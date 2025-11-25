import { Fragment, useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  MoreHorizontal, 
  Eye,
  FileText,
  Download,
  Car,
  Calendar,
  User,
  MessageSquare,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { vehicleHistoryService, userService } from '@/api/services';
import { toast } from 'sonner';
import type { VehicleHistoryItem, User as UserType } from '@/api/types';

const VehicleHistoryContent = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [vehicles, setVehicles] = useState<VehicleHistoryItem[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalVehicles, setTotalVehicles] = useState(0);
  const [vehiclesWithNotes, setVehiclesWithNotes] = useState(0);

  // Fetch users for mapping
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userService.getAll({ page: 0, size: 1000 });
        if (response.status === 1 && response.data?.content) {
          setUsers(response.data.content);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  // Fetch vehicle history
  const fetchVehicles = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: any = {
        page: currentPage,
        size: pageSize,
      };

      // Always send search parameter (even if empty)
      params.search = searchTerm ? searchTerm.trim() : '';

      // Add status filter if not 'all'
      if (statusFilter !== 'all') {
        params.status = statusFilter === 'active' ? 1 : 0;
      }

      const response = await vehicleHistoryService.getAll(params);
      
      if (response.status === 1 && response.data) {
        setVehicles(response.data.content);
        setTotalElements(response.data.totalElements);
      } else {
        toast.error(response.message || 'Failed to load vehicle history');
      }
    } catch (error: any) {
      console.error('Error fetching vehicle history:', error);
      toast.error(error?.response?.data?.message || 'Failed to load vehicle history');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, searchTerm, statusFilter]);

  // Fetch all vehicles for statistics (total vehicles and vehicles with notes)
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

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  // Get user name by ID
  const getUserName = (userId: number): string => {
    const user = users.find(u => u.user_id === userId);
    return user ? `${user.first_name} ${user.last_name}` : 'Unknown';
  };

  const getStatusBadge = (status: number) => {
    if (status === 1) {
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Active</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Inactive</Badge>;
    }
  };

  const handleView = (vehicleId: number) => {
    // Navigation is handled by Link component
  };

  const handleDownloadPDF = (vehicleId: number) => {
    console.log('Download PDF for vehicle:', vehicleId);
  };

  const handleAddNote = (vehicleId: number) => {
    console.log('Add note for vehicle:', vehicleId);
  };

  return (
    <Fragment>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Vehicle History</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage vehicle service history and admin notes</p>
          </div>
          <Button 
            className="flex items-center gap-2"
            onClick={() => navigate('/admin/vehicles/create')}
          >
            <Plus className="h-4 w-4" />
            Add Vehicle
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Search & Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by Vehicle Number, VIN, Make, Model, or Owner..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active (1)</SelectItem>
                    <SelectItem value="inactive">Inactive (0)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vehicles Table */}
        <Card>
          <CardHeader>
            <CardTitle>Vehicle History ({vehicles.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Last Service</TableHead>
                    <TableHead>Job Summary</TableHead>
                    <TableHead>Admin Notes</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <p className="text-gray-500">Loading vehicle history...</p>
                      </TableCell>
                    </TableRow>
                  ) : vehicles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <p className="text-gray-500">No vehicle history found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    vehicles.map((vehicle) => (
                      <TableRow key={vehicle.vehicle_history_id} className="sand-hover-row">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center sand-hover-avatar">
                              <Car className="h-5 w-5 text-gray-600 dark:text-gray-400 sand-hover-icon" />
                            </div>
                            <div>
                              <div className="font-medium">{vehicle.vehicle_number || 'N/A'}</div>
                              <div className="text-sm text-gray-500">{vehicle.make_model || 'N/A'} ({vehicle.make_year || 'N/A'})</div>
                              <div className="text-xs text-gray-400">VIN: {vehicle.vin_number || 'N/A'}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{getUserName(vehicle.user_id)}</div>
                            <div className="text-sm text-gray-500">User ID: {vehicle.user_id}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <div>
                              <div className="text-sm">{vehicle.last_service || 'N/A'}</div>
                              <div className="text-xs text-gray-500">Next: {vehicle.next_service_schedule || 'N/A'}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <div className="text-sm font-medium">{vehicle.job_summary || 'N/A'}</div>
                            <div className="text-xs text-gray-500">Total Jobs: {vehicle.total_jobs}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-gray-400" />
                            <div>
                              <div className="text-sm max-w-xs truncate">{vehicle.admin_notes || 'N/A'}</div>
                              <div className="text-xs text-gray-500">Notes: {vehicle.total_notest}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(vehicle.status)}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link to={`/admin/vehicles/${vehicle.vehicle_history_id}`} className="flex items-center">
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleAddNote(vehicle.vehicle_history_id)}>
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Add Note
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDownloadPDF(vehicle.vehicle_history_id)}>
                                <Download className="h-4 w-4 mr-2" />
                                Download PDF
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Fragment>
  );
};

export { VehicleHistoryContent };
