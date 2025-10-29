import { Fragment } from 'react';
import { Container } from '@/components/container';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading
} from '@/partials/toolbar';
import { PDFConfigurationContent } from '.';
import { useLayout } from '@/providers';

const PDFConfigurationPage = () => {
  const { currentLayout } = useLayout();

  return (
    <Fragment>
      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarDescription>
                <div className="flex items-center flex-wrap gap-1.5 font-medium">
                  <span className="text-md text-gray-700">Current Template:</span>
                  <span className="text-md text-gray-800 font-medium me-2">v1.0</span>
                  <span className="text-md text-gray-700">Last Updated:</span>
                  <span className="text-md text-green-600 font-medium">Jan 15, 2024</span>
                </div>
              </ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <a href="#" className="btn btn-sm btn-light">
                Preview PDF
              </a>
              <a href="#" className="btn btn-sm btn-primary">
                Save Changes
              </a>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}

      <Container>
        <PDFConfigurationContent />
      </Container>
    </Fragment>
  );
};

export { PDFConfigurationPage };

