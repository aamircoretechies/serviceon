import { Fragment, useState } from 'react';
import { 
  X, 
  Download, 
  RefreshCw, 
  FileText, 
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCw
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

interface PDFPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: {
    headerTitle: string;
    footerText: string;
    logo: File | null;
    signaturePlacement: string;
    applyToAllGarages: boolean;
    version: string;
  };
}

const PDFPreviewModal = ({ open, onOpenChange, config }: PDFPreviewModalProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [isLoading, setIsLoading] = useState(true);

  const handleDownload = () => {
    console.log('Download PDF with config:', config);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate PDF regeneration
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  const handleRotate = () => {
    console.log('Rotate PDF');
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Mock PDF URL - in real app, this would be generated based on config
  const pdfUrl = '/sample-pdf.pdf';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${isFullscreen ? 'max-w-none w-screen h-screen' : 'max-w-6xl max-h-[90vh]'} p-0`}>
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              PDF Preview
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                v{config.version}
              </Badge>
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-col h-[70vh]">
          {/* PDF Controls */}
          <div className="flex items-center justify-between px-6 py-2 border-b bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleZoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium min-w-[60px] text-center">{zoom}%</span>
              <Button variant="outline" size="sm" onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleRotate}>
                <RotateCw className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>

          {/* PDF Preview Area */}
          <div className="flex-1 p-6 bg-gray-100 dark:bg-gray-900">
            <Card className="h-full">
              <CardContent className="p-0 h-full">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-500">Generating PDF preview...</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-full">
                    <iframe
                      src={pdfUrl}
                      className="w-full h-full border-0 rounded-lg"
                      style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
                      title="PDF Preview"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* PDF Info Footer */}
          <div className="px-6 py-3 border-t bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-4">
                <span>Template: {config.headerTitle}</span>
                <span>•</span>
                <span>Signature: {config.signaturePlacement}</span>
                <span>•</span>
                <span>Version: v{config.version}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Page 1 of 1</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { PDFPreviewModal };

