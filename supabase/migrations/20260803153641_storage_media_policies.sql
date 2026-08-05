/*
# Storage policies for media bucket

## Overview
Public read access to the `media` storage bucket so the website can display
uploaded images. Authenticated admins can upload, update and delete objects.

## Policies
- Public SELECT on storage.objects for the media bucket.
- Authenticated INSERT / UPDATE / DELETE on storage.objects for the media bucket.
*/

DROP POLICY IF EXISTS "anon_read_media_bucket" ON storage.objects;
CREATE POLICY "anon_read_media_bucket"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'media');

DROP POLICY IF EXISTS "auth_insert_media_bucket" ON storage.objects;
CREATE POLICY "auth_insert_media_bucket"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'media');

DROP POLICY IF EXISTS "auth_update_media_bucket" ON storage.objects;
CREATE POLICY "auth_update_media_bucket"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'media') WITH CHECK (bucket_id = 'media');

DROP POLICY IF EXISTS "auth_delete_media_bucket" ON storage.objects;
CREATE POLICY "auth_delete_media_bucket"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'media');
