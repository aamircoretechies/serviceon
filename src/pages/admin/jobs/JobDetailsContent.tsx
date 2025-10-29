import { Fragment, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

const JobDetailsContent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock job data - replace with actual data fetching
  const job = {
    id: id || 'JOB-001',
    vehicle: {
      make: 'Toyota',
      model: 'Camry',
      year: '2020',
      plate: 'ABC-1234',
      vin: '1HGBH41JXMN109186',
      mileage: '45,000'
    },
    customer: {
      name: 'John Doe',
      phone: '(555) 123-4567',
      email: 'john.doe@example.com',
      address: '123 Main St, Anytown, ST 12345'
    },
    garage: {
      id: '1',
      name: 'Downtown Auto Service',
      address: '123 Main St, Downtown',
      phone: '(555) 987-6543'
    },
    assignedMechanic: {
      id: '1',
      name: 'Mike Wilson',
      avatar: '/media/avatars/300-3.png',
      phone: '(555) 234-5678'
    },
    status: 'in-progress',
    priority: 'medium',
    progress: 65,
    timer: {
      status: 'running',
      elapsed: '02:45:30',
      started: '2024-01-20 09:30:00'
    },
    jobType: 'Brake Service',
    description: 'Complete brake inspection and pad replacement for front and rear brakes. Check brake fluid levels and condition.',
    estimatedHours: '3.5',
    estimatedCost: '285.00',
    actualHours: '2.5',
    actualCost: '0.00',
    createdAt: '2024-01-20 09:00:00',
    estimatedCompletion: '2024-01-20 15:00:00',
    completedAt: null,
    services: [
      'Brake Inspection',
      'Brake Pad Replacement',
      'Brake Fluid Check',
      'Safety Inspection'
    ],
    parts: [
      { name: 'Front Brake Pads', quantity: 2, cost: 45.00, status: 'delivered' },
      { name: 'Rear Brake Pads', quantity: 2, cost: 40.00, status: 'delivered' },
      { name: 'Brake Fluid', quantity: 1, cost: 12.00, status: 'delivered' }
    ],
    notes: [
      {
        id: 1,
        text: 'Customer mentioned squeaking noise when braking',
        author: 'Mike Wilson',
        timestamp: '2024-01-20 09:15:00'
      },
      {
        id: 2,
        text: 'Front brake pads are worn down to 2mm - replacement needed',
        author: 'Mike Wilson',
        timestamp: '2024-01-20 10:30:00'
      }
    ]
  };

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
      details: `Assigned to ${job.assignedMechanic.name}`,
      timestamp: job.createdAt,
      user: 'Admin',
      type: 'success'
    },
    {
      id: 3,
      action: 'Timer Started',
      details: 'Work timer was started',
      timestamp: job.timer.started,
      user: job.assignedMechanic.name,
      type: 'info'
    },
    {
      id: 4,
      action: 'Parts Delivered',
      details: 'All required parts have been delivered',
      timestamp: '2024-01-20 10:00:00',
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
          <Card>
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
          </Card>
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
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-gray-600">{job.progress}%</span>
                  </div>
                  <Progress value={job.progress} className="h-2" />
                  
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
                    {job.services.map((service, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 border rounded">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">{service}</span>
                      </div>
                    ))}
                  </div>
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
                    {job.parts.map((part, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">{part.name}</p>
                          <p className="text-sm text-gray-500">Qty: {part.quantity} | Cost: ${part.cost.toFixed(2)}</p>
                        </div>
                        {getPartStatusBadge(part.status)}
                      </div>
                    ))}
                  </div>
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
                  {job.notes.map((note) => (
                    <div key={note.id} className="flex gap-3">
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
                  ))}
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
                            {new Date(activity.timestamp).toLocaleString()}
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
