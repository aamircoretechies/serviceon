import { Fragment, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Car, 
  User, 
  Calendar, 
  Save,
  X,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { vehicleHistoryService, userService } from '@/api/services';
import { toast } from 'sonner';
import type { User as UserType } from '@/api/types';
import { IMAGES_BASE_URL } from '@/api/config';

const AddVehicleContent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    vehicle_id: '',
    vehicle_number: '',
    vin_number: '',
    make_model: '',
    make_year: '',
    vehicle_color: '',
    vehicle_mileage: '',
    user_id: '',
    status: '1',
    total_jobs: '0',
    total_notest: '0',
    last_service: '',
    next_service_schedule: '',
    job_summary: '',
    admin_notes: '',
  });

  const [users, setUsers] = useState<UserType[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [vehiclePhotos, setVehiclePhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoadingUsers(true);
      try {
        const response = await userService.getAll({ page: 0, size: 1000 });
        if (response.status === 1 && response.data?.content) {
          setUsers(response.data.content);
        } else {
          toast.error('Failed to load users');
        }
      } catch (error: any) {
        console.error('Error fetching users:', error);
        toast.error(error?.response?.data?.message || 'Failed to load users');
      } finally {
        setIsLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setVehiclePhotos(prev => [...prev, ...newFiles]);
      
      // Create previews
      newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPhotoPreviews(prev => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePhoto = (index: number) => {
    setVehiclePhotos(prev => prev.filter((_, i) => i !== index));
    setPhotoPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.user_id) {
      toast.error('Please select a user');
      return;
    }

    setIsSubmitting(true);
    try {
      const requestData = {
        vehicle_id: formData.vehicle_id ? parseInt(formData.vehicle_id) : undefined,
        vehicle_number: formData.vehicle_number || undefined,
        vin_number: formData.vin_number || undefined,
        make_model: formData.make_model || undefined,
        make_year: formData.make_year || undefined,
        vehicle_color: formData.vehicle_color || undefined,
        vehicle_mileage: formData.vehicle_mileage || undefined,
        user_id: parseInt(formData.user_id),
        status: parseInt(formData.status),
        total_jobs: parseInt(formData.total_jobs) || 0,
        total_notest: parseInt(formData.total_notest) || 0,
        last_service: formData.last_service || undefined,
        next_service_schedule: formData.next_service_schedule || undefined,
        job_summary: formData.job_summary || undefined,
        admin_notes: formData.admin_notes || undefined,
        vehicle_photos: vehiclePhotos.length > 0 ? vehiclePhotos : undefined,
      };

      const response = await vehicleHistoryService.create(requestData);
      
      if (response.status === 1) {
        toast.success(response.message || 'Vehicle history created successfully');
        navigate('/admin/vehicles');
      } else {
        toast.error(response.message || 'Failed to create vehicle history');
      }
    } catch (error: any) {
      console.error('Error creating vehicle history:', error);
      toast.error(error?.response?.data?.message || 'Failed to create vehicle history');
    } finally {
      setIsSubmitting(false);
    }
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add Vehicle</h1>
            <p className="text-gray-600 dark:text-gray-400">Create a new vehicle history record</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Vehicle Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="h-5 w-5" />
                    Vehicle Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Vehicle ID</Label>
                    <Input
                      type="number"
                      value={formData.vehicle_id}
                      onChange={(e) => handleInputChange('vehicle_id', e.target.value)}
                      placeholder="Enter vehicle ID"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Vehicle Number *</Label>
                    <Input
                      value={formData.vehicle_number}
                      onChange={(e) => handleInputChange('vehicle_number', e.target.value)}
                      placeholder="Enter vehicle number"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>VIN Number *</Label>
                    <Input
                      value={formData.vin_number}
                      onChange={(e) => handleInputChange('vin_number', e.target.value)}
                      placeholder="Enter VIN number"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Make/Model *</Label>
                    <Input
                      value={formData.make_model}
                      onChange={(e) => handleInputChange('make_model', e.target.value)}
                      placeholder="Enter make/model"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Make Year *</Label>
                    <Input
                      value={formData.make_year}
                      onChange={(e) => handleInputChange('make_year', e.target.value)}
                      placeholder="Enter year"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Vehicle Color *</Label>
                    <Input
                      value={formData.vehicle_color}
                      onChange={(e) => handleInputChange('vehicle_color', e.target.value)}
                      placeholder="Enter color"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Vehicle Mileage *</Label>
                    <Input
                      value={formData.vehicle_mileage}
                      onChange={(e) => handleInputChange('vehicle_mileage', e.target.value)}
                      placeholder="Enter mileage"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Service Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Service Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Total Jobs *</Label>
                    <Input
                      type="number"
                      value={formData.total_jobs}
                      onChange={(e) => handleInputChange('total_jobs', e.target.value)}
                      placeholder="0"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Total Notes *</Label>
                    <Input
                      type="number"
                      value={formData.total_notest}
                      onChange={(e) => handleInputChange('total_notest', e.target.value)}
                      placeholder="0"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Last Service *</Label>
                    <Input
                      type="text"
                      value={formData.last_service}
                      onChange={(e) => handleInputChange('last_service', e.target.value)}
                      placeholder="Enter last service date"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Next Service Schedule *</Label>
                    <Input
                      type="date"
                      value={formData.next_service_schedule}
                      onChange={(e) => handleInputChange('next_service_schedule', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Job Summary *</Label>
                    <Textarea
                      value={formData.job_summary}
                      onChange={(e) => handleInputChange('job_summary', e.target.value)}
                      placeholder="Enter job summary"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Admin Notes *</Label>
                    <Textarea
                      value={formData.admin_notes}
                      onChange={(e) => handleInputChange('admin_notes', e.target.value)}
                      placeholder="Enter admin notes"
                      rows={3}
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Owner Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Owner Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select User *</Label>
                    <Select
                      value={formData.user_id}
                      onValueChange={(value) => handleInputChange('user_id', value)}
                      disabled={isLoadingUsers}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select user" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem key={user.user_id} value={user.user_id.toString()}>
                            {user.first_name} {user.last_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Status *</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleInputChange('status', value)}
                      required
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
                </CardContent>
              </Card>

              {/* Vehicle Photos */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Vehicle Photos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Upload Photos</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-gray-500">You can select multiple photos</p>
                  </div>

                  {photoPreviews.length > 0 && (
                    <div className="grid grid-cols-2 gap-4">
                      {photoPreviews.map((preview, index) => (
                        <div key={index} className="relative">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => removePhoto(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/vehicles')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Creating...' : 'Create Vehicle History'}
            </Button>
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export { AddVehicleContent };

