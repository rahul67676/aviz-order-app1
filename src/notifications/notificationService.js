const { logActivity } = require('../utils/logger');

class NotificationService {
  async sendOrderConfirmation(order) {
    const message = this.buildConfirmationMessage(order);
    await this.sendEmail(order.userId, 'Order Confirmed', message);
    await this.sendSMS(order.userId, `Order #${order.id} confirmed! Total: Rs.${order.total}`);
    logActivity('NOTIFICATION_SENT', { type: 'ORDER_CONFIRMATION', orderId: order.id });
  }

  async sendCancellationNotice(order) {
    const message = this.buildCancellationMessage(order);
    await this.sendEmail(order.userId, 'Order Cancelled', message);
    logActivity('NOTIFICATION_SENT', { type: 'ORDER_CANCELLATION', orderId: order.id });
  }

  async sendPaymentFailureAlert(userId, amount) {
    await this.sendEmail(userId, 'Payment Failed', `Your payment of Rs.${amount} failed. Please retry.`);
    logActivity('NOTIFICATION_SENT', { type: 'PAYMENT_FAILURE', userId });
  }

  buildConfirmationMessage(order) {
    return `Your order #${order.id} has been confirmed. Total: Rs.${order.total}. Thank you for shopping!`;
  }

  buildCancellationMessage(order) {
    return `Your order #${order.id} has been cancelled. Refund will be processed in 5-7 days.`;
  }

  async sendEmail(userId, subject, body) {
    console.log(`[EMAIL] To: ${userId} | Subject: ${subject} | Body: ${body}`);
  }

  async sendSMS(userId, message) {
    console.log(`[SMS] To: ${userId} | Message: ${message}`);
  }
}

module.exports = { NotificationService };
