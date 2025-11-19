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
            {/* Total Garages count is now displayed in GaragesListContent */}
            <ToolbarHeading>
              <ToolbarDescription>
                {/* Stats are shown in GaragesListContent component */}
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
