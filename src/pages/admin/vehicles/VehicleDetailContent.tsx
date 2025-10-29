import { Fragment, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Car, 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  MapPin,
  Wrench,
  MessageSquare,
  Plus,
  Download,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Clock,
  FileText,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, Tab, TabPanel } from '@/components/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { AddNoteDialog } from './AddNoteDialog';

const VehicleDetailContent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('history');
  const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);

  // Mock data - replace with actual data
  const vehicle = {
    id: 1,
    vehicleNumber: 'ABC-123',
    vin: '1HGBH41JXMN109186',
    make: 'Toyota',
    model: 'Camry',
    year: '2020',
    color: 'Silver',
    mileage: '45,000',
    owner: {
      name: 'John Doe',
      phone: '(555) 123-4567',
      email: 'john.doe@email.com',
      address: '123 Main St, Anytown, ST 12345'
    },
    status: 'active',
    totalJobs: 8,
    totalNotes: 3,
    lastServiceDate: '2024-01-15',
    nextServiceDate: '2024-04-15',
    createdAt: '2023-06-15'
  };

  const jobHistory = [
    {
      id: 1,
      date: '2024-01-15',
      jobSummary: 'Oil Change & Tire Rotation',
      adminNotes: 'Customer requested premium oil. Vehicle in excellent condition.',
      author: 'Mike Johnson',
      visibility: 'shared',
      status: 'completed'
    },
    {
      id: 2,
      date: '2023-12-10',
      jobSummary: 'Brake Inspection',
      adminNotes: 'Front brake pads at 60% wear. Rear brakes in good condition.',
      author: 'Sarah Wilson',
      visibility: 'staff-only',
      status: 'completed'
    },
    {
      id: 3,
      date: '2023-11-05',
      jobSummary: 'Transmission Service',
      adminNotes: 'Transmission fluid change completed. No issues found.',
      author: 'Mike Johnson',
      visibility: 'shared',
      status: 'completed'
    },
    {
      id: 4,
      date: '2023-09-20',
      jobSummary: 'Annual Inspection',
      adminNotes: 'Passed inspection with flying colors. All systems functioning properly.',
      author: 'Sarah Wilson',
      visibility: 'shared',
      status: 'completed'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Inactive</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getVisibilityBadge = (visibility: string) => {
    switch (visibility) {
      case 'shared':
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 flex items-center gap-1">
            <Eye className="h-3 w-3" />
            Shared
          </Badge>
        );
      case 'staff-only':
        return (
          <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 flex items-center gap-1">
            <EyeOff className="h-3 w-3" />
            Staff Only
          </Badge>
        );
      default:
        return <Badge variant="outline">{visibility}</Badge>;
    }
  };

  const handleEditNote = (noteId: number) => {
    console.log('Edit note:', noteId);
  };

  const handleDeleteNote = (noteId: number) => {
    console.log('Delete note:', noteId);
  };

  const handleDownloadPDF = () => {
    console.log('Download PDF for vehicle:', vehicle.id);
  };

  return (
    <Fragment>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/admin/vehicles')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Vehicles
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Vehicle Details</h1>
            <p className="text-gray-600 dark:text-gray-400">{vehicle.vehicleNumber} - {vehicle.make} {vehicle.model}</p>
          </div>
        </div>

        {/* Vehicle Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Vehicle Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Vehicle Details</h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Number:</span>
                      <span className="text-sm font-medium">{vehicle.vehicleNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">VIN:</span>
                      <span className="text-sm font-medium">{vehicle.vin}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Make/Model:</span>
                      <span className="text-sm font-medium">{vehicle.make} {vehicle.model}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Year:</span>
                      <span className="text-sm font-medium">{vehicle.year}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Color:</span>
                      <span className="text-sm font-medium">{vehicle.color}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Mileage:</span>
                      <span className="text-sm font-medium">{vehicle.mileage}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Owner Information
                  </h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Name:</span>
                      <span className="text-sm font-medium">{vehicle.owner.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Phone:</span>
                      <span className="text-sm font-medium">{vehicle.owner.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Email:</span>
                      <span className="text-sm font-medium">{vehicle.owner.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Address:</span>
                      <span className="text-sm font-medium">{vehicle.owner.address}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Service Information
                  </h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Status:</span>
                      {getStatusBadge(vehicle.status)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Total Jobs:</span>
                      <span className="text-sm font-medium">{vehicle.totalJobs}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Total Notes:</span>
                      <span className="text-sm font-medium">{vehicle.totalNotes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Last Service:</span>
                      <span className="text-sm font-medium">{vehicle.lastServiceDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Next Service:</span>
                      <span className="text-sm font-medium">{vehicle.nextServiceDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onChange={(event, newValue) => {
          if (newValue !== null) {
            setActiveTab(newValue as string);
          }
        }}>
          <TabsList className="grid w-full grid-cols-2">
            <Tab value="history" className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              Service History
            </Tab>
            <Tab value="notes" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Admin Notes
            </Tab>
          </TabsList>

          <TabPanel value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Service History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Job Summary</TableHead>
                        <TableHead>Admin Notes</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Visibility</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-12"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {jobHistory.map((job) => (
                        <TableRow key={job.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span className="text-sm">{job.date}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{job.jobSummary}</div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-xs text-sm text-gray-600">
                              {job.adminNotes}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">
                                  {job.author.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{job.author}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getVisibilityBadge(job.visibility)}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(job.status)}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditNote(job.id)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Note
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeleteNote(job.id)}>
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Note
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
          </TabPanel>

          <TabPanel value="notes" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Admin Notes</CardTitle>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={handleDownloadPDF}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download PDF
                    </Button>
                    <Button 
                      onClick={() => setShowAddNoteDialog(true)}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Note
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {jobHistory.length > 0 ? (
                  <div className="space-y-4">
                    {jobHistory.map((job) => (
                      <div key={job.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-sm">
                                {job.author.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{job.author}</div>
                              <div className="text-sm text-gray-500 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {job.date}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getVisibilityBadge(job.visibility)}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditNote(job.id)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Note
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeleteNote(job.id)}>
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Note
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        <div className="mb-2">
                          <div className="font-medium text-sm text-gray-700 mb-1">{job.jobSummary}</div>
                          <div className="text-sm text-gray-600">{job.adminNotes}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No notes added yet</h3>
                    <p className="text-gray-500 mb-4">Start by adding your first admin note for this vehicle.</p>
                    <Button onClick={() => setShowAddNoteDialog(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Note
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabPanel>
        </Tabs>
      </div>

      {/* Add Note Dialog */}
      <AddNoteDialog 
        open={showAddNoteDialog} 
        onOpenChange={setShowAddNoteDialog}
        vehicleId={vehicle.id}
      />
    </Fragment>
  );
};

export { VehicleDetailContent };
