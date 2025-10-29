import { Fragment } from 'react';
import { Container } from '@/components/container';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading
} from '@/partials/toolbar';
import { VehicleHistoryContent } from '.';
import { useLayout } from '@/providers';

const VehicleHistoryPage = () => {
  const { currentLayout } = useLayout();

  return (
    <Fragment>
      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarDescription>
                <div className="flex items-center flex-wrap gap-1.5 font-medium">
                  <span className="text-md text-gray-700">Total Vehicles:</span>
                  <span className="text-md text-gray-800 font-medium me-2">156</span>
                  <span className="text-md text-gray-700">With Notes:</span>
                  <span className="text-md text-green-600 font-medium">89</span>
                </div>
              </ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <a href="#" className="btn btn-sm btn-light">
                Export PDF
              </a>
              <a href="#" className="btn btn-sm btn-primary">
                Add Vehicle
              </a>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}

      <Container>
        <VehicleHistoryContent />
      </Container>
    </Fragment>
  );
};

export { VehicleHistoryPage };

