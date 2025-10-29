import { Fragment } from 'react';
import { Container } from '@/components/container';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading
} from '@/partials/toolbar';
import { SystemSettingsContent } from '.';
import { useLayout } from '@/providers';

const SystemSettingsPage = () => {
  const { currentLayout } = useLayout();

  return (
    <Fragment>
      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarDescription>
                <div className="flex items-center flex-wrap gap-1.5 font-medium">
                  <span className="text-md text-gray-700">Manage system integrations and monitor system activity</span>
                </div>
              </ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <a href="#" className="btn btn-sm btn-light">
                Export Logs
              </a>
              <a href="#" className="btn btn-sm btn-primary">
                Test All Connections
              </a>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}

      <Container>
        <SystemSettingsContent />
      </Container>
    </Fragment>
  );
};

export { SystemSettingsPage };

