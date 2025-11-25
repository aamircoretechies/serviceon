import { ChangeEvent, Fragment, useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { useAuthContext } from '@/auth';
import { useLanguage } from '@/i18n';
import { toAbsoluteUrl } from '@/utils';
import { IMAGES_BASE_URL } from '@/api/config';
import { DropdownUserLanguages } from './DropdownUserLanguages';
import { useSettings } from '@/providers/SettingsProvider';
import { DefaultTooltip, KeenIcon } from '@/components';
import { userService } from '@/api/services/user.service';
import { toast } from 'sonner';
import {
  MenuItem,
  MenuLink,
  MenuSub,
  MenuTitle,
  MenuSeparator,
  MenuArrow,
  MenuIcon
} from '@/components/menu';

interface IDropdownUserProps {
  menuItemRef: any;
}

const DropdownUser = ({ menuItemRef }: IDropdownUserProps) => {
  const { settings, storeSettings } = useSettings();
  const { logout: logoutContext, auth, currentUser } = useAuthContext();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  
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
    } catch (error: any) {
      console.error('Failed to fetch user profile:', error);
      // Don't show toast error here as it might be annoying on every dropdown open
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const handleThemeMode = (event: ChangeEvent<HTMLInputElement>) => {
    const newThemeMode = event.target.checked ? 'dark' : 'light';

    storeSettings({
      themeMode: newThemeMode
    });
  };

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

  const buildHeader = () => {
    const fullName = `${userData.first_name} ${userData.last_name}`.trim() || 'User';
    const profileImageUrl = userData.profile_image 
      ? `${IMAGES_BASE_URL}/${userData.profile_image}`
      : toAbsoluteUrl('/media/avatars/blank.png');

    return (
      <div className="flex items-center justify-between px-5 py-1.5 gap-1.5">
        <div className="flex items-center gap-2">
          <img
            className="size-9 rounded-full border-2 border-success"
            src={profileImageUrl}
            alt={fullName}
            onError={(e) => {
              // Fallback to default avatar if image fails to load
              (e.target as HTMLImageElement).src = toAbsoluteUrl('/media/avatars/blank.png');
            }}
          />
          <div className="flex flex-col gap-1.5">
            <Link
              to="/account/home/user-profile"
              className="text-sm text-gray-800 hover:text-primary font-semibold leading-none"
            >
              {isLoading ? 'Loading...' : fullName}
            </Link>
            <a
              href={`mailto:${userData.email}`}
              className="text-xs text-gray-600 hover:text-primary font-medium leading-none"
            >
              {isLoading ? 'Loading...' : userData.email || 'N/A'}
            </a>
          </div>
        </div>
        {/* Pro badge removed as per requirements */}
      </div>
    );
  };

  const buildMenu = () => {
    return (
      <Fragment>
        <MenuSeparator />
        <div className="flex flex-col">
         
          <MenuItem>
            <MenuLink path="/account/home/user-profile">
              <MenuIcon>
                <KeenIcon icon="profile-circle" />
              </MenuIcon>
              <MenuTitle>
                <FormattedMessage id="USER.MENU.MY_PROFILE" />
              </MenuTitle>
            </MenuLink>
          </MenuItem>
         {/*  <MenuItem
            toggle="dropdown"
            trigger="hover"
            dropdownProps={{
              placement: isRTL() ? 'left-start' : 'right-start',
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: isRTL() ? [50, 0] : [-50, 0] // [skid, distance]
                  }
                }
              ]
            }}
          >
            <MenuLink>
              <MenuIcon>
                <KeenIcon icon="setting-2" />
              </MenuIcon>
              <MenuTitle>
                <FormattedMessage id="USER.MENU.MY_ACCOUNT" />
              </MenuTitle>
              <MenuArrow>
                <KeenIcon icon="right" className="text-3xs rtl:transform rtl:rotate-180" />
              </MenuArrow>
            </MenuLink>
            <MenuSub className="menu-default light:border-gray-300 w-[200px]] md:w-[220px]">
            
              <MenuItem>
                <MenuLink path="/account/home/user-profile">
                  <MenuIcon>
                    <KeenIcon icon="some-files" />
                  </MenuIcon>
                  <MenuTitle>
                    <FormattedMessage id="USER.MENU.MY_PROFILE" />
                  </MenuTitle>
                </MenuLink>
              </MenuItem>
              
            
         
         
              <MenuSeparator />
          
            </MenuSub>
          </MenuItem> */}
       
          <MenuSeparator />
        </div>
      </Fragment>
    );
  };

  const buildFooter = () => {
    return (
      <div className="flex flex-col">
        {/* <div className="menu-item mb-0.5">
          <div className="menu-link">
            <span className="menu-icon">
              <KeenIcon icon="moon" />
            </span>
            <span className="menu-title">
              <FormattedMessage id="USER.MENU.DARK_MODE" />
            </span>
            <label className="switch switch-sm">
              <input
                name="theme"
                type="checkbox"
                checked={settings.themeMode === 'dark'}
                onChange={handleThemeMode}
                value="1"
              />
            </label>
          </div>
        </div> */}

        <div className="menu-item px-4 py-1.5">
          <a onClick={handleLogout} className="btn btn-sm btn-light justify-center">
            <FormattedMessage id="USER.MENU.LOGOUT" />
          </a>
        </div>
      </div>
    );
  };

  return (
    <MenuSub
      className="menu-default light:border-gray-300 w-[200px] md:w-[250px]"
      rootClassName="p-0"
    >
      {buildHeader()}
      {buildMenu()}
      {buildFooter()}
    </MenuSub>
  );
};

export { DropdownUser };
