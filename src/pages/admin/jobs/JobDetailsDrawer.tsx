import { Fragment } from 'react';
import { 
  X, 
  Clock, 
  User, 
  Building2, 
  Wrench, 
  Calendar,
  Download,
  FileText,
  Play,
  Pause,
  Square,
  CheckCircle,
  AlertCircle,
  Package,
  History
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

interface JobDetailsDrawerProps {
  job: any;
  open: boolean;
  onClose: () => void;
}

const JobDetailsDrawer = ({ job, open, onClose }: JobDetailsDrawerProps) => {
  if (!open || !job) return null;

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
    ...(job.assignedMechanic ? [{
      id: 2,
      action: 'Mechanic Assigned',
      details: `Assigned to ${job.assignedMechanic.name}`,
      timestamp: job.createdAt,
      user: 'Admin',
      type: 'success'
    }] : []),
    ...(job.timer.started ? [{
      id: 3,
      action: 'Timer Started',
      details: 'Work timer was started',
      timestamp: job.timer.started,
      user: job.assignedMechanic?.name || 'System',
      type: 'info'
    }] : []),
    ...(job.status === 'completed' ? [{
      id: 4,
      action: 'Job Completed',
      details: 'Job was marked as completed',
      timestamp: job.completedAt,
      user: job.assignedMechanic?.name || 'System',
      type: 'success'
    }] : [])
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white dark:bg-gray-900 shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Job Details - {job.id}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {job.vehicle.year} {job.vehicle.make} {job.vehicle.model}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(job.status)}
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Vehicle Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
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
                    <label className="text-sm font-medium text-gray-500">VIN</label>
                    <p className="text-sm font-mono text-xs">{job.vehicle.vin}</p>
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
                    <label className="text-sm font-medium text-gray-500">Timer</label>
                    <div className="mt-1">{getTimerStatusChip(job.timer)}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Created</label>
                    <p className="text-sm">{new Date(job.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Estimated Completion</label>
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
                  </div>
                </div>
                
                {job.assignedMechanic ? (
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={job.assignedMechanic.avatar} />
                      <AvatarFallback>
                        {job.assignedMechanic.name.split(' ').map((n: string) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{job.assignedMechanic.name}</p>
                      <p className="text-sm text-gray-500">Assigned Mechanic</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-gray-500">
                    <User className="h-4 w-4" />
                    <p>No mechanic assigned</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Parts List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Parts List
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {job.parts.map((part: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{part.name}</p>
                        <p className="text-sm text-gray-500">Quantity: {part.quantity}</p>
                      </div>
                      {getPartStatusBadge(part.status)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Activity Log */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Activity Log
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activityLog.map((activity, index) => (
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
          </div>

          {/* Footer Actions */}
          <div className="border-t p-6">
            <div className="flex items-center justify-between">
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
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
                <Button>
                  Edit Job
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { JobDetailsDrawer };

