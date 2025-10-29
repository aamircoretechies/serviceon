import { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Bell,
  Users,
  Eye,
  RefreshCw
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
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

const ScheduledRemindersContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  // Mock data - replace with actual data
  const scheduledReminders = [
    {
      id: 1,
      templateName: 'Service Reminder - 3 Months',
      type: 'Service',
      scheduledTime: '2024-02-15 09:00',
      lastSentTime: '2024-01-15 09:00',
      deliveryStatus: 'Delivered',
      recipients: 156,
      successRate: 98.5,
      nextRun: '2024-02-15 09:00',
      createdAt: '2024-01-01'
    },
    {
      id: 2,
      templateName: 'Oil Change Reminder',
      type: 'Oil Change',
      scheduledTime: '2024-02-20 10:00',
      lastSentTime: '2024-01-20 10:00',
      deliveryStatus: 'Delivered',
      recipients: 89,
      successRate: 95.2,
      nextRun: '2024-02-20 10:00',
      createdAt: '2024-01-01'
    },
    {
      id: 3,
      templateName: 'Holiday Promotion',
      type: 'Promotion',
      scheduledTime: '2024-12-01 08:00',
      lastSentTime: null,
      deliveryStatus: 'Pending',
      recipients: 0,
      successRate: 0,
      nextRun: '2024-12-01 08:00',
      createdAt: '2024-01-15'
    },
    {
      id: 4,
      templateName: 'Maintenance Due Soon',
      type: 'Service',
      scheduledTime: '2024-01-28 14:00',
      lastSentTime: '2024-01-28 14:00',
      deliveryStatus: 'Failed',
      recipients: 45,
      successRate: 0,
      nextRun: '2024-02-28 14:00',
      createdAt: '2024-01-01'
    },
    {
      id: 5,
      templateName: 'Tire Rotation Reminder',
      type: 'Service',
      scheduledTime: '2024-02-10 11:00',
      lastSentTime: '2024-01-10 11:00',
      deliveryStatus: 'Delivered',
      recipients: 78,
      successRate: 97.4,
      nextRun: '2024-02-10 11:00',
      createdAt: '2024-01-01'
    },
    {
      id: 6,
      templateName: 'Inspection Due',
      type: 'Inspection',
      scheduledTime: '2024-02-05 15:30',
      lastSentTime: '2024-01-05 15:30',
      deliveryStatus: 'Partial',
      recipients: 34,
      successRate: 85.3,
      nextRun: '2024-02-05 15:30',
      createdAt: '2024-01-01'
    }
  ];

  const filteredReminders = scheduledReminders.filter(reminder => {
    const matchesSearch = reminder.templateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reminder.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || reminder.deliveryStatus.toLowerCase() === statusFilter.toLowerCase();
    const matchesDate = dateFilter === 'all' || 
                       (dateFilter === 'today' && reminder.scheduledTime.includes('2024-02-15')) ||
                       (dateFilter === 'thisWeek' && reminder.scheduledTime >= '2024-02-12' && reminder.scheduledTime <= '2024-02-18');
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'Service':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Service</Badge>;
      case 'Oil Change':
        return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">Oil Change</Badge>;
      case 'Promotion':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Promotion</Badge>;
      case 'Inspection':
        return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">Inspection</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getDeliveryStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Delivered
          </Badge>
        );
      case 'Failed':
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Failed
          </Badge>
        );
      case 'Pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      case 'Partial':
        return (
          <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Partial
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleView = (reminderId: number) => {
    console.log('View reminder:', reminderId);
  };

  const handleRefresh = (reminderId: number) => {
    console.log('Refresh reminder:', reminderId);
  };

  return (
    <Fragment>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Scheduled Reminders</h1>
            <p className="text-gray-600 dark:text-gray-400">View and monitor scheduled reminder deliveries</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh All
            </Button>
            <Link to="/admin/reminders/templates">
              <Button className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Manage Templates
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">24</div>
                  <div className="text-sm text-gray-500">Total Scheduled</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">18</div>
                  <div className="text-sm text-gray-500">Delivered Today</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">4</div>
                  <div className="text-sm text-gray-500">Pending</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-red-100 dark:bg-red-900 flex items-center justify-center">
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">2</div>
                  <div className="text-sm text-gray-500">Failed</div>
                </div>
              </div>
            </CardContent>
          </Card>
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
                    placeholder="Search reminders..."
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
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Dates</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="thisWeek">This Week</SelectItem>
                    <SelectItem value="thisMonth">This Month</SelectItem>
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

        {/* Reminders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Scheduled Reminders ({filteredReminders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Template Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Last Sent Time</TableHead>
                    <TableHead>Delivery Status</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Success Rate</TableHead>
                    <TableHead>Next Run</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReminders.map((reminder) => (
                    <TableRow key={reminder.id} className="sand-hover-row">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center sand-hover-avatar">
                            <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400 sand-hover-icon" />
                          </div>
                          <div>
                            <div className="font-medium">{reminder.templateName}</div>
                            <div className="text-sm text-gray-500">ID: {reminder.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getTypeBadge(reminder.type)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">
                            {reminder.lastSentTime || 'Never'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getDeliveryStatusBadge(reminder.deliveryStatus)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{reminder.recipients}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {reminder.successRate > 0 ? `${reminder.successRate}%` : 'N/A'}
                          </span>
                          {reminder.successRate > 0 && (
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full" 
                                style={{ width: `${reminder.successRate}%` }}
                              ></div>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{reminder.nextRun}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleView(reminder.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleRefresh(reminder.id)}
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </div>
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

export { ScheduledRemindersContent };

