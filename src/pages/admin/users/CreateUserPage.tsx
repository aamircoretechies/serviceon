import { Fragment } from 'react';
import { Container } from '@/components/container';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading
} from '@/partials/toolbar';
import { CreateUserContent } from '.';
import { useLayout } from '@/providers';

const CreateUserPage = () => {
  const { currentLayout } = useLayout();

  return (
    <Fragment>
      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarDescription>
                <div className="flex items-center flex-wrap gap-1.5 font-medium">
                  <span className="text-md text-gray-700">Add a new user to your organization</span>
                </div>
              </ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <a href="/serviceon/admin/users" className="btn btn-sm btn-light">
                Back to Users
              </a>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}

      <Container>
        <CreateUserContent />
      </Container>
    </Fragment>
  );
};

export { CreateUserPage };
