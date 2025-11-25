import { KeenIcon } from '@/components';
import { useState, useEffect, useCallback } from 'react';
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

interface IBasicSettingsProps {
  title: string;
}

const BasicSettings = ({ title }: IBasicSettingsProps) => {
  const { auth, currentUser } = useAuthContext();
  // Get user_id from auth (stored in localStorage) or currentUser
  const userId = (auth as any)?.user_id || currentUser?.id;

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
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
      
      setEmail(userData.email || '');
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
      <div className="card min-w-full">
        <div className="card-header">
          <h3 className="card-title">{title}</h3>
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
      <div className="card min-w-full">
        <div className="card-header">
          <h3 className="card-title">{title}</h3>
        </div>
        <div className="card-table scrollable-x-auto pb-3">
          <table className="table align-middle text-sm text-gray-500">
            <tbody>
              <tr>
                <td className="py-2 min-w-36 text-gray-600 font-normal">Email</td>
                <td className="py-2 min-w-60">
                  <a href="#" className="text-gray-800 font-normal text-sm hover:text-primary-active">
                    {email || 'N/A'}
                  </a>
                </td>
                <td className="py-2 max-w-16 text-end">
                  {/* Edit icon removed - email is non-editable */}
                </td>
              </tr>

              <tr>
                <td className="py-2 text-gray-600 font-normal">Password</td>
                <td className="py-2 text-gray-700 font-normal">Click on Edit icon to update password</td>
                <td className="py-2 text-end">
                  <button
                    className="btn btn-sm btn-icon btn-clear btn-primary"
                    onClick={() => setShowPasswordDialog(true)}
                  >
                    <KeenIcon icon="notepad-edit" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Password Update Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="sm:max-w-md p-6">
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

export { BasicSettings, type IBasicSettingsProps };
