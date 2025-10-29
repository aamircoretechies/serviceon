import { Fragment } from 'react';
import { Container } from '@/components/container';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading
} from '@/partials/toolbar';
import { ReminderTemplatesContent } from '.';
import { useLayout } from '@/providers';

const ReminderTemplatesPage = () => {
  const { currentLayout } = useLayout();

  return (
    <Fragment>
      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarDescription>
                <div className="flex items-center flex-wrap gap-1.5 font-medium">
                  <span className="text-md text-gray-700">Total Templates:</span>
                  <span className="text-md text-gray-800 font-medium me-2">8</span>
                  <span className="text-md text-gray-700">Active:</span>
                  <span className="text-md text-green-600 font-medium">6</span>
                </div>
              </ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <a href="#" className="btn btn-sm btn-light">
                Export CSV
              </a>
              <a href="/serviceon/admin/reminders/templates/create" className="btn btn-sm btn-primary">
                Create Template
              </a>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}

      <Container>
        <ReminderTemplatesContent />
      </Container>
    </Fragment>
  );
};

export { ReminderTemplatesPage };

