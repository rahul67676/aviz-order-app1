const { logActivity } = require('../utils/logger');
const { validateCard } = require('../utils/cryptoHelper');

class PaymentService {
  constructor(db) {
    this.db = db;
  }

  async chargeCustomer(userId, amount, paymentDetails) {
    const cardValid = await validateCard(paymentDetails.cardNumber);
    if (!cardValid) throw new Error('Invalid card details');

    const transaction = await this.db.payments.create({
      userId, amount, status: 'PROCESSING', gateway: 'razorpay',
      maskedCard: `****${paymentDetails.cardNumber.slice(-4)}`
    });

    const gatewayResponse = await this.callPaymentGateway(transaction);
    transaction.status = gatewayResponse.success ? 'SUCCESS' : 'FAILED';
    transaction.gatewayRef = gatewayResponse.referenceId;
    await this.db.payments.update(transaction);

    logActivity('PAYMENT_PROCESSED', { userId, amount, status: transaction.status });
    return transaction;
  }

  async refundPayment(paymentId, amount) {
    const payment = await this.db.payments.findById(paymentId);
    if (!payment) throw new Error('Payment not found');
    if (payment.status !== 'SUCCESS') throw new Error('Cannot refund unsuccessful payment');

    const refund = await this.db.refunds.create({ paymentId, amount, status: 'INITIATED' });
    await this.callRefundGateway(payment, refund);
    refund.status = 'COMPLETED';
    await this.db.refunds.update(refund);

    logActivity('REFUND_PROCESSED', { paymentId, amount });
    return refund;
  }

  async getPaymentHistory(userId) {
    return this.db.payments.findByUserId(userId);
  }

  async callPaymentGateway(transaction) {
    return { success: true, referenceId: `RZP_${transaction.id}_${Date.now()}` };
  }

  async callRefundGateway(payment, refund) {
    return { success: true };
  }
}

module.exports = { PaymentService };
