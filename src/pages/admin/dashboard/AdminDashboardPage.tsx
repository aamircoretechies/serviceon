import { Fragment } from 'react';
import { Container } from '@/components/container';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading
} from '@/partials/toolbar';
import { AdminDashboardContent } from '.';
import { useLayout } from '@/providers';

const AdminDashboardPage = () => {
  const { currentLayout } = useLayout();

  return (
    <Fragment>
      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarDescription>
                <div className="flex items-center flex-wrap gap-1.5 font-medium">
                  <span className="text-md text-gray-700">System Status:</span>
                  <span className="text-md text-green-600 font-medium me-2">Online</span>
                  <span className="text-md text-gray-700">Active Garages:</span>
                  <span className="text-md text-gray-800 font-medium">12</span>
                </div>
              </ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <a href="/serviceon/admin/garages/create" className="btn btn-sm btn-light">
                Add Garage
              </a>
              <a href="/serviceon/admin/users/create" className="btn btn-sm btn-primary">
                Add User
              </a>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}

      <Container>
        <AdminDashboardContent />
      </Container>
    </Fragment>
  );
};

export { AdminDashboardPage };
