import { Fragment } from 'react';
import { Container } from '@/components/container/Container';
import { JobDetailsContent } from './JobDetailsContent';

const JobDetailsPage = () => {
  return (
    <Fragment>
      <Container>
        <JobDetailsContent />
      </Container>
    </Fragment>
  );
};

export { JobDetailsPage };


