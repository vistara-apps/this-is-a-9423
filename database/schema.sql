-- SampleSafe Database Schema
-- This file contains the complete database schema for SampleSafe application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    subscription_tier VARCHAR(20) DEFAULT 'free' CHECK (subscription_tier IN ('free', 'creator', 'pro')),
    payment_info JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE public.projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    project_name VARCHAR(255) NOT NULL,
    description TEXT,
    creation_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rights holders table
CREATE TABLE public.rights_holders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact_info JSONB NOT NULL, -- {email, phone, address, etc.}
    payment_details JSONB, -- {bank_info, paypal, etc.}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Samples table
CREATE TABLE public.samples (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    rights_holder_id UUID REFERENCES public.rights_holders(id),
    original_artist VARCHAR(255) NOT NULL,
    sample_name VARCHAR(255) NOT NULL,
    sample_file_url TEXT,
    clearance_status VARCHAR(20) DEFAULT 'pending' CHECK (clearance_status IN ('pending', 'negotiating', 'approved', 'rejected')),
    clearance_terms JSONB, -- {usage_rights, territory, duration, etc.}
    royalty_rate DECIMAL(5,2), -- Percentage (e.g., 15.50 for 15.5%)
    request_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approval_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Usage rights table
CREATE TABLE public.usage_rights (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    sample_id UUID REFERENCES public.samples(id) ON DELETE CASCADE,
    licensee_user_id UUID REFERENCES public.users(id),
    licensee_project_id UUID REFERENCES public.projects(id),
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE,
    royalty_payouts JSONB DEFAULT '[]', -- Array of payout records
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Marketplace samples table (pre-cleared samples for sale)
CREATE TABLE public.marketplace_samples (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    rights_holder_id UUID REFERENCES public.rights_holders(id),
    sample_name VARCHAR(255) NOT NULL,
    artist_name VARCHAR(255) NOT NULL,
    genre VARCHAR(100),
    bpm INTEGER,
    key_signature VARCHAR(10),
    sample_file_url TEXT NOT NULL,
    preview_url TEXT,
    price DECIMAL(10,2) NOT NULL,
    license_type VARCHAR(50) NOT NULL, -- 'royalty_free', 'exclusive', 'non_exclusive'
    usage_terms JSONB NOT NULL,
    tags TEXT[], -- Array of tags for search
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sample purchases table
CREATE TABLE public.sample_purchases (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id),
    marketplace_sample_id UUID REFERENCES public.marketplace_samples(id),
    project_id UUID REFERENCES public.projects(id),
    purchase_price DECIMAL(10,2) NOT NULL,
    stripe_payment_intent_id VARCHAR(255),
    purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clearance communications table
CREATE TABLE public.clearance_communications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    sample_id UUID REFERENCES public.samples(id) ON DELETE CASCADE,
    sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('user', 'rights_holder', 'system')),
    message_type VARCHAR(50) NOT NULL, -- 'initial_request', 'negotiation', 'approval', 'rejection', 'ai_generated'
    subject VARCHAR(255),
    message_content TEXT NOT NULL,
    ai_generated BOOLEAN DEFAULT false,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Royalty payments table
CREATE TABLE public.royalty_payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    sample_id UUID REFERENCES public.samples(id),
    rights_holder_id UUID REFERENCES public.rights_holders(id),
    payer_user_id UUID REFERENCES public.users(id),
    amount DECIMAL(10,2) NOT NULL,
    payment_period_start DATE NOT NULL,
    payment_period_end DATE NOT NULL,
    stripe_transfer_id VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    paid_at TIMESTAMP WITH TIME ZONE
);

-- User subscriptions table
CREATE TABLE public.user_subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    stripe_customer_id VARCHAR(255) UNIQUE,
    stripe_subscription_id VARCHAR(255) UNIQUE,
    subscription_tier VARCHAR(20) NOT NULL CHECK (subscription_tier IN ('free', 'creator', 'pro')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid')),
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sample usage analytics table
CREATE TABLE public.sample_usage_analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    sample_id UUID REFERENCES public.samples(id),
    user_id UUID REFERENCES public.users(id),
    project_id UUID REFERENCES public.projects(id),
    usage_type VARCHAR(50) NOT NULL, -- 'stream', 'download', 'commercial_use'
    platform VARCHAR(100), -- 'spotify', 'youtube', 'soundcloud', etc.
    revenue_generated DECIMAL(10,2) DEFAULT 0,
    usage_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_samples_project_id ON public.samples(project_id);
CREATE INDEX idx_samples_rights_holder_id ON public.samples(rights_holder_id);
CREATE INDEX idx_samples_clearance_status ON public.samples(clearance_status);
CREATE INDEX idx_usage_rights_sample_id ON public.usage_rights(sample_id);
CREATE INDEX idx_marketplace_samples_genre ON public.marketplace_samples(genre);
CREATE INDEX idx_marketplace_samples_active ON public.marketplace_samples(is_active);
CREATE INDEX idx_royalty_payments_status ON public.royalty_payments(status);
CREATE INDEX idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);

-- Row Level Security (RLS) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.samples ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_rights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sample_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clearance_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.royalty_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sample_usage_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for projects table
CREATE POLICY "Users can view own projects" ON public.projects
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own projects" ON public.projects
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON public.projects
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" ON public.projects
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for samples table
CREATE POLICY "Users can view samples in own projects" ON public.samples
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.projects 
            WHERE projects.id = samples.project_id 
            AND projects.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create samples in own projects" ON public.samples
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects 
            WHERE projects.id = samples.project_id 
            AND projects.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update samples in own projects" ON public.samples
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.projects 
            WHERE projects.id = samples.project_id 
            AND projects.user_id = auth.uid()
        )
    );

-- Marketplace samples are publicly viewable
CREATE POLICY "Marketplace samples are publicly viewable" ON public.marketplace_samples
    FOR SELECT USING (is_active = true);

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_samples_updated_at BEFORE UPDATE ON public.samples
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_usage_rights_updated_at BEFORE UPDATE ON public.usage_rights
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_marketplace_samples_updated_at BEFORE UPDATE ON public.marketplace_samples
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_subscriptions_updated_at BEFORE UPDATE ON public.user_subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
