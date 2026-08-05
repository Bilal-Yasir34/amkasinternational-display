/*
# Storage Media Bucket Auto-Creation & Public Access Policies

Ensures that the 'media' storage bucket is created in storage.buckets with public access.
Provides public SELECT, INSERT, UPDATE, and DELETE policies for all media uploads.
*/

-- 1. Create the 'media' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  15728640, -- 15MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/x-icon', 'image/vnd.microsoft.icon']
)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Grant permissions on storage.objects
DROP POLICY IF EXISTS "public_select_media_bucket" ON storage.objects;
CREATE POLICY "public_select_media_bucket"
ON storage.objects FOR SELECT TO anon, authenticated, public
USING (bucket_id = 'media');

DROP POLICY IF EXISTS "public_insert_media_bucket" ON storage.objects;
CREATE POLICY "public_insert_media_bucket"
ON storage.objects FOR INSERT TO anon, authenticated, public
WITH CHECK (bucket_id = 'media');

DROP POLICY IF EXISTS "public_update_media_bucket" ON storage.objects;
CREATE POLICY "public_update_media_bucket"
ON storage.objects FOR UPDATE TO anon, authenticated, public
USING (bucket_id = 'media') WITH CHECK (bucket_id = 'media');

DROP POLICY IF EXISTS "public_delete_media_bucket" ON storage.objects;
CREATE POLICY "public_delete_media_bucket"
ON storage.objects FOR DELETE TO anon, authenticated, public
USING (bucket_id = 'media');
