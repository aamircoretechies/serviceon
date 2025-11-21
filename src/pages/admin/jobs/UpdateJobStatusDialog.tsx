import { Fragment, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface UpdateJobStatusDialogProps {
  job: any;
  open: boolean;
  onClose: () => void;
  onUpdate: (jobId: number, status: number) => void;
}

const UpdateJobStatusDialog = ({ job, open, onClose, onUpdate }: UpdateJobStatusDialogProps) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  if (!open || !job) return null;

  const statusOptions = [
    { value: '1', label: 'Complete' },
    { value: '2', label: 'Pending' },
    { value: '3', label: 'In Progress' },
    { value: '4', label: 'On Hold' },
    { value: '5', label: 'Cancelled' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case '1':
        return <Badge className="bg-green-100 text-green-800 border-green-300 dark:bg-green-950/50 dark:text-green-300 dark:border-green-700">Complete</Badge>;
      case '2':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-950/50 dark:text-yellow-300 dark:border-yellow-800">Pending</Badge>;
      case '3':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-700">In Progress</Badge>;
      case '4':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-950/50 dark:text-orange-300 dark:border-orange-700">On Hold</Badge>;
      case '5':
        return <Badge className="bg-red-100 text-red-800 border-red-300 dark:bg-red-950/50 dark:text-red-300 dark:border-red-700">Cancelled</Badge>;
      default:
        return null;
    }
  };

  const handleUpdate = () => {
    if (selectedStatus) {
      onUpdate(job.job_id || job.id, parseInt(selectedStatus));
      setSelectedStatus('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md max-h-[90vh] rounded-xl shadow-2xl bg-gray-800 dark:bg-gray-100">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700 dark:border-gray-300">
            <div>
              <h2 className="text-lg font-semibold text-white dark:text-gray-900">
                Update Job Status
              </h2>
              <p className="text-sm text-gray-400 dark:text-gray-600 mt-1">
                Job ID: {job.id || `JOB-${job.job_id}`}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white dark:text-gray-600 dark:hover:text-gray-900"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-300 dark:text-gray-700 mb-2 block">
                  Select Status
                </label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full bg-gray-700 dark:bg-gray-200 border-gray-600 dark:border-gray-300 text-white dark:text-gray-900">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedStatus && (
                <div className="p-4 bg-gray-700/50 dark:bg-gray-200/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-300 dark:text-gray-700">Selected Status:</span>
                    {getStatusBadge(selectedStatus)}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-700 dark:border-gray-300">
            <Button
              variant="outline"
              onClick={onClose}
              className="text-gray-300 dark:text-gray-700 border-gray-600 dark:border-gray-300 hover:bg-gray-700 dark:hover:bg-gray-200"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={!selectedStatus}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Update Status
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { UpdateJobStatusDialog };

