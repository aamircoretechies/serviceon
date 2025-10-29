import { Fragment } from 'react';
import { Container } from '@/components/container/Container';
import { JobsListContent } from './JobsListContent';

const JobsListPage = () => {
  return (
    <Fragment>
      <Container>
        <JobsListContent />
      </Container>
    </Fragment>
  );
};

export { JobsListPage };


