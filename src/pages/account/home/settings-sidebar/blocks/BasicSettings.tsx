import { CrudAvatarUpload } from '@/partials/crud';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { KeenIcon } from '@/components';
import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useAuthContext } from '@/auth';
import { userService } from '@/api/services/user.service';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const BasicSettings = () => {
  const { auth, currentUser } = useAuthContext();
  // Get user_id from auth (stored in localStorage) or currentUser
  const userId = (auth as any)?.user_id || currentUser?.id;

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    mobile_number: '',
    address1: '',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Password dialog state
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
  });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Fetch user profile on mount
  const fetchUserProfile = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      const response = await userService.getProfile({ user_id: userId });
      const userData = response.data;
      
      setFormData({
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        mobile_number: userData.mobile_number || '',
        address1: userData.address1 || '',
      });
      
      setHasChanges(false);
    } catch (error: any) {
      console.error('Failed to fetch user profile:', error);
      toast.error(error?.response?.data?.message || 'Failed to load user profile');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!userId) {
      toast.error('User ID not found');
      return;
    }

    setIsSaving(true);
    try {
      await userService.updateProfile({
        user_id: userId,
        first_name: formData.first_name,
        last_name: formData.last_name,
        mobile_number: formData.mobile_number,
        address1: formData.address1,
      });
      
      toast.success('Profile updated successfully');
      setHasChanges(false);
      // Refresh profile data
      await fetchUserProfile();
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      toast.error(error?.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdatePassword = async () => {
    if (!passwordData.old_password || !passwordData.new_password) {
      toast.error('Please fill in all password fields');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await userService.resetPasswordOld({
        old_password: passwordData.old_password,
        new_password: passwordData.new_password,
      });
      
      toast.success('Password updated successfully');
      setShowPasswordDialog(false);
      setPasswordData({ old_password: '', new_password: '' });
    } catch (error: any) {
      console.error('Failed to update password:', error);
      toast.error(error?.response?.data?.message || 'Failed to update password');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="card pb-2.5">
        <div className="card-header" id="basic_settings">
          <h3 className="card-title">Basic Settings</h3>
        </div>
        <div className="card-body">
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="card pb-2.5">
        <div className="card-header" id="basic_settings">
          <h3 className="card-title">Basic Settings</h3>
        </div>
        <div className="card-body grid gap-5">
          <div className="flex items-center flex-wrap gap-2.5">
            <label className="form-label max-w-56">Photo</label>
            <div className="flex items-center justify-between flex-wrap grow gap-2.5">
              <span className="text-2sm text-gray-700">150x150px JPEG, PNG Image</span>
              <CrudAvatarUpload />
            </div>
          </div>

          <div className="w-full">
            <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
              <label className="form-label flex items-center gap-1 max-w-56">First Name</label>
              <input
                className="input"
                type="text"
                value={formData.first_name}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
                placeholder="Enter first name"
              /> 
            </div>
          </div>

          <div className="w-full">
            <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
              <label className="form-label flex items-center gap-1 max-w-56">Last Name</label>
              <input
                className="input"
                type="text"
                value={formData.last_name}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                placeholder="Enter last name"
              /> 
            </div>
          </div>

          <div className="w-full">
            <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
              <label className="form-label flex items-center gap-1 max-w-56">Phone number</label>
              <input
                className="input"
                type="text"
                value={formData.mobile_number}
                onChange={(e) => handleInputChange('mobile_number', e.target.value)}
                placeholder="Enter phone number"
              />   
            </div>
          </div>

          <div className="w-full">
            <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
              <label className="form-label flex items-center gap-1 max-w-56">Address</label>
              <input
                className="input"
                type="text"
                value={formData.address1}
                onChange={(e) => handleInputChange('address1', e.target.value)}
                placeholder="Enter address"
              />   
            </div>
          </div>

          <div className="w-full">
            <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
              <label className="form-label flex items-center gap-1 max-w-56">Password</label>
              <div className="flex items-center gap-2 flex-1">
                <span className="text-gray-700">Password last changed 2 months ago</span>
                <button
                  className="btn btn-sm btn-icon btn-clear btn-primary"
                  onClick={() => setShowPasswordDialog(true)}
                >
                  <KeenIcon icon="notepad-edit" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2.5">
            <button 
              className="btn btn-primary"
              onClick={handleSave}
              disabled={isSaving || !hasChanges}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      {/* Password Update Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="old_password">Current Password</Label>
              <Input
                id="old_password"
                type="password"
                value={passwordData.old_password}
                onChange={(e) => handlePasswordChange('old_password', e.target.value)}
                placeholder="Enter current password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new_password">New Password</Label>
              <Input
                id="new_password"
                type="password"
                value={passwordData.new_password}
                onChange={(e) => handlePasswordChange('new_password', e.target.value)}
                placeholder="Enter new password"
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowPasswordDialog(false);
                  setPasswordData({ old_password: '', new_password: '' });
                }}
                disabled={isUpdatingPassword}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdatePassword}
                disabled={isUpdatingPassword || !passwordData.old_password || !passwordData.new_password}
              >
                {isUpdatingPassword ? 'Updating...' : 'Update Password'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export { BasicSettings };
