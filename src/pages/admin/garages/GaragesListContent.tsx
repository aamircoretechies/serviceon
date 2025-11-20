import { Fragment, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import { ViewGarageModal } from './ViewGarageModal';
import { toast } from 'sonner';
import { garageService, timezoneService } from '@/api/services';
import type { Garage, Timezone } from '@/api/types';
import { IMAGES_BASE_URL } from '@/api/config';

const GaragesListContent = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [garages, setGarages] = useState<Garage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [timezones, setTimezones] = useState<Timezone[]>([]);
  const [timezoneMap, setTimezoneMap] = useState<Map<number, string>>(new Map());
  const [totalGarages, setTotalGarages] = useState(0);
  const [activeGarages, setActiveGarages] = useState(0);
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
  const [viewGarage, setViewGarage] = useState<{
    open: boolean;
    garage: Garage | null;
  }>({
    open: false,
    garage: null
  });

  // Fetch timezones on mount
  useEffect(() => {
    const fetchTimezones = async () => {
      try {
        const timezonesData = await timezoneService.getAll();
        setTimezones(timezonesData);
        // Create a map for quick lookup
        const map = new Map<number, string>();
        timezonesData.forEach(tz => {
          map.set(tz.id, tz.timezone_name);
        });
        setTimezoneMap(map);
      } catch (error) {
        console.error('Failed to fetch timezones:', error);
      }
    };
    fetchTimezones();
  }, []);

  // Fetch garages from API
  useEffect(() => {
    fetchGarages();
  }, [statusFilter, searchTerm]);

  const fetchGarages = async () => {
    setIsLoadingData(true);
    try {
      const params: any = {};
      if (searchTerm) {
        params.search = searchTerm;
      }
      if (statusFilter !== 'all') {
        params.status = statusFilter === 'active' ? 1 : 0;
      }

      const response = await garageService.getAll(params);
      
      if (response.status === 1) {
        setGarages(response.data.garages.content);
        setTotalGarages(response.data.total_garages_count);
        setActiveGarages(response.data.active_garages_count);
      } else {
        toast.error(response.message || 'Failed to load garages');
      }
    } catch (error: any) {
      console.error('Error fetching garages:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to load garages';
      toast.error(errorMessage);
    } finally {
      setIsLoadingData(false);
    }
  };

  const filteredGarages = garages.filter(garage => {
    const matchesSearch = garage.garage_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         `${garage.garage_street_address}, ${garage.garage_city}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && garage.status === 1) ||
                         (statusFilter === 'inactive' && garage.status === 0);
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: number) => {
    if (status === 1) {
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Active</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Inactive</Badge>;
    }
  };

  const handleEdit = (garage: Garage) => {
    // Navigate to create screen with garage data in state
    navigate('/admin/garages/create', {
      state: { garage }
    });
  };

  const handleDelete = (garage: Garage) => {
    setConfirmationDialog({
      open: true,
      garageId: garage.garage_id,
      garageName: garage.garage_name
    });
  };

  const handleView = (garage: Garage) => {
    setViewGarage({
      open: true,
      garage: garage
    });
  };

  const handleBrandingPreview = (garage: Garage) => {
    // Map API garage data to preview format
    const previewData = {
      name: garage.garage_name,
      address: `${garage.garage_street_address}, ${garage.garage_city}, ${garage.garage_state} ${garage.garage_zip_code}`,
      phone: garage.garage_phone_number,
      email: garage.garage_email_address,
      timezone: '', // Will need to fetch timezone name from ID if needed
      logo: garage.garage_logo ? `${IMAGES_BASE_URL}/${garage.garage_logo}` : undefined,
      brandColor: garage.garage_brand_color
    };
    setBrandingPreview({
      open: true,
      garageData: previewData
    });
  };

  const handleConfirmDelete = async () => {
    setIsLoading(true);
    try {
      const response = await garageService.delete({ garage_id: confirmationDialog.garageId });
      
      if (response.status === 1) {
        toast.success(response.message || 'Garage deleted successfully');
        setConfirmationDialog({ open: false, garageId: 0, garageName: '' });
        // Refresh the list
        await fetchGarages();
      } else {
        throw new Error(response.message || 'Failed to delete garage');
      }
    } catch (error: any) {
      console.error('Error deleting garage:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete garage. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimezone = (timezoneId: number) => {
    const timezoneName = timezoneMap.get(timezoneId);
    if (timezoneName) {
      return timezoneName.replace(/_/g, ' ');
    }
    return `Timezone ID: ${timezoneId}`;
  };

  return (
    <Fragment>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Garages</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your garage locations and settings</p>
            <div className="flex items-center flex-wrap gap-1.5 font-medium mt-2">
              <span className="text-md text-gray-700">Total Garages:</span>
              <span className="text-md text-gray-800 font-medium me-2">{totalGarages}</span>
              <span className="text-md text-gray-700">Active:</span>
              <span className="text-md text-green-600 font-medium">{activeGarages}</span>
            </div>
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
                {/* <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  More Filters
                </Button> */}
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
                  {isLoadingData ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex items-center justify-center">
                          <div className="text-gray-500">Loading garages...</div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredGarages.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex flex-col items-center justify-center">
                          <Building2 className="h-12 w-12 text-gray-400 mb-2" />
                          <div className="text-gray-500">No garages found</div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredGarages.map((garage) => (
                      <TableRow key={garage.garage_id} className="sand-hover-row">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center sand-hover-avatar">
                              <Building2 className="h-5 w-5 text-gray-600 dark:text-gray-400 sand-hover-icon" />
                            </div>
                            <div>
                              <div className="font-medium">{garage.garage_name}</div>
                              <div className="text-sm text-gray-500">ID: {garage.garage_id}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{garage.garage_street_address}, {garage.garage_city}, {garage.garage_state}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{formatTimezone(garage.time_zone_id)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {garage.garage_logo ? (
                              <Avatar className="h-8 w-8">
                                <AvatarImage 
                                  src={`${IMAGES_BASE_URL}/${garage.garage_logo}`} 
                                  alt="Garage Logo" 
                                />
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
                              {garage.garage_logo ? 'Uploaded' : 'No Logo'}
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
                                <DropdownMenuItem onClick={() => handleView(garage)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEdit(garage)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDelete(garage)}
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
                    ))
                  )}
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

      {/* View Garage Modal */}
      {viewGarage.garage && (
        <ViewGarageModal
          open={viewGarage.open}
          onOpenChange={(open) => setViewGarage(prev => ({ ...prev, open }))}
          garage={viewGarage.garage}
          timezoneName={timezoneMap.get(viewGarage.garage.time_zone_id)}
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
