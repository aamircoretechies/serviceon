import { Fragment, useState } from 'react';
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

const UsersListContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
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
  const [showPermissionsMatrix, setShowPermissionsMatrix] = useState(false);

  // Mock data - replace with actual data
  const users = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@serviceon.com',
      phone: '(555) 123-4567',
      role: 'admin',
      status: 'active',
      lastLogin: '2024-01-20 10:30 AM',
      createdAt: '2024-01-15',
      avatar: '/media/avatars/300-1.png'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@serviceon.com',
      phone: '(555) 234-5678',
      role: 'mechanic',
      status: 'active',
      lastLogin: '2024-01-19 2:15 PM',
      createdAt: '2024-01-10',
      avatar: '/media/avatars/300-2.png'
    },
    {
      id: 3,
      name: 'Mike Wilson',
      email: 'mike.wilson@serviceon.com',
      phone: '(555) 345-6789',
      role: 'mechanic',
      status: 'inactive',
      lastLogin: '2024-01-15 9:45 AM',
      createdAt: '2024-01-08',
      avatar: '/media/avatars/300-3.png'
    },
    {
      id: 4,
      name: 'Lisa Brown',
      email: 'lisa.brown@serviceon.com',
      phone: '(555) 456-7890',
      role: 'customer',
      status: 'active',
      lastLogin: '2024-01-18 4:20 PM',
      createdAt: '2024-01-12',
      avatar: '/media/avatars/300-4.png'
    }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

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
                <Select value={roleFilter} onValueChange={setRoleFilter}>
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
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  More Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Users ({filteredUsers.length})</CardTitle>
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
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
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
