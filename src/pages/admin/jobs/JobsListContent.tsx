import { Fragment, useState, useEffect, useCallback } from 'react';
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
import { jobService, garageService, userService } from '@/api/services';
import { toast } from 'sonner';
import type { JobWithParts, Garage, User as UserType } from '@/api/types';

const JobsListContent = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [garageFilter, setGarageFilter] = useState('all');
  const [mechanicFilter, setMechanicFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  
  // API data states
  const [jobs, setJobs] = useState<JobWithParts[]>([]);
  const [garages, setGarages] = useState<Garage[]>([]);
  const [mechanics, setMechanics] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingGarages, setIsLoadingGarages] = useState(false);
  const [isLoadingMechanics, setIsLoadingMechanics] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Mock data - replace with actual data (keeping for reference)
  const mockJobs = [
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

  // Fetch garages for filter dropdown
  useEffect(() => {
    const fetchGarages = async () => {
      setIsLoadingGarages(true);
      try {
        const response = await garageService.getAll();
        if (response.status === 1 && response.data?.garages?.content) {
          setGarages(response.data.garages.content);
        } else {
          toast.error('Failed to load garages');
        }
      } catch (error) {
        console.error('Error fetching garages:', error);
        toast.error('Failed to load garages');
      } finally {
        setIsLoadingGarages(false);
      }
    };
    fetchGarages();
  }, []);

  // Fetch mechanics (users with user_role = 2) for filter dropdown
  useEffect(() => {
    const fetchMechanics = async () => {
      setIsLoadingMechanics(true);
      try {
        const response = await userService.getAll({
          page: 0,
          size: 1000, // Get all mechanics
          user_role: 2, // Filter for mechanics only
        });
        if (response.status === 1 && response.data?.content) {
          setMechanics(response.data.content);
        } else {
          toast.error('Failed to load mechanics');
        }
      } catch (error) {
        console.error('Error fetching mechanics:', error);
        toast.error('Failed to load mechanics');
      } finally {
        setIsLoadingMechanics(false);
      }
    };
    fetchMechanics();
  }, []);

  // Fetch jobs from API
  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: any = {
        page_number: currentPage,
        page_size: pageSize,
        search: searchTerm || '', // Always send search, even if empty
      };

      // Only add filters if they're not "all"
      if (garageFilter !== 'all') {
        params.garage_id = parseInt(garageFilter);
      }
      // Note: For "unassigned", we filter on frontend since API doesn't support null mechanic_id filter
      if (mechanicFilter !== 'all' && mechanicFilter !== 'unassigned') {
        params.mechanic_id = parseInt(mechanicFilter);
      }
      if (statusFilter !== 'all') {
        params.status = parseInt(statusFilter);
      }

      console.log('Fetching jobs with params:', params);
      const response = await jobService.getAll(params);
      console.log('Jobs API response:', response);

      if (response.status === 1 && response.data?.jobs) {
        setJobs(response.data.jobs);
        setTotalElements(response.data.total_elements);
        setTotalPages(response.data.total_pages);
      } else {
        toast.error(response.message || 'Failed to load jobs');
      }
    } catch (error: any) {
      console.error('Error fetching jobs:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to load jobs';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, searchTerm, garageFilter, mechanicFilter, statusFilter]);

  // Fetch jobs when filters change
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Map API job data to UI format
  const mapJobToUI = (job: JobWithParts) => {
    const garage = garages.find(g => g.garage_id === job.garage_id);
    const mechanic = mechanics.find(m => m.user_id === job.mechanic_id);
    
    // Map status: 1=Complete, 2=Pending, 3=In progress, 4=onHold, 5=cancelled
    const statusMap: { [key: number]: string } = {
      1: 'completed',
      2: 'pending',
      3: 'in-progress',
      4: 'on-hold',
      5: 'cancelled',
    };
    
    const status = statusMap[job.status || 2] || 'pending';
    
    // Parse timer
    const timerValue = job.timer || '00:00:00';
    const timer = {
      status: timerValue === '00:00:00' ? 'stopped' : 'running',
      elapsed: timerValue,
      started: job.created || null,
    };

    return {
      id: `JOB-${String(job.job_id).padStart(3, '0')}`,
      job_id: job.job_id,
      vehicle: {
        make: job.vehicle_make || '',
        model: job.vehicle_model || '',
        year: job.vehicle_year || '',
        plate: job.vehicle_license_plate || '',
        vin: job.vehicle_vin || '',
      },
      garage: {
        id: job.garage_id?.toString() || '',
        name: garage?.garage_name || 'Unknown Garage',
        address: garage ? `${garage.garage_street_address}, ${garage.garage_city}` : '',
      },
      assignedMechanic: mechanic ? {
        id: mechanic.user_id?.toString() || '',
        name: `${mechanic.first_name || ''} ${mechanic.last_name || ''}`.trim(),
        avatar: '/media/avatars/300-3.png',
      } : null,
      status,
      progress: status === 'completed' ? 100 : status === 'in-progress' ? 50 : 0,
      timer,
      parts: (job.job_parts || []).map(part => ({
        name: part.part_name || '',
        quantity: part.part_count || 0,
        status: 'ordered' as const,
      })),
      createdAt: job.created || '',
      estimatedCompletion: job.job_estimated_hours || '',
    };
  };

  const uiJobs = jobs.map(mapJobToUI);
  
  // Filter for unassigned mechanic if needed
  const filteredJobs = uiJobs.filter(job => {
    if (mechanicFilter === 'unassigned') {
      return !job.assignedMechanic;
    }
    return true; // API already filters, just return all
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
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 border-red-300 dark:bg-red-950/50 dark:text-red-300 dark:border-red-700">Cancelled</Badge>;
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
    navigate(`/admin/jobs/${job.job_id || job.id}`);
  };

  const handleAssignMechanic = (job: any) => {
    setSelectedJob(job);
    setShowAssignDialog(true);
  };

  const handleTimerAction = (job: any, action: string) => {
    // Handle timer actions (start, pause, stop)
    console.log(`Timer ${action} for job ${job.id}`);
  };

  // Check if any filters are active
  const hasActiveFilters = searchTerm !== '' || 
    garageFilter !== 'all' || 
    mechanicFilter !== 'all' || 
    statusFilter !== 'all';

  // Only show "No Jobs Yet" if there are no jobs AND no filters are applied
  if (!isLoading && jobs.length === 0 && !hasActiveFilters) {
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
                      <SelectItem key={garage.garage_id} value={garage.garage_id?.toString() || ''}>
                        {garage.garage_name}
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
                      <SelectItem key={mechanic.user_id} value={mechanic.user_id?.toString() || ''}>
                        {`${mechanic.first_name || ''} ${mechanic.last_name || ''}`.trim()}
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
                    <SelectItem value="1">Complete</SelectItem>
                    <SelectItem value="2">Pending</SelectItem>
                    <SelectItem value="3">In Progress</SelectItem>
                    <SelectItem value="4">On Hold</SelectItem>
                    <SelectItem value="5">Cancelled</SelectItem>
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
                    {/* <TableHead className="font-semibold py-4">Progress</TableHead> */}
                    <TableHead className="font-semibold py-4">Timer</TableHead>
                    <TableHead className="w-12 font-semibold py-4">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredJobs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12">
                        <div className="flex flex-col items-center justify-center">
                          <Wrench className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                          <p className="text-gray-600 dark:text-gray-400">
                            {hasActiveFilters 
                              ? 'No jobs found matching your filters.' 
                              : 'No jobs found.'}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredJobs.map((job) => (
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
                      {/* <TableCell className="text-gray-900 dark:text-white py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${job.progress}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-300">{job.progress}%</span>
                        </div>
                      </TableCell> */}
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
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4">
              {filteredJobs.length === 0 ? (
                <Card className="p-8 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <Wrench className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      {hasActiveFilters 
                        ? 'No jobs found matching your filters.' 
                        : 'No jobs found.'}
                    </p>
                  </div>
                </Card>
              ) : (
                filteredJobs.map((job) => (
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
                ))
              )}
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
