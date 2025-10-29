import { Fragment } from 'react';
import { Shield, User, UserCheck, Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface RolePermissions {
  [role: string]: {
    [permission: string]: boolean;
  };
}

const RolePermissionsMatrix = () => {
  const permissions: Permission[] = [
    // User Management
    { id: 'users.view', name: 'View Users', description: 'View user list and details', category: 'User Management' },
    { id: 'users.create', name: 'Create Users', description: 'Add new users to the system', category: 'User Management' },
    { id: 'users.edit', name: 'Edit Users', description: 'Modify user information and settings', category: 'User Management' },
    { id: 'users.delete', name: 'Delete Users', description: 'Remove users from the system', category: 'User Management' },
    
    // Service Management
    { id: 'services.view', name: 'View Services', description: 'View service records and history', category: 'Service Management' },
    { id: 'services.create', name: 'Create Services', description: 'Add new service records', category: 'Service Management' },
    { id: 'services.edit', name: 'Edit Services', description: 'Modify service information', category: 'Service Management' },
    { id: 'services.complete', name: 'Complete Services', description: 'Mark services as completed', category: 'Service Management' },
    
    // Vehicle Management
    { id: 'vehicles.view', name: 'View Vehicles', description: 'View vehicle information and history', category: 'Vehicle Management' },
    { id: 'vehicles.create', name: 'Add Vehicles', description: 'Add new vehicles to the system', category: 'Vehicle Management' },
    { id: 'vehicles.edit', name: 'Edit Vehicles', description: 'Modify vehicle information', category: 'Vehicle Management' },
    
    // Garage Management
    { id: 'garages.view', name: 'View Garages', description: 'View garage information', category: 'Garage Management' },
    { id: 'garages.manage', name: 'Manage Garages', description: 'Create and modify garage settings', category: 'Garage Management' },
    
    // Reports & Analytics
    { id: 'reports.view', name: 'View Reports', description: 'Access reports and analytics', category: 'Reports & Analytics' },
    { id: 'reports.export', name: 'Export Data', description: 'Export reports and data', category: 'Reports & Analytics' },
    
    // System Settings
    { id: 'settings.view', name: 'View Settings', description: 'View system configuration', category: 'System Settings' },
    { id: 'settings.manage', name: 'Manage Settings', description: 'Modify system configuration', category: 'System Settings' },
    
    // Customer Portal
    { id: 'customer.view', name: 'View Own Data', description: 'View personal service history', category: 'Customer Portal' },
    { id: 'customer.book', name: 'Book Services', description: 'Schedule new service appointments', category: 'Customer Portal' }
  ];

  const rolePermissions: RolePermissions = {
    admin: {
      'users.view': true,
      'users.create': true,
      'users.edit': true,
      'users.delete': true,
      'services.view': true,
      'services.create': true,
      'services.edit': true,
      'services.complete': true,
      'vehicles.view': true,
      'vehicles.create': true,
      'vehicles.edit': true,
      'garages.view': true,
      'garages.manage': true,
      'reports.view': true,
      'reports.export': true,
      'settings.view': true,
      'settings.manage': true,
      'customer.view': true,
      'customer.book': true
    },
    mechanic: {
      'users.view': false,
      'users.create': false,
      'users.edit': false,
      'users.delete': false,
      'services.view': true,
      'services.create': true,
      'services.edit': true,
      'services.complete': true,
      'vehicles.view': true,
      'vehicles.create': true,
      'vehicles.edit': true,
      'garages.view': true,
      'garages.manage': false,
      'reports.view': true,
      'reports.export': false,
      'settings.view': false,
      'settings.manage': false,
      'customer.view': false,
      'customer.book': false
    },
    customer: {
      'users.view': false,
      'users.create': false,
      'users.edit': false,
      'users.delete': false,
      'services.view': false,
      'services.create': false,
      'services.edit': false,
      'services.complete': false,
      'vehicles.view': false,
      'vehicles.create': false,
      'vehicles.edit': false,
      'garages.view': false,
      'garages.manage': false,
      'reports.view': false,
      'reports.export': false,
      'settings.view': false,
      'settings.manage': false,
      'customer.view': true,
      'customer.book': true
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4 text-red-600" />;
      case 'mechanic':
        return <User className="h-4 w-4 text-blue-600" />;
      case 'customer':
        return <UserCheck className="h-4 w-4 text-green-600" />;
      default:
        return <User className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Admin</Badge>;
      case 'mechanic':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Mechanic</Badge>;
      case 'customer':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Customer</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const roles = ['admin', 'mechanic', 'customer'];
  const categories = [...new Set(permissions.map(p => p.category))];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Role Permissions Matrix
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          View-only permissions matrix showing what each role can access
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Role Headers */}
          <div className="flex items-center gap-4">
            <div className="w-48 font-medium text-sm text-gray-500">Permission</div>
            {roles.map(role => (
              <div key={role} className="flex-1 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {getRoleIcon(role)}
                  {getRoleBadge(role)}
                </div>
              </div>
            ))}
          </div>

          {/* Permissions by Category */}
          {categories.map(category => (
            <div key={category} className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-white text-sm">{category}</h4>
              <div className="space-y-1">
                {permissions
                  .filter(p => p.category === category)
                  .map(permission => (
                    <div key={permission.id} className="flex items-center gap-4 py-2 px-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="w-48">
                        <div className="font-medium text-sm">{permission.name}</div>
                        <div className="text-xs text-gray-500">{permission.description}</div>
                      </div>
                      {roles.map(role => (
                        <div key={role} className="flex-1 text-center">
                          {rolePermissions[role][permission.id] ? (
                            <Check className="h-4 w-4 text-green-600 mx-auto" />
                          ) : (
                            <X className="h-4 w-4 text-gray-400 mx-auto" />
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
              </div>
            </div>
          ))}

          {/* Legend */}
          <div className="pt-4 border-t">
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span>Has Permission</span>
              </div>
              <div className="flex items-center gap-2">
                <X className="h-4 w-4 text-gray-400" />
                <span>No Permission</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { RolePermissionsMatrix };

