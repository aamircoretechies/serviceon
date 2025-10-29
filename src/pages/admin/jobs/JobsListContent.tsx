import { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, 
  Wrench, 
  Building2, 
  User, 
  Filter, 
  Search, 
  Plus,
  Eye,
  Edit,
  MoreHorizontal,
  Play,
  Pause,
  Square,
  CheckCircle,
  AlertCircle,
  Download,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { JobDetailsDrawer } from './JobDetailsDrawer';
import { AssignMechanicDialog } from './AssignMechanicDialog';

const JobsListContent = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [garageFilter, setGarageFilter] = useState('all');
  const [mechanicFilter, setMechanicFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);

  // Mock data - replace with actual data
  const jobs = [
    {
      id: 'JOB-001',
      vehicle: {
        make: 'Toyota',
        model: 'Camry',
        year: '2020',
        plate: 'ABC-1234',
        vin: '1HGBH41JXMN109186'
      },
      garage: {
        id: '1',
        name: 'Downtown Auto Service',
        address: '123 Main St, Downtown'
      },
      assignedMechanic: {
        id: '1',
        name: 'Mike Wilson',
        avatar: '/media/avatars/300-3.png'
      },
      status: 'in-progress',
      progress: 65,
      timer: {
        status: 'running',
        elapsed: '02:45:30',
        started: '2024-01-20 09:30:00'
      },
      parts: [
        { name: 'Oil Filter', quantity: 1, status: 'ordered' },
        { name: 'Brake Pads', quantity: 4, status: 'delivered' }
      ],
      createdAt: '2024-01-20 09:00:00',
      estimatedCompletion: '2024-01-20 15:00:00'
    },
    {
      id: 'JOB-002',
      vehicle: {
        make: 'Honda',
        model: 'Civic',
        year: '2019',
        plate: 'XYZ-5678',
        vin: '2HGBH41JXMN109187'
      },
      garage: {
        id: '2',
        name: 'Westside Garage',
        address: '456 Oak Ave, Westside'
      },
      assignedMechanic: {
        id: '2',
        name: 'Sarah Johnson',
        avatar: '/media/avatars/300-2.png'
      },
      status: 'pending',
      progress: 0,
      timer: {
        status: 'stopped',
        elapsed: '00:00:00',
        started: null
      },
      parts: [
        { name: 'Air Filter', quantity: 1, status: 'pending' }
      ],
      createdAt: '2024-01-20 10:15:00',
      estimatedCompletion: '2024-01-20 16:30:00'
    },
    {
      id: 'JOB-003',
      vehicle: {
        make: 'Ford',
        model: 'F-150',
        year: '2021',
        plate: 'DEF-9012',
        vin: '3HGBH41JXMN109188'
      },
      garage: {
        id: '1',
        name: 'Downtown Auto Service',
        address: '123 Main St, Downtown'
      },
      assignedMechanic: null,
      status: 'completed',
      progress: 100,
      timer: {
        status: 'stopped',
        elapsed: '04:20:15',
        started: '2024-01-19 14:00:00'
      },
      parts: [
        { name: 'Spark Plugs', quantity: 6, status: 'used' },
        { name: 'Timing Belt', quantity: 1, status: 'used' }
      ],
      createdAt: '2024-01-19 13:45:00',
      estimatedCompletion: '2024-01-19 18:00:00',
      completedAt: '2024-01-19 18:15:00'
    }
  ];

  const garages = [
    { id: '1', name: 'Downtown Auto Service' },
    { id: '2', name: 'Westside Garage' },
    { id: '3', name: 'North Point Motors' },
    { id: '4', name: 'Central Auto' },
    { id: '5', name: 'Eastside Garage' }
  ];

  const mechanics = [
    { id: '1', name: 'Mike Wilson' },
    { id: '2', name: 'Sarah Johnson' },
    { id: '3', name: 'David Lee' },
    { id: '4', name: 'Lisa Chen' }
  ];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGarage = garageFilter === 'all' || job.garage.id === garageFilter;
    const matchesMechanic = mechanicFilter === 'all' || 
      (job.assignedMechanic && job.assignedMechanic.id === mechanicFilter) ||
      (mechanicFilter === 'unassigned' && !job.assignedMechanic);
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    
    return matchesSearch && matchesGarage && matchesMechanic && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-950/50 dark:text-yellow-300 dark:border-yellow-800">Pending</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-700">In Progress</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 border-green-300 dark:bg-green-950/50 dark:text-green-300 dark:border-green-700">Completed</Badge>;
      case 'on-hold':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-950/50 dark:text-orange-300 dark:border-orange-700">On Hold</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600">Unknown</Badge>;
    }
  };

  const getTimerStatusChip = (timer: any) => {
    switch (timer.status) {
      case 'running':
        return (
          <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
            <Play className="h-3 w-3" />
            <span className="text-xs font-medium">{timer.elapsed}</span>
          </div>
        );
      case 'paused':
        return (
          <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
            <Pause className="h-3 w-3" />
            <span className="text-xs font-medium">{timer.elapsed}</span>
          </div>
        );
      case 'stopped':
        return (
          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-500">
            <Square className="h-3 w-3" />
            <span className="text-xs font-medium">{timer.elapsed}</span>
          </div>
        );
      default:
        return <span className="text-xs text-gray-500 dark:text-gray-500">Not Started</span>;
    }
  };

  const handleViewJob = (job: any) => {
    navigate(`/admin/jobs/${job.id}`);
  };

  const handleAssignMechanic = (job: any) => {
    setSelectedJob(job);
    setShowAssignDialog(true);
  };

  const handleTimerAction = (job: any, action: string) => {
    // Handle timer actions (start, pause, stop)
    console.log(`Timer ${action} for job ${job.id}`);
  };

  if (jobs.length === 0) {
    return (
      <Fragment>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Jobs</h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Manage and track job progress</p>
            </div>
          </div>

          {/* Empty State */}
          <Card className="text-center py-12">
            <CardContent>
              <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <Wrench className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Jobs Yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Get started by creating your first job or check-in a vehicle.
              </p>
              <Button 
                className="flex items-center gap-2"
                onClick={() => navigate('/admin/jobs/create')}
              >
                <Plus className="h-4 w-4" />
                Create First Job
              </Button>
            </CardContent>
          </Card>
        </div>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Jobs</h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Manage and track job progress</p>
          </div>
          <Button 
            className="flex items-center gap-2 w-full sm:w-auto"
            onClick={() => navigate('/admin/jobs/create')}
          >
            <Plus className="h-4 w-4" />
            New Job
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900 dark:text-white">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                  <Input
                    placeholder="Search jobs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900 dark:text-white">Garage</label>
                <Select value={garageFilter} onValueChange={setGarageFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Garages" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Garages</SelectItem>
                    {garages.map((garage) => (
                      <SelectItem key={garage.id} value={garage.id}>
                        {garage.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900 dark:text-white">Mechanic</label>
                <Select value={mechanicFilter} onValueChange={setMechanicFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Mechanics" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Mechanics</SelectItem>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {mechanics.map((mechanic) => (
                      <SelectItem key={mechanic.id} value={mechanic.id}>
                        {mechanic.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900 dark:text-white">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="on-hold">On Hold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Jobs Table */}
        <Card>
          <CardHeader>
            <CardTitle>Jobs ({filteredJobs.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold py-4">Job ID</TableHead>
                    <TableHead className="font-semibold py-4">Vehicle</TableHead>
                    <TableHead className="font-semibold py-4">Garage</TableHead>
                    <TableHead className="font-semibold py-4">Mechanic</TableHead>
                    <TableHead className="font-semibold py-4">Status</TableHead>
                    <TableHead className="font-semibold py-4">Progress</TableHead>
                    <TableHead className="font-semibold py-4">Timer</TableHead>
                    <TableHead className="w-12 font-semibold py-4">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredJobs.map((job) => (
                    <TableRow key={job.id} className="hover:bg-gray-800/50 dark:hover:bg-gray-700/50 transition-colors">
                      <TableCell className="py-4">
                        <div className="font-medium">{job.id}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(job.createdAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-900 dark:text-white py-4">
                        <div>
                          <div className="font-medium">
                            {job.vehicle.year} {job.vehicle.make} {job.vehicle.model}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{job.vehicle.plate}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-900 dark:text-white py-4">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                          <span className="text-sm">{job.garage.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-900 dark:text-white py-4">
                        {job.assignedMechanic ? (
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={job.assignedMechanic.avatar} />
                              <AvatarFallback className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                                {job.assignedMechanic.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{job.assignedMechanic.name}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500 dark:text-gray-400">Unassigned</span>
                        )}
                      </TableCell>
                      <TableCell className="py-4">{getStatusBadge(job.status)}</TableCell>
                      <TableCell className="text-gray-900 dark:text-white py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${job.progress}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-300">{job.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-900 dark:text-white py-4">{getTimerStatusChip(job.timer)}</TableCell>
                      <TableCell className="py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewJob(job)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAssignMechanic(job)}>
                              <User className="h-4 w-4 mr-2" />
                              Assign Mechanic
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleTimerAction(job, 'start')}>
                              <Play className="h-4 w-4 mr-2" />
                              Start Timer
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleTimerAction(job, 'pause')}>
                              <Pause className="h-4 w-4 mr-2" />
                              Pause Timer
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleTimerAction(job, 'stop')}>
                              <Square className="h-4 w-4 mr-2" />
                              Stop Timer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-medium text-sm">{job.id}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    {getStatusBadge(job.status)}
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Wrench className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">
                        {job.vehicle.year} {job.vehicle.make} {job.vehicle.model} ({job.vehicle.plate})
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">{job.garage.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">
                        {job.assignedMechanic ? job.assignedMechanic.name : 'Unassigned'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">{getTimerStatusChip(job.timer)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${job.progress}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">{job.progress}%</span>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleViewJob(job)}
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleAssignMechanic(job)}
                      className="flex-1"
                    >
                      <User className="h-4 w-4 mr-1" />
                      Assign
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Job Details Drawer */}
      {showJobDetails && selectedJob && (
        <JobDetailsDrawer
          job={selectedJob}
          open={showJobDetails}
          onClose={() => setShowJobDetails(false)}
        />
      )}

      {/* Assign Mechanic Dialog */}
      {showAssignDialog && selectedJob && (
        <AssignMechanicDialog
          job={selectedJob}
          open={showAssignDialog}
          onClose={() => setShowAssignDialog(false)}
          mechanics={mechanics}
        />
      )}
    </Fragment>
  );
};

export { JobsListContent };
