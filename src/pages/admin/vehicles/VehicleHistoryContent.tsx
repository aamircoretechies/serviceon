import { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
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

const VehicleHistoryContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data - replace with actual data
  const vehicles = [
    {
      id: 1,
      vehicleNumber: 'ABC-123',
      vin: '1HGBH41JXMN109186',
      make: 'Toyota',
      model: 'Camry',
      year: '2020',
      color: 'Silver',
      owner: 'John Doe',
      phone: '(555) 123-4567',
      lastServiceDate: '2024-01-15',
      nextServiceDate: '2024-04-15',
      totalJobs: 8,
      totalNotes: 3,
      status: 'active',
      lastJobSummary: 'Oil Change & Tire Rotation',
      lastAdminNote: 'Customer requested premium oil. Vehicle in excellent condition.',
      createdAt: '2023-06-15'
    },
    {
      id: 2,
      vehicleNumber: 'XYZ-789',
      vin: '2HGBH41JXMN109187',
      make: 'Honda',
      model: 'Civic',
      year: '2019',
      color: 'Blue',
      owner: 'Jane Smith',
      phone: '(555) 234-5678',
      lastServiceDate: '2024-01-10',
      nextServiceDate: '2024-04-10',
      totalJobs: 12,
      totalNotes: 5,
      status: 'active',
      lastJobSummary: 'Brake Pad Replacement',
      lastAdminNote: 'Front brakes were completely worn. Customer satisfied with service.',
      createdAt: '2023-03-20'
    },
    {
      id: 3,
      vehicleNumber: 'DEF-456',
      vin: '3HGBH41JXMN109188',
      make: 'Ford',
      model: 'F-150',
      year: '2021',
      color: 'Black',
      owner: 'Mike Johnson',
      phone: '(555) 345-6789',
      lastServiceDate: '2024-01-05',
      nextServiceDate: '2024-04-05',
      totalJobs: 6,
      totalNotes: 2,
      status: 'inactive',
      lastJobSummary: 'Transmission Service',
      lastAdminNote: 'Transmission fluid change completed. No issues found.',
      createdAt: '2023-08-10'
    },
    {
      id: 4,
      vehicleNumber: 'GHI-321',
      vin: '4HGBH41JXMN109189',
      make: 'BMW',
      model: 'X5',
      year: '2022',
      color: 'White',
      owner: 'Sarah Wilson',
      phone: '(555) 456-7890',
      lastServiceDate: '2024-01-20',
      nextServiceDate: '2024-04-20',
      totalJobs: 4,
      totalNotes: 1,
      status: 'active',
      lastJobSummary: 'Annual Inspection',
      lastAdminNote: 'Passed inspection with flying colors. All systems functioning properly.',
      createdAt: '2023-11-15'
    }
  ];

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.vin.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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
          <Button className="flex items-center gap-2">
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
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  More Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vehicles Table */}
        <Card>
          <CardHeader>
            <CardTitle>Vehicle History ({filteredVehicles.length})</CardTitle>
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
                  {filteredVehicles.map((vehicle) => (
                    <TableRow key={vehicle.id} className="sand-hover-row">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center sand-hover-avatar">
                            <Car className="h-5 w-5 text-gray-600 dark:text-gray-400 sand-hover-icon" />
                          </div>
                          <div>
                            <div className="font-medium">{vehicle.vehicleNumber}</div>
                            <div className="text-sm text-gray-500">{vehicle.make} {vehicle.model} ({vehicle.year})</div>
                            <div className="text-xs text-gray-400">VIN: {vehicle.vin}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{vehicle.owner}</div>
                          <div className="text-sm text-gray-500">{vehicle.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <div>
                            <div className="text-sm">{vehicle.lastServiceDate}</div>
                            <div className="text-xs text-gray-500">Next: {vehicle.nextServiceDate}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <div className="text-sm font-medium">{vehicle.lastJobSummary}</div>
                          <div className="text-xs text-gray-500">Total Jobs: {vehicle.totalJobs}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-gray-400" />
                          <div>
                            <div className="text-sm">{vehicle.lastAdminNote}</div>
                            <div className="text-xs text-gray-500">Notes: {vehicle.totalNotes}</div>
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
                              <Link to={`/admin/vehicles/${vehicle.id}`} className="flex items-center">
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAddNote(vehicle.id)}>
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Add Note
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDownloadPDF(vehicle.id)}>
                              <Download className="h-4 w-4 mr-2" />
                              Download PDF
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
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
