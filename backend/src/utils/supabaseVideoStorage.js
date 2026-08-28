import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

const getClient = () => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error('Supabase video storage configuration is incomplete', { urlConfigured: Boolean(url), serviceRoleConfigured: Boolean(key), bucketConfigured: Boolean(process.env.SUPABASE_VIDEO_BUCKET) });
    throw new Error('Supabase video storage is not configured');
  }
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
};

export const uploadReelVideo = async (file) => {
  const bucket = process.env.SUPABASE_VIDEO_BUCKET;
  if (!bucket) throw new Error('SUPABASE_VIDEO_BUCKET is not configured');
  if (!file?.buffer?.length) throw new Error('Video upload did not include a file buffer');
  const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '-');
  const path = `reels/${randomUUID()}-${safeName}`;
  console.info('Uploading reel video to Supabase', { urlConfigured: Boolean(process.env.SUPABASE_URL), serviceRoleConfigured: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY), bucket, filename: file.originalname, mimeType: file.mimetype, size: file.size, storagePath: path });
  const client = getClient();
  const { error } = await client.storage.from(bucket).upload(path, file.buffer, { contentType: file.mimetype, upsert: false });
  if (error) {
    console.error('Supabase reel upload failed', { message: error?.message, name: error?.name, cause: error?.cause?.message, status: error?.status || error?.statusCode, details: error?.details, bucket, path, filename: file.originalname, mimeType: file.mimetype, fileSize: file.size });
    throw new Error('Supabase upload failed: ' + error.message);
  }
  const { data } = client.storage.from(bucket).getPublicUrl(path);
  return { url: data.publicUrl, path };
};

export const deleteReelVideo = async (path) => {
  if (!path || !process.env.SUPABASE_VIDEO_BUCKET) return;
  const { error } = await getClient().storage.from(process.env.SUPABASE_VIDEO_BUCKET).remove([path]);
  if (error) {
    console.error('Supabase reel delete failed', { message: error?.message, name: error?.name, cause: error?.cause?.message, status: error?.status || error?.statusCode, details: error?.details, bucket: process.env.SUPABASE_VIDEO_BUCKET, path });
    throw new Error('Supabase delete failed: ' + error.message);
  }
};