import { Fragment, useState, useRef, useEffect } from 'react';
import { 
  X, 
  Download, 
  Trash2, 
  Archive, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  Maximize,
  RotateCw,
  Image as ImageIcon,
  Video,
  File,
  Calendar,
  Building,
  Wrench,
  User,
  Tag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface MediaPreviewModalProps {
  media: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MediaPreviewModal = ({ media, open, onOpenChange }: MediaPreviewModalProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (media && media.type === 'video' && videoRef.current) {
      const video = videoRef.current;
      video.addEventListener('loadedmetadata', () => {
        setDuration(video.duration);
      });
      video.addEventListener('timeupdate', () => {
        setCurrentTime(video.currentTime);
      });
    }
  }, [media]);

  const handlePlayPause = () => {
    if (media?.type === 'video' && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuteToggle = () => {
    if (media?.type === 'video' && videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (media?.type === 'video' && videoRef.current) {
      const time = parseFloat(e.target.value);
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

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

  const handleDownload = () => {
    console.log('Download media:', media);
  };

  const handleDelete = () => {
    console.log('Delete media:', media);
  };

  const handleArchive = () => {
    console.log('Archive media:', media);
  };

  if (!media) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              {getTypeIcon(media.type)}
              {media.name}
            </DialogTitle>
            <div className="flex items-center gap-2">
              {getTypeBadge(media.type)}
              <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-col lg:flex-row h-[70vh]">
          {/* Media Display */}
          <div className="flex-1 bg-black flex items-center justify-center relative">
            {media.type === 'video' ? (
              <div className="relative w-full h-full">
                <video
                  ref={videoRef}
                  src={media.url}
                  className="w-full h-full object-contain"
                  onEnded={() => setIsPlaying(false)}
                />
                
                {/* Video Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                  <div className="space-y-2">
                    {/* Progress Bar */}
                    <div className="flex items-center gap-2">
                      <span className="text-white text-sm w-12">{formatTime(currentTime)}</span>
                      <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        value={currentTime}
                        onChange={handleSeek}
                        className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="text-white text-sm w-12">{formatTime(duration)}</span>
                    </div>
                    
                    {/* Control Buttons */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handlePlayPause}
                        className="text-white hover:bg-white hover:bg-opacity-20"
                      >
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleMuteToggle}
                        className="text-white hover:bg-white hover:bg-opacity-20"
                      >
                        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </Button>
                      <div className="flex-1" />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white hover:bg-opacity-20"
                      >
                        <Maximize className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : media.type === 'photo' ? (
              <img 
                src={media.url} 
                alt={media.name}
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-white">
                <File className="h-16 w-16 mb-4" />
                <p className="text-lg font-medium">{media.name}</p>
                <p className="text-sm text-gray-400">{media.size}</p>
              </div>
            )}
          </div>

          {/* Media Details */}
          <div className="w-full lg:w-80 border-l bg-gray-50 dark:bg-gray-900 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <Card>
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-medium">File Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Size:</span>
                      <span>{media.size}</span>
                    </div>
                    {media.duration && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Duration:</span>
                        <span>{media.duration}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-500">Type:</span>
                      {getTypeBadge(media.type)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Uploaded:</span>
                      <span>{media.uploadedAt}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Context Info */}
              <Card>
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-medium">Context</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-gray-400" />
                      <span>{media.garage}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wrench className="h-4 w-4 text-gray-400" />
                      <span>{media.job}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span>{media.uploadedBy}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              {media.tags && media.tags.length > 0 && (
                <Card>
                  <CardContent className="p-4 space-y-3">
                    <h3 className="font-medium flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {media.tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              <Card>
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-medium">Actions</h3>
                  <div className="space-y-2">
                    <Button 
                      onClick={handleDownload}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button 
                      onClick={handleArchive}
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <Archive className="h-4 w-4 mr-2" />
                      Archive
                    </Button>
                    <Button 
                      onClick={handleDelete}
                      className="w-full justify-start text-red-600 hover:text-red-700"
                      variant="outline"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { MediaPreviewModal };

