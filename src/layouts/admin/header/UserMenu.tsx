import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthContext } from '@/auth';
import { userService } from '@/api/services/user.service';
import { IMAGES_BASE_URL } from '@/api/config';
import { toAbsoluteUrl } from '@/utils';
import { toast } from 'sonner';

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { logout: logoutContext, auth, currentUser } = useAuthContext();
  // Get user_id from auth (stored in localStorage) or currentUser
  const userId = (auth as any)?.user_id || currentUser?.id;

  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    profile_image: null as string | null,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile on mount
  const fetchUserProfile = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await userService.getProfile({ user_id: userId });
      const data = response.data;
      
      setUserData({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        email: data.email || '',
        profile_image: data.profile_image || null,
      });
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const handleLogout = async () => {
    try {
      await userService.logout();
      logoutContext();
      navigate('/auth/login');
      toast.success('Logged out successfully');
    } catch (error: any) {
      console.error('Logout error:', error);
      // Even if API fails, clear local auth and redirect
      logoutContext();
      navigate('/auth/login');
      toast.error(error?.response?.data?.message || 'Logout failed');
    }
  };

  const handleProfile = () => {
    navigate('/account/home/user-profile');
  };

  const handleSettings = () => {
    navigate('/account/home/settings-sidebar');
  };

  const fullName = `${userData.first_name} ${userData.last_name}`.trim() || 'User';
  const profileImageUrl = userData.profile_image 
    ? `${IMAGES_BASE_URL}/${userData.profile_image}`
    : toAbsoluteUrl('/media/avatars/blank.png');
  const initials = `${userData.first_name?.[0] || ''}${userData.last_name?.[0] || ''}`.toUpperCase() || 'U';

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 p-2">
          <Avatar className="h-8 w-8">
            <AvatarImage 
              src={profileImageUrl} 
              alt={fullName}
              onError={(e) => {
                // Fallback to default avatar if image fails to load
                (e.target as HTMLImageElement).src = toAbsoluteUrl('/media/avatars/blank.png');
              }}
            />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="hidden md:block text-left">
            <div className="text-sm font-medium">{isLoading ? 'Loading...' : fullName}</div>
            <div className="text-xs text-gray-500">{isLoading ? 'Loading...' : userData.email || 'N/A'}</div>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={handleProfile} className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSettings} className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-red-600">
          <LogOut className="h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { UserMenu };
