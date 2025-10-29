import { Fragment, useState, useRef } from 'react';
import { 
  Upload, 
  X, 
  File, 
  Image as ImageIcon, 
  Video, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  Building,
  Wrench
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface UploadFile {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'failed';
  error?: string;
}

const UploadDialog = ({ open, onOpenChange }: UploadDialogProps) => {
  const [selectedGarage, setSelectedGarage] = useState('');
  const [selectedJob, setSelectedJob] = useState('');
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const garages = ['Downtown Auto Service', 'Westside Garage', 'North Point Motors', 'East End Auto'];
  const jobs = ['JOB-001 - Engine Diagnosis', 'JOB-002 - Brake Inspection', 'JOB-003 - Tire Rotation', 'JOB-004 - Transmission Service', 'JOB-005 - Oil Change', 'JOB-006 - Interior Cleaning'];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newUploadFiles: UploadFile[] = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      progress: 0,
      status: 'uploading'
    }));
    
    setUploadFiles(prev => [...prev, ...newUploadFiles]);
    
    // Simulate upload progress
    newUploadFiles.forEach(uploadFile => {
      simulateUpload(uploadFile.id);
    });
  };

  const simulateUpload = (fileId: string) => {
    const interval = setInterval(() => {
      setUploadFiles(prev => prev.map(file => {
        if (file.id === fileId) {
          const newProgress = Math.min(file.progress + Math.random() * 20, 100);
          const newStatus = newProgress >= 100 ? 'completed' : 'uploading';
          
          if (newStatus === 'completed') {
            clearInterval(interval);
          }
          
          return {
            ...file,
            progress: newProgress,
            status: newStatus
          };
        }
        return file;
      }));
    }, 500);
  };

  const removeFile = (fileId: string) => {
    setUploadFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const retryUpload = (fileId: string) => {
    setUploadFiles(prev => prev.map(file => 
      file.id === fileId 
        ? { ...file, status: 'uploading', progress: 0, error: undefined }
        : file
    ));
    
    // Restart upload simulation
    setTimeout(() => simulateUpload(fileId), 100);
  };

  const handleUpload = async () => {
    if (uploadFiles.length === 0 || !selectedGarage || !selectedJob) return;
    
    setIsUploading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Uploading files:', { garage: selectedGarage, job: selectedJob, files: uploadFiles });
      
      // Reset form
      setUploadFiles([]);
      setSelectedGarage('');
      setSelectedJob('');
      onOpenChange(false);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="h-4 w-4" />;
    } else if (file.type.startsWith('video/')) {
      return <Video className="h-4 w-4" />;
    } else {
      return <File className="h-4 w-4" />;
    }
  };

  const getFileTypeBadge = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Photo</Badge>;
    } else if (file.type.startsWith('video/')) {
      return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">Video</Badge>;
    } else {
      return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">File</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'uploading':
        return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      default:
        return null;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const completedFiles = uploadFiles.filter(file => file.status === 'completed').length;
  const totalFiles = uploadFiles.length;
  const overallProgress = totalFiles > 0 ? (completedFiles / totalFiles) * 100 : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Media Files
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 px-6 py-4">
          {/* Context Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="garage">Garage *</Label>
              <Select value={selectedGarage} onValueChange={setSelectedGarage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select garage" />
                </SelectTrigger>
                <SelectContent>
                  {garages.map((garage) => (
                    <SelectItem key={garage} value={garage}>
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        {garage}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="job">Job *</Label>
              <Select value={selectedJob} onValueChange={setSelectedJob}>
                <SelectTrigger>
                  <SelectValue placeholder="Select job" />
                </SelectTrigger>
                <SelectContent>
                  {jobs.map((job) => (
                    <SelectItem key={job} value={job}>
                      <div className="flex items-center gap-2">
                        <Wrench className="h-4 w-4" />
                        {job}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* File Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Upload Media Files
            </h3>
            <p className="text-gray-500 mb-4">
              Drag and drop files here, or click to select files
            </p>
            <Button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              Select Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*,.zip,.rar"
              onChange={handleFileSelect}
              className="hidden"
            />
            <p className="text-xs text-gray-400 mt-2">
              Supports: Images (JPG, PNG, GIF), Videos (MP4, MOV), Archives (ZIP, RAR)
            </p>
          </div>

          {/* Upload Progress */}
          {uploadFiles.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Upload Progress</h3>
                  <div className="text-sm text-gray-500">
                    {completedFiles} of {totalFiles} completed
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Progress value={overallProgress} className="h-2" />
                  
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {uploadFiles.map((uploadFile) => (
                      <div key={uploadFile.id} className="flex items-center gap-3 p-2 border rounded-lg">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {getFileIcon(uploadFile.file)}
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">
                              {uploadFile.file.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatFileSize(uploadFile.file.size)}
                            </div>
                          </div>
                          {getFileTypeBadge(uploadFile.file)}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {getStatusIcon(uploadFile.status)}
                          {uploadFile.status === 'uploading' && (
                            <div className="w-16">
                              <Progress value={uploadFile.progress} className="h-1" />
                            </div>
                          )}
                          {uploadFile.status === 'failed' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => retryUpload(uploadFile.id)}
                            >
                              <RefreshCw className="h-3 w-3" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeFile(uploadFile.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t px-6 pb-6">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleUpload}
            disabled={isUploading || uploadFiles.length === 0 || !selectedGarage || !selectedJob}
          >
            {isUploading ? 'Uploading...' : 'Upload Files'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { UploadDialog };
