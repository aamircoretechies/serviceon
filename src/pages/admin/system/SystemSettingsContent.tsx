import { Fragment, useState } from 'react';
import { 
  Settings, 
  Key, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  RefreshCw,
  Plus,
  Download,
  Search,
  Filter,
  Calendar,
  User,
  Activity,
  Database,
  Bot,
  Globe,
  Shield,
  Cloud
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, Tab, TabPanel } from '@/components/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { SystemLogsContent } from './SystemLogsContent';

interface APIKey {
  id: string;
  name: string;
  key: string;
  masked: boolean;
  status: 'connected' | 'error' | 'testing' | 'disconnected';
  lastTested?: string;
  description: string;
  icon: React.ReactNode;
}

const SystemSettingsContent = () => {
  const [activeTab, setActiveTab] = useState('integrations');
  const [apiKeys, setApiKeys] = useState<APIKey[]>([
    {
      id: 'openai',
      name: 'OpenAI API Key',
      key: 'sk-proj-abc123...xyz789',
      masked: true,
      status: 'connected',
      lastTested: '2024-01-15 10:30:00',
      description: 'Used for AI-powered features and content generation',
      icon: <Bot className="h-5 w-5" />
    },
    {
      id: 'google-translate',
      name: 'Google Translate Key',
      key: 'AIzaSyB...xyz123',
      masked: true,
      status: 'error',
      lastTested: '2024-01-14 15:45:00',
      description: 'Enables multi-language support and translations',
      icon: <Globe className="h-5 w-5" />
    },
    {
      id: 'firebase',
      name: 'Firebase Credentials',
      key: 'firebase-config-json',
      masked: true,
      status: 'connected',
      lastTested: '2024-01-15 09:15:00',
      description: 'Authentication and real-time database services',
      icon: <Shield className="h-5 w-5" />
    },
    {
      id: 'supabase',
      name: 'Supabase Credentials',
      key: 'supabase-url-key',
      masked: true,
      status: 'testing',
      lastTested: '2024-01-15 11:20:00',
      description: 'Database and backend services integration',
      icon: <Database className="h-5 w-5" />
    }
  ]);

  const [newKey, setNewKey] = useState({
    name: '',
    key: '',
    description: ''
  });

  const [showAddForm, setShowAddForm] = useState(false);

  const handleToggleMask = (id: string) => {
    setApiKeys(prev => prev.map(key => 
      key.id === id ? { ...key, masked: !key.masked } : key
    ));
  };

  const handleTestConnection = async (id: string) => {
    setApiKeys(prev => prev.map(key => 
      key.id === id ? { ...key, status: 'testing' } : key
    ));

    // Simulate API test
    await new Promise(resolve => setTimeout(resolve, 2000));

    setApiKeys(prev => prev.map(key => 
      key.id === id ? { 
        ...key, 
        status: Math.random() > 0.3 ? 'connected' : 'error',
        lastTested: new Date().toLocaleString()
      } : key
    ));
  };

  const handleAddKey = () => {
    if (newKey.name && newKey.key) {
      const newApiKey: APIKey = {
        id: newKey.name.toLowerCase().replace(/\s+/g, '-'),
        name: newKey.name,
        key: newKey.key,
        masked: true,
        status: 'disconnected',
        description: newKey.description,
        icon: <Key className="h-5 w-5" />
      };
      
      setApiKeys(prev => [...prev, newApiKey]);
      setNewKey({ name: '', key: '', description: '' });
      setShowAddForm(false);
    }
  };

  const handleUpdateKey = (id: string, newKeyValue: string) => {
    setApiKeys(prev => prev.map(key => 
      key.id === id ? { ...key, key: newKeyValue } : key
    ));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Connected</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Error</Badge>;
      case 'testing':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Testing</Badge>;
      case 'disconnected':
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">Disconnected</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'testing':
        return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'disconnected':
        return <AlertTriangle className="h-4 w-4 text-gray-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <Fragment>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Settings</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage integrations and monitor system activity</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onChange={(event, newValue) => {
          if (newValue !== null) {
            setActiveTab(newValue as string);
          }
        }}>
          <TabsList className="grid w-full grid-cols-1">
            <Tab value="integrations" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              API Keys & Integrations
            </Tab>
            {/* <Tab value="logs" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              System Logs
            </Tab> */}
          </TabsList>

          <TabPanel value="integrations" className="space-y-6">
            {/* API Keys Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    API Keys & Integrations
                  </CardTitle>
                  <Button onClick={() => setShowAddForm(!showAddForm)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Key
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add New Key Form */}
                {showAddForm && (
                  <Card className="border-dashed">
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="keyName">Key Name</Label>
                            <Input
                              id="keyName"
                              value={newKey.name}
                              onChange={(e) => setNewKey(prev => ({ ...prev, name: e.target.value }))}
                              placeholder="e.g., Stripe API Key"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="keyValue">API Key</Label>
                            <Input
                              id="keyValue"
                              value={newKey.key}
                              onChange={(e) => setNewKey(prev => ({ ...prev, key: e.target.value }))}
                              placeholder="Enter your API key"
                              type="password"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="keyDescription">Description</Label>
                          <Input
                            id="keyDescription"
                            value={newKey.description}
                            onChange={(e) => setNewKey(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Brief description of what this key is used for"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleAddKey}>
                            Add Key
                          </Button>
                          <Button variant="outline" onClick={() => setShowAddForm(false)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* API Keys List */}
                <div className="space-y-4">
                  {apiKeys.map((apiKey) => (
                    <Card key={apiKey.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                              {apiKey.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium text-gray-900 dark:text-white">
                                  {apiKey.name}
                                </h3>
                                {getStatusIcon(apiKey.status)}
                                {getStatusBadge(apiKey.status)}
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                {apiKey.description}
                              </p>
                              <div className="flex items-center gap-2">
                                <Input
                                  value={apiKey.masked ? '••••••••••••••••' : apiKey.key}
                                  onChange={(e) => handleUpdateKey(apiKey.id, e.target.value)}
                                  className="font-mono text-sm max-w-md"
                                  readOnly={apiKey.masked}
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleToggleMask(apiKey.id)}
                                >
                                  {apiKey.masked ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleTestConnection(apiKey.id)}
                                  disabled={apiKey.status === 'testing'}
                                >
                                  <RefreshCw className={`h-4 w-4 mr-1 ${apiKey.status === 'testing' ? 'animate-spin' : ''}`} />
                                  Test
                                </Button>
                              </div>
                              {apiKey.lastTested && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Last tested: {apiKey.lastTested}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Integration Status Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Integration Status Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">
                      {apiKeys.filter(k => k.status === 'connected').length}
                    </div>
                    <div className="text-sm text-green-600">Connected</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-red-600">
                      {apiKeys.filter(k => k.status === 'error').length}
                    </div>
                    <div className="text-sm text-red-600">Errors</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <RefreshCw className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">
                      {apiKeys.filter(k => k.status === 'testing').length}
                    </div>
                    <div className="text-sm text-blue-600">Testing</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
                    <AlertTriangle className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-600">
                      {apiKeys.filter(k => k.status === 'disconnected').length}
                    </div>
                    <div className="text-sm text-gray-600">Disconnected</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabPanel>

          {/* System Logs Tab - Commented out for now */}
          {/* <TabPanel value="logs" className="space-y-6">
            <SystemLogsContent />
          </TabPanel> */}
        </Tabs>
      </div>
    </Fragment>
  );
};

export { SystemSettingsContent };
