import { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Building2, 
  Users, 
  CheckSquare, 
  DollarSign, 
  TrendingUp,
  AlertCircle,
  Clock,
  Wrench,
  Car,
  Bell,
  Upload,
  FileText,
  Settings,
  Eye,
  Filter,
  Plus,
  UserPlus,
  Wrench as MechanicIcon,
  DollarSign as RateIcon,
  Bell as ReminderIcon,
  Image as MediaIcon,
  Activity,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  BarChart3,
  Zap,
  Globe,
  Cloud,
  Database
} from 'lucide-react';

const AdminDashboardContent = () => {
  const navigate = useNavigate();
  
  // State for garage selection
  const [selectedGarage, setSelectedGarage] = useState('all');
  const [jobsFilter, setJobsFilter] = useState('all');

  // Mock data - replace with actual data
  const garages = [
    { id: 'all', name: 'All Garages' },
    { id: '1', name: 'Downtown Auto Service' },
    { id: '2', name: 'Westside Garage' },
    { id: '3', name: 'North Point Motors' }
  ];

  // Multi-Garage Summary KPIs
  const garageKPIs = {
    all: {
      totalActiveJobs: 47,
      pendingCheckins: 12,
      completedJobs: 89,
      mechanicsOnline: 8,
      mechanicsAssigned: 12,
      upcomingReminders: 15
    },
    '1': {
      totalActiveJobs: 18,
      pendingCheckins: 5,
      completedJobs: 34,
      mechanicsOnline: 3,
      mechanicsAssigned: 5,
      upcomingReminders: 6
    },
    '2': {
      totalActiveJobs: 15,
      pendingCheckins: 4,
      completedJobs: 28,
      mechanicsOnline: 2,
      mechanicsAssigned: 4,
      upcomingReminders: 4
    },
    '3': {
      totalActiveJobs: 14,
      pendingCheckins: 3,
      completedJobs: 27,
      mechanicsOnline: 3,
      mechanicsAssigned: 3,
      upcomingReminders: 5
    }
  };

  const currentKPIs = garageKPIs[selectedGarage as keyof typeof garageKPIs] || garageKPIs.all;

  // Jobs Overview Data
  const jobs = [
    {
      id: 'JOB-001',
      vehicleNo: 'ABC-123',
      mechanic: { name: 'John Smith', avatar: '/media/avatars/300-1.png' },
      status: 'In Progress',
      elapsedTime: '2h 15m',
      stage: 'Diagnosis',
      progress: 60
    },
    {
      id: 'JOB-002',
      vehicleNo: 'XYZ-789',
      mechanic: { name: 'Sarah Johnson', avatar: '/media/avatars/300-2.png' },
      status: 'Start',
      elapsedTime: '0h 30m',
      stage: 'Intake',
      progress: 20
    },
    {
      id: 'JOB-003',
      vehicleNo: 'DEF-456',
      mechanic: { name: 'Mike Wilson', avatar: '/media/avatars/300-3.png' },
      status: 'Done',
      elapsedTime: '4h 45m',
      stage: 'Checkout',
      progress: 100
    }
  ];

  // Reminders Data
  const reminders = [
    {
      id: 1,
      type: 'Service',
      scheduledDate: '2024-01-25',
      targetAudience: 'All Customers',
      status: 'Scheduled'
    },
    {
      id: 2,
      type: 'Oil Change',
      scheduledDate: '2024-01-26',
      targetAudience: 'Premium Customers',
      status: 'Pending'
    },
    {
      id: 3,
      type: 'Promotion',
      scheduledDate: '2024-01-27',
      targetAudience: 'New Customers',
      status: 'Scheduled'
    }
  ];

  // Activity Feed Data
  const activities = [
    {
      id: 1,
      action: 'User added',
      details: 'New mechanic John Smith added to Downtown Auto Service',
      time: '2 hours ago',
      actor: { name: 'Admin', avatar: '/media/avatars/300-1.png' },
      type: 'success'
    },
    {
      id: 2,
      action: 'Job created',
      details: 'New job JOB-001 created for vehicle ABC-123',
      time: '3 hours ago',
      actor: { name: 'Sarah Johnson', avatar: '/media/avatars/300-2.png' },
      type: 'info'
    },
    {
      id: 3,
      action: 'PDF generated',
      details: 'Check-in PDF generated for JOB-002',
      time: '4 hours ago',
      actor: { name: 'System', avatar: null },
      type: 'info'
    },
    {
      id: 4,
      action: 'Reminder triggered',
      details: 'Service reminder sent to 15 customers',
      time: '6 hours ago',
      actor: { name: 'System', avatar: null },
      type: 'success'
    }
  ];

  // System Status Data
  const systemStatus = [
    { name: 'AI Diagnosis API (OpenAI)', status: 'connected', icon: Zap },
    { name: 'Translation API (Google)', status: 'active', icon: Globe },
    { name: 'FCM Notifications', status: 'online', icon: Bell },
    { name: 'Supabase Storage', status: 'healthy', icon: Database }
  ];

  // Media Upload Monitor Data
  const mediaStats = {
    uploadsToday: 23,
    failedUploads: 2,
    retriedUploads: 1,
    successRate: 95.7
  };

  // PDF Generation Stats
  const pdfStats = {
    totalGenerated: 47,
    successful: 45,
    failed: 2,
    successRate: 95.7
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
      case 'active':
      case 'online':
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'info':
        return <Activity className="h-4 w-4 text-blue-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  // Navigation functions for Quick Actions
  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'add-garage':
        navigate('/admin/garages/create');
        break;
      case 'add-user':
        navigate('/admin/users/create');
        break;
      case 'assign-mechanic':
        navigate('/admin/users');
        break;
      case 'configure-labor-rate':
        navigate('/admin/labor-rates');
        break;
      case 'create-reminder':
        navigate('/admin/reminders/templates/create');
        break;
      case 'view-media':
        navigate('/admin/media');
        break;
      default:
        console.log('Action not implemented:', action);
    }
  };

  return (
    <Fragment>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">Welcome to ServiceOn Admin Panel</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-green-600 border-green-600">
              System Online
            </Badge>
          </div>
        </div>

        {/* A. Multi-Garage Summary Widget */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Multi-Garage Summary
              </CardTitle>
              <Select value={selectedGarage} onValueChange={setSelectedGarage}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select garage" />
                </SelectTrigger>
                <SelectContent>
                  {garages.map((garage) => (
                    <SelectItem key={garage.id} value={garage.id}>
                      {garage.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Wrench className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">{currentKPIs.totalActiveJobs}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Active Jobs</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-600">{currentKPIs.pendingCheckins}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Pending Check-ins</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <CheckSquare className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">{currentKPIs.completedJobs}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Completed (7 days)</div>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-600">{currentKPIs.mechanicsOnline}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Mechanics Online</div>
              </div>
              <div className="text-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                <MechanicIcon className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-indigo-600">{currentKPIs.mechanicsAssigned}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Mechanics Assigned</div>
              </div>
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <Bell className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-600">{currentKPIs.upcomingReminders}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Upcoming Reminders</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* B. Jobs Overview Panel */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Jobs Overview
                </CardTitle>
              <div className="flex items-center gap-2">
                <Select value={jobsFilter} onValueChange={setJobsFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Jobs</SelectItem>
                    <SelectItem value="start">Start</SelectItem>
                    <SelectItem value="progress">In Progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/admin/jobs')}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View All
                </Button>
              </div>
            </div>
              </CardHeader>
              <CardContent>
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{job.id}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{job.vehicleNo}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={job.mechanic.avatar} />
                        <AvatarFallback>{job.mechanic.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{job.mechanic.name}</span>
                    </div>
                    <Badge variant={job.status === 'Done' ? 'default' : job.status === 'In Progress' ? 'secondary' : 'outline'}>
                      {job.status}
                    </Badge>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {job.elapsedTime}
                    </div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {job.stage}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20">
                      <Progress value={job.progress} className="h-2" />
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => navigate(`/admin/jobs/${job.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
              </CardContent>
            </Card>

        {/* C. Reminders & Notifications Panel */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Reminders & Notifications
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/admin/reminders/templates/create')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Reminder
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reminders.map((reminder) => (
                <div key={reminder.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{reminder.type}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{reminder.targetAudience}</div>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(reminder.scheduledDate).toLocaleDateString()}
                    </div>
                  </div>
                  <Badge variant={reminder.status === 'Scheduled' ? 'default' : 'outline'}>
                    {reminder.status}
                  </Badge>
                </div>
          ))}
        </div>
          </CardContent>
        </Card>

        {/* D. Quick Actions / Shortcuts Bar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <Button 
                variant="outline" 
                className="h-20 flex-col gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                onClick={() => handleQuickAction('add-garage')}
              >
                <Building2 className="h-6 w-6" />
                <span className="text-xs">Add New Garage</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col gap-2 hover:bg-green-50 dark:hover:bg-green-900/20"
                onClick={() => handleQuickAction('add-user')}
              >
                <UserPlus className="h-6 w-6" />
                <span className="text-xs">Add New User</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col gap-2 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                onClick={() => handleQuickAction('assign-mechanic')}
              >
                <MechanicIcon className="h-6 w-6" />
                <span className="text-xs">Assign Mechanic</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col gap-2 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                onClick={() => handleQuickAction('configure-labor-rate')}
              >
                <RateIcon className="h-6 w-6" />
                <span className="text-xs">Configure Labor Rate</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col gap-2 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                onClick={() => handleQuickAction('create-reminder')}
              >
                <ReminderIcon className="h-6 w-6" />
                <span className="text-xs">Create Reminder Template</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col gap-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                onClick={() => handleQuickAction('view-media')}
              >
                <MediaIcon className="h-6 w-6" />
                <span className="text-xs">View Media Library</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* E. Activity Feed / Recent Events */}
          <Card>
            <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Activity Feed
            </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
              {activities.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3">
                    {getActivityIcon(activity.type)}
                  <Avatar className="h-8 w-8">
                    {activity.actor.avatar ? (
                      <AvatarImage src={activity.actor.avatar} />
                    ) : (
                      <AvatarFallback>
                        <Activity className="h-4 w-4" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.action}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {activity.details}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {activity.time}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        {/* F. Media Upload Monitor & G. System Status & H. PDF Generation Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Media Upload Monitor */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Media Upload Monitor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{mediaStats.uploadsToday}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Uploads Today</div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Failed: {mediaStats.failedUploads}</span>
                    <span>Retried: {mediaStats.retriedUploads}</span>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-600">{mediaStats.successRate}%</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Success Rate</div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => navigate('/admin/media')}
                >
                  <MediaIcon className="h-4 w-4 mr-2" />
                  View Media Library
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* System Status Indicators */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {systemStatus.map((system, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <system.icon className="h-4 w-4 text-gray-600" />
                      <span className="text-sm">{system.name}</span>
                    </div>
                    {getStatusIcon(system.status)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* PDF Generation Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                PDF Generation Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{pdfStats.totalGenerated}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Generated Today</div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">✓ {pdfStats.successful}</span>
                    <span className="text-red-600">✗ {pdfStats.failed}</span>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-600">{pdfStats.successRate}%</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Success Rate</div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => navigate('/admin/pdf-config')}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  View PDF Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Fragment>
  );
};

export { AdminDashboardContent };
