import { Fragment, useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, 
  Car, 
  User, 
  Calendar, 
  Clock, 
  Wrench, 
  FileText,
  Edit,
  Play,
  Pause,
  Square,
  CheckCircle,
  AlertCircle,
  Download,
  Package,
  History,
  Building2,
  Phone,
  Mail,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, Tab, TabPanel } from '@/components/tabs';
import { jobService, garageService, userService, jobTypeService, serviceTypeService } from '@/api/services';
import { toast } from 'sonner';
import type { JobWithParts, Garage, User as UserType, JobType, ServiceType } from '@/api/types';

const JobDetailsContent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [jobData, setJobData] = useState<JobWithParts | null>(null);
  const [garage, setGarage] = useState<Garage | null>(null);
  const [mechanic, setMechanic] = useState<UserType | null>(null);
  const [jobType, setJobType] = useState<JobType | null>(null);
  const [serviceType, setServiceType] = useState<ServiceType | null>(null);

  // Get job data from navigation state or fetch from API
  useEffect(() => {
    const fetchJobData = async () => {
      setIsLoading(true);
      try {
        // First, try to get from navigation state
        const stateJobData = location.state?.jobData as JobWithParts | undefined;
        
        if (stateJobData) {
          console.log('Job data from state:', stateJobData);
          console.log('Job parts from state:', stateJobData.job_parts);
          setJobData(stateJobData);
        } else {
          // If not in state, fetch from API using the job ID from URL
          // For now, we'll need to fetch all jobs and find the one with matching ID
          // TODO: Add a GET job by ID endpoint if available
          const response = await jobService.getAll({ page_number: 0, page_size: 1000 });
          if (response.status === 1 && response.data?.jobs) {
            const jobId = parseInt(id || '0');
            const foundJob = response.data.jobs.find(j => j.job_id === jobId);
            if (foundJob) {
              console.log('Job data from API:', foundJob);
              console.log('Job parts from API:', foundJob.job_parts);
              setJobData(foundJob);
            } else {
              toast.error('Job not found');
              navigate('/admin/jobs');
            }
          }
        }
      } catch (error: any) {
        console.error('Error fetching job data:', error);
        toast.error('Failed to load job details');
        navigate('/admin/jobs');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchJobData();
    }
  }, [id, location.state, navigate]);

  // Fetch related data (garage, mechanic, job type, service type)
  useEffect(() => {
    const fetchRelatedData = async () => {
      if (!jobData) return;

      try {
        // Fetch garage
        if (jobData.garage_id) {
          const garagesResponse = await garageService.getAll();
          if (garagesResponse.status === 1 && garagesResponse.data?.garages?.content) {
            const foundGarage = garagesResponse.data.garages.content.find(
              g => g.garage_id === jobData.garage_id
            );
            if (foundGarage) setGarage(foundGarage);
          }
        }

        // Fetch mechanic
        if (jobData.mechanic_id) {
          const mechanicsResponse = await userService.getAll({
            page: 0,
            size: 1000,
            user_role: 2,
          });
          if (mechanicsResponse.status === 1 && mechanicsResponse.data?.content) {
            const foundMechanic = mechanicsResponse.data.content.find(
              m => m.user_id === jobData.mechanic_id
            );
            if (foundMechanic) setMechanic(foundMechanic);
          }
        }

        // Fetch job type
        if (jobData.job_type_id) {
          const jobTypes = await jobTypeService.getAll();
          const foundJobType = jobTypes.find(jt => jt.job_type_id === jobData.job_type_id);
          if (foundJobType) setJobType(foundJobType);
        }

        // Fetch service type
        if (jobData.job_service_type !== null && jobData.job_service_type !== undefined) {
          console.log('Fetching service type for job_service_type:', jobData.job_service_type);
          const serviceTypes = await serviceTypeService.getAll();
          console.log('All service types:', serviceTypes);
          const foundServiceType = serviceTypes.find(st => st.service_type_id === jobData.job_service_type);
          console.log('Found service type:', foundServiceType);
          if (foundServiceType) {
            setServiceType(foundServiceType);
          } else {
            console.warn('Service type not found for job_service_type:', jobData.job_service_type);
          }
        } else {
          console.log('No service type (job_service_type is null/undefined)');
        }
      } catch (error) {
        console.error('Error fetching related data:', error);
      }
    };

    fetchRelatedData();
  }, [jobData]);

  // Map status: 1=Complete, 2=Pending, 3=In progress, 4=onHold, 5=cancelled
  const statusMap: { [key: number]: string } = {
    1: 'completed',
    2: 'pending',
    3: 'in-progress',
    4: 'on-hold',
    5: 'cancelled',
  };

  // Map priority: 1=Low, 2=Medium, 3=High
  const priorityMap: { [key: number]: string } = {
    1: 'low',
    2: 'medium',
    3: 'high',
  };

  // Calculate progress based on status
  const calculateProgress = (status: number | undefined): number => {
    switch (status) {
      case 1: return 100; // Completed
      case 3: return 50;  // In Progress
      case 4: return 25;  // On Hold
      case 5: return 0;   // Cancelled
      default: return 0; // Pending
    }
  };

  // Calculate total parts cost
  const calculatePartsCost = (parts: any[] | undefined): number => {
    if (!parts || parts.length === 0) return 0;
    return parts.reduce((total, part) => {
      const cost = parseFloat(part.part_cost_total || '0');
      return total + cost;
    }, 0);
  };

  // Map API data to UI format - use useMemo to recalculate when dependencies change
  const job = useMemo(() => {
    if (!jobData) return null;
    
    return {
    id: `JOB-${String(jobData.job_id).padStart(3, '0')}`,
    job_id: jobData.job_id,
    vehicle: {
      make: jobData.vehicle_make || '',
      model: jobData.vehicle_model || '',
      year: jobData.vehicle_year || '',
      plate: jobData.vehicle_license_plate || '',
      vin: jobData.vehicle_vin || '',
      mileage: jobData.vehicle_mileage || '0'
    },
    customer: {
      name: jobData.customer_name || '',
      phone: jobData.customer_phone_number || '',
      email: jobData.customer_email_address || '',
      address: '' // Not available in API
    },
    garage: {
      id: garage?.garage_id?.toString() || '',
      name: garage?.garage_name || 'Unknown Garage',
      address: garage ? `${garage.garage_street_address || ''}, ${garage.garage_city || ''}`.trim() : '',
      phone: garage?.garage_phone_number || ''
    },
    assignedMechanic: mechanic ? {
      id: mechanic.user_id?.toString() || '',
      name: `${mechanic.first_name || ''} ${mechanic.last_name || ''}`.trim(),
      avatar: '/media/avatars/300-3.png',
      phone: mechanic.mobile_number || ''
    } : null,
    status: statusMap[jobData.status || 2] || 'pending',
    priority: priorityMap[jobData.job_priority || 2] || 'medium',
    progress: calculateProgress(jobData.status),
    timer: {
      status: (jobData.timer && jobData.timer !== '00:00:00') ? 'running' : 'stopped',
      elapsed: jobData.timer || '00:00:00',
      started: jobData.created || null
    },
    jobType: jobType?.job_type_name || 'Unknown',
    description: jobData.job_description || '',
    estimatedHours: jobData.job_estimated_hours || '0',
    estimatedCost: jobData.job_estimated_cost || '0',
    actualHours: '0', // Not available in API
    actualCost: calculatePartsCost(jobData.job_parts).toFixed(2),
    createdAt: jobData.created || '',
    estimatedCompletion: jobData.job_estimated_hours || '', // Use estimated hours as completion time
    completedAt: jobData.status === 1 ? jobData.updated : null,
    services: (() => {
      console.log('Mapping services - serviceType:', serviceType);
      console.log('jobData.job_service_type:', jobData.job_service_type);
      if (serviceType && serviceType.service_type_name) {
        return [serviceType.service_type_name];
      }
      return [];
    })(),
    parts: (() => {
      console.log('Mapping parts, jobData.job_parts:', jobData.job_parts);
      const partsArray = jobData.job_parts || [];
      console.log('Parts array length:', partsArray.length);
      return partsArray.map(part => {
        console.log('Mapping part:', part);
        return {
          name: part.part_name || '',
          quantity: part.part_count || 0,
          cost: parseFloat(part.part_cost_total || '0'),
          status: 'delivered', // Default status
          part_number: part.part_number || '',
          part_description: part.part_description || ''
        };
      });
    })(),
    notes: [] // Not available in API
    };
  }, [jobData, garage, mechanic, jobType, serviceType]);

  // Show loading state
  if (isLoading || !job) {
    return (
      <Fragment>
        <div className="space-y-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading job details...</p>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }

  // Type guard - job is guaranteed to be non-null after the check above
  if (!job) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Pending</Badge>;
      case 'in-progress':
        return <Badge variant="outline" className="text-blue-600 border-blue-600">In Progress</Badge>;
      case 'completed':
        return <Badge variant="outline" className="text-green-600 border-green-600">Completed</Badge>;
      case 'on-hold':
        return <Badge variant="outline" className="text-orange-600 border-orange-600">On Hold</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'low':
        return <Badge variant="outline" className="text-green-600 border-green-600">Low</Badge>;
      case 'medium':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Medium</Badge>;
      case 'high':
        return <Badge variant="outline" className="text-red-600 border-red-600">High</Badge>;
      default:
        return <Badge variant="outline">Medium</Badge>;
    }
  };

  const getTimerStatusChip = (timer: any) => {
    switch (timer.status) {
      case 'running':
        return (
          <div className="flex items-center gap-2 text-green-600">
            <Play className="h-4 w-4" />
            <span className="font-medium">{timer.elapsed}</span>
          </div>
        );
      case 'paused':
        return (
          <div className="flex items-center gap-2 text-yellow-600">
            <Pause className="h-4 w-4" />
            <span className="font-medium">{timer.elapsed}</span>
          </div>
        );
      case 'stopped':
        return (
          <div className="flex items-center gap-2 text-gray-500">
            <Square className="h-4 w-4" />
            <span className="font-medium">{timer.elapsed}</span>
          </div>
        );
      default:
        return <span className="text-gray-500">Not Started</span>;
    }
  };

  const getPartStatusBadge = (status: string) => {
    switch (status) {
      case 'ordered':
        return <Badge variant="outline" className="text-blue-600 border-blue-600">Ordered</Badge>;
      case 'delivered':
        return <Badge variant="outline" className="text-green-600 border-green-600">Delivered</Badge>;
      case 'used':
        return <Badge variant="outline" className="text-purple-600 border-purple-600">Used</Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Activity log - defined after null check
  const activityLog = [
    {
      id: 1,
      action: 'Job Created',
      details: 'Job was created and assigned to queue',
      timestamp: job.createdAt,
      user: 'System',
      type: 'info'
    },
    {
      id: 2,
      action: 'Mechanic Assigned',
      details: job.assignedMechanic ? `Assigned to ${job.assignedMechanic.name}` : 'No mechanic assigned',
      timestamp: job.createdAt,
      user: 'Admin',
      type: 'success'
    },
    {
      id: 3,
      action: 'Timer Started',
      details: 'Work timer was started',
      timestamp: job.timer.started || job.createdAt,
      user: job.assignedMechanic?.name || 'System',
      type: 'info'
    },
    {
      id: 4,
      action: 'Parts Delivered',
      details: job.parts && job.parts.length > 0 ? `${job.parts.length} parts have been delivered` : 'No parts required',
      timestamp: job.createdAt,
      user: 'System',
      type: 'success'
    }
  ];

  return (
    <Fragment>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Job Details - {job.id}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              {job.vehicle.year} {job.vehicle.make} {job.vehicle.model}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(job.status)}
            <Button
              variant="outline"
              onClick={() => navigate('/admin/jobs')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Jobs
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Progress</p>
                  <p className="text-lg font-semibold">{job.progress}%</p>
                </div>
              </div>
            </CardContent>
          </Card> */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Timer</p>
                  <p className="text-lg font-semibold">{job.timer.elapsed}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Est. Cost</p>
                  <p className="text-lg font-semibold">${job.estimatedCost}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Est. Hours</p>
                  <p className="text-lg font-semibold">{job.estimatedHours}h</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onChange={(_, value) => {
          if (value !== null) {
            setActiveTab(value as string);
          }
        }} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <Tab value="overview">Overview</Tab>
            <Tab value="services">Services & Parts</Tab>
            <Tab value="notes">Notes</Tab>
            <Tab value="activity">Activity</Tab>
          </TabsList>

          <TabPanel value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Vehicle Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="h-5 w-5" />
                    Vehicle Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Make & Model</label>
                      <p className="text-sm">{job.vehicle.make} {job.vehicle.model}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Year</label>
                      <p className="text-sm">{job.vehicle.year}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">License Plate</label>
                      <p className="text-sm">{job.vehicle.plate}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Mileage</label>
                      <p className="text-sm">{job.vehicle.mileage}</p>
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-gray-500">VIN</label>
                      <p className="text-sm font-mono text-xs">{job.vehicle.vin}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Name</label>
                      <p className="text-sm">{job.customer.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{job.customer.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{job.customer.email}</span>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Address</label>
                      <p className="text-sm">{job.customer.address}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Job Status & Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Job Status & Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-gray-600">{job.progress}%</span>
                  </div>
                  <Progress value={job.progress} className="h-2" /> */}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <div className="mt-1">{getStatusBadge(job.status)}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Priority</label>
                      <div className="mt-1">{getPriorityBadge(job.priority)}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Timer</label>
                      <div className="mt-1">{getTimerStatusChip(job.timer)}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Job Type</label>
                      <p className="text-sm">{job.jobType}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Created</label>
                      <p className="text-sm">{new Date(job.createdAt).toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Est. Completion</label>
                      <p className="text-sm">{new Date(job.estimatedCompletion).toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Assignment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Assignment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="font-medium">{job.garage.name}</p>
                      <p className="text-sm text-gray-500">{job.garage.address}</p>
                      <p className="text-sm text-gray-500">{job.garage.phone}</p>
                    </div>
                  </div>
                  
                  {job.assignedMechanic ? (
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={job.assignedMechanic.avatar} />
                        <AvatarFallback>
                          {job.assignedMechanic.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{job.assignedMechanic.name}</p>
                        <p className="text-sm text-gray-500">{job.assignedMechanic.phone}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">No mechanic assigned</div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Job Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Job Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">{job.description}</p>
              </CardContent>
            </Card>
          </TabPanel>

          <TabPanel value="services" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Services */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Services
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {job.services && job.services.length > 0 ? (
                      job.services.map((service, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 border rounded">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">{service}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 py-4 text-center">No services assigned</p>
                    )}
                  </div>
                  {/* Debug info */}
                  {/* {process.env.NODE_ENV === 'development' && (
                    <div className="mt-4 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                      <p>Debug: job_service_type = {jobData?.job_service_type ?? 'null'}</p>
                      <p>Debug: serviceType state = {serviceType ? JSON.stringify(serviceType) : 'null'}</p>
                      <p>Debug: serviceType name = {serviceType?.service_type_name || 'null'}</p>
                      <p>Debug: services array = {JSON.stringify(job.services)}</p>
                      <p>Debug: services length = {job.services?.length || 0}</p>
                    </div>
                  )} */}
                </CardContent>
              </Card>

              {/* Parts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Parts Required
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {job.parts && job.parts.length > 0 ? (
                      job.parts.map((part, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded">
                          <div className="flex-1">
                            <p className="font-medium">{part.name || 'Unnamed Part'}</p>
                            <div className="text-sm text-gray-500 mt-1">
                              <span>Qty: {part.quantity}</span>
                              {part.cost > 0 && <span className="ml-2">| Cost: ${part.cost.toFixed(2)}</span>}
                            </div>
                            {/* Show part number and description if available */}
                            {part.part_number && (
                              <p className="text-xs text-gray-400 mt-1">Part #: {part.part_number}</p>
                            )}
                            {part.part_description && (
                              <p className="text-xs text-gray-400 mt-1">{part.part_description}</p>
                            )}
                          </div>
                          {getPartStatusBadge(part.status)}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 py-4 text-center">No parts required</p>
                    )}
                  </div>
                  {/* Debug info */}
                  {/* {process.env.NODE_ENV === 'development' && (
                    <div className="mt-4 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                      <p>Debug: job_parts length = {jobData?.job_parts?.length || 0}</p>
                      <p>Debug: job_parts = {JSON.stringify(jobData?.job_parts || [])}</p>
                      <p>Debug: parts array = {JSON.stringify(job.parts)}</p>
                    </div>
                  )} */}
                </CardContent>
              </Card>
            </div>
          </TabPanel>

          <TabPanel value="notes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Job Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {job.notes && job.notes.length > 0 ? (
                    job.notes.map((note: any, index: number) => (
                      <div key={note.id || index} className="flex gap-3">
                        <div className="flex-shrink-0">
                          <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                            <FileText className="h-4 w-4" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm">{note.text}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500">{note.author}</span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500">
                              {new Date(note.timestamp).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No notes available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabPanel>

          <TabPanel value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Activity Log
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activityLog.map((activity) => (
                    <div key={activity.id} className="flex gap-3">
                      <div className="flex-shrink-0">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          activity.type === 'success' ? 'bg-green-100 text-green-600' :
                          activity.type === 'error' ? 'bg-red-100 text-red-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          {activity.type === 'success' ? <CheckCircle className="h-4 w-4" /> :
                           activity.type === 'error' ? <AlertCircle className="h-4 w-4" /> :
                           <Clock className="h-4 w-4" />}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{activity.action}</p>
                        <p className="text-sm text-gray-600">{activity.details}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">{activity.user}</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">
                            {activity.timestamp ? new Date(activity.timestamp).toLocaleString() : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabPanel>
        </Tabs>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-6 border-t">
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Check-in Summary
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit Job
            </Button>
            <Button>
              <CheckCircle className="h-4 w-4 mr-2" />
              Complete Job
            </Button>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export { JobDetailsContent };
