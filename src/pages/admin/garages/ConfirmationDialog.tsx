import { Fragment } from 'react';
import { AlertTriangle, Trash2, Building2 } from 'lucide-react';
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
  garageName: string;
  onConfirm: () => void;
  isLoading?: boolean;
}

const ConfirmationDialog = ({ 
  open, 
  onOpenChange, 
  garageName, 
  onConfirm, 
  isLoading = false 
}: ConfirmationDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Trash2 className="h-6 w-6 text-red-600" />
            <DialogTitle>Delete Garage</DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            Are you sure you want to delete <strong>{garageName}</strong>? This action cannot be undone and will permanently remove the garage and all associated data including:
            <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
              <li>All service records</li>
              <li>Customer data</li>
              <li>User assignments</li>
              <li>Branding settings</li>
            </ul>
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
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? 'Deleting...' : 'Delete Garage'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { ConfirmationDialog };

