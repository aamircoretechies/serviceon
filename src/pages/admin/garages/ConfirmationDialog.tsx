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
      <DialogContent className="sm:max-w-lg bg-white dark:bg-gray-800">
        <DialogHeader className="space-y-0">
          {/* Close button */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            disabled={isLoading}
          >
            <X className="h-5 w-5" />
          </button>

          {/* Title with icon - positioned above content */}
          <div className="flex items-center gap-4 mb-6 pr-8">
            <div className="h-12 w-12 rounded-full bg-red-50 dark:bg-red-500/20 flex items-center justify-center flex-shrink-0">
              <Trash2 className="h-6 w-6 text-red-600 dark:text-red-500" />
            </div>
            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              Delete Garage
            </DialogTitle>
          </div>

          {/* Content */}
          <DialogDescription className="text-gray-700 dark:text-gray-300 space-y-4 pt-2">
            <p className="text-base">
              Are you sure you want to delete <strong className="text-gray-900 dark:text-white font-semibold">{garageName}</strong>?
            </p>
            <p className="text-sm">
              This action cannot be undone and will permanently remove the garage and all associated data including:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-600 dark:text-gray-400 ml-2">
              <li>All service records</li>
              <li>Customer data</li>
              <li>User assignments</li>
              <li>Branding settings</li>
            </ul>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-row gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="flex-1 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
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

