const { PaymentService } = require('../payments/paymentService');
const { NotificationService } = require('../notifications/notificationService');
const { UserService } = require('../auth/userService');
const { logActivity } = require('../utils/logger');
const { calculateDiscount } = require('../utils/discountEngine');

class OrderService {
  constructor(db) {
    this.db = db;
    this.paymentService = new PaymentService(db);
    this.notificationService = new NotificationService();
    this.userService = new UserService(db);
  }

  async createOrder(userId, items, couponCode = null) {
    const user = await this.userService.getUserById(userId);
    if (!user) throw new Error('User not found');

    const subtotal = this.calculateSubtotal(items);
    const discount = couponCode ? await calculateDiscount(couponCode, subtotal) : 0;
    const total = subtotal - discount;

    const order = await this.db.orders.create({
      userId, items, subtotal, discount, total, status: 'PENDING'
    });

    logActivity('ORDER_CREATED', { orderId: order.id, userId, total });
    return order;
  }

  async processOrder(orderId, paymentDetails) {
    const order = await this.getOrder(orderId);
    if (order.status !== 'PENDING') throw new Error('Order already processed');

    const payment = await this.paymentService.chargeCustomer(order.userId, order.total, paymentDetails);

    order.status = 'CONFIRMED';
    order.paymentId = payment.id;
    await this.db.orders.update(order);

    await this.notificationService.sendOrderConfirmation(order);
    logActivity('ORDER_PROCESSED', { orderId, paymentId: payment.id });
    return order;
  }

  async cancelOrder(orderId, userId) {
    const order = await this.getOrder(orderId);
    if (order.userId !== userId) throw new Error('Unauthorized');
    if (order.status === 'SHIPPED') throw new Error('Cannot cancel shipped order');

    if (order.paymentId) {
      await this.paymentService.refundPayment(order.paymentId, order.total);
    }

    order.status = 'CANCELLED';
    await this.db.orders.update(order);
    await this.notificationService.sendCancellationNotice(order);
    logActivity('ORDER_CANCELLED', { orderId, userId });
    return order;
  }

  async getOrder(orderId) {
    return this.db.orders.findById(orderId);
  }

  async getOrdersByUser(userId) {
    return this.db.orders.findByUserId(userId);
  }

  calculateSubtotal(items) {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
}

module.exports = { OrderService };
