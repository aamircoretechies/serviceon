import { Fragment } from 'react';
import { Container } from '@/components/container';
import { AddVehicleContent } from '.';
import { useLayout } from '@/providers';

const AddVehiclePage = () => {
  const { currentLayout } = useLayout();

  return (
    <Fragment>
      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          {/* Toolbar can be added here if needed */}
        </Container>
      )}

      <Container>
        <AddVehicleContent />
      </Container>
    </Fragment>
  );
};

export { AddVehiclePage };

