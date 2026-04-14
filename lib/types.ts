export type CheckoutItem = {
  id: string;
  title: string;
  unitPrice: number;
  quantity: number;
};

export type ShippingAddress = {
  fullName: string;
  mobile: string;
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type CheckoutRequest = {
  userId: string;
  email: string;
  items: CheckoutItem[];
  couponCode?: string | null;
  giftCardCode?: string | null;
  shippingAddress: ShippingAddress;
};

export type PriceBreakdown = {
  subtotal: number;
  couponDiscount: number;
  giftCardAmount: number;
  shipping: number;
  tax: number;
  total: number;
};
