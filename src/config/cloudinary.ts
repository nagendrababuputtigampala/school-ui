export interface CloudinaryUploadResult {
  secureUrl: string;
  publicId?: string;
  originalFilename?: string;
}

const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

/**
 * Uploads an image file to Cloudinary using the unsigned upload API.
 */
export async function uploadImageToCloudinary(
  file: File,
  options: { folder?: string } = {}
): Promise<CloudinaryUploadResult> {
  if (!cloudName || !uploadPreset) {
    throw new Error('Missing Cloudinary configuration. Set REACT_APP_CLOUDINARY_* env vars.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  const folder = options.folder;
  if (folder) {
    formData.append('folder', folder);
  }

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Cloudinary upload failed: ${response.status} ${message}`);
  }

  const json = (await response.json()) as {
    secure_url?: string;
    public_id?: string;
    original_filename?: string;
  };

  if (!json.secure_url) {
    throw new Error('Cloudinary upload did not return a secure URL.');
  }

  return {
    secureUrl: json.secure_url,
    publicId: json.public_id,
    originalFilename: json.original_filename,
  };
}
