-- Supabase Database Schema for Alfred Hafiz Portfolio
-- Run this in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CONTACT MESSAGES TABLE
-- Stores all contact form submissions
-- ============================================
CREATE TABLE contact_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(500),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied', 'archived')),
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    replied_at TIMESTAMP WITH TIME ZONE,
    reply_content TEXT,
    has_attachments BOOLEAN DEFAULT FALSE,
    attachment_urls JSONB DEFAULT '[]'::jsonb,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX idx_contact_messages_status ON contact_messages(status);
CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at DESC);
CREATE INDEX idx_contact_messages_is_read ON contact_messages(is_read);

-- Enable Row Level Security
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to insert (for contact form)
CREATE POLICY "Allow public insert on contact_messages" 
ON contact_messages FOR INSERT 
TO PUBLIC 
WITH CHECK (true);

-- Policy: Only authenticated users can view messages
CREATE POLICY "Allow authenticated select on contact_messages" 
ON contact_messages FOR SELECT 
TO authenticated 
USING (true);

-- Policy: Only authenticated users can update messages
CREATE POLICY "Allow authenticated update on contact_messages" 
ON contact_messages FOR UPDATE 
TO authenticated 
USING (true);

-- Policy: Only authenticated users can delete messages
CREATE POLICY "Allow authenticated delete on contact_messages" 
ON contact_messages FOR DELETE 
TO authenticated 
USING (true);

-- ============================================
-- SITE SETTINGS TABLE
-- Stores site configuration like logo, favicon, etc.
-- ============================================
CREATE TABLE site_settings (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    site_name VARCHAR(255) DEFAULT 'Alfred Hafiz',
    site_description TEXT,
    site_logo_url TEXT,
    site_favicon_url TEXT,
    contact_email VARCHAR(255) DEFAULT 'ask@alfredhafiz.me',
    smtp_enabled BOOLEAN DEFAULT FALSE,
    smtp_host VARCHAR(255),
    smtp_port INTEGER,
    smtp_secure BOOLEAN DEFAULT TRUE,
    smtp_user VARCHAR(255),
    smtp_pass TEXT,
    hero_title VARCHAR(500),
    hero_subtitle TEXT,
    meta_keywords TEXT,
    meta_author VARCHAR(255),
    google_analytics_id VARCHAR(100),
    social_links JSONB DEFAULT '{
        "github": "",
        "linkedin": "",
        "twitter": "",
        "instagram": ""
    }'::jsonb,
    custom_css TEXT,
    maintenance_mode BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id)
);

-- Insert default settings
INSERT INTO site_settings (id, site_name, site_description, contact_email, hero_title, hero_subtitle)
VALUES (
    1,
    'Alfred Hafiz',
    'Full Stack Developer & Designer',
    'ask@alfredhafiz.me',
    'Hi, I''m Alfred Hafiz',
    'Full Stack Developer passionate about creating beautiful, functional web experiences'
);

-- Enable RLS on site_settings
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to read settings
CREATE POLICY "Allow public read on site_settings" 
ON site_settings FOR SELECT 
TO PUBLIC 
USING (true);

-- Policy: Only authenticated users can update settings
CREATE POLICY "Allow authenticated update on site_settings" 
ON site_settings FOR UPDATE 
TO authenticated 
USING (true);

-- ============================================
-- ADMIN ACTIVITY LOG
-- Track all admin actions for security
-- ============================================
CREATE TABLE admin_activity_log (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    admin_id UUID REFERENCES auth.users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id UUID,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_admin_activity_log_created_at ON admin_activity_log(created_at DESC);
CREATE INDEX idx_admin_activity_log_admin_id ON admin_activity_log(admin_id);

ALTER TABLE admin_activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated select on admin_activity_log" 
ON admin_activity_log FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated insert on admin_activity_log" 
ON admin_activity_log FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for contact_messages
CREATE TRIGGER update_contact_messages_updated_at 
    BEFORE UPDATE ON contact_messages 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for site_settings
CREATE TRIGGER update_site_settings_updated_at 
    BEFORE UPDATE ON site_settings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Function to log admin activity
CREATE OR REPLACE FUNCTION log_admin_activity(
    p_admin_id UUID,
    p_action VARCHAR(100),
    p_resource_type VARCHAR(100),
    p_resource_id UUID,
    p_details JSONB DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO admin_activity_log (admin_id, action, resource_type, resource_id, details)
    VALUES (p_admin_id, p_action, p_resource_type, p_resource_id, p_details);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- REALTIME SETUP
-- ============================================

-- Enable realtime for contact_messages table
ALTER PUBLICATION supabase_realtime ADD TABLE contact_messages;

-- ============================================
-- STORAGE BUCKETS SETUP
-- Run these in Supabase Dashboard or via API
-- ============================================

-- Create bucket for site assets (logos, favicons)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('site-assets', 'site-assets', true);

-- Create bucket for message attachments
-- INSERT INTO storage.buckets (id, name, public) VALUES ('attachments', 'attachments', false);

-- Storage policies would be:
-- 1. Anyone can read from site-assets
-- 2. Only authenticated users can upload to site-assets
-- 3. Only authenticated users can read/write attachments
