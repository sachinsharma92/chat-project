import { supabaseClient } from '.';

export const publicBucketName = 'botnet-assets';

export const publicFolderForAvatarImages = 'public-avatars';

export const uploadAvatarIamge = async (
  file: File,
  id: string,
  name: string,
) => {
  const filePath = `${publicFolderForAvatarImages}/${id}-${name}`;
  const { data: uploadData, error } = await supabaseClient.storage
    .from(publicBucketName)
    .upload(filePath, file);

  if (uploadData && !error) {
    const path = uploadData?.path;
    const { data: urlData } = supabaseClient.storage
      .from(publicBucketName)
      .getPublicUrl(path);

    return urlData?.publicUrl;
  }

  console.log('uploadAvatarIamge() err', error?.message);

  return '';
};
