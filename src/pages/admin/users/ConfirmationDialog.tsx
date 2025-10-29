import { Fragment } from 'react';
import { AlertTriangle, Trash2, UserX, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'delete' | 'disable' | 'enable';
  userName: string;
  onConfirm: () => void;
  isLoading?: boolean;
}

const ConfirmationDialog = ({ 
  open, 
  onOpenChange, 
  type, 
  userName, 
  onConfirm, 
  isLoading = false 
}: ConfirmationDialogProps) => {
  const getDialogContent = () => {
    switch (type) {
      case 'delete':
        return {
          title: 'Delete User',
          description: `Are you sure you want to delete ${userName}? This action cannot be undone and will permanently remove the user account and all associated data.`,
          icon: <Trash2 className="h-6 w-6 text-red-600" />,
          confirmText: 'Delete User',
          confirmVariant: 'destructive' as const
        };
      case 'disable':
        return {
          title: 'Disable User',
          description: `Are you sure you want to disable ${userName}? The user will no longer be able to access the system until re-enabled.`,
          icon: <UserX className="h-6 w-6 text-orange-600" />,
          confirmText: 'Disable User',
          confirmVariant: 'destructive' as const
        };
      case 'enable':
        return {
          title: 'Enable User',
          description: `Are you sure you want to enable ${userName}? The user will regain access to the system.`,
          icon: <UserCheck className="h-6 w-6 text-green-600" />,
          confirmText: 'Enable User',
          confirmVariant: 'default' as const
        };
      default:
        return {
          title: 'Confirm Action',
          description: 'Are you sure you want to proceed?',
          icon: <AlertTriangle className="h-6 w-6 text-yellow-600" />,
          confirmText: 'Confirm',
          confirmVariant: 'default' as const
        };
    }
  };

  const content = getDialogContent();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {content.icon}
            <DialogTitle>{content.title}</DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            {content.description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            variant={content.confirmVariant}
            onClick={onConfirm}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? 'Processing...' : content.confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { ConfirmationDialog };

