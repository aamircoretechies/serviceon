import { Fragment } from 'react';
import { useLocation } from 'react-router';
import { useMenuCurrentItem } from '@/components/menu';
import { useMenus } from '@/providers';
import { Breadcrumb } from '@/components/ui/breadcrumb';

const HeaderToolbar = () => {
  const { pathname } = useLocation();
  const { getMenuConfig } = useMenus();
  const menuConfig = getMenuConfig('admin');
  const menuItem = useMenuCurrentItem(pathname, menuConfig);

  return (
    <Fragment>
      <div className="header-toolbar">
        <div className="flex items-center justify-between w-full px-6 py-4">
          <div className="flex items-center gap-4">
            <Breadcrumb />
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              {menuItem?.title || 'Admin Panel'}
            </h1>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export { HeaderToolbar };




