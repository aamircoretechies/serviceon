import { Fragment, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Car, 
  User, 
  Calendar, 
  Clock, 
  Wrench, 
  FileText,
  Plus,
  Save,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { garageService, userService, jobTypeService, serviceTypeService, jobService } from '@/api/services';
import { toast } from 'sonner';
import type { Garage, User as UserType, JobType, ServiceType } from '@/api/types';

const CreateJobContent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Vehicle Information
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    licensePlate: '',
    vin: '',
    mileage: '',
    
    // Customer Information
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    
    // Job Information
    jobType: '',
    priority: '2', // Default to Medium (2)
    description: '',
    estimatedHours: '',
    estimatedCost: '',
    
    // Assignment
    assignedGarage: '',
    assignedMechanic: '',
    
    // Additional Services
    services: [] as string[],
    parts: [] as { name: string; quantity: number; cost: number }[]
  });

  const [newService, setNewService] = useState('');
  const [newPart, setNewPart] = useState({ name: '', quantity: 1, cost: 0 });

  // API data
  const [garages, setGarages] = useState<Garage[]>([]);
  const [mechanics, setMechanics] = useState<UserType[]>([]);
  const [jobTypes, setJobTypes] = useState<JobType[]>([]);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [isLoadingGarages, setIsLoadingGarages] = useState(false);
  const [isLoadingMechanics, setIsLoadingMechanics] = useState(false);
  const [isLoadingJobTypes, setIsLoadingJobTypes] = useState(false);
  const [isLoadingServiceTypes, setIsLoadingServiceTypes] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch garages from API
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
      } catch (error) {
        console.error('Error fetching garages:', error);
        toast.error('Failed to load garages');
      } finally {
        setIsLoadingGarages(false);
      }
    };

    fetchGarages();
  }, []);

  // Fetch mechanics (users with user_role = 2) from API
  useEffect(() => {
    const fetchMechanics = async () => {
      setIsLoadingMechanics(true);
      try {
        const response = await userService.getAll({
          page: 0,
          size: 1000, // Get all mechanics
          user_role: 2, // Filter for mechanics only
        });
        if (response.status === 1 && response.data?.content) {
          setMechanics(response.data.content);
        } else {
          toast.error('Failed to load mechanics');
        }
      } catch (error) {
        console.error('Error fetching mechanics:', error);
        toast.error('Failed to load mechanics');
      } finally {
        setIsLoadingMechanics(false);
      }
    };

    fetchMechanics();
  }, []);

  // Fetch job types from API
  useEffect(() => {
    const fetchJobTypes = async () => {
      setIsLoadingJobTypes(true);
      try {
        const jobTypesData = await jobTypeService.getAll();
        setJobTypes(jobTypesData);
      } catch (error) {
        console.error('Error fetching job types:', error);
        toast.error('Failed to load job types');
      } finally {
        setIsLoadingJobTypes(false);
      }
    };

    fetchJobTypes();
  }, []);

  // Fetch service types from API
  useEffect(() => {
    const fetchServiceTypes = async () => {
      setIsLoadingServiceTypes(true);
      try {
        const serviceTypesData = await serviceTypeService.getAll();
        setServiceTypes(serviceTypesData);
      } catch (error) {
        console.error('Error fetching service types:', error);
        toast.error('Failed to load service types');
      } finally {
        setIsLoadingServiceTypes(false);
      }
    };

    fetchServiceTypes();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddService = () => {
    if (newService && !formData.services.includes(newService)) {
      setFormData(prev => ({
        ...prev,
        services: [...prev.services, newService]
      }));
      setNewService('');
    }
  };

  const handleRemoveService = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter(s => s !== service)
    }));
  };

  const handleAddPart = () => {
    if (newPart.name) {
      setFormData(prev => ({
        ...prev,
        parts: [...prev.parts, { ...newPart }]
      }));
      setNewPart({ name: '', quantity: 1, cost: 0 });
    }
  };

  const handleRemovePart = (index: number) => {
    setFormData(prev => ({
      ...prev,
      parts: prev.parts.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submitted, formData:', formData);

    // Validate required fields
    if (!formData.vehicleMake || !formData.vehicleModel || !formData.vehicleYear || !formData.licensePlate) {
      toast.error('Please fill in all required vehicle fields');
      return;
    }

    if (!formData.customerName || !formData.customerPhone) {
      toast.error('Please fill in all required customer fields');
      return;
    }

    if (!formData.jobType || !formData.description) {
      toast.error('Please fill in all required job fields');
      return;
    }

    if (!formData.assignedGarage) {
      toast.error('Please select a garage');
      return;
    }

    setIsSubmitting(true);

    try {
      // Map form data to API request format - send ALL fields even if empty
      const jobTypeId = formData.jobType ? parseInt(formData.jobType) : undefined;
      const garageId = formData.assignedGarage ? parseInt(formData.assignedGarage) : undefined;
      const mechanicId = formData.assignedMechanic ? parseInt(formData.assignedMechanic) : undefined;
      const serviceTypeId = formData.services.length > 0 ? parseInt(formData.services[0]) : undefined;
      
      const requestData = {
        // Vehicle information - always send, use empty string if not provided
        vehicle_make: formData.vehicleMake || '',
        vehicle_model: formData.vehicleModel || '',
        vehicle_year: formData.vehicleYear || '',
        vehicle_license_plate: formData.licensePlate || '',
        vehicle_vin: formData.vin || '',
        vehicle_mileage: formData.mileage || '',
        
        // Customer information - always send, use empty string if not provided
        customer_name: formData.customerName || '',
        customer_phone_number: formData.customerPhone || '',
        customer_email_address: formData.customerEmail || '',
        
        // Job information - always send, use undefined/empty for optional fields
        job_type_id: jobTypeId,
        job_priority: formData.priority ? parseInt(formData.priority) : undefined,
        job_estimated_hours: formData.estimatedHours || '',
        job_estimated_cost: formData.estimatedCost || '',
        job_description: formData.description || '',
        job_service_type: serviceTypeId,
        
        // Assignment - always send
        garage_id: garageId,
        mechanic_id: mechanicId,
        
        // Status and additional fields - always send
        status: 1,
        timer: '00:00:00', // Default timer value
        extra_data: '', // Default empty
        
        // Parts data - always send arrays, even if empty
        part_name: formData.parts.length > 0 ? formData.parts.map(part => part.name) : [],
        part_count: formData.parts.length > 0 ? formData.parts.map(part => part.quantity) : [],
        part_number: formData.parts.length > 0 ? formData.parts.map(() => '') : [], // Empty string for each part
        part_description: formData.parts.length > 0 ? formData.parts.map(() => '') : [], // Empty string for each part
        part_cost_total: formData.parts.length > 0 ? formData.parts.map(part => part.cost.toString()) : [],
      };

      console.log('Calling jobService.create with data:', requestData);
      const response = await jobService.create(requestData);
      console.log('API Response:', response);

      if (response.status === 1) {
        toast.success(response.message || 'Job created successfully');
        navigate('/admin/jobs');
      } else {
        toast.error(response.message || 'Failed to create job');
      }
    } catch (error: any) {
      console.error('Error creating job:', error);
      const errorMessage = error?.response?.data?.message || 'Failed to create job';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case '1':
        return <Badge variant="outline" className="text-green-600 border-green-600">Low</Badge>;
      case '2':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Medium</Badge>;
      case '3':
        return <Badge variant="outline" className="text-red-600 border-red-600">High</Badge>;
      default:
        return <Badge variant="outline">Medium</Badge>;
    }
  };

  return (
    <Fragment>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Create New Job</h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Add a new service job to the system</p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/admin/jobs')}
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Jobs
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="xl:col-span-2 space-y-6">
              {/* Vehicle Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="h-5 w-5" />
                    Vehicle Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="vehicleMake">Make *</Label>
                      <Input
                        id="vehicleMake"
                        value={formData.vehicleMake}
                        onChange={(e) => handleInputChange('vehicleMake', e.target.value)}
                        placeholder="Toyota, Honda, Ford..."
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vehicleModel">Model *</Label>
                      <Input
                        id="vehicleModel"
                        value={formData.vehicleModel}
                        onChange={(e) => handleInputChange('vehicleModel', e.target.value)}
                        placeholder="Camry, Civic, F-150..."
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vehicleYear">Year *</Label>
                      <Input
                        id="vehicleYear"
                        value={formData.vehicleYear}
                        onChange={(e) => handleInputChange('vehicleYear', e.target.value)}
                        placeholder="2020"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="licensePlate">License Plate *</Label>
                      <Input
                        id="licensePlate"
                        value={formData.licensePlate}
                        onChange={(e) => handleInputChange('licensePlate', e.target.value)}
                        placeholder="ABC-1234"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vin">VIN</Label>
                      <Input
                        id="vin"
                        value={formData.vin}
                        onChange={(e) => handleInputChange('vin', e.target.value)}
                        placeholder="1HGBH41JXMN109186"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mileage">Mileage</Label>
                      <Input
                        id="mileage"
                        value={formData.mileage}
                        onChange={(e) => handleInputChange('mileage', e.target.value)}
                        placeholder="50000"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="customerName">Customer Name *</Label>
                      <Input
                        id="customerName"
                        value={formData.customerName}
                        onChange={(e) => handleInputChange('customerName', e.target.value)}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customerPhone">Phone Number *</Label>
                      <Input
                        id="customerPhone"
                        value={formData.customerPhone}
                        onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                        placeholder="(555) 123-4567"
                        required
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="customerEmail">Email</Label>
                      <Input
                        id="customerEmail"
                        type="email"
                        value={formData.customerEmail}
                        onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                        placeholder="john.doe@example.com"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Job Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wrench className="h-5 w-5" />
                    Job Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="jobType">Job Type *</Label>
                      <Select 
                        value={formData.jobType} 
                        onValueChange={(value) => handleInputChange('jobType', value)}
                        disabled={isLoadingJobTypes}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={isLoadingJobTypes ? "Loading..." : "Select job type"} />
                        </SelectTrigger>
                        <SelectContent>
                          {jobTypes.map((type) => (
                            <SelectItem key={type.job_type_id} value={type.job_type_id.toString()}>
                              {type.job_type_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Low</SelectItem>
                          <SelectItem value="2">Medium</SelectItem>
                          <SelectItem value="3">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="estimatedHours">Estimated Hours</Label>
                      <Input
                        id="estimatedHours"
                        value={formData.estimatedHours}
                        onChange={(e) => handleInputChange('estimatedHours', e.target.value)}
                        placeholder="2.5"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="estimatedCost">Estimated Cost</Label>
                      <Input
                        id="estimatedCost"
                        value={formData.estimatedCost}
                        onChange={(e) => handleInputChange('estimatedCost', e.target.value)}
                        placeholder="150.00"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Job Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Describe the work to be performed..."
                      rows={4}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Services */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Services
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Select 
                      value={newService} 
                      onValueChange={setNewService}
                      disabled={isLoadingServiceTypes}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder={isLoadingServiceTypes ? "Loading..." : "Select service"} />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceTypes.map((service) => (
                          <SelectItem key={service.service_type_id} value={service.service_type_id.toString()}>
                            {service.service_type_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button type="button" onClick={handleAddService} disabled={!newService}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {formData.services.length > 0 && (
                    <div className="space-y-2">
                      <Label>Selected Services</Label>
                      <div className="flex flex-wrap gap-2">
                        {formData.services.map((serviceId) => {
                          const service = serviceTypes.find(s => s.service_type_id.toString() === serviceId);
                          return (
                            <Badge key={serviceId} variant="outline" className="flex items-center gap-1">
                              {service?.service_type_name || serviceId}
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveService(serviceId)}
                                className="h-4 w-4 p-0 hover:bg-transparent"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Parts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wrench className="h-5 w-5" />
                    Parts Required
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="partName" className="text-sm">Part Name</Label>
                      <Input
                        id="partName"
                        placeholder="Part name"
                        value={newPart.name}
                        onChange={(e) => setNewPart(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="partQuantity" className="text-sm">Part Quantity</Label>
                      <Input
                        id="partQuantity"
                        type="number"
                        placeholder="Quantity"
                        value={newPart.quantity}
                        onChange={(e) => setNewPart(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="partCost" className="text-sm">Part Cost</Label>
                      <div className="flex gap-2">
                        <Input
                          id="partCost"
                          type="number"
                          placeholder="Cost"
                          value={newPart.cost}
                          onChange={(e) => setNewPart(prev => ({ ...prev, cost: parseFloat(e.target.value) || 0 }))}
                        />
                        <Button type="button" onClick={handleAddPart} disabled={!newPart.name}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {formData.parts.length > 0 && (
                    <div className="space-y-2">
                      <Label>Parts List</Label>
                      <div className="space-y-2">
                        {formData.parts.map((part, index) => (
                          <div key={index} className="flex items-center justify-between p-2 border rounded">
                            <div className="flex-1">
                              <span className="font-medium">{part.name}</span>
                              <span className="text-sm text-gray-500 ml-2">
                                Qty: {part.quantity} | Cost: ${part.cost.toFixed(2)}
                              </span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemovePart(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Assignment */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Assignment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="assignedGarage">Garage *</Label>
                    <Select 
                      value={formData.assignedGarage} 
                      onValueChange={(value) => handleInputChange('assignedGarage', value)}
                      disabled={isLoadingGarages}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingGarages ? "Loading..." : "Select garage"} />
                      </SelectTrigger>
                      <SelectContent>
                        {garages.map((garage) => (
                          <SelectItem key={garage.garage_id} value={garage.garage_id.toString()}>
                            {garage.garage_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assignedMechanic">Mechanic</Label>
                    <Select 
                      value={formData.assignedMechanic} 
                      onValueChange={(value) => handleInputChange('assignedMechanic', value)}
                      disabled={isLoadingMechanics}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingMechanics ? "Loading..." : "Select mechanic"} />
                      </SelectTrigger>
                      <SelectContent>
                        {mechanics.map((mechanic) => (
                          <SelectItem key={mechanic.user_id} value={mechanic.user_id.toString()}>
                            {mechanic.first_name} {mechanic.last_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Job Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Job Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Priority:</span>
                    {getPriorityBadge(formData.priority)}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Services:</span>
                    <span className="text-sm font-medium">{formData.services.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Parts:</span>
                    <span className="text-sm font-medium">{formData.parts.length}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Est. Hours:</span>
                    <span className="text-sm font-medium">{formData.estimatedHours || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Est. Cost:</span>
                    <span className="text-sm font-medium">${formData.estimatedCost || '0.00'}</span>
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
              onClick={() => navigate('/admin/jobs')}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex items-center gap-2" disabled={isSubmitting}>
              <Save className="h-4 w-4" />
              {isSubmitting ? 'Creating...' : 'Create Job'}
            </Button>
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export { CreateJobContent };


