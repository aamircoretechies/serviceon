import { Fragment } from 'react';
import { Container } from '@/components/container';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading
} from '@/partials/toolbar';
import { CreateReminderTemplateContent } from '.';
import { useLayout } from '@/providers';

const CreateReminderTemplatePage = () => {
  const { currentLayout } = useLayout();

  return (
    <Fragment>
      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarDescription>
                <div className="flex items-center flex-wrap gap-1.5 font-medium">
                  <span className="text-md text-gray-700">Create a new reminder template with scheduling and targeting options</span>
                </div>
              </ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <a href="/serviceon/admin/reminders/templates" className="btn btn-sm btn-light">
                Back to Templates
              </a>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}

      <Container>
        <CreateReminderTemplateContent />
      </Container>
    </Fragment>
  );
};

export { CreateReminderTemplatePage };

