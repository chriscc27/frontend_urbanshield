import api from './api';

export const getPresignedUrl = async ({ fileName, contentType, fileSize }) => {
  const { data } = await api.post('/uploads/presigned-url', {
    fileName,
    contentType,
    fileSize,
  });
  return data.data;
};

export const uploadFileToS3 = async (file, presigned) => {
  if (!presigned.uploadUrl) {
    return presigned.publicUrl;
  }
  await fetch(presigned.uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  });
  return presigned.publicUrl;
};
