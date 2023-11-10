import { supabaseClient } from '.';

export const publicBucketName = 'botnet-assets';

export const publicFolderForAvatarImages = 'public-avatars';

export const publicFolderForBotAudio = 'bot-audio';

/**
 * Upload image file for profile avatar
 * @param file
 * @param id
 * @param name
 * @returns
 */
export const uploadAvatarIamge = async (
  file: File | Blob,
  id: string,
  name: string,
): Promise<string> => {
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
