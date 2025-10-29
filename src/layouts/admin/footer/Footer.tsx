import { Fragment } from 'react';

const Footer = () => {
  return (
    <Fragment>
      <div className="footer">
        <div className="flex items-center justify-between w-full px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            © 2024 ServiceOn. All rights reserved.
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Admin Panel v1.0.0
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export { Footer };




