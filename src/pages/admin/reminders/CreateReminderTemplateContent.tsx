import { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Calendar, Users, Send, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { DateTimePicker } from '@/components/ui/date-time-picker';

const CreateReminderTemplateContent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    type: 'Service',
    frequency: 'monthly',
    targetAudience: [] as string[],
    scheduledDate: '',
    scheduledTime: '',
    isActive: true,
    testMode: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTargetAudienceChange = (audience: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      targetAudience: checked 
        ? [...prev.targetAudience, audience]
        : prev.targetAudience.filter(a => a !== audience)
    }));
  };

  const handleTestPush = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Test push sent:', formData);
      // Show success toast
    } catch (error) {
      console.error('Test push failed:', error);
      // Show error toast
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Creating template:', formData);
      navigate('/admin/reminders/templates');
    } catch (error) {
      console.error('Template creation failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const frequencyOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Every 3 months' },
    { value: 'biannually', label: 'Every 6 months' },
    { value: 'annually', label: 'Annually' },
    { value: 'custom', label: 'Custom' }
  ];

  const typeOptions = [
    { value: 'Service', label: 'Service Reminder' },
    { value: 'Oil Change', label: 'Oil Change' },
    { value: 'Promotion', label: 'Promotion' },
    { value: 'Maintenance', label: 'Maintenance' },
    { value: 'Inspection', label: 'Inspection' }
  ];

  const targetAudienceOptions = [
    'All Customers',
    'Premium Members',
    'VIP Members',
    'New Customers',
    'Returning Customers',
    'High-Value Customers',
    'Inactive Customers'
  ];

  return (
    <Fragment>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/admin/reminders/templates')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Templates
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Reminder Template</h1>
            <p className="text-gray-600 dark:text-gray-400">Create a new reminder template with scheduling and targeting options</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Template Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Template Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="e.g., Service Reminder - 3 Months"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Type *</Label>
                      <Select 
                        value={formData.type} 
                        onValueChange={(value) => handleInputChange('type', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {typeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="body">Message Body *</Label>
                    <Textarea
                      id="body"
                      value={formData.body}
                      onChange={(e) => handleInputChange('body', e.target.value)}
                      placeholder="Enter your reminder message here..."
                      rows={4}
                      required
                    />
                    <p className="text-xs text-gray-500">
                      Use placeholders like {`{customer_name}`}, {`{service_date}`}, {`{vehicle_make}`} for personalization
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Scheduling */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Scheduling
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="frequency">Frequency *</Label>
                      <Select 
                        value={formData.frequency} 
                        onValueChange={(value) => handleInputChange('frequency', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {frequencyOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="scheduledTime">Preferred Time</Label>
                      <Input
                        id="scheduledTime"
                        type="time"
                        value={formData.scheduledTime}
                        onChange={(e) => handleInputChange('scheduledTime', e.target.value)}
                      />
                    </div>
                  </div>

                  {formData.frequency === 'custom' && (
                    <div className="space-y-2">
                      <Label htmlFor="customFrequency">Custom Frequency (days)</Label>
                      <Input
                        id="customFrequency"
                        type="number"
                        placeholder="e.g., 45"
                        min="1"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="scheduledDate">Next Send Date</Label>
                    <Input
                      id="scheduledDate"
                      type="date"
                      value={formData.scheduledDate}
                      onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Target Audience */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Target Audience
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {targetAudienceOptions.map((audience) => (
                      <div key={audience} className="flex items-center space-x-2">
                        <Checkbox
                          id={audience}
                          checked={formData.targetAudience.includes(audience)}
                          onCheckedChange={(checked) => 
                            handleTargetAudienceChange(audience, checked as boolean)
                          }
                        />
                        <Label htmlFor={audience} className="text-sm font-normal">
                          {audience}
                        </Label>
                      </div>
                    ))}
                  </div>
                  
                  {formData.targetAudience.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.targetAudience.map((audience) => (
                        <Badge key={audience} variant="secondary">
                          {audience}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Template Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Template Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <Bell className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">
                          {formData.title || 'Template Title'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formData.type || 'Type'} • {formData.frequency || 'Frequency'}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {formData.body || 'Your message will appear here...'}
                    </p>
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>Next send: {formData.scheduledDate || 'Not scheduled'}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="isActive">Active Status</Label>
                      <p className="text-sm text-gray-500">Enable this template</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        id="isActive"
                        checked={formData.isActive}
                        onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                      />
                      <Badge variant={formData.isActive ? 'default' : 'secondary'}>
                        {formData.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="testMode">Test Mode</Label>
                      <p className="text-sm text-gray-500">Send test notifications</p>
                    </div>
                    <Switch
                      id="testMode"
                      checked={formData.testMode}
                      onCheckedChange={(checked) => handleInputChange('testMode', checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Test Push */}
              <Card>
                <CardHeader>
                  <CardTitle>Test Push Notification</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Send a test push notification to verify your template works correctly.
                    </p>
                    <Button 
                      type="button"
                      variant="outline" 
                      className="w-full flex items-center gap-2"
                      onClick={handleTestPush}
                      disabled={isSubmitting || !formData.title || !formData.body}
                    >
                      <Send className="h-4 w-4" />
                      {isSubmitting ? 'Sending...' : 'Test Push'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/admin/reminders/templates')}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !formData.title || !formData.body}
            >
              {isSubmitting ? 'Creating...' : 'Create Template'}
            </Button>
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export { CreateReminderTemplateContent };

