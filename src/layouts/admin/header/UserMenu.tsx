import { useState } from 'react';
import { LogOut, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    // Implement logout logic
    console.log('Logout clicked');
  };

  const handleProfile = () => {
    // Navigate to profile
    console.log('Profile clicked');
  };

  const handleSettings = () => {
    // Navigate to settings
    console.log('Settings clicked');
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 p-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/media/avatars/300-1.png" alt="Admin" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
          <div className="hidden md:block text-left">
            <div className="text-sm font-medium">Admin User</div>
            <div className="text-xs text-gray-500">admin@serviceon.com</div>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={handleProfile} className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSettings} className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-red-600">
          <LogOut className="h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { UserMenu };




