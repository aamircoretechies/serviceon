import { Fragment } from 'react';
import { useAdminLayout } from '../';
import { GarageSelector } from './GarageSelector';
import { UserMenu } from './UserMenu';

const HeaderTopbar = () => {
  const { currentGarage } = useAdminLayout();

  return (
    <Fragment>
      <div className="header-topbar">
        <div className="flex items-center justify-between w-full px-6 py-3">
          <div className="flex items-center gap-4">
            <GarageSelector />
            {currentGarage && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Active: <span className="font-medium">{currentGarage.name}</span>
              </div>
            )}
          </div>
          
          <UserMenu />
        </div>
      </div>
    </Fragment>
  );
};

export { HeaderTopbar };




