import { Fragment, useState } from 'react';
import { 
  Download, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Activity,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  RefreshCw,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

interface LogEntry {
  id: string;
  date: string;
  time: string;
  event: string;
  actor: string;
  status: 'success' | 'error' | 'warning' | 'info';
  details: string;
  ipAddress: string;
  userAgent: string;
}

const SystemLogsContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState<Date | undefined>();
  const [showFilters, setShowFilters] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const [logs] = useState<LogEntry[]>([
    {
      id: '1',
      date: '2024-01-15',
      time: '14:30:25',
      event: 'User Login',
      actor: 'admin@serviceon.com',
      status: 'success',
      details: 'Successful login from IP 192.168.1.100',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    {
      id: '2',
      date: '2024-01-15',
      time: '14:28:12',
      event: 'API Key Test',
      actor: 'System',
      status: 'error',
      details: 'OpenAI API key validation failed - Invalid key format',
      ipAddress: '127.0.0.1',
      userAgent: 'ServiceOn/1.0'
    },
    {
      id: '3',
      date: '2024-01-15',
      time: '14:25:45',
      event: 'PDF Generated',
      actor: 'admin@serviceon.com',
      status: 'success',
      details: 'Service report PDF generated for job JOB-001',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    {
      id: '4',
      date: '2024-01-15',
      time: '14:20:33',
      event: 'Database Backup',
      actor: 'System',
      status: 'success',
      details: 'Daily database backup completed successfully',
      ipAddress: '127.0.0.1',
      userAgent: 'ServiceOn/1.0'
    },
    {
      id: '5',
      date: '2024-01-15',
      time: '14:15:18',
      event: 'File Upload',
      actor: 'admin@serviceon.com',
      status: 'warning',
      details: 'Large file upload detected (15.2MB) - may impact performance',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    {
      id: '6',
      date: '2024-01-15',
      time: '14:10:05',
      event: 'System Update',
      actor: 'System',
      status: 'info',
      details: 'System configuration updated - PDF templates refreshed',
      ipAddress: '127.0.0.1',
      userAgent: 'ServiceOn/1.0'
    },
    {
      id: '7',
      date: '2024-01-15',
      time: '14:05:42',
      event: 'Failed Login Attempt',
      actor: 'unknown@example.com',
      status: 'error',
      details: 'Invalid credentials provided - account locked after 3 attempts',
      ipAddress: '203.0.113.45',
      userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'
    },
    {
      id: '8',
      date: '2024-01-15',
      time: '14:00:15',
      event: 'Integration Test',
      actor: 'System',
      status: 'success',
      details: 'Firebase connection test passed - all services operational',
      ipAddress: '127.0.0.1',
      userAgent: 'ServiceOn/1.0'
    }
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Success</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Error</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Warning</Badge>;
      case 'info':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Info</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-600" />;
      default:
        return <Info className="h-4 w-4 text-gray-600" />;
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    
    const matchesDate = !dateFilter || log.date === dateFilter.toISOString().split('T')[0];
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const toggleRowExpansion = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const handleExportCSV = () => {
    const csvContent = [
      'Date,Time,Event,Actor,Status,Details,IP Address,User Agent',
      ...filteredLogs.map(log => 
        `"${log.date}","${log.time}","${log.event}","${log.actor}","${log.status}","${log.details}","${log.ipAddress}","${log.userAgent}"`
      ).join('\n')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system-logs-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const statusCounts = {
    success: logs.filter(log => log.status === 'success').length,
    error: logs.filter(log => log.status === 'error').length,
    warning: logs.filter(log => log.status === 'warning').length,
    info: logs.filter(log => log.status === 'info').length
  };

  return (
    <Fragment>
      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              System Logs & Audit Trail
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {showFilters ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
              </Button>
              <Button variant="outline" onClick={handleExportCSV}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search logs by event, actor, or details..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <Calendar className="h-4 w-4 mr-2" />
                        {dateFilter ? dateFilter.toLocaleDateString() : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={dateFilter}
                        onSelect={setDateFilter}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Quick Actions</Label>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                      setDateFilter(undefined);
                    }}>
                      Clear All
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setDateFilter(new Date())}>
                      Today
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Status Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{statusCounts.success}</div>
                <div className="text-sm text-green-600">Success</div>
              </div>
              <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{statusCounts.error}</div>
                <div className="text-sm text-red-600">Errors</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{statusCounts.warning}</div>
                <div className="text-sm text-yellow-600">Warnings</div>
              </div>
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{statusCounts.info}</div>
                <div className="text-sm text-blue-600">Info</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <Fragment key={log.id}>
                    <TableRow className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleRowExpansion(log.id)}
                        >
                          {expandedRows.has(log.id) ? 
                            <ChevronUp className="h-4 w-4" /> : 
                            <ChevronDown className="h-4 w-4" />
                          }
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{log.date}</div>
                          <div className="text-sm text-gray-500">{log.time}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(log.status)}
                          <span className="font-medium">{log.event}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span>{log.actor}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(log.status)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleRowExpansion(log.id)}
                        >
                          {expandedRows.has(log.id) ? 'Hide' : 'View'}
                        </Button>
                      </TableCell>
                    </TableRow>
                    {expandedRows.has(log.id) && (
                      <TableRow>
                        <TableCell colSpan={6} className="bg-gray-50 dark:bg-gray-800">
                          <div className="p-4 space-y-3">
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Event Details</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{log.details}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium text-gray-500">IP Address:</span>
                                <span className="ml-2 font-mono">{log.ipAddress}</span>
                              </div>
                              <div>
                                <span className="font-medium text-gray-500">User Agent:</span>
                                <span className="ml-2 text-xs">{log.userAgent}</span>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination Info */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div>
          Showing {filteredLogs.length} of {logs.length} log entries
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </Fragment>
  );
};

export { SystemLogsContent };

