import { Fragment, useState } from 'react';
import { 
  Plus, 
  GripVertical, 
  Trash2, 
  Edit, 
  Eye, 
  CheckSquare,
  Type,
  Hash,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Image, PenTool } from 'lucide-react';

import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';

interface ChecklistItem {
  id: string;
  type: 'text' | 'textarea' | 'number' | 'checkbox' |'photo' | 'signature';
  label: string;
  placeholder?: string;
  required: boolean;
  order: number;
}

const ChecklistConfigContent = () => {
  const [items, setItems] = useState<ChecklistItem[]>([
    {
      id: '1',
      type: 'text',
      label: 'Customer Name',
      placeholder: 'Enter customer name',
      required: true,
      order: 1
    },
    {
      id: '2',
      type: 'text',
      label: 'Vehicle Make',
      placeholder: 'Enter vehicle make',
      required: true,
      order: 2
    },
    {
      id: '3',
      type: 'text',
      label: 'Vehicle Model',
      placeholder: 'Enter vehicle model',
      required: true,
      order: 3
    },
    {
      id: '4',
      type: 'number',
      label: 'Vehicle Year',
      placeholder: 'Enter vehicle year',
      required: true,
      order: 4
    },
    {
      id: '5',
      type: 'textarea',
      label: 'Service Description',
      placeholder: 'Describe the service needed',
      required: false,
      order: 5
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ChecklistItem | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const fieldTypes = [
    { value: 'text', label: 'Short Text', icon: Type },
    { value: 'textarea', label: 'Long Text', icon: Type },
    { value: 'number', label: 'Number', icon: Hash },
    { value: 'checkbox', label: 'Checkbox', icon: CheckSquare },
    { value: 'photo', label: 'Photo Upload', icon: Image },
    { value: 'signature', label: 'Signature', icon: PenTool },

  ];

  const addItem = (newItem: Omit<ChecklistItem, 'id' | 'order'>) => {
    const item: ChecklistItem = {
      ...newItem,
      id: Date.now().toString(),
      order: items.length + 1
    };
    setItems([...items, item]);
    setIsAddDialogOpen(false);
  };

  const updateItem = (id: string, updates: Partial<ChecklistItem>) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
    setEditingItem(null);
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const moveItem = (id: string, direction: 'up' | 'down') => {
    const currentIndex = items.findIndex(item => item.id === id);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= items.length) return;

    const newItems = [...items];
    [newItems[currentIndex], newItems[newIndex]] = [newItems[newIndex], newItems[currentIndex]];
    setItems(newItems);
  };

  const getFieldIcon = (type: string) => {
    const fieldType = fieldTypes.find(ft => ft.value === type);
    return fieldType ? fieldType.icon : Type;
  };

  const renderPreviewField = (item: ChecklistItem) => {
    switch (item.type) {
      case 'text':
        return (
          <Input
            placeholder={item.placeholder}
            disabled
            className="bg-gray-50 dark:bg-gray-800"
          />
        );
      case 'textarea':
        return (
          <Textarea
            placeholder={item.placeholder}
            disabled
            className="bg-gray-50 dark:bg-gray-800"
            rows={3}
          />
        );
      case 'number':
        return (
          <Input
            type="number"
            placeholder={item.placeholder}
            disabled
            className="bg-gray-50 dark:bg-gray-800"
          />
        );
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <input type="checkbox" disabled className="rounded" />
            <span className="text-sm text-gray-500">Check if applicable</span>
          </div>
        );
        case 'photo':
      return (
        <div className="border rounded-lg p-3 bg-gray-50 dark:bg-gray-800 text-gray-500 text-sm">
          [Photo Upload Placeholder]
        </div>
      );
    case 'signature':
      return (
        <div className="border rounded-lg p-3 bg-gray-50 dark:bg-gray-800 text-gray-500 text-sm">
          [Signature Field Placeholder]
        </div>
      );
      default:
        return null;
    }
  };

  return (
    <Fragment>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Intake Checklist Configuration</h1>
            <p className="text-gray-600 dark:text-gray-400">Configure the intake form fields for your garage</p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsPreviewOpen(true)}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Preview
            </Button>
            <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Field
            </Button>
          </div>
        </div>

        {/* Checklist Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5" />
              Checklist Items ({items.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {items.length === 0 ? (
              <div className="text-center py-8">
                <CheckSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No checklist items</h3>
                <p className="text-gray-500 mb-4">Add fields to create your intake checklist</p>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Field
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item, index) => {
                  const FieldIcon = getFieldIcon(item.type);
                  return (
                    <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                        <span className="text-sm text-gray-500">{index + 1}</span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <FieldIcon className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">{item.label}</span>
                          {item.required && (
                            <Badge variant="destructive" className="text-xs">Required</Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {fieldTypes.find(ft => ft.value === item.type)?.label}
                          </Badge>
                        </div>
                        {item.placeholder && (
                          <p className="text-sm text-gray-500 mt-1">{item.placeholder}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveItem(item.id, 'up')}
                          disabled={index === 0}
                        >
                          ↑
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveItem(item.id, 'down')}
                          disabled={index === items.length - 1}
                        >
                          ↓
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingItem(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteItem(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Version Info */}
        <Card>
          <CardHeader>
            <CardTitle>Version Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Last updated: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Changes will be applied to new intake forms immediately
                </p>
              </div>
              <Badge variant="outline">v1.0</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Item Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Checklist Field</DialogTitle>
          </DialogHeader>
          <AddItemForm onSubmit={addItem} onCancel={() => setIsAddDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Checklist Field</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <EditItemForm 
              item={editingItem} 
              onSubmit={(updates) => updateItem(editingItem.id, updates)} 
              onCancel={() => setEditingItem(null)} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Checklist Preview</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
              <h3 className="font-medium mb-4">Service Intake Form</h3>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id}>
                    <Label className="flex items-center gap-2">
                      {item.label}
                      {item.required && <span className="text-red-500">*</span>}
                    </Label>
                    {renderPreviewField(item)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

// Add Item Form Component
const AddItemForm = ({ onSubmit, onCancel }: { 
  onSubmit: (item: Omit<ChecklistItem, 'id' | 'order'>) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState({
    type: 'text' as ChecklistItem['type'],
    label: '',
    placeholder: '',
    required: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.label.trim()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Field Type</Label>
        <Select value={formData.type} onValueChange={(value: ChecklistItem['type']) => 
          setFormData(prev => ({ ...prev, type: value }))
        }>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text">Short Text</SelectItem>
            <SelectItem value="textarea">Long Text</SelectItem>
            <SelectItem value="number">Number</SelectItem>
            <SelectItem value="checkbox">Checkbox</SelectItem>
            <SelectItem value="photo">Photo Upload</SelectItem>
            <SelectItem value="signature">Signature</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Field Label *</Label>
        <Input
          value={formData.label}
          onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
          placeholder="Enter field label"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Placeholder Text</Label>
        <Input
          value={formData.placeholder}
          onChange={(e) => setFormData(prev => ({ ...prev, placeholder: e.target.value }))}
          placeholder="Enter placeholder text"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Switch
            checked={formData.required}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, required: checked }))}
          />
          <Label>Required field</Label>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Add Field</Button>
      </div>
    </form>
  );
};

// Edit Item Form Component
const EditItemForm = ({ item, onSubmit, onCancel }: {
  item: ChecklistItem;
  onSubmit: (updates: Partial<ChecklistItem>) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState({
    type: item.type,
    label: item.label,
    placeholder: item.placeholder || '',
    required: item.required
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.label.trim()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Field Type</Label>
        <Select value={formData.type} onValueChange={(value: ChecklistItem['type']) => 
          setFormData(prev => ({ ...prev, type: value }))
        }>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text">Short Text</SelectItem>
            <SelectItem value="textarea">Long Text</SelectItem>
            <SelectItem value="number">Number</SelectItem>
            <SelectItem value="checkbox">Checkbox</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Field Label *</Label>
        <Input
          value={formData.label}
          onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
          placeholder="Enter field label"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Placeholder Text</Label>
        <Input
          value={formData.placeholder}
          onChange={(e) => setFormData(prev => ({ ...prev, placeholder: e.target.value }))}
          placeholder="Enter placeholder text"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Switch
            checked={formData.required}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, required: checked }))}
          />
          <Label>Required field</Label>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  );
};

export { ChecklistConfigContent };




