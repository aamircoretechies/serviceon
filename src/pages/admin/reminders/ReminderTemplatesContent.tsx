import { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  Bell,
  Calendar,
  Users,
  Play,
  Pause,
  Clock
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

const ReminderTemplatesContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data - replace with actual data
  const templates = [
    {
      id: 1,
      name: 'Service Reminder - 3 Months',
      type: 'Service',
      body: 'Your vehicle is due for a service appointment. Schedule now to maintain optimal performance.',
      frequency: 'Every 3 months',
      nextRun: '2024-02-15 09:00',
      status: 'active',
      targetAudience: ['All Customers', 'Premium Members'],
      lastSent: '2024-01-15 09:00',
      deliveryStatus: 'Delivered',
      createdAt: '2024-01-01',
      lastUpdated: '2024-01-20'
    },
    {
      id: 2,
      name: 'Oil Change Reminder',
      type: 'Oil Change',
      body: 'Time for your regular oil change! Book an appointment to keep your engine running smoothly.',
      frequency: 'Every 6 months',
      nextRun: '2024-03-01 10:00',
      status: 'active',
      targetAudience: ['All Customers'],
      lastSent: '2024-01-01 10:00',
      deliveryStatus: 'Delivered',
      createdAt: '2024-01-01',
      lastUpdated: '2024-01-18'
    },
    {
      id: 3,
      name: 'Holiday Promotion',
      type: 'Promotion',
      body: 'Special holiday discount! Get 20% off your next service. Limited time offer.',
      frequency: 'One-time',
      nextRun: '2024-12-01 08:00',
      status: 'scheduled',
      targetAudience: ['All Customers', 'VIP Members'],
      lastSent: null,
      deliveryStatus: 'Pending',
      createdAt: '2024-01-15',
      lastUpdated: '2024-01-19'
    },
    {
      id: 4,
      name: 'Maintenance Due Soon',
      type: 'Service',
      body: 'Your vehicle maintenance is due soon. Don\'t wait - schedule your appointment today.',
      frequency: 'Every 2 months',
      nextRun: '2024-02-28 14:00',
      status: 'paused',
      targetAudience: ['All Customers'],
      lastSent: '2024-01-28 14:00',
      deliveryStatus: 'Failed',
      createdAt: '2024-01-01',
      lastUpdated: '2024-01-25'
    },
    {
      id: 5,
      name: 'Tire Rotation Reminder',
      type: 'Service',
      body: 'Time for tire rotation! This helps ensure even tire wear and better handling.',
      frequency: 'Every 4 months',
      nextRun: '2024-03-15 11:00',
      status: 'active',
      targetAudience: ['All Customers'],
      lastSent: '2024-01-15 11:00',
      deliveryStatus: 'Delivered',
      createdAt: '2024-01-01',
      lastUpdated: '2024-01-22'
    }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.body.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || template.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || template.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'Service':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Service</Badge>;
      case 'Oil Change':
        return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">Oil Change</Badge>;
      case 'Promotion':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Promotion</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Active</Badge>;
      case 'paused':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Paused</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Scheduled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getDeliveryStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Delivered</Badge>;
      case 'Failed':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Failed</Badge>;
      case 'Pending':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleEdit = (templateId: number) => {
    console.log('Edit template:', templateId);
  };

  const handleDelete = (templateId: number) => {
    console.log('Delete template:', templateId);
  };

  const handleView = (templateId: number) => {
    console.log('View template:', templateId);
  };

  const handleTestPush = (templateId: number) => {
    console.log('Test push for template:', templateId);
  };

  const handleToggleStatus = (templateId: number, currentStatus: string) => {
    console.log('Toggle status for template:', templateId, currentStatus);
  };

  return (
    <Fragment>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reminder Templates</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your reminder and notification templates</p>
          </div>
          <Link to="/admin/reminders/templates/create">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Template
            </Button>
          </Link>
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
                    placeholder="Search templates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Service">Service</SelectItem>
                    <SelectItem value="Oil Change">Oil Change</SelectItem>
                    <SelectItem value="Promotion">Promotion</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
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

        {/* Templates Table */}
        <Card>
          <CardHeader>
            <CardTitle>Reminder Templates ({filteredTemplates.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Template Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Next Run</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Sent</TableHead>
                    <TableHead>Delivery Status</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTemplates.map((template) => (
                    <TableRow key={template.id} className="sand-hover-row">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center sand-hover-avatar">
                            <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400 sand-hover-icon" />
                          </div>
                          <div>
                            <div className="font-medium">{template.name}</div>
                            <div className="text-sm text-gray-500 max-w-xs truncate">{template.body}</div>
                            <div className="text-xs text-gray-400 mt-1">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {template.frequency}
                              </span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getTypeBadge(template.type)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{template.nextRun}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(template.status)}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-500">
                          {template.lastSent || 'Never'}
                        </span>
                      </TableCell>
                      <TableCell>
                        {getDeliveryStatusBadge(template.deliveryStatus)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleView(template.id)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(template.id)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleTestPush(template.id)}>
                              <Play className="h-4 w-4 mr-2" />
                              Test Push
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleToggleStatus(template.id, template.status)}
                            >
                              {template.status === 'active' ? (
                                <>
                                  <Pause className="h-4 w-4 mr-2" />
                                  Pause
                                </>
                              ) : (
                                <>
                                  <Play className="h-4 w-4 mr-2" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(template.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
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

export { ReminderTemplatesContent };

