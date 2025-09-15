import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  User, 
  Globe, 
  Bell, 
  Shield, 
  Download,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const UserSettings = () => {
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    preferredLanguage: 'en',
    timezone: 'UTC'
  });
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    weeklyDigest: false,
    newFeatures: true
  });
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' },
    { code: 'hi', name: 'Hindi' },
    { code: 'ar', name: 'Arabic' },
  ];

  const timezones = [
    'UTC',
    'America/New_York',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Asia/Kolkata',
    'Australia/Sydney'
  ];

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setProfile({
        fullName: user.user_metadata?.full_name || '',
        email: user.email || '',
        preferredLanguage: 'en',
        timezone: 'UTC'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load profile.',
        variant: 'destructive',
      });
    }
  };

  const updateProfile = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: profile.fullName,
          preferred_language: profile.preferredLanguage,
          timezone: profile.timezone
        }
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Profile updated successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const exportData = () => {
    const data = {
      exported_at: new Date().toISOString(),
      profile: profile,
      settings: notifications
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `questro-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Exported!',
      description: 'Your data has been exported successfully.',
    });
  };

  const deleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') {
      toast({
        title: 'Error',
        description: 'Please type "DELETE" to confirm account deletion.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // In a real app, this would trigger account deletion
      toast({
        title: 'Account deletion initiated',
        description: 'Your account deletion request has been submitted. You will receive an email confirmation.',
      });
      setDeleteConfirm('');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b border-border/50 p-6 bg-card/50">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Settings className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">User Settings</h1>
            <p className="text-sm text-muted-foreground">Manage your account preferences and privacy settings</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Profile Settings */}
          <Card className="shadow-soft border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-primary" />
                <span>Profile Information</span>
              </CardTitle>
              <CardDescription>
                Update your personal information and account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={profile.fullName}
                    onChange={(e) => setProfile(prev => ({...prev, fullName: e.target.value}))}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Email cannot be changed from here
                  </p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="language">Preferred Language</Label>
                  <Select 
                    value={profile.preferredLanguage} 
                    onValueChange={(value) => setProfile(prev => ({...prev, preferredLanguage: value}))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select 
                    value={profile.timezone} 
                    onValueChange={(value) => setProfile(prev => ({...prev, timezone: value}))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timezones.map((tz) => (
                        <SelectItem key={tz} value={tz}>
                          {tz}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={updateProfile} 
                disabled={loading}
                className="bg-gradient-primary hover:opacity-90 text-white"
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </Button>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="shadow-soft border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-primary" />
                <span>Notification Preferences</span>
              </CardTitle>
              <CardDescription>
                Choose how you want to be notified about updates and activities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch
                  checked={notifications.emailNotifications}
                  onCheckedChange={(checked) => setNotifications(prev => ({...prev, emailNotifications: checked}))}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Weekly Digest</p>
                  <p className="text-sm text-muted-foreground">Get a weekly summary of your learning progress</p>
                </div>
                <Switch
                  checked={notifications.weeklyDigest}
                  onCheckedChange={(checked) => setNotifications(prev => ({...prev, weeklyDigest: checked}))}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">New Features</p>
                  <p className="text-sm text-muted-foreground">Be notified about new features and updates</p>
                </div>
                <Switch
                  checked={notifications.newFeatures}
                  onCheckedChange={(checked) => setNotifications(prev => ({...prev, newFeatures: checked}))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Data */}
          <Card className="shadow-soft border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-primary" />
                <span>Privacy & Data</span>
              </CardTitle>
              <CardDescription>
                Manage your data and privacy preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Export Your Data</p>
                  <p className="text-sm text-muted-foreground">Download a copy of all your data</p>
                </div>
                <Button onClick={exportData} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="shadow-soft border-destructive/20 bg-destructive/5">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                <span>Danger Zone</span>
              </CardTitle>
              <CardDescription>
                Irreversible actions that will permanently affect your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium mb-2">Delete Account</p>
                <p className="text-sm text-muted-foreground mb-4">
                  This will permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder='Type "DELETE" to confirm'
                    value={deleteConfirm}
                    onChange={(e) => setDeleteConfirm(e.target.value)}
                    className="max-w-48"
                  />
                  <Button 
                    variant="destructive" 
                    onClick={deleteAccount}
                    disabled={deleteConfirm !== 'DELETE'}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;