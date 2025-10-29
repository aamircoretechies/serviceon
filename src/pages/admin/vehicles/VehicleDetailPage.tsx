import { Fragment } from 'react';
import { Container } from '@/components/container';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading
} from '@/partials/toolbar';
import { VehicleDetailContent } from '.';
import { useLayout } from '@/providers';

const VehicleDetailPage = () => {
  const { currentLayout } = useLayout();

  return (
    <Fragment>
      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarDescription>
                <div className="flex items-center flex-wrap gap-1.5 font-medium">
                  <span className="text-md text-gray-700">Vehicle:</span>
                  <span className="text-md text-gray-800 font-medium me-2">ABC-123</span>
                  <span className="text-md text-gray-700">Total Jobs:</span>
                  <span className="text-md text-green-600 font-medium">8</span>
                </div>
              </ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <a href="#" className="btn btn-sm btn-light">
                Download PDF
              </a>
              <a href="/serviceon/admin/vehicles" className="btn btn-sm btn-primary">
                Back to Vehicles
              </a>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}

      <Container>
        <VehicleDetailContent />
      </Container>
    </Fragment>
  );
};

export { VehicleDetailPage };

