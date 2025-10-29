import { Fragment, useState } from 'react';
import { X, MessageSquare, Eye, EyeOff, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

interface AddNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicleId: number;
}

const AddNoteDialog = ({ open, onOpenChange, vehicleId }: AddNoteDialogProps) => {
  const [formData, setFormData] = useState({
    jobSummary: '',
    adminNotes: '',
    visibility: 'shared',
    isUrgent: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Adding note:', { vehicleId, ...formData });
      // Reset form
      setFormData({
        jobSummary: '',
        adminNotes: '',
        visibility: 'shared',
        isUrgent: false
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to add note:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getVisibilityBadge = (visibility: string) => {
    switch (visibility) {
      case 'shared':
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 flex items-center gap-1">
            <Eye className="h-3 w-3" />
            Shared
          </Badge>
        );
      case 'staff-only':
        return (
          <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 flex items-center gap-1">
            <EyeOff className="h-3 w-3" />
            Staff Only
          </Badge>
        );
      default:
        return <Badge variant="outline">{visibility}</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Add Admin Note
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Job Summary */}
            <div className="space-y-2">
              <Label htmlFor="jobSummary">Job Summary *</Label>
              <Input
                id="jobSummary"
                value={formData.jobSummary}
                onChange={(e) => handleInputChange('jobSummary', e.target.value)}
                placeholder="e.g., Oil Change & Tire Rotation"
                required
              />
            </div>

            {/* Admin Notes */}
            <div className="space-y-2">
              <Label htmlFor="adminNotes">Admin Notes *</Label>
              <Textarea
                id="adminNotes"
                value={formData.adminNotes}
                onChange={(e) => handleInputChange('adminNotes', e.target.value)}
                placeholder="Enter detailed notes about the service, observations, recommendations, etc..."
                rows={6}
                required
              />
              <p className="text-xs text-gray-500">
                Use this space to record important observations, customer feedback, or recommendations for future service.
              </p>
            </div>

            {/* Visibility and Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="visibility">Visibility</Label>
                <Select 
                  value={formData.visibility} 
                  onValueChange={(value) => handleInputChange('visibility', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shared">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Shared (Visible to customer)
                      </div>
                    </SelectItem>
                    <SelectItem value="staff-only">
                      <div className="flex items-center gap-2">
                        <EyeOff className="h-4 w-4" />
                        Staff Only (Internal notes)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2">
                  {getVisibilityBadge(formData.visibility)}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="isUrgent">Priority</Label>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium text-sm">Mark as Urgent</div>
                    <div className="text-xs text-gray-500">High priority note</div>
                  </div>
                  <Switch
                    id="isUrgent"
                    checked={formData.isUrgent}
                    onCheckedChange={(checked) => handleInputChange('isUrgent', checked)}
                  />
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-sm">{formData.jobSummary || 'Job Summary'}</div>
                  <div className="flex items-center gap-2">
                    {getVisibilityBadge(formData.visibility)}
                    {formData.isUrgent && (
                      <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                        Urgent
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {formData.adminNotes || 'Your notes will appear here...'}
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Added by Admin • {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !formData.jobSummary || !formData.adminNotes}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? 'Adding...' : 'Add Note'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { AddNoteDialog };

