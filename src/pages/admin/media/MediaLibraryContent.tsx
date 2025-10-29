import { Fragment, useState } from 'react';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Upload,
  MoreHorizontal, 
  Eye,
  Download,
  Trash2,
  Archive,
  Play,
  Pause,
  Image as ImageIcon,
  Video,
  File,
  Calendar,
  Building,
  Wrench,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { MediaPreviewModal } from './MediaPreviewModal';
import { UploadDialog } from './UploadDialog';

const MediaLibraryContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [garageFilter, setGarageFilter] = useState('all');
  const [jobFilter, setJobFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedMedia, setSelectedMedia] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  // Mock data - replace with actual data
  const mediaItems = [
    {
      id: 1,
      name: 'engine_diagnosis_001.jpg',
      type: 'photo',
      size: '2.4 MB',
      duration: null,
      thumbnail: '/media/images/engine_diagnosis_001_thumb.jpg',
      url: '/media/images/engine_diagnosis_001.jpg',
      garage: 'Downtown Auto Service',
      job: 'JOB-001 - Engine Diagnosis',
      uploadedBy: 'Mike Johnson',
      uploadedAt: '2024-01-15 14:30',
      status: 'completed',
      tags: ['engine', 'diagnosis', 'repair']
    },
    {
      id: 2,
      name: 'brake_inspection_video.mp4',
      type: 'video',
      size: '15.2 MB',
      duration: '00:18',
      thumbnail: '/media/videos/brake_inspection_video_thumb.jpg',
      url: '/media/videos/brake_inspection_video.mp4',
      garage: 'Westside Garage',
      job: 'JOB-002 - Brake Inspection',
      uploadedBy: 'Sarah Wilson',
      uploadedAt: '2024-01-14 09:15',
      status: 'completed',
      tags: ['brake', 'inspection', 'video']
    },
    {
      id: 3,
      name: 'tire_rotation_photos.zip',
      type: 'archive',
      size: '8.7 MB',
      duration: null,
      thumbnail: '/media/icons/zip_icon.png',
      url: '/media/archives/tire_rotation_photos.zip',
      garage: 'North Point Motors',
      job: 'JOB-003 - Tire Rotation',
      uploadedBy: 'John Doe',
      uploadedAt: '2024-01-13 16:45',
      status: 'completed',
      tags: ['tire', 'rotation', 'photos']
    },
    {
      id: 4,
      name: 'transmission_service_001.jpg',
      type: 'photo',
      size: '3.1 MB',
      duration: null,
      thumbnail: '/media/images/transmission_service_001_thumb.jpg',
      url: '/media/images/transmission_service_001.jpg',
      garage: 'East End Auto',
      job: 'JOB-004 - Transmission Service',
      uploadedBy: 'Mike Johnson',
      uploadedAt: '2024-01-12 11:20',
      status: 'uploading',
      uploadProgress: 75,
      tags: ['transmission', 'service']
    },
    {
      id: 5,
      name: 'oil_change_process.mp4',
      type: 'video',
      size: '22.8 MB',
      duration: '00:45',
      thumbnail: '/media/videos/oil_change_process_thumb.jpg',
      url: '/media/videos/oil_change_process.mp4',
      garage: 'Downtown Auto Service',
      job: 'JOB-005 - Oil Change',
      uploadedBy: 'Sarah Wilson',
      uploadedAt: '2024-01-11 13:10',
      status: 'failed',
      tags: ['oil', 'change', 'process']
    },
    {
      id: 6,
      name: 'interior_cleaning_001.jpg',
      type: 'photo',
      size: '1.8 MB',
      duration: null,
      thumbnail: '/media/images/interior_cleaning_001_thumb.jpg',
      url: '/media/images/interior_cleaning_001.jpg',
      garage: 'Westside Garage',
      job: 'JOB-006 - Interior Cleaning',
      uploadedBy: 'John Doe',
      uploadedAt: '2024-01-10 15:30',
      status: 'completed',
      tags: ['interior', 'cleaning']
    }
  ];

  const filteredMedia = mediaItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.garage.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.job.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesGarage = garageFilter === 'all' || item.garage === garageFilter;
    const matchesJob = jobFilter === 'all' || item.job === jobFilter;
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    const matchesDate = dateFilter === 'all' || 
                       (dateFilter === 'today' && item.uploadedAt.includes('2024-01-15')) ||
                       (dateFilter === 'thisWeek' && item.uploadedAt >= '2024-01-08');
    return matchesSearch && matchesGarage && matchesJob && matchesType && matchesDate;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'photo':
        return <ImageIcon className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'archive':
        return <File className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'photo':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Photo</Badge>;
      case 'video':
        return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">Video</Badge>;
      case 'archive':
        return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">Archive</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Completed
          </Badge>
        );
      case 'uploading':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Uploading
          </Badge>
        );
      case 'failed':
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Failed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleView = (media: any) => {
    setSelectedMedia(media);
    setShowPreview(true);
  };

  const handleDownload = (media: any) => {
    console.log('Download media:', media);
  };

  const handleDelete = (media: any) => {
    console.log('Delete media:', media);
  };

  const handleArchive = (media: any) => {
    console.log('Archive media:', media);
  };

  const handleRetry = (media: any) => {
    console.log('Retry upload:', media);
  };

  const garages = ['Downtown Auto Service', 'Westside Garage', 'North Point Motors', 'East End Auto'];
  const jobs = ['JOB-001 - Engine Diagnosis', 'JOB-002 - Brake Inspection', 'JOB-003 - Tire Rotation', 'JOB-004 - Transmission Service', 'JOB-005 - Oil Change', 'JOB-006 - Interior Cleaning'];

  return (
    <Fragment>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Media Library</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your media files and storage</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="flex items-center gap-2"
            >
              {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
              {viewMode === 'grid' ? 'List View' : 'Grid View'}
            </Button>
            <Button onClick={() => setShowUpload(true)} className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload Media
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Search & Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search media files..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Select value={garageFilter} onValueChange={setGarageFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Garage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Garages</SelectItem>
                    {garages.map((garage) => (
                      <SelectItem key={garage} value={garage}>{garage}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={jobFilter} onValueChange={setJobFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Job" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Jobs</SelectItem>
                    {jobs.map((job) => (
                      <SelectItem key={job} value={job}>{job}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Dates</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="thisWeek">This Week</SelectItem>
                    <SelectItem value="thisMonth">This Month</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="photo">Photos</SelectItem>
                    <SelectItem value="video">Videos</SelectItem>
                    <SelectItem value="archive">Archives</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  More Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Media Content */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredMedia.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative aspect-square bg-gray-100 dark:bg-gray-800">
                  {item.type === 'video' ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative">
                        <img 
                          src={item.thumbnail} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                          <Play className="h-8 w-8 text-white" />
                        </div>
                        {item.duration && (
                          <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                            {item.duration}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <img 
                      src={item.thumbnail} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                  
                  {/* Upload Progress */}
                  {item.status === 'uploading' && (
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-75">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="h-3 w-3 text-white" />
                        <span className="text-xs text-white">Uploading...</span>
                      </div>
                      <Progress value={item.uploadProgress} className="h-1" />
                    </div>
                  )}

                  {/* Failed Upload */}
                  {item.status === 'failed' && (
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-red-600 bg-opacity-90">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-white">Upload Failed</span>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-6 w-6 p-0 text-white hover:bg-white hover:bg-opacity-20"
                          onClick={() => handleRetry(item)}
                        >
                          <RefreshCw className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Actions Overlay */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-black bg-opacity-50 text-white hover:bg-opacity-75">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(item)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownload(item)}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleArchive(item)}>
                          <Archive className="h-4 w-4 mr-2" />
                          Archive
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(item)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                
                <CardContent className="p-3">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="font-medium text-sm truncate" title={item.name}>
                        {item.name}
                      </h3>
                      {getTypeBadge(item.type)}
                    </div>
                    
                    <div className="text-xs text-gray-500 space-y-1">
                      <div className="flex items-center gap-1">
                        <Building className="h-3 w-3" />
                        {item.garage}
                      </div>
                      <div className="flex items-center gap-1">
                        <Wrench className="h-3 w-3" />
                        {item.job}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {item.uploadedAt}
                      </div>
                      <div className="flex items-center justify-between">
                        <span>{item.size}</span>
                        {getStatusBadge(item.status)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Media Files ({filteredMedia.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Preview</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Garage</TableHead>
                      <TableHead>Job</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Uploaded</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMedia.map((item) => (
                      <TableRow key={item.id} className="sand-hover-row">
                        <TableCell>
                          <div className="relative w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden">
                            <img 
                              src={item.thumbnail} 
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                            {item.type === 'video' && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                                <Play className="h-4 w-4 text-white" />
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-gray-500">by {item.uploadedBy}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTypeIcon(item.type)}
                            {getTypeBadge(item.type)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{item.size}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{item.duration || '-'}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Building className="h-3 w-3 text-gray-400" />
                            <span className="text-sm">{item.garage}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Wrench className="h-3 w-3 text-gray-400" />
                            <span className="text-sm">{item.job}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(item.status)}
                          {item.status === 'uploading' && (
                            <div className="mt-1">
                              <Progress value={item.uploadProgress} className="h-1" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-gray-400" />
                            <span className="text-sm">{item.uploadedAt}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleView(item)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDownload(item)}>
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleArchive(item)}>
                                <Archive className="h-4 w-4 mr-2" />
                                Archive
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDelete(item)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Media Preview Modal */}
      <MediaPreviewModal 
        media={selectedMedia}
        open={showPreview}
        onOpenChange={setShowPreview}
      />

      {/* Upload Dialog */}
      <UploadDialog 
        open={showUpload}
        onOpenChange={setShowUpload}
      />
    </Fragment>
  );
};

export { MediaLibraryContent };

