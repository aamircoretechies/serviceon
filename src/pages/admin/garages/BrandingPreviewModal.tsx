import { Fragment, useState } from 'react';
import { 
  X, 
  Download, 
  Eye, 
  FileText, 
  Palette,
  Building2,
  MapPin,
  Phone,
  Mail,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, Tab, TabPanel } from '@/components/tabs';

interface BrandingPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  garageData: {
    name: string;
    address: string;
    phone: string;
    email: string;
    timezone: string;
    logo?: string;
    brandColor?: string;
  } | null;
}

const BrandingPreviewModal = ({ open, onOpenChange, garageData }: BrandingPreviewModalProps) => {
  const [activeTab, setActiveTab] = useState('preview');

  // Don't render if garageData is null
  if (!garageData) {
    return null;
  }

  const handleDownloadPDF = () => {
    console.log('Download PDF preview for garage:', garageData.name);
  };

  const handleDownloadBranding = () => {
    console.log('Download branding assets for garage:', garageData.name);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Branding Preview - {garageData.name}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
                <FileText className="h-4 w-4 mr-2" />
                PDF Preview
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadBranding}>
                <Download className="h-4 w-4 mr-2" />
                Download Assets
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6">
          <Tabs value={activeTab} onChange={(event, newValue) => {
            if (newValue !== null) {
              setActiveTab(newValue as string);
            }
          }}>
            <TabsList className="grid w-full grid-cols-3">
              <Tab value="preview" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Preview
              </Tab>
              <Tab value="colors" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Colors
              </Tab>
              <Tab value="assets" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Assets
              </Tab>
            </TabsList>

            <TabPanel value="preview" className="space-y-6">
              {/* Intake Form Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Intake Form Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-6 bg-white">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6 pb-4 border-b">
                      <div className="flex items-center gap-3">
                        {garageData.logo ? (
                          <img
                            src={garageData.logo}
                            alt="Garage Logo"
                            className="h-12 w-12 object-contain"
                          />
                        ) : (
                          <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center">
                            <Building2 className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <h1 className="text-xl font-bold text-gray-900">{garageData.name}</h1>
                          <p className="text-sm text-gray-600">Service Intake Form</p>
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <p>Date: {new Date().toLocaleDateString()}</p>
                        <p>Form ID: #INT-{Math.random().toString(36).substr(2, 6).toUpperCase()}</p>
                      </div>
                    </div>

                    {/* Customer Information Section */}
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold mb-4 text-gray-800">Customer Information</h2>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                          <div className="h-8 bg-gray-100 rounded border"></div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                          <div className="h-8 bg-gray-100 rounded border"></div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                          <div className="h-8 bg-gray-100 rounded border"></div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                          <div className="h-8 bg-gray-100 rounded border"></div>
                        </div>
                      </div>
                    </div>

                    {/* Vehicle Information Section */}
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold mb-4 text-gray-800">Vehicle Information</h2>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
                          <div className="h-8 bg-gray-100 rounded border"></div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                          <div className="h-8 bg-gray-100 rounded border"></div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                          <div className="h-8 bg-gray-100 rounded border"></div>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 pt-4 border-t text-center text-sm text-gray-500">
                      <p>{garageData.address}</p>
                      <p>{garageData.phone} • {garageData.email}</p>
                      <p>Timezone: {garageData.timezone}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Business Card Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Business Card Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center">
                    <div className="w-80 h-48 border rounded-lg p-4 bg-white shadow-lg">
                      <div className="flex items-center gap-3 mb-3">
                        {garageData.logo ? (
                          <img
                            src={garageData.logo}
                            alt="Garage Logo"
                            className="h-8 w-8 object-contain"
                          />
                        ) : (
                          <div className="h-8 w-8 bg-gray-200 rounded flex items-center justify-center">
                            <Building2 className="h-4 w-4 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-bold text-gray-900">{garageData.name}</h3>
                          <p className="text-xs text-gray-600">Auto Service Center</p>
                        </div>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          <span>{garageData.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <span>{garageData.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3 text-gray-400" />
                          <span>{garageData.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span>{garageData.timezone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabPanel>

            <TabPanel value="colors" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Brand Colors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div 
                          className="w-16 h-16 rounded-lg mx-auto mb-2 border"
                          style={{ backgroundColor: garageData.brandColor || '#3B82F6' }}
                        ></div>
                        <p className="text-sm font-medium">Primary</p>
                        <p className="text-xs text-gray-500">{garageData.brandColor || '#3B82F6'}</p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-lg mx-auto mb-2 border bg-gray-600"></div>
                        <p className="text-sm font-medium">Secondary</p>
                        <p className="text-xs text-gray-500">#6B7280</p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-lg mx-auto mb-2 border bg-green-600"></div>
                        <p className="text-sm font-medium">Success</p>
                        <p className="text-xs text-gray-500">#059669</p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-lg mx-auto mb-2 border bg-red-600"></div>
                        <p className="text-sm font-medium">Warning</p>
                        <p className="text-xs text-gray-500">#DC2626</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">
                      These colors will be used across all branded materials and digital outputs.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabPanel>

            <TabPanel value="assets" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Downloadable Assets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-8 w-8 text-blue-600" />
                          <div>
                            <p className="font-medium">Intake Form Template</p>
                            <p className="text-sm text-gray-500">PDF format</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Building2 className="h-8 w-8 text-green-600" />
                          <div>
                            <p className="font-medium">Business Card Template</p>
                            <p className="text-sm text-gray-500">PNG format</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Palette className="h-8 w-8 text-purple-600" />
                          <div>
                            <p className="font-medium">Logo Package</p>
                            <p className="text-sm text-gray-500">Multiple formats</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-8 w-8 text-orange-600" />
                          <div>
                            <p className="font-medium">Brand Guidelines</p>
                            <p className="text-sm text-gray-500">PDF format</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabPanel>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { BrandingPreviewModal };
