import { Fragment, useState } from 'react';
import { 
  FileText, 
  Download, 
  Settings, 
  Eye, 
  Upload, 
  Palette,
  Printer,
  Mail,
  Share2,
  CheckCircle,
  AlertCircle,
  Clock,
  Building2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, Tab, TabPanel } from '@/components/tabs';
import { Textarea } from '@/components/ui/textarea';

const BrandingOutputContent = () => {
  const [activeTab, setActiveTab] = useState('templates');
  const [selectedGarage, setSelectedGarage] = useState('all');

  // Mock data
  const garages = [
    { id: 'all', name: 'All Garages' },
    { id: '1', name: 'Downtown Auto Service' },
    { id: '2', name: 'Westside Garage' },
    { id: '3', name: 'North Point Motors' }
  ];

  const outputTemplates = [
    {
      id: 1,
      name: 'Service Invoice',
      type: 'Invoice',
      description: 'Standard service invoice template',
      lastModified: '2024-01-20',
      status: 'active',
      downloads: 156
    },
    {
      id: 2,
      name: 'Check-in Form',
      type: 'Form',
      description: 'Vehicle check-in intake form',
      lastModified: '2024-01-18',
      status: 'active',
      downloads: 89
    },
    {
      id: 3,
      name: 'Estimate Template',
      type: 'Estimate',
      description: 'Service estimate and quote template',
      lastModified: '2024-01-15',
      status: 'draft',
      downloads: 23
    },
    {
      id: 4,
      name: 'Receipt Template',
      type: 'Receipt',
      description: 'Payment receipt template',
      lastModified: '2024-01-12',
      status: 'active',
      downloads: 234
    }
  ];

  const outputSettings = {
    defaultFormat: 'PDF',
    includeLogo: true,
    includeSignature: true,
    autoEmail: false,
    watermark: false,
    pageSize: 'A4',
    orientation: 'Portrait'
  };

  const recentOutputs = [
    {
      id: 1,
      type: 'Invoice',
      jobId: 'JOB-001',
      garage: 'Downtown Auto Service',
      customer: 'John Smith',
      generatedAt: '2024-01-20 14:30',
      status: 'sent'
    },
    {
      id: 2,
      type: 'Estimate',
      jobId: 'JOB-002',
      garage: 'Westside Garage',
      customer: 'Sarah Johnson',
      generatedAt: '2024-01-20 13:15',
      status: 'pending'
    },
    {
      id: 3,
      type: 'Receipt',
      jobId: 'JOB-003',
      garage: 'North Point Motors',
      customer: 'Mike Wilson',
      generatedAt: '2024-01-20 12:45',
      status: 'delivered'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Active</Badge>;
      case 'draft':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Draft</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getOutputStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Sent</Badge>;
      case 'delivered':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Delivered</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Fragment>
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-end gap-2">
          <Select value={selectedGarage} onValueChange={setSelectedGarage}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select garage" />
            </SelectTrigger>
            <SelectContent>
              {garages.map((garage) => (
                <SelectItem key={garage.id} value={garage.id}>
                  {garage.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            Upload Template
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onChange={(event, newValue) => {
          if (newValue !== null) {
            setActiveTab(newValue as string);
          }
        }}>
          <TabsList className="grid w-full grid-cols-4">
            <Tab value="templates" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Templates
            </Tab>
            <Tab value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Tab>
            <Tab value="outputs" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Recent Outputs
            </Tab>
            <Tab value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </Tab>
          </TabsList>

          {/* Templates Tab */}
          <TabPanel value="templates" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {outputTemplates.map((template) => (
                <Card key={template.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        {template.name}
                      </CardTitle>
                      {getStatusBadge(template.status)}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{template.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Type:</span>
                        <span className="font-medium">{template.type}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Last Modified:</span>
                        <span className="font-medium">{template.lastModified}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Downloads:</span>
                        <span className="font-medium">{template.downloads}</span>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-4 w-4 mr-1" />
                          Preview
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Settings className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabPanel>

          {/* Settings Tab */}
          <TabPanel value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Output Format Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Printer className="h-5 w-5" />
                    Output Format
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="defaultFormat">Default Format</Label>
                    <Select defaultValue={outputSettings.defaultFormat}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PDF">PDF</SelectItem>
                        <SelectItem value="DOCX">Word Document</SelectItem>
                        <SelectItem value="HTML">HTML</SelectItem>
                        <SelectItem value="TXT">Plain Text</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pageSize">Page Size</Label>
                    <Select defaultValue={outputSettings.pageSize}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A4">A4</SelectItem>
                        <SelectItem value="A3">A3</SelectItem>
                        <SelectItem value="Letter">Letter</SelectItem>
                        <SelectItem value="Legal">Legal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="orientation">Orientation</Label>
                    <Select defaultValue={outputSettings.orientation}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Portrait">Portrait</SelectItem>
                        <SelectItem value="Landscape">Landscape</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Branding Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Branding Options
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="includeLogo">Include Logo</Label>
                      <p className="text-sm text-gray-500">Add garage logo to all documents</p>
                    </div>
                    <Switch id="includeLogo" defaultChecked={outputSettings.includeLogo} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="includeSignature">Include Signature</Label>
                      <p className="text-sm text-gray-500">Add digital signature to documents</p>
                    </div>
                    <Switch id="includeSignature" defaultChecked={outputSettings.includeSignature} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="autoEmail">Auto Email</Label>
                      <p className="text-sm text-gray-500">Automatically email documents to customers</p>
                    </div>
                    <Switch id="autoEmail" defaultChecked={outputSettings.autoEmail} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="watermark">Watermark</Label>
                      <p className="text-sm text-gray-500">Add watermark to documents</p>
                    </div>
                    <Switch id="watermark" defaultChecked={outputSettings.watermark} />
                  </div>
                </CardContent>
              </Card>

              {/* Email Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Email Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="emailSubject">Default Subject</Label>
                    <Input 
                      id="emailSubject" 
                      placeholder="Service Invoice - {Job ID}"
                      defaultValue="Service Invoice - {Job ID}"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emailTemplate">Email Template</Label>
                    <Textarea 
                      id="emailTemplate"
                      placeholder="Enter email template..."
                      defaultValue="Dear {Customer Name},\n\nPlease find attached your {Document Type} for job {Job ID}.\n\nThank you for choosing our service.\n\nBest regards,\n{Garage Name}"
                      rows={6}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Footer Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Footer Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="footerText">Footer Text</Label>
                    <Textarea 
                      id="footerText"
                      placeholder="Enter footer text..."
                      defaultValue="Thank you for your business. For questions, contact us at {Phone} or {Email}."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="legalText">Legal Text</Label>
                    <Textarea 
                      id="legalText"
                      placeholder="Enter legal disclaimer..."
                      defaultValue="This document is generated electronically and is valid without signature."
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline">Reset to Default</Button>
              <Button>Save Settings</Button>
            </div>
          </TabPanel>

          {/* Recent Outputs Tab */}
          <TabPanel value="outputs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Recent Document Outputs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOutputs.map((output) => (
                    <div key={output.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">{output.type} - {output.jobId}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {output.customer} • {output.garage}
                          </div>
                          <div className="text-xs text-gray-500">
                            Generated: {output.generatedAt}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getOutputStatusBadge(output.status)}
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabPanel>

          {/* Preview Tab */}
          <TabPanel value="preview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Document Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-6 bg-gray-50 dark:bg-gray-800 min-h-[600px]">
                  <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8 pb-4 border-b">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 bg-blue-600 rounded flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h1 className="text-xl font-bold">Downtown Auto Service</h1>
                          <p className="text-sm text-gray-600">Service Invoice</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Invoice #INV-001</p>
                        <p className="text-sm text-gray-500">Date: {new Date().toLocaleDateString()}</p>
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="mb-6">
                      <h3 className="font-semibold mb-2">Bill To:</h3>
                      <p className="text-sm">John Smith</p>
                      <p className="text-sm text-gray-600">123 Main Street</p>
                      <p className="text-sm text-gray-600">City, State 12345</p>
                    </div>

                    {/* Service Details */}
                    <div className="mb-6">
                      <h3 className="font-semibold mb-2">Service Details:</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Oil Change Service</span>
                          <span>$45.00</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Labor (2 hours)</span>
                          <span>$120.00</span>
                        </div>
                        <div className="flex justify-between font-semibold border-t pt-2">
                          <span>Total</span>
                          <span>$165.00</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 pt-4 border-t text-center text-sm text-gray-500">
                      <p>Thank you for your business!</p>
                      <p>For questions, contact us at (555) 123-4567</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center gap-2 mt-4">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button variant="outline">
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                  <Button variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabPanel>
        </Tabs>
      </div>
    </Fragment>
  );
};

export { BrandingOutputContent };
