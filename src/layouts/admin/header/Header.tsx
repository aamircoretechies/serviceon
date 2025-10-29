import { Fragment } from 'react';
import { HeaderTopbar } from './HeaderTopbar';
import { HeaderToolbar } from './HeaderToolbar';

const Header = () => {
  return (
    <Fragment>
      <div className="header">
        <HeaderTopbar />
        <HeaderToolbar />
      </div>
    </Fragment>
  );
};

export { Header };




