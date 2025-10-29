import { Fragment, useState } from 'react';
import { X, User, Search, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface AssignMechanicDialogProps {
  job: any;
  open: boolean;
  onClose: () => void;
  mechanics: any[];
}

const AssignMechanicDialog = ({ job, open, onClose, mechanics }: AssignMechanicDialogProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMechanic, setSelectedMechanic] = useState<any>(null);

  if (!open || !job) return null;

  const filteredMechanics = mechanics.filter(mechanic =>
    mechanic.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAssign = () => {
    if (selectedMechanic) {
      // Handle assignment logic here
      console.log(`Assigning ${selectedMechanic.name} to job ${job.id}`);
      onClose();
    }
  };

  const handleUnassign = () => {
    // Handle unassignment logic here
    console.log(`Unassigning mechanic from job ${job.id}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md max-h-[90vh] rounded-xl shadow-2xl bg-gray-800 dark:bg-gray-100">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h2 className="text-lg font-semibold">
                Assign Mechanic
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-700">
                Job {job.id} - {job.vehicle.year} {job.vehicle.make} {job.vehicle.model}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="p-6 space-y-4 flex-1 overflow-y-auto">
              {/* Current Assignment */}
              {job.assignedMechanic && (
                <Card className="border-blue-300 bg-blue-50 dark:bg-blue-950/50 dark:border-blue-800">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={job.assignedMechanic.avatar} />
                        <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                          {job.assignedMechanic.name.split(' ').map((n:any) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">{job.assignedMechanic.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Currently Assigned</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700">
                        Assigned
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900 dark:text-white">Search Mechanics</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-400" />
                  <Input
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Mechanics List */}
              <div className="space-y-2 flex-1 min-h-0">
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {filteredMechanics.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <User className="h-8 w-8 mx-auto mb-2 text-gray-400 dark:text-gray-500" />
                      <p>No mechanics found</p>
                    </div>
                  ) : (
                    filteredMechanics.map((mechanic) => (
                      <Card 
                        key={mechanic.id} 
                        className={`cursor-pointer transition-all duration-200 ${
                          selectedMechanic?.id === mechanic.id 
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/50 dark:border-blue-600 shadow-md' 
                            : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                        onClick={() => setSelectedMechanic(mechanic)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={mechanic.avatar || '/media/avatars/default.png'} />
                              <AvatarFallback className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                                {mechanic.name.split(' ').map((n:any) => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 dark:text-white">{mechanic.name}</p>
                              <p className="text-sm text-gray-600 dark:text-green-500">Available</p>
                            </div>
                            {selectedMechanic?.id === mechanic.id && (
                              <div className="h-5 w-5 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center shadow-sm">
                                <Check className="h-3 w-3 text-white" />
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>

              {/* Job Details Summary */}
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">Job Summary</h4>
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-600">
                    <p><span className="font-medium">Vehicle:</span> {job.vehicle.year} {job.vehicle.make} {job.vehicle.model}</p>
                    <p><span className="font-medium">Garage:</span> {job.garage.name}</p>
                    <p><span className="font-medium">Status:</span> {job.status}</p>
                    <p><span className="font-medium">Progress:</span> {job.progress}%</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between p-6 border-t ">
            <div>
              {job.assignedMechanic && (
                <Button 
                  variant="outline" 
                  onClick={handleUnassign}
                  className="text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-700 dark:hover:bg-red-950/50"
                >
                  Unassign Current
                </Button>
              )}
            </div>
            <div className="flex gap-1">
            
              <Button 
                onClick={handleAssign}
                disabled={!selectedMechanic}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <User className="h-4 w-4" />
                {job.assignedMechanic ? 'Reassign' : 'Assign'} Mechanic
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { AssignMechanicDialog };
