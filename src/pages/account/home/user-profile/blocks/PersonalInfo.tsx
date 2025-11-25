import { KeenIcon } from '@/components';
import { ImageInput } from '@/components/image-input';
import type { IImageInputFile } from '@/components/image-input';
import { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '@/auth';
import { userService } from '@/api/services/user.service';
import { toast } from 'sonner';
import { IMAGES_BASE_URL } from '@/api/config';
import { toAbsoluteUrl } from '@/utils/Assets';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const PersonalInfo = () => {
  const { auth, currentUser } = useAuthContext();
  // Get user_id from auth (stored in localStorage) or currentUser
  const userId = (auth as any)?.user_id || currentUser?.id;

  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    profile_image: null as string | null,
  });
  const [avatar, setAvatar] = useState<IImageInputFile[]>([]);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [nameData, setNameData] = useState({
    first_name: '',
    last_name: '',
  });
  const [isUpdatingName, setIsUpdatingName] = useState(false);

  // Fetch user profile on mount
  const fetchUserProfile = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      const response = await userService.getProfile({ user_id: userId });
      const data = response.data;
      
      setUserData({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        profile_image: data.profile_image || null,
      });
      
      setNameData({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
      });

      // Set avatar preview
      if (data.profile_image) {
        const imageUrl = `${IMAGES_BASE_URL}/${data.profile_image}`;
        setAvatar([{ dataURL: imageUrl }]);
      } else {
        setAvatar([{ dataURL: toAbsoluteUrl(`/media/avatars/blank.png`) }]);
      }
    } catch (error: any) {
      console.error('Failed to fetch user profile:', error);
      toast.error(error?.response?.data?.message || 'Failed to load user profile');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const handleAvatarChange = (selectedAvatar: IImageInputFile[]) => {
    setAvatar(selectedAvatar);
    // Extract file from the selected avatar if available
    if (selectedAvatar.length > 0 && selectedAvatar[0].file) {
      setSelectedImageFile(selectedAvatar[0].file);
    } else {
      setSelectedImageFile(null);
    }
  };

  const handleUploadImage = async () => {
    if (!userId) {
      toast.error('User ID not found');
      return;
    }

    if (!selectedImageFile) {
      toast.error('Please select an image first');
      return;
    }

    setIsUploadingImage(true);
    try {
      // Fetch current profile to get all required fields
      const currentProfile = await userService.getProfile({ user_id: userId });
      
      await userService.updateProfile({
        user_id: userId,
        profile_image: selectedImageFile,
        first_name: userData.first_name || currentProfile.data.first_name || '',
        last_name: userData.last_name || currentProfile.data.last_name || '',
        mobile_number: currentProfile.data.mobile_number || '',
        address1: currentProfile.data.address1 || '',
      });
      
      toast.success('Profile image updated successfully');
      setSelectedImageFile(null);
      // Refresh profile data
      await fetchUserProfile();
    } catch (error: any) {
      console.error('Failed to update profile image:', error);
      console.error('Error details:', error?.response?.data);
      toast.error(error?.response?.data?.message || 'Failed to update profile image');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleUpdateName = async () => {
    if (!userId) {
      toast.error('User ID not found');
      return;
    }

    if (!nameData.first_name || !nameData.last_name) {
      toast.error('Please fill in both first and last name');
      return;
    }

    setIsUpdatingName(true);
    try {
      // Fetch current profile to get mobile_number and address1
      const currentProfile = await userService.getProfile({ user_id: userId });
      
      const response = await userService.updateProfile({
        user_id: userId,
        first_name: nameData.first_name,
        last_name: nameData.last_name,
        mobile_number: currentProfile.data.mobile_number || '',
        address1: currentProfile.data.address1 || '',
      });
      
      console.log('Update profile response:', response);
      toast.success('Name updated successfully');
      setShowNameDialog(false);
      // Refresh profile data
      await fetchUserProfile();
    } catch (error: any) {
      console.error('Failed to update name:', error);
      console.error('Error details:', error?.response?.data);
      toast.error(error?.response?.data?.message || 'Failed to update name');
    } finally {
      setIsUpdatingName(false);
    }
  };

  const fullName = `${userData.first_name} ${userData.last_name}`.trim() || 'N/A';

  if (isLoading) {
    return (
      <div className="card min-w-full">
        <div className="card-header">
          <h3 className="card-title">Personal Info</h3>
        </div>
        <div className="card-body">
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="card min-w-full">
        <div className="card-header">
          <h3 className="card-title">Personal Info</h3>
        </div>
        <div className="card-table scrollable-x-auto pb-3">
          <table className="table align-middle text-sm text-gray-500">
            <tbody>
              <tr>
                <td className="py-2 min-w-28 text-gray-600 font-normal">Photo</td>
                <td className="py-2 text-gray700 font-normal min-w-32 text-2sm">
                  150x150px JPEG, PNG Image
                </td>
                <td className="py-2 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <ImageInput value={avatar} onChange={handleAvatarChange}>
                      {({ onImageUpload }) => (
                        <div className="image-input size-16" onClick={onImageUpload}>
                          <div
                            className="btn btn-icon btn-icon-xs btn-light shadow-default absolute z-1 size-5 -top-0.5 -end-0.5 rounded-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              setAvatar([{ dataURL: toAbsoluteUrl(`/media/avatars/blank.png`) }]);
                              setSelectedImageFile(null);
                            }}
                          >
                            <KeenIcon icon="cross" />
                          </div>
                          <span className="tooltip" id="image_input_tooltip">
                            Click to remove or revert
                          </span>

                          <div
                            className="image-input-placeholder rounded-full border-2 border-success image-input-empty:border-gray-300"
                            style={{ backgroundImage: `url(${toAbsoluteUrl(`/media/avatars/blank.png`)})` }}
                          >
                            {avatar.length > 0 && <img src={avatar[0].dataURL} alt="avatar" />}

                            <div className="flex items-center justify-center cursor-pointer h-5 left-0 right-0 bottom-0 bg-dark-clarity absolute">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="12"
                                viewBox="0 0 14 12"
                                className="fill-light opacity-80"
                              >
                                <path
                                  d="M11.6665 2.64585H11.2232C11.0873 2.64749 10.9538 2.61053 10.8382 2.53928C10.7225 2.46803 10.6295 2.36541 10.5698 2.24335L10.0448 1.19918C9.91266 0.931853 9.70808 0.707007 9.45438 0.550249C9.20068 0.393491 8.90806 0.311121 8.60984 0.312517H5.38984C5.09162 0.311121 4.799 0.393491 4.5453 0.550249C4.2916 0.707007 4.08701 0.931853 3.95484 1.19918L3.42984 2.24335C3.37021 2.36541 3.27716 2.46803 3.1615 2.53928C3.04584 2.61053 2.91234 2.64749 2.7765 2.64585H2.33317C1.90772 2.64585 1.49969 2.81486 1.19885 3.1157C0.898014 3.41654 0.729004 3.82457 0.729004 4.25002V10.0834C0.729004 10.5088 0.898014 10.9168 1.19885 11.2177C1.49969 11.5185 1.90772 11.6875 2.33317 11.6875H11.6665C12.092 11.6875 12.5 11.5185 12.8008 11.2177C13.1017 10.9168 13.2707 10.5088 13.2707 10.0834V4.25002C13.2707 3.82457 13.1017 3.41654 12.8008 3.1157C12.5 2.81486 12.092 2.64585 11.6665 2.64585ZM6.99984 9.64585C6.39413 9.64585 5.80203 9.46624 5.2984 9.12973C4.79478 8.79321 4.40225 8.31492 4.17046 7.75532C3.93866 7.19572 3.87802 6.57995 3.99618 5.98589C4.11435 5.39182 4.40602 4.84613 4.83432 4.41784C5.26262 3.98954 5.80831 3.69786 6.40237 3.5797C6.99644 3.46153 7.61221 3.52218 8.1718 3.75397C8.7314 3.98576 9.2097 4.37829 9.54621 4.88192C9.88272 5.38554 10.0623 5.97765 10.0623 6.58335C10.0608 7.3951 9.73765 8.17317 9.16365 8.74716C8.58965 9.32116 7.81159 9.64431 6.99984 9.64585Z"
                                  fill=""
                                />
                                <path
                                  d="M7 8.77087C8.20812 8.77087 9.1875 7.7915 9.1875 6.58337C9.1875 5.37525 8.20812 4.39587 7 4.39587C5.79188 4.39587 4.8125 5.37525 4.8125 6.58337C4.8125 7.7915 5.79188 8.77087 7 8.77087Z"
                                  fill=""
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      )}
                    </ImageInput>
                    {selectedImageFile && (
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={handleUploadImage}
                        disabled={isUploadingImage}
                      >
                        {isUploadingImage ? 'Uploading...' : 'Upload Image'}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="py-2 text-gray-600 font-normal">Name</td>
                <td className="py-2 text-gray-800 font-normal text-sm">{fullName}</td>
                <td className="py-2 text-center">
                  <button
                    className="btn btn-sm btn-icon btn-clear btn-primary"
                    onClick={() => setShowNameDialog(true)}
                  >
                    <KeenIcon icon="notepad-edit" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Name Update Dialog */}
      <Dialog open={showNameDialog} onOpenChange={setShowNameDialog}>
        <DialogContent className="sm:max-w-md p-6">
          <DialogHeader>
            <DialogTitle>Update Name</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                type="text"
                value={nameData.first_name}
                onChange={(e) => setNameData(prev => ({ ...prev, first_name: e.target.value }))}
                placeholder="Enter first name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                type="text"
                value={nameData.last_name}
                onChange={(e) => setNameData(prev => ({ ...prev, last_name: e.target.value }))}
                placeholder="Enter last name"
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowNameDialog(false);
                  setNameData({
                    first_name: userData.first_name,
                    last_name: userData.last_name,
                  });
                }}
                disabled={isUpdatingName}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateName}
                disabled={isUpdatingName || !nameData.first_name || !nameData.last_name}
              >
                {isUpdatingName ? 'Updating...' : 'Update Name'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export { PersonalInfo };
