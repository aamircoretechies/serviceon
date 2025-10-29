import { Fragment } from 'react';
import { useAdminLayout } from '../';
import { SidebarMenu } from './SidebarMenu';
import { SidebarLogo } from './SidebarLogo';

const Sidebar = () => {
  const { layout } = useAdminLayout();

  return (
    <Fragment>
      <div
        className={`sidebar ${layout.options.sidebar.collapse ? 'sidebar-collapse' : ''} ${
          layout.options.sidebar.fixed ? 'sidebar-fixed' : ''
        }`}
      >
        <SidebarLogo />
        <SidebarMenu />
      </div>
    </Fragment>
  );
};

export { Sidebar };




