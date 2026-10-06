const COUPONS = {
  'AVIZ10': { type: 'PERCENT', value: 10 },
  'FLAT200': { type: 'FLAT', value: 200 },
  'NEWUSER': { type: 'PERCENT', value: 20 },
};

async function calculateDiscount(couponCode, subtotal) {
  const coupon = COUPONS[couponCode.toUpperCase()];
  if (!coupon) throw new Error('Invalid coupon code');

  if (coupon.type === 'PERCENT') {
    return Math.floor((subtotal * coupon.value) / 100);
  } else if (coupon.type === 'FLAT') {
    return Math.min(coupon.value, subtotal);
  }
  return 0;
}

function getActiveCoupons() {
  return Object.keys(COUPONS);
}

module.exports = { calculateDiscount, getActiveCoupons };
