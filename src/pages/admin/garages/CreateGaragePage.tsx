import { Fragment } from 'react';
import { Container } from '@/components/container';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading
} from '@/partials/toolbar';
import { CreateGarageContent } from '.';
import { useLayout } from '@/providers';

const CreateGaragePage = () => {
  const { currentLayout } = useLayout();

  return (
    <Fragment>
      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarDescription>
                <div className="flex items-center flex-wrap gap-1.5 font-medium">
                  <span className="text-md text-gray-700">Create a new garage location with branding and settings</span>
                </div>
              </ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <a href="/serviceon/admin/garages" className="btn btn-sm btn-light">
                Back to Garages
              </a>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}

      <Container>
        <CreateGarageContent />
      </Container>
    </Fragment>
  );
};

export { CreateGaragePage };
