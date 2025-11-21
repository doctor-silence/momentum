// Mock implementation of functions

export const createCheckoutSession = async (options) => {
  console.log('[Mock API] createCheckoutSession called with:', options);
  alert('Checkout is currently disabled.');
  return Promise.resolve({ url: '#' });
};

export const createBillingPortalSession = async (options) => {
  console.log('[Mock API] createBillingPortalSession called with:', options);
  alert('Billing portal is currently disabled.');
  return Promise.resolve({ url: '#' });
};