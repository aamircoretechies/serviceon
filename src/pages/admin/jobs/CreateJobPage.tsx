import { Fragment } from 'react';
import { Container } from '@/components/container/Container';
import { CreateJobContent } from './CreateJobContent';

const CreateJobPage = () => {
  return (
    <Fragment>
      <Container>
        <CreateJobContent />
      </Container>
    </Fragment>
  );
};

export { CreateJobPage };


