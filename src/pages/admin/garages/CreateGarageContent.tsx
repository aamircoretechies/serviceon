import { Fragment, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X, Palette, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { BrandingPreviewModal } from './BrandingPreviewModal';
import { toast } from 'sonner';
import { timezoneService, garageService } from '@/api/services';
import type { Timezone } from '@/api/types';

const CreateGarageContent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    email: '',
    timezone: 'America/New_York',
    status: 'active',
    description: '',
    logo: null as File | null,
    brandColor: '#3B82F6'
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [showBrandingPreview, setShowBrandingPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [timezones, setTimezones] = useState<Timezone[]>([]);
  const [loadingTimezones, setLoadingTimezones] = useState(false);

  // Fetch timezones from API on component mount
  useEffect(() => {
    const fetchTimezones = async () => {
      setLoadingTimezones(true);
      try {
        const timezonesData = await timezoneService.getAll();
        setTimezones(timezonesData);
        
        // Set default timezone if none is set and we have timezones
        setFormData(prev => {
          if (!prev.timezone && timezonesData.length > 0) {
            // Try to find America/New_York first, otherwise use first timezone
            const defaultTz = timezonesData.find(tz => tz.timezone_name === 'America/New_York') 
              || timezonesData[0];
            if (defaultTz) {
              return { ...prev, timezone: defaultTz.timezone_name };
            }
          }
          return prev;
        });
      } catch (error) {
        console.error('Failed to fetch timezones:', error);
        toast.error('Failed to load timezones. Please refresh the page.');
      } finally {
        setLoadingTimezones(false);
      }
    };

    fetchTimezones();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        logo: file
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setFormData(prev => ({
      ...prev,
      logo: null
    }));
    setLogoPreview(null);
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Garage name is required';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors below');
      return;
    }
    
    // Find the timezone ID from the selected timezone name
    const selectedTimezone = timezones.find(tz => tz.timezone_name === formData.timezone);
    if (!selectedTimezone) {
      toast.error('Please select a valid timezone');
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Map form data to API format
      const garageData = {
        garage_name: formData.name,
        garage_phone_number: formData.phone,
        garage_email_address: formData.email,
        garage_description: formData.description || '',
        garage_street_address: formData.address,
        garage_city: formData.city,
        garage_state: formData.state,
        garage_zip_code: formData.zipCode,
        time_zone_id: selectedTimezone.id,
        status: formData.status === 'active' ? 1 : 0,
        garage_brand_color: formData.brandColor,
        garage_logo: formData.logo || undefined,
      };

      const response = await garageService.create(garageData);
      
      if (response.status === 1) {
        toast.success(response.message || 'Garage created successfully!');
        navigate('/admin/garages');
      } else {
        throw new Error(response.message || 'Failed to create garage');
      }
    } catch (error: any) {
      console.error('Error creating garage:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create garage. Please try again.';
      toast.error(errorMessage);
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
            onClick={() => navigate('/admin/garages')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Garages
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Garage</h1>
            <p className="text-gray-600 dark:text-gray-400">Create a new garage location</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Garage Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter garage name"
                        required
                        className={errors.name ? 'border-red-500' : ''}
                      />
                      {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="(555) 123-4567"
                        required
                        className={errors.phone ? 'border-red-500' : ''}
                      />
                      {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="contact@garage.com"
                      required
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Brief description of the garage"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Address Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Address Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="123 Main Street"
                      required
                      className={errors.address ? 'border-red-500' : ''}
                    />
                    {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="City"
                        required
                        className={errors.city ? 'border-red-500' : ''}
                      />
                      {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        placeholder="State"
                        required
                        className={errors.state ? 'border-red-500' : ''}
                      />
                      {errors.state && <p className="text-sm text-red-500">{errors.state}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP Code *</Label>
                      <Input
                        id="zipCode"
                        value={formData.zipCode}
                        onChange={(e) => handleInputChange('zipCode', e.target.value)}
                        placeholder="12345"
                        required
                        className={errors.zipCode ? 'border-red-500' : ''}
                      />
                      {errors.zipCode && <p className="text-sm text-red-500">{errors.zipCode}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select 
                      value={formData.timezone} 
                      onValueChange={(value) => handleInputChange('timezone', value)}
                      disabled={loadingTimezones}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={loadingTimezones ? 'Loading timezones...' : 'Select timezone'} />
                      </SelectTrigger>
                      <SelectContent>
                        {timezones.map((tz) => (
                          <SelectItem key={tz.id} value={tz.timezone_name}>
                            {tz.timezone_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {loadingTimezones && (
                      <p className="text-sm text-gray-500">Loading timezones...</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <p className="text-sm text-gray-500">Enable or disable this garage</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        id="status"
                        checked={formData.status === 'active'}
                        onCheckedChange={(checked) => 
                          handleInputChange('status', checked ? 'active' : 'inactive')
                        }
                      />
                      <Badge variant={formData.status === 'active' ? 'default' : 'secondary'}>
                        {formData.status === 'active' ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Branding Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Branding Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="brandColor">Brand Color</Label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        id="brandColor"
                        value={formData.brandColor}
                        onChange={(e) => handleInputChange('brandColor', e.target.value)}
                        className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                      />
                      <Input
                        value={formData.brandColor}
                        onChange={(e) => handleInputChange('brandColor', e.target.value)}
                        placeholder="#3B82F6"
                        className="font-mono"
                      />
                    </div>
                    <p className="text-sm text-gray-500">
                      This color will be used across all branded materials and digital outputs.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Logo Upload */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Garage Logo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {logoPreview ? (
                      <div className="relative">
                        <img
                          src={logoPreview}
                          alt="Logo preview"
                          className="w-full h-32 object-contain border rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={removeLogo}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Upload garage logo</p>
                        <p className="text-xs text-gray-400">PNG, JPG up to 2MB</p>
                      </div>
                    )}

                    <div>
                      <Label htmlFor="logo" className="cursor-pointer">
                        <div className="flex items-center justify-center w-full p-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                          <Upload className="h-4 w-4 mr-2" />
                          Choose File
                        </div>
                      </Label>
                      <Input
                        id="logo"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </div>

                    <div className="text-xs text-gray-500">
                      <p>• Recommended size: 200x200px</p>
                      <p>• Supported formats: PNG, JPG</p>
                      <p>• Max file size: 2MB</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Branding Preview */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Branding Preview</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowBrandingPreview(true)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Full Preview
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                    <div className="flex items-center gap-3 mb-3">
                      {logoPreview ? (
                        <img
                          src={logoPreview}
                          alt="Logo"
                          className="h-8 w-8 object-contain"
                        />
                      ) : (
                        <div className="h-8 w-8 bg-gray-300 rounded flex items-center justify-center">
                          <span className="text-xs text-gray-600">Logo</span>
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-sm">
                          {formData.name || 'Garage Name'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formData.address || 'Address'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div 
                        className="w-4 h-4 rounded border"
                        style={{ backgroundColor: formData.brandColor }}
                      ></div>
                      <span className="text-xs text-gray-500 font-mono">
                        {formData.brandColor}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      This is how the branding will appear on intake forms and other outputs.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/admin/garages')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Garage'}
            </Button>
          </div>
        </form>
      </div>

      {/* Branding Preview Modal */}
      <BrandingPreviewModal
        open={showBrandingPreview}
        onOpenChange={setShowBrandingPreview}
        garageData={{
          name: formData.name || 'Garage Name',
          address: formData.address || 'Address',
          phone: formData.phone || 'Phone',
          email: formData.email || 'Email',
          timezone: formData.timezone,
          logo: logoPreview || undefined,
          brandColor: formData.brandColor
        }}
      />
    </Fragment>
  );
};

export { CreateGarageContent };


