import { Fragment } from 'react';
import { Helmet } from 'react-helmet-async';
import { Container } from '@/components/container';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading
} from '@/partials/toolbar';
import { BrandingOutputContent } from './BrandingOutputContent';
import { useLayout } from '@/providers';

const BrandingOutputPage = () => {
  const { currentLayout } = useLayout();

  return (
    <Fragment>
      <Helmet>
        <title>Branding Output Settings | ServiceOn Admin</title>
      </Helmet>
      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarDescription>
                <div className="flex items-center flex-wrap gap-1.5 font-medium">
                  <span className="text-md text-gray-700">Manage document templates and output configurations</span>
                </div>
              </ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <a href="#" className="btn btn-sm btn-light">
                Preview Output
              </a>
              <a href="#" className="btn btn-sm btn-primary">
                Save Settings
              </a>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}

      <Container>
        <BrandingOutputContent />
      </Container>
    </Fragment>
  );
};

export { BrandingOutputPage };
