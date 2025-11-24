import { Fragment } from 'react';
import { Container } from '@/components/container';
import { LaborRatesListContent } from '.';
import { useLayout } from '@/providers';

const LaborRatesListPage = () => {
  const { currentLayout } = useLayout();

  return (
    <Fragment>
      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          {/* Toolbar can be added here if needed */}
        </Container>
      )}

      <Container>
        <LaborRatesListContent />
      </Container>
    </Fragment>
  );
};

export { LaborRatesListPage };

