import { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, Shield, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Checkbox } from '@/components/ui/checkbox';

const CreateUserContent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'mechanic',
    status: 'active',
    assignedGarages: [] as string[],
    sendWelcomeEmail: true,
    requirePasswordChange: false
  });

  // Mock garages - replace with actual data
  const availableGarages = [
    { id: '1', name: 'Downtown Auto Service' },
    { id: '2', name: 'Westside Garage' },
    { id: '3', name: 'North Point Motors' },
    { id: '4', name: 'East End Auto' }
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGarageToggle = (garageId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      assignedGarages: checked 
        ? [...prev.assignedGarages, garageId]
        : prev.assignedGarages.filter(id => id !== garageId)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating user:', formData);
    // Implement user creation logic
    navigate('/admin/users');
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Full access to all system features and settings';
      case 'mechanic':
        return 'Access to service management and customer tools';
      case 'customer':
        return 'Limited access to view their own service history';
      default:
        return '';
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
            onClick={() => navigate('/admin/users')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Users
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New User</h1>
            <p className="text-gray-600 dark:text-gray-400">Create a new user account</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        placeholder="Enter first name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        placeholder="Enter last name"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="user@serviceon.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Role & Permissions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Role & Permissions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">User Role *</Label>
                    <Select 
                      value={formData.role} 
                      onValueChange={(value) => handleInputChange('role', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-red-600" />
                            Admin
                          </div>
                        </SelectItem>
                        <SelectItem value="mechanic">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-blue-600" />
                            Mechanic
                          </div>
                        </SelectItem>
                        <SelectItem value="customer">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-green-600" />
                            Customer
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-500">
                      {getRoleDescription(formData.role)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Account Status</Label>
                      <p className="text-sm text-gray-500">Enable or disable this account</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
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

              {/* Garage Assignment */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Garage Assignment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Select which garages this user can access:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {availableGarages.map((garage) => (
                        <div key={garage.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`garage-${garage.id}`}
                            checked={formData.assignedGarages.includes(garage.id)}
                            onCheckedChange={(checked) => 
                              handleGarageToggle(garage.id, checked as boolean)
                            }
                          />
                          <Label 
                            htmlFor={`garage-${garage.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {garage.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {formData.assignedGarages.length === 0 && (
                      <p className="text-sm text-yellow-600">
                        ⚠️ User must be assigned to at least one garage
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Account Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Send Welcome Email</Label>
                      <p className="text-sm text-gray-500">Send login credentials via email</p>
                    </div>
                    <Switch
                      checked={formData.sendWelcomeEmail}
                      onCheckedChange={(checked) => handleInputChange('sendWelcomeEmail', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Require Password Change</Label>
                      <p className="text-sm text-gray-500">User must change password on first login</p>
                    </div>
                    <Switch
                      checked={formData.requirePasswordChange}
                      onCheckedChange={(checked) => handleInputChange('requirePasswordChange', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Summary Panel */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">
                        {formData.firstName} {formData.lastName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{formData.email}</span>
                    </div>
                    {formData.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{formData.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-gray-500" />
                      <Badge variant="outline">{formData.role}</Badge>
                    </div>
                    <div className="pt-2 border-t">
                      <p className="text-sm text-gray-600">Assigned Garages:</p>
                      <div className="mt-1 space-y-1">
                        {formData.assignedGarages.length > 0 ? (
                          formData.assignedGarages.map(garageId => {
                            const garage = availableGarages.find(g => g.id === garageId);
                            return (
                              <div key={garageId} className="text-xs text-gray-500">
                                • {garage?.name}
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-xs text-yellow-600">No garages assigned</div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Next Steps</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600 space-y-2">
                    <p>• User will receive login credentials</p>
                    <p>• Account will be created immediately</p>
                    <p>• User can be assigned to additional garages later</p>
                    <p>• Permissions can be modified after creation</p>
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
              onClick={() => navigate('/admin/users')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={formData.assignedGarages.length === 0}>
              Create User
            </Button>
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export { CreateUserContent };


