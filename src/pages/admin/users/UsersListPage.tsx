import { Fragment, useState, useEffect } from 'react';
import { Container } from '@/components/container';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading
} from '@/partials/toolbar';
import { UsersListContent } from '.';
import { useLayout } from '@/providers';
import { userService } from '@/api/services';
import type { User } from '@/api/types';

const UsersListPage = () => {
  const { currentLayout } = useLayout();
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);

  // Fetch user counts for the toolbar
  useEffect(() => {
    const fetchUserCounts = async () => {
      try {
        // Fetch without any filters to get accurate total counts
        const response = await userService.getAll({
          page: 0,
          size: 1000, // Large size to get as many users as possible for counting
        });

        if (response.status === 1 && response.data) {
          const total = response.data.totalElements;
          
          // Count active users from the content we received
          let active = 0;
          if (response.data.content) {
            active = response.data.content.filter((user: User) => user.status === 1).length;
          }
          
          // If we got all users in one page, use the accurate count
          if (response.data.last && response.data.content) {
            setActiveUsers(active);
          } else {
            // Approximate based on first page
            setActiveUsers(active);
          }
          setTotalUsers(total);
        }
      } catch (error) {
        console.error('Error fetching user counts:', error);
      }
    };

    fetchUserCounts();
  }, []);

  return (
    <Fragment>
      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarDescription>
                <div className="flex items-center flex-wrap gap-1.5 font-medium">
                  <span className="text-md text-gray-700">Total Users:</span>
                  <span className="text-md text-gray-800 font-medium me-2">{totalUsers}</span>
                  <span className="text-md text-gray-700">Active:</span>
                  <span className="text-md text-green-600 font-medium">{activeUsers}</span>
                </div>
              </ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <a href="#" className="btn btn-sm btn-light">
                Export CSV
              </a>
              <a href="/admin/users/create" className="btn btn-sm btn-primary">
                Add User
              </a>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}

      <Container>
        <UsersListContent />
      </Container>
    </Fragment>
  );
};

export { UsersListPage };
