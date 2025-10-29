import { Link } from 'react-router-dom';
import { toAbsoluteUrl } from '@/utils';
import { useAdminLayout } from '../';

const SidebarLogo = () => {
  const { layout } = useAdminLayout();

  return (
    <div className="sidebar-logo">
      <Link to="/admin" className="flex items-center gap-3">
        <img
          src={toAbsoluteUrl('/media/app/mini-logo-circle-primary.svg')}
          className="dark:hidden h-8 w-8"
          alt="ServiceOn"
        />
        <img
          src={toAbsoluteUrl('/media/app/mini-logo-circle-primary-dark.svg')}
          className="hidden dark:inline-block h-8 w-8"
          alt="ServiceOn"
        />
        {!layout.options.sidebar.collapse && (
          <div className="flex flex-col">
            <span className="text-lg font-bold text-gray-900 dark:text-white">ServiceOn</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Admin Panel</span>
          </div>
        )}
      </Link>
    </div>
  );
};

export { SidebarLogo };




