const { authenticate, authorize } = require('./auth/authMiddleware');
const { UserService } = require('./auth/userService');
const { OrderService } = require('./orders/orderService');
const { PaymentService } = require('./payments/paymentService');
const { logActivity } = require('./utils/logger');

// Simulated Express-style app
const app = {
  routes: [],
  use(middleware) { this.routes.push({ type: 'middleware', fn: middleware }); },
  get(path, ...handlers) { this.routes.push({ method: 'GET', path, handlers }); },
  post(path, ...handlers) { this.routes.push({ method: 'POST', path, handlers }); },
  delete(path, ...handlers) { this.routes.push({ method: 'DELETE', path, handlers }); },
};

// Routes
app.post('/auth/register', async (req, res) => {
  const userService = new UserService(req.db);
  const user = await userService.registerUser(req.body.email, req.body.password);
  res.json({ success: true, userId: user.id });
});

app.post('/auth/login', async (req, res) => {
  const userService = new UserService(req.db);
  const session = await userService.loginUser(req.body.email, req.body.password);
  res.json(session);
});

app.post('/orders', authenticate, async (req, res) => {
  const orderService = new OrderService(req.db);
  const order = await orderService.createOrder(req.user.userId, req.body.items, req.body.coupon);
  res.json(order);
});

app.post('/orders/:id/process', authenticate, async (req, res) => {
  const orderService = new OrderService(req.db);
  const result = await orderService.processOrder(req.params.id, req.body.payment);
  res.json(result);
});

app.delete('/orders/:id', authenticate, async (req, res) => {
  const orderService = new OrderService(req.db);
  const result = await orderService.cancelOrder(req.params.id, req.user.userId);
  res.json(result);
});

app.get('/payments/history', authenticate, async (req, res) => {
  const paymentService = new PaymentService(req.db);
  const history = await paymentService.getPaymentHistory(req.user.userId);
  res.json(history);
});

logActivity('APP_INITIALIZED', { routes: app.routes.length });

module.exports = { app };
