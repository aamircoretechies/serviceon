import { Fragment, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, Info, Save, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { laborCategoryService, garageService, laborRatesService } from '@/api/services';
import { toast } from 'sonner';
import type { LaborCategory, Garage } from '@/api/types';

const LaborRatesContent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    defaultRate: '85.00',
    overtimeRate: '127.50',
    weekendRate: '95.00',
    holidayRate: '110.00',
    currency: 'USD',
    billingUnit: 'hour',
    laborCategory: '',
    selectedGarage: '',
    notes: '',
  });

  const [laborCategories, setLaborCategories] = useState<LaborCategory[]>([]);
  const [garages, setGarages] = useState<Garage[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isLoadingGarages, setIsLoadingGarages] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Fetch labor categories
  useEffect(() => {
    const fetchLaborCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const categories = await laborCategoryService.getAll();
        setLaborCategories(categories);
      } catch (error: any) {
        console.error('Error fetching labor categories:', error);
        toast.error(error?.response?.data?.message || 'Failed to load labor categories');
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchLaborCategories();
  }, []);

  // Fetch garages
  useEffect(() => {
    const fetchGarages = async () => {
      setIsLoadingGarages(true);
      try {
        const response = await garageService.getAll();
        if (response.status === 1 && response.data?.garages?.content) {
          setGarages(response.data.garages.content);
        } else {
          toast.error('Failed to load garages');
        }
      } catch (error: any) {
        console.error('Error fetching garages:', error);
        toast.error(error?.response?.data?.message || 'Failed to load garages');
      } finally {
        setIsLoadingGarages(false);
      }
    };

    fetchGarages();
  }, []);

  const handleSave = async () => {
    // Validation
    if (!formData.laborCategory) {
      toast.error('Please select a labor category');
      return;
    }
    if (!formData.selectedGarage) {
      toast.error('Please select a garage');
      return;
    }

    setIsSaving(true);
    try {
      const requestData = {
        standard_rate: parseFloat(formData.defaultRate) || 0,
        overtime_rate: parseFloat(formData.overtimeRate) || 0,
        weekend_rate: parseFloat(formData.weekendRate) || 0,
        holiday_rate: parseFloat(formData.holidayRate) || 0,
        currency: formData.currency,
        billing_unit: formData.billingUnit,
        labor_category_id: parseInt(formData.laborCategory),
        garage_id: parseInt(formData.selectedGarage),
        notes: formData.notes || '',
      };

      const response = await laborRatesService.create(requestData);
      
      if (response.status === 1) {
        toast.success(response.message || 'Labor rates created successfully');
        // Reset form
        setFormData({
          defaultRate: '85.00',
          overtimeRate: '127.50',
          weekendRate: '95.00',
          holidayRate: '110.00',
          currency: 'USD',
          billingUnit: 'hour',
          laborCategory: '',
          selectedGarage: '',
          notes: '',
        });
      } else {
        toast.error(response.message || 'Failed to create labor rates');
      }
    } catch (error: any) {
      console.error('Error saving labor rates:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create labor rates';
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const rateTypes = [
    {
      key: 'defaultRate',
      label: 'Standard Rate',
      description: 'Default hourly rate for regular work',
      icon: DollarSign
    },
    {
      key: 'overtimeRate',
      label: 'Overtime Rate',
      description: 'Rate for hours over 40 per week',
      icon: DollarSign
    },
    {
      key: 'weekendRate',
      label: 'Weekend Rate',
      description: 'Rate for weekend work',
      icon: DollarSign
    },
    {
      key: 'holidayRate',
      label: 'Holiday Rate',
      description: 'Rate for holiday work',
      icon: DollarSign
    }
  ];

  return (
    <Fragment>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Labor Rates</h1>
            <p className="text-gray-600 dark:text-gray-400">Configure default labor rates for your garage</p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin/labor-rates/list')} 
              className="flex items-center gap-2"
            >
              <List className="h-4 w-4" />
              Show ALL Labor Rates
            </Button>
            <Button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        {/* Main Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Rate Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Rate Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {rateTypes.map((rateType) => {
                  const Icon = rateType.icon;
                  return (
                    <div key={rateType.key} className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-gray-500" />
                        <div className="flex-1">
                          <Label className="text-base font-medium">{rateType.label}</Label>
                          <p className="text-sm text-gray-500">{rateType.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">$</span>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData[rateType.key as keyof typeof formData]}
                            onChange={(e) => handleInputChange(rateType.key, e.target.value)}
                            className="w-32"
                            placeholder="0.00"
                          />
                        </div>
                        <span className="text-sm text-gray-500">per {formData.billingUnit}</span>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Additional Labor Settings */}
<Card>
  <CardHeader>
    <CardTitle>Additional Labor Settings</CardTitle>
  </CardHeader>
  <CardContent className="space-y-6">

    {/* Labor Category */}
    <div className="space-y-2">
      <Label>Labor Category</Label>
      <Select
        value={formData.laborCategory}
        onValueChange={(value) => handleInputChange('laborCategory', value)}
        disabled={isLoadingCategories}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Category" />
        </SelectTrigger>
        <SelectContent>
          {laborCategories.map((category) => (
            <SelectItem key={category.labor_category_id} value={category.labor_category_id.toString()}>
              {category.category_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-sm text-gray-500">Choose the type of labor rate this configuration applies to.</p>
    </div>

    {/* Garage Selector */}
    <div className="space-y-2">
      <Label>Garage</Label>
      <Select
        value={formData.selectedGarage}
        onValueChange={(value) => handleInputChange('selectedGarage', value)}
        disabled={isLoadingGarages}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Garage" />
        </SelectTrigger>
        <SelectContent>
          {garages.map((garage) => (
            <SelectItem key={garage.garage_id} value={garage.garage_id.toString()}>
              {garage.garage_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-sm text-gray-500">Assign this rate configuration to a specific garage.</p>
    </div>

    {/* Notes / Remarks */}
    <div className="space-y-2">
      <Label>Notes / Remarks</Label>
      <Textarea
        value={formData.notes || ''}
        onChange={(e) => handleInputChange('notes', e.target.value)}
        rows={3}
        placeholder="Add any special conditions or notes here..."
      />
    </div>

  </CardContent>
</Card>


            {/* Billing Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Billing Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={formData.currency}
                        onChange={(e) => handleInputChange('currency', e.target.value)}
                        className="w-20"
                        placeholder="USD"
                      />
                      <span className="text-sm text-gray-500">ISO code</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Billing Unit</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={formData.billingUnit}
                        onChange={(e) => handleInputChange('billingUnit', e.target.value)}
                        className="w-20"
                        placeholder="hour"
                      />
                      <span className="text-sm text-gray-500">e.g., hour, day</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Info Panel */}
          <div className="space-y-6">
            {/* How It Works */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  How It Works
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Default Rates</p>
                    <p className="text-gray-600 dark:text-gray-400">
                      These rates serve as defaults for new jobs and can be overridden per job.
                    </p>
                  </div>
                  
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Rate Application</p>
                    <p className="text-gray-600 dark:text-gray-400">
                      Rates are automatically applied based on work conditions (weekend, holiday, overtime).
                    </p>
                  </div>
                  
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Job Override</p>
                    <p className="text-gray-600 dark:text-gray-400">
                      Individual jobs can have custom rates that override these defaults.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Settings Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Current Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Standard Rate</span>
                    <Badge variant="outline">${formData.defaultRate}/hour</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Overtime Rate</span>
                    <Badge variant="outline">${formData.overtimeRate}/hour</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Weekend Rate</span>
                    <Badge variant="outline">${formData.weekendRate}/hour</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Holiday Rate</span>
                    <Badge variant="outline">${formData.holidayRate}/hour</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Help Text */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <p>
                    <strong>Tip:</strong> Set competitive rates based on your local market and service quality.
                  </p>
                  <p>
                    <strong>Note:</strong> These rates can be adjusted per job if needed for special circumstances.
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

export { LaborRatesContent };


