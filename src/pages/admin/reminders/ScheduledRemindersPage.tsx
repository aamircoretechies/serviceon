import { Fragment } from 'react';
import { Container } from '@/components/container';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading
} from '@/partials/toolbar';
import { ScheduledRemindersContent } from '.';
import { useLayout } from '@/providers';

const ScheduledRemindersPage = () => {
  const { currentLayout } = useLayout();

  return (
    <Fragment>
      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarDescription>
                <div className="flex items-center flex-wrap gap-1.5 font-medium">
                  <span className="text-md text-gray-700">Total Scheduled:</span>
                  <span className="text-md text-gray-800 font-medium me-2">24</span>
                  <span className="text-md text-gray-700">Delivered Today:</span>
                  <span className="text-md text-green-600 font-medium">18</span>
                </div>
              </ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <a href="#" className="btn btn-sm btn-light">
                Export Log
              </a>
              <a href="/serviceon/admin/reminders/templates" className="btn btn-sm btn-primary">
                Manage Templates
              </a>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}

      <Container>
        <ScheduledRemindersContent />
      </Container>
    </Fragment>
  );
};

export { ScheduledRemindersPage };

