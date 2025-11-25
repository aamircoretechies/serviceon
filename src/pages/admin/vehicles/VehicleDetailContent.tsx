import { Fragment, useState, useEffect } from 'react';
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
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { vehicleHistoryService, userService } from '@/api/services';
import { toast } from 'sonner';
import type { VehicleHistoryItem, User as UserType } from '@/api/types';
import { IMAGES_BASE_URL } from '@/api/config';
import { AddNoteDialog } from './AddNoteDialog';

const VehicleDetailContent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const vehicleHistoryId = id ? parseInt(id) : null;
  const [activeTab, setActiveTab] = useState('history');
  const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);
  const [vehicle, setVehicle] = useState<VehicleHistoryItem | null>(null);
  const [serviceHistory, setServiceHistory] = useState<VehicleHistoryItem[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingHistory, setEditingHistory] = useState<VehicleHistoryItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch vehicle data
  useEffect(() => {
    const fetchVehicle = async () => {
      if (!vehicleHistoryId) return;
      
      setIsLoading(true);
      try {
        const response = await vehicleHistoryService.getAll({ page: 0, size: 1000 });
        if (response.status === 1 && response.data) {
          const found = response.data.content.find(v => v.vehicle_history_id === vehicleHistoryId);
          if (found) {
            setVehicle(found);
          } else {
            toast.error('Vehicle history not found');
            navigate('/admin/vehicles');
          }
        }
      } catch (error: any) {
        console.error('Error fetching vehicle:', error);
        toast.error(error?.response?.data?.message || 'Failed to load vehicle');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicle();
  }, [vehicleHistoryId, navigate]);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userService.getAll({ page: 0, size: 1000 });
        if (response.status === 1 && response.data?.content) {
          setUsers(response.data.content);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  // Fetch service history when vehicle is loaded and tab is active
  useEffect(() => {
    const fetchServiceHistory = async () => {
      if (!vehicle || activeTab !== 'history') return;
      
      setIsLoadingHistory(true);
      try {
        const response = await vehicleHistoryService.getAll({ 
          page: 0, 
          size: 1000,
          user_id: vehicle.user_id 
        });
        if (response.status === 1 && response.data) {
          setServiceHistory(response.data.content);
        }
      } catch (error: any) {
        console.error('Error fetching service history:', error);
        toast.error(error?.response?.data?.message || 'Failed to load service history');
      } finally {
        setIsLoadingHistory(false);
      }
    };

    fetchServiceHistory();
  }, [vehicle, activeTab]);

  const getUserName = (userId: number): string => {
    const user = users.find(u => u.user_id === userId);
    return user ? `${user.first_name} ${user.last_name}` : 'Unknown';
  };

  const getStatusBadge = (status: number | string) => {
    if (typeof status === 'string') {
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
    } else {
      if (status === 1) {
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Active</Badge>;
      } else {
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Inactive</Badge>;
      }
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

  const handleEditHistory = (historyItem: VehicleHistoryItem) => {
    setEditingHistory(historyItem);
    setShowEditDialog(true);
  };

  const handleDeleteHistory = async (historyId: number) => {
    if (!confirm('Are you sure you want to delete this history record?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await vehicleHistoryService.delete({ vehicle_history_id: historyId });
      if (response.status === 1) {
        toast.success(response.message || 'History deleted successfully');
        // Refresh data
        if (vehicle) {
          const vehicleResponse = await vehicleHistoryService.getAll({ page: 0, size: 1000 });
          if (vehicleResponse.status === 1 && vehicleResponse.data) {
            const found = vehicleResponse.data.content.find(v => v.vehicle_history_id === vehicleHistoryId);
            if (found) setVehicle(found);
            
            // Refresh service history
            const historyResponse = await vehicleHistoryService.getAll({ 
              page: 0, 
              size: 1000,
              user_id: vehicle.user_id 
            });
            if (historyResponse.status === 1 && historyResponse.data) {
              setServiceHistory(historyResponse.data.content);
            }
          }
        }
      } else {
        toast.error(response.message || 'Failed to delete history');
      }
    } catch (error: any) {
      console.error('Error deleting history:', error);
      toast.error(error?.response?.data?.message || 'Failed to delete history');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveEdit = async (formData: any) => {
    if (!editingHistory) return;

    setIsSaving(true);
    try {
      const response = await vehicleHistoryService.update({
        vehicle_history_id: editingHistory.vehicle_history_id,
        ...formData,
      });

      if (response.status === 1) {
        toast.success(response.message || 'History updated successfully');
        setShowEditDialog(false);
        setEditingHistory(null);
        
        // Refresh data
        if (vehicle) {
          const vehicleResponse = await vehicleHistoryService.getAll({ page: 0, size: 1000 });
          if (vehicleResponse.status === 1 && vehicleResponse.data) {
            const found = vehicleResponse.data.content.find(v => v.vehicle_history_id === vehicleHistoryId);
            if (found) setVehicle(found);
            
            // Refresh service history
            const historyResponse = await vehicleHistoryService.getAll({ 
              page: 0, 
              size: 1000,
              user_id: vehicle.user_id 
            });
            if (historyResponse.status === 1 && historyResponse.data) {
              setServiceHistory(historyResponse.data.content);
            }
          }
        }
      } else {
        toast.error(response.message || 'Failed to update history');
      }
    } catch (error: any) {
      console.error('Error updating history:', error);
      toast.error(error?.response?.data?.message || 'Failed to update history');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadPDF = () => {
    console.log('Download PDF for vehicle:', vehicle?.vehicle_history_id);
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
            <p className="text-gray-600 dark:text-gray-400">
              {vehicle ? `${vehicle.vehicle_number || 'N/A'} - ${vehicle.make_model || 'N/A'}` : 'Loading...'}
            </p>
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
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading vehicle information...</p>
              </div>
            ) : vehicle ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Vehicle Details</h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Number:</span>
                        <span className="text-sm font-medium">{vehicle.vehicle_number || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">VIN:</span>
                        <span className="text-sm font-medium">{vehicle.vin_number || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Make/Model:</span>
                        <span className="text-sm font-medium">{vehicle.make_model || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Year:</span>
                        <span className="text-sm font-medium">{vehicle.make_year || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Color:</span>
                        <span className="text-sm font-medium">{vehicle.vehicle_color || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Mileage:</span>
                        <span className="text-sm font-medium">{vehicle.vehicle_mileage || 'N/A'}</span>
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
                        <span className="text-sm font-medium">{getUserName(vehicle.user_id)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">User ID:</span>
                        <span className="text-sm font-medium">{vehicle.user_id}</span>
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
                        <span className="text-sm font-medium">{vehicle.total_jobs}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Total Notes:</span>
                        <span className="text-sm font-medium">{vehicle.total_notest}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Last Service:</span>
                        <span className="text-sm font-medium">{vehicle.last_service || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Next Service:</span>
                        <span className="text-sm font-medium">{vehicle.next_service_schedule || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Vehicle not found</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onChange={(event, newValue) => {
          if (newValue !== null) {
            setActiveTab(newValue as string);
          }
        }}>
          <TabsList className="grid w-full grid-cols-1">
            <Tab value="history" className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              Service History
            </Tab>
            {/* <Tab value="notes" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Admin Notes
            </Tab> */}
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
                      {isLoadingHistory ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            <p className="text-gray-500">Loading service history...</p>
                          </TableCell>
                        </TableRow>
                      ) : serviceHistory.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            <p className="text-gray-500">No service history found</p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        serviceHistory.map((history) => (
                          <TableRow key={history.vehicle_history_id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <span className="text-sm">{history.last_service || 'N/A'}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">{history.job_summary || 'N/A'}</div>
                            </TableCell>
                            <TableCell>
                              <div className="max-w-xs text-sm text-gray-600">
                                {history.admin_notes || 'N/A'}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback className="text-xs">
                                    {getUserName(history.user_id).split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{getUserName(history.user_id)}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">-</Badge>
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(history.status)}
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleEditHistory(history)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit History
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleDeleteHistory(history.vehicle_history_id)}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete History
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
              </CardContent>
            </Card>
          </TabPanel>

          {/* Admin Notes Tab - Commented out for now */}
          {/* <TabPanel value="notes" className="space-y-4">
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
                {/* Static mock data for Admin Notes */}
                {/* {[
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
                ].length > 0 ? (
                  <div className="space-y-4">
                    {[
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
                    ].map((job) => (
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
          </TabPanel> */}
        </Tabs>
      </div>

      {/* Add Note Dialog */}
      <AddNoteDialog 
        open={showAddNoteDialog} 
        onOpenChange={setShowAddNoteDialog}
        vehicleId={vehicle?.vehicle_history_id || 0}
      />

      {/* Edit History Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle>Edit History</DialogTitle>
          </DialogHeader>
          {editingHistory && (
            <EditHistoryForm
              history={editingHistory}
              onSave={handleSaveEdit}
              onCancel={() => {
                setShowEditDialog(false);
                setEditingHistory(null);
              }}
              isSaving={isSaving}
            />
          )}
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

// Edit History Form Component
const EditHistoryForm = ({ 
  history, 
  onSave, 
  onCancel,
  isSaving 
}: { 
  history: VehicleHistoryItem;
  onSave: (data: any) => void;
  onCancel: () => void;
  isSaving: boolean;
}) => {
  const [formData, setFormData] = useState({
    vehicle_number: history.vehicle_number || '',
    vin_number: history.vin_number || '',
    make_model: history.make_model || '',
    make_year: history.make_year || '',
    vehicle_color: history.vehicle_color || '',
    vehicle_mileage: history.vehicle_mileage || '',
    total_jobs: history.total_jobs.toString(),
    total_notest: history.total_notest.toString(),
    last_service: history.last_service || '',
    next_service_schedule: history.next_service_schedule || '',
    job_summary: history.job_summary || '',
    admin_notes: history.admin_notes || '',
    status: history.status.toString(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      vehicle_number: formData.vehicle_number || undefined,
      vin_number: formData.vin_number || undefined,
      make_model: formData.make_model || undefined,
      make_year: formData.make_year || undefined,
      vehicle_color: formData.vehicle_color || undefined,
      vehicle_mileage: formData.vehicle_mileage || undefined,
      total_jobs: parseInt(formData.total_jobs) || undefined,
      total_notest: parseInt(formData.total_notest) || undefined,
      last_service: formData.last_service || undefined,
      next_service_schedule: formData.next_service_schedule || undefined,
      job_summary: formData.job_summary || undefined,
      admin_notes: formData.admin_notes || undefined,
      status: parseInt(formData.status),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Vehicle Number</Label>
          <Input
            value={formData.vehicle_number}
            onChange={(e) => setFormData(prev => ({ ...prev, vehicle_number: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label>VIN Number</Label>
          <Input
            value={formData.vin_number}
            onChange={(e) => setFormData(prev => ({ ...prev, vin_number: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label>Make/Model</Label>
          <Input
            value={formData.make_model}
            onChange={(e) => setFormData(prev => ({ ...prev, make_model: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label>Make Year</Label>
          <Input
            value={formData.make_year}
            onChange={(e) => setFormData(prev => ({ ...prev, make_year: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label>Vehicle Color</Label>
          <Input
            value={formData.vehicle_color}
            onChange={(e) => setFormData(prev => ({ ...prev, vehicle_color: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label>Vehicle Mileage</Label>
          <Input
            value={formData.vehicle_mileage}
            onChange={(e) => setFormData(prev => ({ ...prev, vehicle_mileage: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label>Total Jobs</Label>
          <Input
            type="number"
            value={formData.total_jobs}
            onChange={(e) => setFormData(prev => ({ ...prev, total_jobs: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label>Total Notes</Label>
          <Input
            type="number"
            value={formData.total_notest}
            onChange={(e) => setFormData(prev => ({ ...prev, total_notest: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label>Last Service</Label>
          <Input
            value={formData.last_service}
            onChange={(e) => setFormData(prev => ({ ...prev, last_service: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label>Next Service Schedule</Label>
          <Input
            type="date"
            value={formData.next_service_schedule}
            onChange={(e) => setFormData(prev => ({ ...prev, next_service_schedule: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Active</SelectItem>
              <SelectItem value="0">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Job Summary</Label>
        <Textarea
          value={formData.job_summary}
          onChange={(e) => setFormData(prev => ({ ...prev, job_summary: e.target.value }))}
          rows={3}
        />
      </div>
      <div className="space-y-2">
        <Label>Admin Notes</Label>
        <Textarea
          value={formData.admin_notes}
          onChange={(e) => setFormData(prev => ({ ...prev, admin_notes: e.target.value }))}
          rows={3}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};

export { VehicleDetailContent };
