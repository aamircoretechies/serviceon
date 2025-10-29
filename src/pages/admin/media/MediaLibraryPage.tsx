import { Fragment } from 'react';
import { Container } from '@/components/container';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading
} from '@/partials/toolbar';
import { MediaLibraryContent } from '.';
import { useLayout } from '@/providers';

const MediaLibraryPage = () => {
  const { currentLayout } = useLayout();

  return (
    <Fragment>
      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarDescription>
                <div className="flex items-center flex-wrap gap-1.5 font-medium">
                  <span className="text-md text-gray-700">Total Media:</span>
                  <span className="text-md text-gray-800 font-medium me-2">1,247</span>
                  <span className="text-md text-gray-700">Photos:</span>
                  <span className="text-md text-blue-600 font-medium">1,089</span>
                  <span className="text-md text-gray-700">Videos:</span>
                  <span className="text-md text-purple-600 font-medium">158</span>
                </div>
              </ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <a href="#" className="btn btn-sm btn-light">
                Bulk Actions
              </a>
              <a href="#" className="btn btn-sm btn-primary">
                Upload Media
              </a>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}

      <Container>
        <MediaLibraryContent />
      </Container>
    </Fragment>
  );
};

export { MediaLibraryPage };

