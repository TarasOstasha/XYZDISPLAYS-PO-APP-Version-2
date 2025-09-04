export const formatPrice = (price) => {
  return price !== undefined ? parseFloat(price).toFixed(2) : '';
};

export const priceWithDiscountPerUnit = (vendorPrice, discount) => {
  const discountedPrice = vendorPrice * (1 - discount / 100);
  return discountedPrice.toFixed(2);
};

export const isNumber = (number) => isNaN(Number(number));

export const calculateRoundedPercentage = (discount) => {
  if (discount > 0) {
    return ((1 - (1 - discount / 100)) * 100).toFixed(0) + '%';
  }
  return 0 + '%';
};

export const calculatePrice = (price, quantity) => {
  return `$${(price * quantity).toFixed(2)}`;
};

export const calculateDiscountedPrice = (price, discount, quantity) => {
  if (discount > 0) {
    const discountDecimal = discount / 100;
    const discountedPrice = price * (1 - discountDecimal) * quantity;
    return `$${discountedPrice.toFixed(2)}`;
  } else {
    const discountedPrice = price * quantity;
    return `$${discountedPrice.toFixed(2)}`;
  }
};

export const isPriceOutOfRange = (webPrice, priceWithDiscount) => {
  const ratio = webPrice / priceWithDiscount - 1;
  return ratio > 0.9 || ratio < 0.3;
};

export const grandTotalPrice = (order, switcher, discount) => {
  const grandTotal = order.reduce((acc, item) => {
    const price = switcher
      ? item.ProductPrice?.[0]
      : (item.Vendor_Price?.[0] * (100 - item.discount)) / 100;
    return acc + item.Quantity?.[0] * price;
  }, 0);
  return '$' + grandTotal.toFixed(2);
};

export const discountAmount = (discount) => {
  return discount === undefined ? (
    <b style={{ color: 'red' }}>Website order item</b>
  ) : (
    calculateRoundedPercentage(discount)
  );
};
