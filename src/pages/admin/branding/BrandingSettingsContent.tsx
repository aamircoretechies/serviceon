import { Fragment, useState, useEffect } from 'react';
import { Upload, X, Eye, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { brandSettingsService } from '@/api/services';
import { IMAGES_BASE_URL } from '@/api/config';

const BrandingSettingsContent = () => {
  const [formData, setFormData] = useState({
    logo: null as File | null,
    companyName: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    footerText: '',
    showLogo: false,
    showContact: false,
    showFooter: false
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [existingLogoUrl, setExistingLogoUrl] = useState<string | null>(null);
  const [logoLoadError, setLogoLoadError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
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
    setExistingLogoUrl(null);
    setLogoLoadError(false);
  };

  /**
   * Fetch brand settings on component mount
   */
  useEffect(() => {
    const fetchBrandSettings = async () => {
      setIsLoading(true);
      try {
        const data = await brandSettingsService.get();
        
        console.log('Brand settings data received:', data);
        console.log('Logo value from API:', data.logo);
        console.log('IMAGES_BASE_URL:', IMAGES_BASE_URL);
        
        // Map API response to form state
        setFormData({
          logo: null, // Don't set file from API response
          companyName: data.company_name || '',
          address: data.address || '',
          phone: data.phone_number || '',
          email: data.email || '',
          website: data.website || '',
          footerText: data.footer_text || '',
          showLogo: data.show_logo_on_outputs === 1,
          showContact: data.show_content_information === 1,
          showFooter: data.show_custom_footer === 1
        });

        // Set existing logo URL if available
        // Handle both string and null/undefined cases
        const logoValue = data.logo;
        console.log('Logo value type:', typeof logoValue, 'Value:', logoValue);
        
        if (logoValue && typeof logoValue === 'string' && logoValue.trim() !== '') {
          const logoUrl = `${IMAGES_BASE_URL}/${logoValue}`;
          console.log('Setting existing logo URL:', logoUrl);
          setExistingLogoUrl(logoUrl);
          setLogoLoadError(false); // Reset error state when setting new URL
        } else {
          console.log('No logo found in API response or logo is empty/null');
          setExistingLogoUrl(null);
          setLogoLoadError(false);
        }
      } catch (error: any) {
        console.error('Failed to fetch brand settings:', error);
        toast.error(error?.response?.data?.message || 'Failed to load brand settings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrandSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Map form state to API request format
      const requestData = {
        logo: formData.logo,
        show_logo_on_outputs: formData.showLogo ? 1 : 0,
        company_name: formData.companyName,
        phone_number: formData.phone,
        address: formData.address,
        email: formData.email,
        website: formData.website,
        show_content_information: formData.showContact ? 1 : 0,
        show_custom_footer: formData.showFooter ? 1 : 0,
        footer_text: formData.footerText,
      };

      await brandSettingsService.createOrUpdate(requestData);
      
      toast.success('Brand settings saved successfully');
      
      // Refresh data after save
      const updatedData = await brandSettingsService.get();
      setFormData(prev => ({
        ...prev,
        logo: null, // Reset file after save
      }));
      
      // Update existing logo URL - always refresh from API
      if (updatedData.logo && updatedData.logo.trim() !== '') {
        const logoUrl = `${IMAGES_BASE_URL}/${updatedData.logo}`;
        console.log('Updating existing logo URL after save:', logoUrl);
        setExistingLogoUrl(logoUrl);
        setLogoLoadError(false);
      } else {
        // Only clear if we explicitly removed the logo
        // If no logo was uploaded, keep the existing one
        if (formData.logo === null && !existingLogoUrl) {
          setExistingLogoUrl(null);
        }
      }
      
      setLogoPreview(null); // Clear preview after save
    } catch (error: any) {
      console.error('Failed to save brand settings:', error);
      toast.error(error?.response?.data?.message || 'Failed to save brand settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    console.log('Preview branding');
    // Implement preview logic
  };

  if (isLoading) {
    return (
      <Fragment>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading brand settings...</div>
        </div>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Branding Settings</h1>
            <p className="text-gray-600 dark:text-gray-400">Configure your garage branding for intake forms and outputs</p>
          </div>
          <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handlePreview} className="flex items-center gap-2 sand-hover-button" disabled={isLoading || isSaving}>
            <Eye className="h-4 w-4" />
            Preview
          </Button>
          <Button onClick={handleSave} className="sand-hover-button" disabled={isLoading || isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Logo Settings */}
            <Card className="sand-hover-card">
              <CardHeader>
                <CardTitle>Logo Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show Logo on Outputs</Label>
                    <p className="text-sm text-gray-500">Display logo on intake forms and PDFs</p>
                  </div>
                  <Switch
                    checked={formData.showLogo}
                    onCheckedChange={(checked) => handleInputChange('showLogo', checked)}
                  />
                </div>

                <div className="space-y-4">
                  <Label>Upload Logo</Label>
                  {/* Debug info - remove after testing */}
                  {/* {existingLogoUrl && (
                    <div className="text-xs text-gray-500 p-2 bg-gray-100 dark:bg-gray-800 rounded">
                      Debug: existingLogoUrl = {existingLogoUrl}
                    </div>
                  )} */}
                  {logoPreview ? (
                    <div className="relative">
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="w-32 h-32 object-contain border rounded-lg"
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
                  ) : existingLogoUrl ? (
                    <div className="relative">
                      {!logoLoadError ? (
                        <img
                          src={existingLogoUrl}
                          alt="Company logo"
                          className="w-32 h-32 object-contain border rounded-lg bg-gray-50 dark:bg-gray-800"
                          onError={(e) => {
                            console.error('Failed to load logo image:', existingLogoUrl);
                            setLogoLoadError(true);
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                          onLoad={() => {
                            console.log('Logo image loaded successfully:', existingLogoUrl);
                            setLogoLoadError(false);
                          }}
                        />
                      ) : (
                        <div className="w-32 h-32 border rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                          <div className="text-center p-2">
                            <Upload className="h-6 w-6 mx-auto text-gray-400 mb-1" />
                            <p className="text-xs text-gray-500">Logo exists but failed to load</p>
                            <p className="text-xs text-gray-400 mt-1 break-all">{existingLogoUrl}</p>
                          </div>
                        </div>
                      )}
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
                      <p className="text-sm text-gray-500">Upload your garage logo</p>
                      <p className="text-xs text-gray-400">PNG, JPG up to 2MB</p>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="logo" className="cursor-pointer">
                      <div className="flex items-center justify-center w-full p-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                        <Upload className="h-4 w-4 mr-2" />
                        Choose Logo File
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

                  <div className="text-xs text-gray-500 space-y-1">
                    <p>• Recommended size: 200x200px or larger</p>
                    <p>• Supported formats: PNG, JPG, SVG</p>
                    <p>• Max file size: 2MB</p>
                    <p>• Logo will be automatically resized to fit</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Company Information */}
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      placeholder="Your Company Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="123 Business St, City, State 12345"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="info@company.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      placeholder="www.company.com"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Footer Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Footer Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show Contact Information</Label>
                    <p className="text-sm text-gray-500">Display contact info in footer</p>
                  </div>
                  <Switch
                    checked={formData.showContact}
                    onCheckedChange={(checked) => handleInputChange('showContact', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show Custom Footer</Label>
                    <p className="text-sm text-gray-500">Display custom footer text</p>
                  </div>
                  <Switch
                    checked={formData.showFooter}
                    onCheckedChange={(checked) => handleInputChange('showFooter', checked)}
                  />
                </div>

                {formData.showFooter && (
                  <div className="space-y-2">
                    <Label htmlFor="footerText">Footer Text</Label>
                    <Textarea
                      id="footerText"
                      value={formData.footerText}
                      onChange={(e) => handleInputChange('footerText', e.target.value)}
                      placeholder="Thank you for choosing our services"
                      rows={2}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4 bg-white dark:bg-gray-900">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b">
                    {formData.showLogo && (logoPreview || existingLogoUrl) && (
                      <img
                        src={logoPreview || existingLogoUrl || ''}
                        alt="Logo"
                        className="h-8 w-8 object-contain"
                      />
                    )}
                    <div>
                      <div className="font-bold text-sm">{formData.companyName || 'Company Name'}</div>
                      <div className="text-xs text-gray-500">Service Intake Form</div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-2 text-xs">
                    <div className="font-medium">Customer Information</div>
                    <div className="text-gray-500">Name: _________________</div>
                    <div className="text-gray-500">Phone: _________________</div>
                    <div className="text-gray-500">Email: _________________</div>
                  </div>

                  {/* Footer */}
                  <div className="mt-4 pt-4 border-t text-xs text-gray-500">
                    {formData.showContact && (
                      <div className="space-y-1">
                        <div>{formData.address}</div>
                        <div>{formData.phone} • {formData.email}</div>
                        {formData.website && <div>{formData.website}</div>}
                      </div>
                    )}
                    {formData.showFooter && (
                      <div className="mt-2 text-center">
                        {formData.footerText}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Applied To Outputs */}
            <Card>
              <CardHeader>
                <CardTitle>Applied To Outputs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Intake Forms</Badge>
                    <span className="text-sm text-gray-500">Customer intake checklists</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Service Reports</Badge>
                    <span className="text-sm text-gray-500">Completed service documentation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Invoices</Badge>
                    <span className="text-sm text-gray-500">Customer billing documents</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Labels</Badge>
                    <span className="text-sm text-gray-500">Part and service labels</span>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    <strong>Note:</strong> These branding settings will be applied to all PDF outputs and printed materials generated by the system.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export { BrandingSettingsContent };
