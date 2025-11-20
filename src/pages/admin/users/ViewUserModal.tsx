import { X, User, Mail, Phone, Shield, MapPin, Clock, Image as ImageIcon, UserCheck, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { User as UserType } from '@/api/types';
import { IMAGES_BASE_URL } from '@/api/config';

interface ViewUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserType | null;
}

const ViewUserModal = ({ open, onOpenChange, user }: ViewUserModalProps) => {
  if (!user) {
    return null;
  }

  const getStatusBadge = (status: number) => {
    if (status === 1) {
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Active</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Inactive</Badge>;
    }
  };

  const getRoleBadge = (role: number) => {
    switch (role) {
      case 1:
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Admin</Badge>;
      case 2:
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Technician</Badge>;
      case 3:
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Customer</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getRoleIcon = (role: number) => {
    switch (role) {
      case 1:
        return <Shield className="h-4 w-4 text-red-600" />;
      case 2:
        return <User className="h-4 w-4 text-blue-600" />;
      case 3:
        return <UserCheck className="h-4 w-4 text-green-600" />;
      default:
        return <User className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <User className="h-5 w-5" />
              {user.first_name} {user.last_name}
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="px-6 py-4 space-y-4">
          {/* Basic Information - Compact Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <User className="h-4 w-4" />
                <span>First Name</span>
              </div>
              <p className="font-medium text-sm">{user.first_name}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <User className="h-4 w-4" />
                <span>Last Name</span>
              </div>
              <p className="font-medium text-sm">{user.last_name}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </div>
              <p className="font-medium text-sm break-words">{user.email}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Phone className="h-4 w-4" />
                <span>Phone</span>
              </div>
              <p className="font-medium text-sm">{user.mobile_number || 'N/A'}</p>
            </div>
          </div>

          {/* Role & Status */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Shield className="h-4 w-4" />
                <span>Role</span>
              </div>
              <div className="flex items-center gap-2">
                {getRoleIcon(user.user_role)}
                {getRoleBadge(user.user_role)}
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <UserCheck className="h-4 w-4" />
                <span>Status</span>
              </div>
              {getStatusBadge(user.status)}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Mail className="h-4 w-4" />
                <span>Email Verified</span>
              </div>
              <p className="font-medium text-sm">
                {user.email_verified_status === 1 ? (
                  <Badge className="bg-green-100 text-green-800">Verified</Badge>
                ) : (
                  <Badge className="bg-yellow-100 text-yellow-800">Not Verified</Badge>
                )}
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Shield className="h-4 w-4" />
                <span>2FA Enabled</span>
              </div>
              <p className="font-medium text-sm">
                {user.is2_fa_enabled === 1 ? (
                  <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                ) : (
                  <Badge className="bg-gray-100 text-gray-800">Disabled</Badge>
                )}
              </p>
            </div>
          </div>

          {/* Address */}
          {user.address1 && (
            <div className="space-y-1 pt-2 border-t">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="h-4 w-4" />
                <span>Address</span>
              </div>
              <p className="font-medium text-sm">{user.address1}</p>
            </div>
          )}

          {/* Profile Image & Additional Info - Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t">
            {/* Profile Image */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-700">Profile Image</p>
              <div>
                {user.profile_image ? (
                  <Avatar className="h-24 w-24">
                    <AvatarImage 
                      src={`${IMAGES_BASE_URL}/${user.profile_image}`} 
                      alt="Profile" 
                    />
                    <AvatarFallback>
                      <ImageIcon className="h-12 w-12" />
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-700">Additional Information</p>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-xs text-gray-500">User ID</p>
                  <p className="font-medium">{user.user_id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Created</p>
                  <p className="font-medium">
                    {user.created ? new Date(user.created).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                {user.updated && (
                  <div>
                    <p className="text-xs text-gray-500">Last Updated</p>
                    <p className="font-medium">
                      {new Date(user.updated).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {user.last_login_updated && (
                  <div>
                    <p className="text-xs text-gray-500">Last Login</p>
                    <p className="font-medium">
                      {new Date(user.last_login_updated).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { ViewUserModal };

