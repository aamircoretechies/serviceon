import { X, Building2, MapPin, Phone, Mail, Clock, Palette, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Garage } from '@/api/types';
import { IMAGES_BASE_URL } from '@/api/config';

interface ViewGarageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  garage: Garage | null;
  timezoneName?: string;
}

const ViewGarageModal = ({ open, onOpenChange, garage, timezoneName }: ViewGarageModalProps) => {
  if (!garage) {
    return null;
  }

  const getStatusBadge = (status: number) => {
    if (status === 1) {
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Active</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Inactive</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Building2 className="h-5 w-5" />
              {garage.garage_name}
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="px-6 py-4 space-y-4">
          {/* Basic Information - Compact Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Building2 className="h-4 w-4" />
                <span>Garage Name</span>
              </div>
              <p className="font-medium text-sm">{garage.garage_name}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Phone className="h-4 w-4" />
                <span>Phone</span>
              </div>
              <p className="font-medium text-sm">{garage.garage_phone_number}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </div>
              <p className="font-medium text-sm break-words">{garage.garage_email_address}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>Timezone</span>
              </div>
              <p className="font-medium text-sm">{timezoneName || `ID: ${garage.time_zone_id}`}</p>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-1 pt-2 border-t">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MapPin className="h-4 w-4" />
              <span>Address</span>
            </div>
            <p className="font-medium text-sm">{garage.garage_street_address}</p>
            <p className="text-sm text-gray-600">
              {garage.garage_city}, {garage.garage_state} {garage.garage_zip_code}
            </p>
          </div>

          {/* Description */}
          {garage.garage_description && (
            <div className="space-y-1 pt-2 border-t">
              <p className="text-sm text-gray-500">Description</p>
              <p className="text-sm">{garage.garage_description}</p>
            </div>
          )}

          {/* Branding & Additional Info - Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t">
            {/* Branding */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-700">Branding & Settings</p>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1.5">Logo</p>
                  {garage.garage_logo ? (
                    <Avatar className="h-12 w-12">
                      <AvatarImage 
                        src={`${IMAGES_BASE_URL}/${garage.garage_logo}`} 
                        alt="Garage Logo" 
                      />
                      <AvatarFallback>
                        <ImageIcon className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <ImageIcon className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1.5">Brand Color</p>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-8 h-8 rounded border border-gray-300"
                      style={{ backgroundColor: garage.garage_brand_color }}
                    ></div>
                    <span className="font-mono text-xs">{garage.garage_brand_color}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1.5">Status</p>
                  {getStatusBadge(garage.status)}
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-700">Additional Information</p>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-xs text-gray-500">Garage ID</p>
                  <p className="font-medium">{garage.garage_id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Created</p>
                  <p className="font-medium">{new Date(garage.created).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Last Updated</p>
                  <p className="font-medium">{new Date(garage.updated).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { ViewGarageModal };

