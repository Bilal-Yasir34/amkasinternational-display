import { supabase, MEDIA_BUCKET } from './supabase';

const MAX_DIMENSION = 1600;
const THUMBNAIL_DIMENSION = 400;
const QUALITY = 0.82;

export type OptimizedImage = {
  path: string;
  publicUrl: string;
  width: number;
  height: number;
  size_bytes: number;
  mime_type: string;
};

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function drawScaled(
  img: HTMLImageElement,
  maxDim: number,
  mime: string,
  quality: number,
): Promise<{ blob: Blob; width: number; height: number }> {
  const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');
  ctx.drawImage(img, 0, 0, w, h);
  const blob: Blob = await new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b as Blob), mime, quality),
  );
  return { blob, width: w, height: h };
}

// Auto-create media bucket if missing
async function ensureBucketExists(): Promise<boolean> {
  try {
    const { data: bucket, error } = await supabase.storage.getBucket(MEDIA_BUCKET);
    if (!bucket || error) {
      const { error: createErr } = await supabase.storage.createBucket(MEDIA_BUCKET, {
        public: true,
        fileSizeLimit: 15 * 1024 * 1024,
      });
      if (createErr) {
        console.warn('Could not create storage bucket via API:', createErr.message);
        return false;
      }
    }
    return true;
  } catch (err) {
    console.warn('Storage bucket check failed:', err);
    return false;
  }
}

export async function optimizeAndUpload(
  file: File,
  folder: string,
  onProgress?: (pct: number) => void,
): Promise<OptimizedImage> {
  if (!file.type.startsWith('image/')) throw new Error('Only image files are allowed.');
  if (file.size > 12 * 1024 * 1024) throw new Error('Image exceeds 12MB limit.');

  onProgress?.(10);
  const dataUrl = await blobToDataUrl(file);
  const img = await loadImage(dataUrl);

  const outMime = 'image/jpeg';
  const { blob: mainBlob, width, height } = await drawScaled(img, MAX_DIMENSION, outMime, QUALITY);
  onProgress?.(40);

  const safeName = file.name.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase();
  const basePath = `${folder}/${safeName}-${Date.now()}`;

  // Try to ensure bucket exists
  await ensureBucketExists();

  let publicUrl: string = '';
  let finalPath: string = `${basePath}.jpg`;
  let uploadSuccess = false;

  try {
    const { data: upMain, error: errMain } = await supabase.storage
      .from(MEDIA_BUCKET)
      .upload(finalPath, mainBlob, { contentType: outMime, upsert: true });

    if (errMain) {
      // If bucket not found, retry auto-creating bucket
      if (
        errMain.message?.includes('Bucket not found') ||
        (errMain as any).error === 'Bucket not found' ||
        (errMain as any).statusCode === '404' ||
        (errMain as any).statusCode === '400'
      ) {
        await supabase.storage.createBucket(MEDIA_BUCKET, { public: true });
        const retry = await supabase.storage
          .from(MEDIA_BUCKET)
          .upload(finalPath, mainBlob, { contentType: outMime, upsert: true });
        if (!retry.error && retry.data) {
          finalPath = retry.data.path;
          publicUrl = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(finalPath).data.publicUrl;
          uploadSuccess = true;
        }
      }
    } else if (upMain) {
      finalPath = upMain.path;
      publicUrl = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(finalPath).data.publicUrl;
      uploadSuccess = true;
    }
  } catch (err) {
    console.warn('Storage upload error, falling back to data URL:', err);
  }

  onProgress?.(70);

  // Optional thumbnail upload if storage works
  if (uploadSuccess) {
    try {
      const { blob: thumbBlob } = await drawScaled(img, THUMBNAIL_DIMENSION, outMime, QUALITY);
      await supabase.storage
        .from(MEDIA_BUCKET)
        .upload(`${basePath}-thumb.jpg`, thumbBlob, { contentType: outMime, upsert: true });
    } catch {
      // ignore optional thumbnail failure
    }
  }

  // If storage upload failed or bucket couldn't be created, fall back gracefully to data URL
  if (!uploadSuccess || !publicUrl) {
    const optimizedDataUrl = await blobToDataUrl(mainBlob);
    publicUrl = optimizedDataUrl;
    finalPath = `data-url/${safeName}-${Date.now()}`;
  }

  onProgress?.(85);

  // Record in media table if database connected
  try {
    await supabase.from('media').insert({
      name: file.name,
      path: finalPath.startsWith('data-url/') ? 'data-url' : finalPath,
      folder: folder || 'general',
      width,
      height,
      size_bytes: mainBlob.size,
      mime_type: outMime,
      alt: safeName.replace(/-/g, ' '),
    });
  } catch (dbErr) {
    console.warn('Could not insert media row:', dbErr);
  }

  onProgress?.(100);

  return {
    path: finalPath,
    publicUrl,
    width,
    height,
    size_bytes: mainBlob.size,
    mime_type: outMime,
  };
}

export function thumbFromUrl(url: string): string {
  if (!url) return url;
  return url.replace(/\.jpg(\?|$)/, '-thumb.jpg$1');
}

export function responsiveSrcSet(url: string): string | undefined {
  if (!url || !url.includes('images.pexels.com')) return undefined;
  const widths = [400, 800, 1200, 1600];
  return widths
    .map((w) => `${url}&w=${w} ${w}w`)
    .join(', ');
}
