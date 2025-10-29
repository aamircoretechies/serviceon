import { Fragment } from 'react';
import { Container } from '@/components/container';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading
} from '@/partials/toolbar';
import { GaragesListContent } from '.';
import { useLayout } from '@/providers';

const GaragesListPage = () => {
  const { currentLayout } = useLayout();

  return (
    <Fragment>
      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarDescription>
                <div className="flex items-center flex-wrap gap-1.5 font-medium">
                  <span className="text-md text-gray-700">Total Garages:</span>
                  <span className="text-md text-gray-800 font-medium me-2">12</span>
                  <span className="text-md text-gray-700">Active:</span>
                  <span className="text-md text-green-600 font-medium">10</span>
                </div>
              </ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <a href="#" className="btn btn-sm btn-light">
                Export CSV
              </a>
              <a href="/serviceon/admin/garages/create" className="btn btn-sm btn-primary">
                Add Garage
              </a>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}

      <Container>
        <GaragesListContent />
      </Container>
    </Fragment>
  );
};

export { GaragesListPage };
