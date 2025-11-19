import { Fragment } from 'react';
import { X, Trash2 } from 'lucide-react';
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
      <DialogContent className="sm:max-w-md bg-gray-800 border-gray-700 text-white">
        <DialogHeader className="space-y-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <Trash2 className="h-5 w-5 text-red-500" />
              </div>
              <DialogTitle className="text-white text-xl font-semibold">Delete Garage</DialogTitle>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="text-gray-400 hover:text-white transition-colors"
              disabled={isLoading}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <DialogDescription className="text-gray-300 pt-2 space-y-3">
            <p>
              Are you sure you want to delete <strong className="text-white font-semibold">{garageName}</strong>?
            </p>
            <p className="text-sm">
              This action cannot be undone and will permanently remove the garage and all associated data including:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-300 ml-2">
              <li>All service records</li>
              <li>Customer data</li>
              <li>User assignments</li>
              <li>Branding settings</li>
            </ul>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-row gap-3 mt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="flex-1 bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
          >
            {isLoading ? 'Deleting...' : 'Delete Garage'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { ConfirmationDialog };

