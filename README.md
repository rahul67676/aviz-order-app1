# aviz-order-app

**Sample repo for GitNexus demo — Aviz Academy Batch 8**

A realistic Node.js e-commerce backend with intentional cross-service dependencies,
perfect for demonstrating GitNexus knowledge graph, impact analysis, and MCP integration.

## Structure

```
src/
  auth/
    userService.js       ← Core user management (8 functions)
    authMiddleware.js    ← JWT auth + role check
  orders/
    orderService.js      ← Order lifecycle (depends on payment + notification + user)
  payments/
    paymentService.js    ← Razorpay-style payment processing
  notifications/
    notificationService.js ← Email + SMS
  utils/
    cryptoHelper.js      ← Password hashing, token validation
    logger.js            ← Activity logging (used by ALL services)
    discountEngine.js    ← Coupon calculation
  app.js                 ← Route definitions
```

## Why this repo?
- `UserService` is called by 4 other services — great for impact analysis demo
- `logActivity` is imported by every module — shows blast radius clearly
- Clear call chains: `app → orderService → paymentService → gateway`
- Realistic enough to ask meaningful questions to GitNexus RAG agent
