import { Fragment, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DollarSign, 
  ArrowLeft,
  Building2,
  Wrench,
  Calendar,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { laborRatesService, laborCategoryService, garageService } from '@/api/services';
import { toast } from 'sonner';
import type { LaborRate, LaborCategory, Garage } from '@/api/types';

const LaborRatesListContent = () => {
  const navigate = useNavigate();
  const [laborRates, setLaborRates] = useState<LaborRate[]>([]);
  const [laborCategories, setLaborCategories] = useState<LaborCategory[]>([]);
  const [garages, setGarages] = useState<Garage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch all data in parallel
        const [ratesResponse, categoriesResponse, garagesResponse] = await Promise.all([
          laborRatesService.getAll(),
          laborCategoryService.getAll(),
          garageService.getAll()
        ]);

        setLaborRates(ratesResponse);
        setLaborCategories(categoriesResponse);
        
        if (garagesResponse.status === 1 && garagesResponse.data?.garages?.content) {
          setGarages(garagesResponse.data.garages.content);
        }
      } catch (error: any) {
        console.error('Error fetching data:', error);
        toast.error(error?.response?.data?.message || 'Failed to load labor rates');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper functions to get names by ID
  const getCategoryName = (categoryId: number): string => {
    const category = laborCategories.find(c => c.labor_category_id === categoryId);
    return category?.category_name || 'Unknown';
  };

  const getGarageName = (garageId: number): string => {
    const garage = garages.find(g => g.garage_id === garageId);
    return garage?.garage_name || 'Unknown';
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <Fragment>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/admin/labor-rates')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Labor Rates</h1>
              <p className="text-gray-600 dark:text-gray-400">View and manage all labor rate configurations</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Labor Rates List
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading labor rates...</p>
              </div>
            ) : laborRates.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No labor rates found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Labor Category</TableHead>
                      <TableHead>Garage</TableHead>
                      <TableHead>Standard Rate</TableHead>
                      <TableHead>Overtime Rate</TableHead>
                      <TableHead>Weekend Rate</TableHead>
                      <TableHead>Holiday Rate</TableHead>
                      <TableHead>Currency</TableHead>
                      <TableHead>Billing Unit</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead>Created At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {laborRates.map((rate) => (
                      <TableRow key={rate.id}>
                        <TableCell className="font-medium">{rate.id}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="flex items-center gap-1 w-fit">
                            <Wrench className="h-3 w-3" />
                            {getCategoryName(rate.labor_category_id)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-gray-400" />
                            <span>{getGarageName(rate.garage_id)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            <span className="font-medium">{rate.standard_rate.toFixed(2)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4 text-orange-600" />
                            <span className="font-medium">{rate.overtime_rate.toFixed(2)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4 text-blue-600" />
                            <span className="font-medium">{rate.weekend_rate.toFixed(2)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4 text-red-600" />
                            <span className="font-medium">{rate.holiday_rate.toFixed(2)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{rate.currency}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{rate.billing_unit}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate" title={rate.notes || 'No notes'}>
                              {rate.notes || '-'}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="h-4 w-4" />
                            {formatDate(rate.created_at)}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Fragment>
  );
};

export { LaborRatesListContent };

