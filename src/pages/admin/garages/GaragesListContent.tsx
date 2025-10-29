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
  Building2,
  MapPin,
  Phone,
  Mail,
  Clock,
  Image as ImageIcon,
  Eye as EyeIcon
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BrandingPreviewModal } from './BrandingPreviewModal';
import { ConfirmationDialog } from './ConfirmationDialog';
import { toast } from 'sonner';

const GaragesListContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [confirmationDialog, setConfirmationDialog] = useState<{
    open: boolean;
    garageId: number;
    garageName: string;
  }>({
    open: false,
    garageId: 0,
    garageName: ''
  });
  const [brandingPreview, setBrandingPreview] = useState<{
    open: boolean;
    garageData: any;
  }>({
    open: false,
    garageData: null
  });
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - replace with actual data
  const garages = [
    {
      id: 1,
      name: 'Downtown Auto Service',
      address: '123 Main St, Downtown',
      phone: '(555) 123-4567',
      email: 'info@downtownauto.com',
      timezone: 'America/New_York',
      status: 'active',
      logo: '/media/avatars/garage-1.png',
      brandColor: '#3B82F6',
      createdAt: '2024-01-15',
      lastUpdated: '2024-01-20'
    },
    {
      id: 2,
      name: 'Westside Garage',
      address: '456 Oak Ave, Westside',
      phone: '(555) 234-5678',
      email: 'contact@westsidegarage.com',
      timezone: 'America/Los_Angeles',
      status: 'active',
      logo: '/media/avatars/garage-2.png',
      brandColor: '#10B981',
      createdAt: '2024-01-10',
      lastUpdated: '2024-01-18'
    },
    {
      id: 3,
      name: 'North Point Motors',
      address: '789 Pine Rd, North Point',
      phone: '(555) 345-6789',
      email: 'hello@northpointmotors.com',
      timezone: 'America/Chicago',
      status: 'inactive',
      logo: null,
      brandColor: '#F59E0B',
      createdAt: '2024-01-05',
      lastUpdated: '2024-01-12'
    },
    {
      id: 4,
      name: 'East End Auto',
      address: '321 Elm St, East End',
      phone: '(555) 456-7890',
      email: 'service@eastendauto.com',
      timezone: 'America/Denver',
      status: 'active',
      logo: '/media/avatars/garage-3.png',
      brandColor: '#EF4444',
      createdAt: '2024-01-08',
      lastUpdated: '2024-01-19'
    }
  ];

  const filteredGarages = garages.filter(garage => {
    const matchesSearch = garage.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         garage.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || garage.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleEdit = (garageId: number) => {
    window.location.href = `/admin/garages/edit/${garageId}`;
  };

  const handleDelete = (garageId: number) => {
    const garage = garages.find(g => g.id === garageId);
    if (garage) {
      setConfirmationDialog({
        open: true,
        garageId,
        garageName: garage.name
      });
    }
  };

  const handleView = (garageId: number) => {
    window.location.href = `/admin/garages/${garageId}`;
  };

  const handleBrandingPreview = (garage: any) => {
    setBrandingPreview({
      open: true,
      garageData: garage
    });
  };

  const handleConfirmDelete = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Garage deleted successfully');
      setConfirmationDialog({ open: false, garageId: 0, garageName: '' });
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimezone = (timezone: string) => {
    return timezone.replace('America/', '').replace('_', ' ');
  };

  return (
    <Fragment>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Garages</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your garage locations and settings</p>
          </div>
          <Link to="/admin/garages/create">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Garage
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
                    placeholder="Search garages..."
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
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
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

        {/* Garages Table */}
        <Card>
          <CardHeader>
            <CardTitle>Garages ({filteredGarages.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Garage Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Timezone</TableHead>
                    <TableHead>Logo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGarages.map((garage) => (
                    <TableRow key={garage.id} className="sand-hover-row">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center sand-hover-avatar">
                            <Building2 className="h-5 w-5 text-gray-600 dark:text-gray-400 sand-hover-icon" />
                          </div>
                          <div>
                            <div className="font-medium">{garage.name}</div>
                            <div className="text-sm text-gray-500">ID: {garage.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{garage.address}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{formatTimezone(garage.timezone)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {garage.logo ? (
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={garage.logo} alt="Garage Logo" />
                              <AvatarFallback>
                                <ImageIcon className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                              <ImageIcon className="h-4 w-4 text-gray-400" />
                            </div>
                          )}
                          <span className="text-sm text-gray-500">
                            {garage.logo ? 'Uploaded' : 'No Logo'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(garage.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleBrandingPreview(garage)}
                            title="Branding Preview"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleView(garage.id)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEdit(garage.id)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDelete(garage.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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

      {/* Branding Preview Modal */}
      {brandingPreview.garageData && (
        <BrandingPreviewModal
          open={brandingPreview.open}
          onOpenChange={(open) => setBrandingPreview(prev => ({ ...prev, open }))}
          garageData={brandingPreview.garageData}
        />
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={confirmationDialog.open}
        onOpenChange={(open) => setConfirmationDialog(prev => ({ ...prev, open }))}
        garageName={confirmationDialog.garageName}
        onConfirm={handleConfirmDelete}
        isLoading={isLoading}
      />
    </Fragment>
  );
};

export { GaragesListContent };
