import { Fragment, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  User,
  Mail,
  Phone,
  Shield,
  UserCheck,
  UserX,
  ChevronLeft,
  ChevronRight
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
import { ConfirmationDialog } from './ConfirmationDialog';
import { RolePermissionsMatrix } from './RolePermissionsMatrix';
import { toast } from 'sonner';
import { userService } from '@/api/services';
import type { User as UserType } from '@/api/types';

// UI User interface (mapped from API response)
interface UIUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  lastLogin: string;
  createdAt: string;
  avatar: string;
}

const UsersListContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [confirmationDialog, setConfirmationDialog] = useState<{
    open: boolean;
    type: 'delete' | 'disable' | 'enable';
    userId: number;
    userName: string;
  }>({
    open: false,
    type: 'delete',
    userId: 0,
    userName: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [showPermissionsMatrix, setShowPermissionsMatrix] = useState(false);
  const [users, setUsers] = useState<UIUser[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch users from API
  const fetchUsers = useCallback(async () => {
    setIsLoadingUsers(true);
    try {
      // Build params object matching Postman format (form-data)
      const params: any = {
        page: currentPage - 1, // API uses 0-based pagination
        size: itemsPerPage,
      };

      // 1. Search filter: Always send search parameter (as shown in Postman)
      // Send search text when available, empty string when no search
      params.search = debouncedSearchTerm ? debouncedSearchTerm.trim() : '';

      // 2. Status filter: Send status parameter only when not "all"
      // 1 for Enabled (active), 0 for Disabled (inactive)
      // In Postman, unchecked parameters are not sent
      if (statusFilter !== 'all') {
        params.status = statusFilter === 'active' ? 1 : 0;
      }
      // When "all" is selected, don't include status in params (will not be sent)

      // 3. Role filter: Send user_role parameter only when not "all"
      // 1 for Admin, 2 for Technician, 3 for Customer
      // In Postman, unchecked parameters are not sent
      if (roleFilter !== 'all') {
        // Map role string to number: admin=1, mechanic=2, customer=3
        const roleMap: { [key: string]: number } = {
          admin: 1,
          mechanic: 2,
          customer: 3,
        };
        if (roleMap[roleFilter]) {
          params.user_role = roleMap[roleFilter];
        }
      }
      // When "all" is selected, don't include user_role in params (will not be sent)

      // Debug: Log the params being sent to API
      console.log('=== API Request Debug ===');
      console.log('Request Params (will be converted to FormData):', params);
      console.log('Filter States:', {
        searchTerm,
        debouncedSearchTerm,
        roleFilter,
        statusFilter,
        currentPage
      });
      console.log('========================');

      const response = await userService.getAll(params);

      if (response.status === 1 && response.data?.content) {
        // Map role number to string: 1=admin, 2=mechanic, 3=customer
        const roleNumberToString = (roleNum: number): string => {
          switch (roleNum) {
            case 1:
              return 'admin';
            case 2:
              return 'mechanic';
            case 3:
              return 'customer';
            default:
              return 'mechanic';
          }
        };

        // Map API users to UI format
        const mappedUsers: UIUser[] = response.data.content.map((user: UserType) => ({
          id: user.user_id,
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          phone: user.mobile_number || 'N/A',
          role: roleNumberToString(user.user_role || 2), // Default to mechanic if not provided
          status: user.status === 1 ? 'active' : 'inactive',
          lastLogin: user.last_login_updated 
            ? new Date(user.last_login_updated).toLocaleString() 
            : 'Never',
          createdAt: user.created ? new Date(user.created).toLocaleDateString() : 'N/A',
          avatar: user.profile_image || `/media/avatars/300-${(user.user_id % 32) + 1}.png`,
        }));

        setUsers(mappedUsers);
        setTotalUsers(response.data.totalElements);
        setTotalPages(response.data.totalPages);
      } else {
        toast.error('Failed to load users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoadingUsers(false);
    }
  }, [debouncedSearchTerm, roleFilter, statusFilter, currentPage, itemsPerPage]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      // Reset to page 1 when search changes
      setCurrentPage(1);
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset to page 1 when role or status filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [roleFilter, statusFilter]);

  // Fetch users when filters or page change
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalUsers);
  const paginatedUsers = users;

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 sand-hover-badge">Admin</Badge>;
      case 'mechanic':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 sand-hover-badge">Mechanic</Badge>;
      case 'customer':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 sand-hover-badge">Customer</Badge>;
      default:
        return <Badge variant="outline" className="sand-hover-badge">{role}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 sand-hover-badge">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 sand-hover-badge">Inactive</Badge>;
      default:
        return <Badge variant="outline" className="sand-hover-badge">{status}</Badge>;
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

  const handleEdit = (userId: number) => {
    // Navigate to edit user page
    window.location.href = `/admin/users/edit/${userId}`;
  };

  const handleDelete = (userId: number) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setConfirmationDialog({
        open: true,
        type: 'delete',
        userId,
        userName: user.name
      });
    }
  };

  const handleView = (userId: number) => {
    // Navigate to user detail page
    window.location.href = `/admin/users/${userId}`;
  };

  const handleToggleStatus = (userId: number, currentStatus: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setConfirmationDialog({
        open: true,
        type: currentStatus === 'active' ? 'disable' : 'enable',
        userId,
        userName: user.name
      });
    }
  };

  const handleResetPassword = (userId: number) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Password reset email sent successfully');
    }, 1000);
  };

  const handleConfirmAction = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      switch (confirmationDialog.type) {
        case 'delete':
          toast.success('User deleted successfully');
          break;
        case 'disable':
          toast.success('User disabled successfully');
          break;
        case 'enable':
          toast.success('User enabled successfully');
          break;
      }
      
      setConfirmationDialog({ open: false, type: 'delete', userId: 0, userName: '' });
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Fragment>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage user accounts and permissions</p>
          </div>
          <Link to="/admin/users/create">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add User
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
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select 
                  value={roleFilter} 
                  onValueChange={(value) => {
                    console.log('Role filter changed to:', value);
                    setRoleFilter(value);
                  }}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="mechanic">Mechanic</SelectItem>
                    <SelectItem value="customer">Customer</SelectItem>
                  </SelectContent>
                </Select>
                <Select 
                  value={statusFilter} 
                  onValueChange={(value) => {
                    console.log('Status filter changed to:', value);
                    setStatusFilter(value);
                  }}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                {/* More Filters button - commented out as per requirements */}
                {/* <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  More Filters
                </Button> */}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Users ({totalUsers})</CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowPermissionsMatrix(!showPermissionsMatrix)}
              >
                <Shield className="h-4 w-4 mr-2" />
                {showPermissionsMatrix ? 'Hide' : 'Show'} Permissions Matrix
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingUsers ? (
              <div className="text-center py-8 text-gray-500">Loading users...</div>
            ) : paginatedUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No users found</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedUsers.map((user) => (
                    <TableRow key={user.id} className="sand-hover-row">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 sand-hover-avatar">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-gray-500">ID: {user.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3 text-gray-400" />
                            <span className="text-sm">{user.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3 text-gray-400" />
                            <span className="text-sm">{user.phone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getRoleIcon(user.role)}
                          {getRoleBadge(user.role)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(user.status)}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-500">{user.lastLogin}</span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleView(user.id)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(user.id)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleResetPassword(user.id)}>
                              <Shield className="h-4 w-4 mr-2" />
                              Reset Password
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleToggleStatus(user.id, user.status)}
                              className={user.status === 'active' ? 'text-red-600' : 'text-green-600'}
                            >
                              {user.status === 'active' ? (
                                <>
                                  <UserX className="h-4 w-4 mr-2" />
                                  Disable
                                </>
                              ) : (
                                <>
                                  <UserCheck className="h-4 w-4 mr-2" />
                                  Enable
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(user.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing {startIndex + 1} to {endIndex} of {totalUsers} users
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Role Permissions Matrix */}
        {showPermissionsMatrix && (
          <RolePermissionsMatrix />
        )}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={confirmationDialog.open}
        onOpenChange={(open) => setConfirmationDialog(prev => ({ ...prev, open }))}
        type={confirmationDialog.type}
        userName={confirmationDialog.userName}
        onConfirm={handleConfirmAction}
        isLoading={isLoading}
      />
    </Fragment>
  );
};

export { UsersListContent };
