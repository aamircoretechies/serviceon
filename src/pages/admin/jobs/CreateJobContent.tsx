import { Fragment, useState } from 'react';
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
    priority: 'medium',
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

  // Mock data - replace with actual data
  const garages = [
    { id: '1', name: 'Downtown Auto Service' },
    { id: '2', name: 'Westside Garage' },
    { id: '3', name: 'North Point Motors' },
    { id: '4', name: 'Central Auto' },
    { id: '5', name: 'Eastside Garage' }
  ];

  const mechanics = [
    { id: '1', name: 'Mike Wilson' },
    { id: '2', name: 'Sarah Johnson' },
    { id: '3', name: 'David Lee' },
    { id: '4', name: 'Lisa Chen' }
  ];

  const jobTypes = [
    'Oil Change',
    'Brake Service',
    'Engine Repair',
    'Transmission Service',
    'Tire Service',
    'Electrical Repair',
    'AC Service',
    'General Maintenance',
    'Diagnostic',
    'Other'
  ];

  const serviceOptions = [
    'Oil Change',
    'Filter Replacement',
    'Brake Inspection',
    'Tire Rotation',
    'Battery Check',
    'Fluid Top-up',
    'Diagnostic Scan',
    'Safety Inspection'
  ];

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Creating job:', formData);
    // Navigate back to jobs list
    navigate('/admin/jobs');
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'low':
        return <Badge variant="outline" className="text-green-600 border-green-600">Low</Badge>;
      case 'medium':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Medium</Badge>;
      case 'high':
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
                      <Select value={formData.jobType} onValueChange={(value) => handleInputChange('jobType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select job type" />
                        </SelectTrigger>
                        <SelectContent>
                          {jobTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
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
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
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
                    <Select value={newService} onValueChange={setNewService}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select service" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceOptions.map((service) => (
                          <SelectItem key={service} value={service}>
                            {service}
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
                        {formData.services.map((service) => (
                          <Badge key={service} variant="outline" className="flex items-center gap-1">
                            {service}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveService(service)}
                              className="h-4 w-4 p-0 hover:bg-transparent"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
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
                    <Input
                      placeholder="Part name"
                      value={newPart.name}
                      onChange={(e) => setNewPart(prev => ({ ...prev, name: e.target.value }))}
                    />
                    <Input
                      type="number"
                      placeholder="Quantity"
                      value={newPart.quantity}
                      onChange={(e) => setNewPart(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                    />
                    <div className="flex gap-2">
                      <Input
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
                    <Select value={formData.assignedGarage} onValueChange={(value) => handleInputChange('assignedGarage', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select garage" />
                      </SelectTrigger>
                      <SelectContent>
                        {garages.map((garage) => (
                          <SelectItem key={garage.id} value={garage.id}>
                            {garage.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assignedMechanic">Mechanic</Label>
                    <Select value={formData.assignedMechanic} onValueChange={(value) => handleInputChange('assignedMechanic', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select mechanic" />
                      </SelectTrigger>
                      <SelectContent>
                        {mechanics.map((mechanic) => (
                          <SelectItem key={mechanic.id} value={mechanic.id}>
                            {mechanic.name}
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
            <Button type="submit" className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Create Job
            </Button>
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export { CreateJobContent };


