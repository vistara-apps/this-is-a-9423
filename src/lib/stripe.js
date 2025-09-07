import { loadStripe } from '@stripe/stripe-js';

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey) {
  throw new Error('Missing Stripe publishable key');
}

export const stripe = await loadStripe(stripePublishableKey);

// Subscription tiers configuration
export const SUBSCRIPTION_TIERS = {
  free: {
    name: 'Free',
    price: 0,
    priceId: null,
    features: [
      'Up to 3 sample clearance requests',
      'Basic sample attribution tools',
      'Community support'
    ],
    limits: {
      samplesPerMonth: 3,
      projects: 1
    }
  },
  creator: {
    name: 'Creator',
    price: 15,
    priceId: 'price_creator_monthly', // Replace with actual Stripe price ID
    features: [
      'Up to 10 samples per month',
      'AI-assisted clearance communication',
      'Basic royalty tracking',
      'Email support',
      'Sample marketplace access'
    ],
    limits: {
      samplesPerMonth: 10,
      projects: 5
    }
  },
  pro: {
    name: 'Pro',
    price: 45,
    priceId: 'price_pro_monthly', // Replace with actual Stripe price ID
    features: [
      'Unlimited samples',
      'Advanced analytics',
      'Priority support',
      'Custom attribution templates',
      'Bulk sample processing',
      'API access'
    ],
    limits: {
      samplesPerMonth: -1, // Unlimited
      projects: -1 // Unlimited
    }
  }
};

// Stripe service functions
export const stripeService = {
  // Create subscription checkout session
  createSubscriptionCheckout: async (priceId, customerId, successUrl, cancelUrl) => {
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          customerId,
          successUrl,
          cancelUrl,
          mode: 'subscription'
        }),
      });

      const session = await response.json();
      
      if (session.error) {
        throw new Error(session.error);
      }

      return { sessionId: session.id, error: null };
    } catch (error) {
      return { sessionId: null, error: error.message };
    }
  },

  // Create one-time payment for sample purchase
  createSamplePayment: async (amount, sampleId, userId, successUrl, cancelUrl) => {
    try {
      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to cents
          currency: 'usd',
          metadata: {
            sampleId,
            userId,
            type: 'sample_purchase'
          },
          successUrl,
          cancelUrl
        }),
      });

      const paymentIntent = await response.json();
      
      if (paymentIntent.error) {
        throw new Error(paymentIntent.error);
      }

      return { clientSecret: paymentIntent.client_secret, error: null };
    } catch (error) {
      return { clientSecret: null, error: error.message };
    }
  },

  // Redirect to Stripe Checkout
  redirectToCheckout: async (sessionId) => {
    try {
      const result = await stripe.redirectToCheckout({
        sessionId: sessionId,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  },

  // Create customer portal session
  createPortalSession: async (customerId, returnUrl) => {
    try {
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          returnUrl
        }),
      });

      const session = await response.json();
      
      if (session.error) {
        throw new Error(session.error);
      }

      return { url: session.url, error: null };
    } catch (error) {
      return { url: null, error: error.message };
    }
  },

  // Get subscription details
  getSubscription: async (subscriptionId) => {
    try {
      const response = await fetch(`/api/stripe/subscription/${subscriptionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const subscription = await response.json();
      
      if (subscription.error) {
        throw new Error(subscription.error);
      }

      return { subscription, error: null };
    } catch (error) {
      return { subscription: null, error: error.message };
    }
  },

  // Cancel subscription
  cancelSubscription: async (subscriptionId) => {
    try {
      const response = await fetch(`/api/stripe/subscription/${subscriptionId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }

      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Process royalty payment
  createRoyaltyTransfer: async (amount, rightsHolderId, sampleId) => {
    try {
      const response = await fetch('/api/stripe/create-transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to cents
          currency: 'usd',
          destination: rightsHolderId, // Stripe Connect account ID
          metadata: {
            sampleId,
            type: 'royalty_payment'
          }
        }),
      });

      const transfer = await response.json();
      
      if (transfer.error) {
        throw new Error(transfer.error);
      }

      return { transferId: transfer.id, error: null };
    } catch (error) {
      return { transferId: null, error: error.message };
    }
  }
};

// Utility functions
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

export const getTierByPriceId = (priceId) => {
  return Object.entries(SUBSCRIPTION_TIERS).find(
    ([key, tier]) => tier.priceId === priceId
  )?.[0] || 'free';
};

export const canUserPerformAction = (userTier, action, currentUsage = {}) => {
  const tier = SUBSCRIPTION_TIERS[userTier] || SUBSCRIPTION_TIERS.free;
  
  switch (action) {
    case 'create_sample':
      if (tier.limits.samplesPerMonth === -1) return true;
      return (currentUsage.samplesThisMonth || 0) < tier.limits.samplesPerMonth;
    
    case 'create_project':
      if (tier.limits.projects === -1) return true;
      return (currentUsage.totalProjects || 0) < tier.limits.projects;
    
    case 'access_marketplace':
      return userTier !== 'free';
    
    case 'ai_assistance':
      return userTier !== 'free';
    
    case 'advanced_analytics':
      return userTier === 'pro';
    
    default:
      return true;
  }
};
