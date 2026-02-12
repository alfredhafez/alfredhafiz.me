import React, { useEffect, useState } from 'react';
import { fetchSiteSettings, updateSiteSettings, uploadFile, type SiteSettings } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  Loader2, 
  Save, 
  Image as ImageIcon, 
  Globe, 
  Mail, 
  Settings,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    const { data, error } = await fetchSiteSettings();
    
    if (error) {
      toast.error('Failed to load settings');
      console.error(error);
    } else if (data) {
      setSettings(data);
    }
    setIsLoading(false);
  };

  const handleSave = async () => {
    if (!settings) return;

    setIsSaving(true);
    
    try {
      // Upload logo if selected
      if (logoFile) {
        const { data: logoData, error: logoError } = await uploadFile(
          'site-assets',
          `logo-${Date.now()}.${logoFile.name.split('.').pop()}`,
          logoFile
        );
        
        if (logoError) {
          toast.error('Failed to upload logo');
          setIsSaving(false);
          return;
        }
        
        settings.site_logo_url = logoData?.publicUrl || settings.site_logo_url;
        setLogoFile(null);
      }

      // Upload favicon if selected
      if (faviconFile) {
        const { data: faviconData, error: faviconError } = await uploadFile(
          'site-assets',
          `favicon-${Date.now()}.${faviconFile.name.split('.').pop()}`,
          faviconFile
        );
        
        if (faviconError) {
          toast.error('Failed to upload favicon');
          setIsSaving(false);
          return;
        }
        
        settings.site_favicon_url = faviconData?.publicUrl || settings.site_favicon_url;
        setFaviconFile(null);
      }

      // Update settings in Supabase
      const { error } = await updateSiteSettings({
        site_name: settings.site_name,
        site_description: settings.site_description,
        site_logo_url: settings.site_logo_url,
        site_favicon_url: settings.site_favicon_url,
        contact_email: settings.contact_email,
        hero_title: settings.hero_title,
        hero_subtitle: settings.hero_subtitle,
        meta_keywords: settings.meta_keywords,
        meta_author: settings.meta_author,
        google_analytics_id: settings.google_analytics_id,
        smtp_enabled: settings.smtp_enabled,
        smtp_host: settings.smtp_host,
        smtp_port: settings.smtp_port,
        smtp_secure: settings.smtp_secure,
        smtp_user: settings.smtp_user,
        smtp_pass: settings.smtp_pass,
        maintenance_mode: settings.maintenance_mode,
      });

      if (error) {
        toast.error('Failed to save settings');
        console.error(error);
      } else {
        toast.success('Settings saved successfully');
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: keyof SiteSettings, value: any) => {
    setSettings(prev => prev ? { ...prev, [field]: value } : null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Failed to load settings</p>
        <Button onClick={loadSettings} variant="outline" className="mt-4">
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Site Settings</h1>
          <p className="text-muted-foreground">
            Manage your site configuration and appearance
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">
            <Globe className="mr-2 h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="branding">
            <ImageIcon className="mr-2 h-4 w-4" />
            Branding
          </TabsTrigger>
          <TabsTrigger value="smtp">
            <Mail className="mr-2 h-4 w-4" />
            SMTP
          </TabsTrigger>
          <TabsTrigger value="advanced">
            <Settings className="mr-2 h-4 w-4" />
            Advanced
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
              <CardDescription>
                Basic site information and contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="site_name">Site Name</Label>
                  <Input
                    id="site_name"
                    value={settings.site_name}
                    onChange={(e) => handleChange('site_name', e.target.value)}
                    placeholder="Your Site Name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="site_description">Site Description</Label>
                  <Input
                    id="site_description"
                    value={settings.site_description || ''}
                    onChange={(e) => handleChange('site_description', e.target.value)}
                    placeholder="Brief description of your site"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_email">Contact Email</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={settings.contact_email}
                    onChange={(e) => handleChange('contact_email', e.target.value)}
                    placeholder="contact@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hero_title">Hero Title</Label>
                  <Input
                    id="hero_title"
                    value={settings.hero_title || ''}
                    onChange={(e) => handleChange('hero_title', e.target.value)}
                    placeholder="Main headline on your homepage"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hero_subtitle">Hero Subtitle</Label>
                  <Input
                    id="hero_subtitle"
                    value={settings.hero_subtitle || ''}
                    onChange={(e) => handleChange('hero_subtitle', e.target.value)}
                    placeholder="Subtitle or tagline"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
              <CardDescription>
                Search engine optimization settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="meta_keywords">Meta Keywords</Label>
                <Input
                  id="meta_keywords"
                  value={settings.meta_keywords || ''}
                  onChange={(e) => handleChange('meta_keywords', e.target.value)}
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta_author">Meta Author</Label>
                <Input
                  id="meta_author"
                  value={settings.meta_author || ''}
                  onChange={(e) => handleChange('meta_author', e.target.value)}
                  placeholder="Your Name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="google_analytics_id">Google Analytics ID</Label>
                <Input
                  id="google_analytics_id"
                  value={settings.google_analytics_id || ''}
                  onChange={(e) => handleChange('google_analytics_id', e.target.value)}
                  placeholder="G-XXXXXXXXXX"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Branding Settings */}
        <TabsContent value="branding" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Site Branding</CardTitle>
              <CardDescription>
                Upload your site logo and favicon
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Logo Upload */}
              <div className="space-y-4">
                <Label>Site Logo</Label>
                <div className="flex items-center gap-4">
                  {settings.site_logo_url ? (
                    <div className="w-24 h-24 border rounded-lg overflow-hidden bg-muted">
                      <img
                        src={settings.site_logo_url}
                        alt="Site Logo"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 border rounded-lg bg-muted flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                      className="cursor-pointer"
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      Recommended size: 200x50px, PNG or SVG format
                    </p>
                  </div>
                </div>
              </div>

              {/* Favicon Upload */}
              <div className="space-y-4">
                <Label>Site Favicon</Label>
                <div className="flex items-center gap-4">
                  {settings.site_favicon_url ? (
                    <div className="w-16 h-16 border rounded-lg overflow-hidden bg-muted">
                      <img
                        src={settings.site_favicon_url}
                        alt="Favicon"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 border rounded-lg bg-muted flex items-center justify-center">
                      <Globe className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1">
                    <Input
                      type="file"
                      accept="image/x-icon,image/png,image/svg+xml"
                      onChange={(e) => setFaviconFile(e.target.files?.[0] || null)}
                      className="cursor-pointer"
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      Recommended: 32x32px ICO or PNG format
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SMTP Settings */}
        <TabsContent value="smtp" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SMTP Configuration</CardTitle>
              <CardDescription>
                Configure email settings for sending replies from the dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="smtp_enabled">Enable SMTP</Label>
                  <p className="text-sm text-muted-foreground">
                    Turn on to send email replies from the dashboard
                  </p>
                </div>
                <Switch
                  id="smtp_enabled"
                  checked={settings.smtp_enabled}
                  onCheckedChange={(checked: boolean) => handleChange('smtp_enabled', checked)}
                />
              </div>

              {settings.smtp_enabled && (
                <div className="space-y-4 pt-4 border-t">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="smtp_host">SMTP Host</Label>
                      <Input
                        id="smtp_host"
                        value={settings.smtp_host || ''}
                        onChange={(e) => handleChange('smtp_host', e.target.value)}
                        placeholder="smtp.example.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="smtp_port">SMTP Port</Label>
                      <Input
                        id="smtp_port"
                        type="number"
                        value={settings.smtp_port || ''}
                        onChange={(e) => handleChange('smtp_port', parseInt(e.target.value))}
                        placeholder="587"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="smtp_user">SMTP Username</Label>
                    <Input
                      id="smtp_user"
                      value={settings.smtp_user || ''}
                      onChange={(e) => handleChange('smtp_user', e.target.value)}
                      placeholder="your-email@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="smtp_pass">SMTP Password</Label>
                    <Input
                      id="smtp_pass"
                      type="password"
                      value={settings.smtp_pass || ''}
                      onChange={(e) => handleChange('smtp_pass', e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="smtp_secure"
                      checked={settings.smtp_secure}
                      onCheckedChange={(checked: boolean) => handleChange('smtp_secure', checked)}
                    />
                    <Label htmlFor="smtp_secure">Use Secure Connection (TLS/SSL)</Label>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Settings */}
        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>
                Additional configuration options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="maintenance_mode">Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Show a maintenance page to visitors
                  </p>
                </div>
                <Switch
                  id="maintenance_mode"
                  checked={settings.maintenance_mode}
                  onCheckedChange={(checked: boolean) => handleChange('maintenance_mode', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
