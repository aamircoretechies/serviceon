import { Fragment, useState, useEffect } from 'react';
import { Container } from '@/components/container';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading
} from '@/partials/toolbar';
import { VehicleHistoryContent } from '.';
import { useLayout } from '@/providers';
import { vehicleHistoryService } from '@/api/services';

const VehicleHistoryPage = () => {
  const { currentLayout } = useLayout();
  const [totalVehicles, setTotalVehicles] = useState(0);
  const [vehiclesWithNotes, setVehiclesWithNotes] = useState(0);

  // Fetch statistics
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await vehicleHistoryService.getAll({ page: 0, size: 10000 });
        if (response.status === 1 && response.data) {
          const allVehicles = response.data.content;
          setTotalVehicles(allVehicles.length);
          const withNotes = allVehicles.filter(v => v.total_notest > 0).length;
          setVehiclesWithNotes(withNotes);
        }
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };
    fetchStatistics();
  }, []);

  return (
    <Fragment>
      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarDescription>
                <div className="flex items-center flex-wrap gap-1.5 font-medium">
                  <span className="text-md text-gray-700">Total Vehicles:</span>
                  <span className="text-md text-gray-800 font-medium me-2">{totalVehicles}</span>
                  <span className="text-md text-gray-700">With Notes:</span>
                  <span className="text-md text-green-600 font-medium">{vehiclesWithNotes}</span>
                </div>
              </ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <a href="#" className="btn btn-sm btn-light">
                Export PDF
              </a>
              <a href="#" className="btn btn-sm btn-primary">
                Add Vehicle
              </a>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}

      <Container>
        <VehicleHistoryContent />
      </Container>
    </Fragment>
  );
};

export { VehicleHistoryPage };

