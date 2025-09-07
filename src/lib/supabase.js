import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Auth helpers
export const auth = {
  signUp: async (email, password, userData = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    return { data, error };
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  getCurrentUser: () => {
    return supabase.auth.getUser();
  },

  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// Database helpers
export const db = {
  // Users
  getUser: async (userId) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  },

  updateUser: async (userId, updates) => {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    return { data, error };
  },

  // Projects
  getProjects: async (userId) => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  createProject: async (projectData) => {
    const { data, error } = await supabase
      .from('projects')
      .insert(projectData)
      .select()
      .single();
    return { data, error };
  },

  updateProject: async (projectId, updates) => {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', projectId)
      .select()
      .single();
    return { data, error };
  },

  deleteProject: async (projectId) => {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);
    return { error };
  },

  // Samples
  getSamples: async (projectId) => {
    const { data, error } = await supabase
      .from('samples')
      .select(`
        *,
        rights_holders (
          id,
          name,
          contact_info
        )
      `)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  createSample: async (sampleData) => {
    const { data, error } = await supabase
      .from('samples')
      .insert(sampleData)
      .select()
      .single();
    return { data, error };
  },

  updateSample: async (sampleId, updates) => {
    const { data, error } = await supabase
      .from('samples')
      .update(updates)
      .eq('id', sampleId)
      .select()
      .single();
    return { data, error };
  },

  // Marketplace
  getMarketplaceSamples: async (filters = {}) => {
    let query = supabase
      .from('marketplace_samples')
      .select('*')
      .eq('is_active', true);

    if (filters.genre) {
      query = query.eq('genre', filters.genre);
    }
    if (filters.minPrice) {
      query = query.gte('price', filters.minPrice);
    }
    if (filters.maxPrice) {
      query = query.lte('price', filters.maxPrice);
    }
    if (filters.search) {
      query = query.or(`sample_name.ilike.%${filters.search}%,artist_name.ilike.%${filters.search}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    return { data, error };
  },

  purchaseSample: async (purchaseData) => {
    const { data, error } = await supabase
      .from('sample_purchases')
      .insert(purchaseData)
      .select()
      .single();
    return { data, error };
  },

  // Rights Holders
  createRightsHolder: async (rightsHolderData) => {
    const { data, error } = await supabase
      .from('rights_holders')
      .insert(rightsHolderData)
      .select()
      .single();
    return { data, error };
  },

  searchRightsHolders: async (searchTerm) => {
    const { data, error } = await supabase
      .from('rights_holders')
      .select('*')
      .ilike('name', `%${searchTerm}%`)
      .limit(10);
    return { data, error };
  },

  // Royalty Payments
  getRoyaltyPayments: async (userId) => {
    const { data, error } = await supabase
      .from('royalty_payments')
      .select(`
        *,
        samples (
          sample_name,
          original_artist
        ),
        rights_holders (
          name
        )
      `)
      .eq('payer_user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  createRoyaltyPayment: async (paymentData) => {
    const { data, error } = await supabase
      .from('royalty_payments')
      .insert(paymentData)
      .select()
      .single();
    return { data, error };
  },

  // Subscriptions
  getUserSubscription: async (userId) => {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();
    return { data, error };
  },

  updateSubscription: async (userId, subscriptionData) => {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .upsert({
        user_id: userId,
        ...subscriptionData
      })
      .select()
      .single();
    return { data, error };
  }
};
