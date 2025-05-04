-- Policy to allow all authenticated users to access PDF buckets
CREATE POLICY "pdf_bucket_access" ON "storage"."buckets"
AS PERMISSIVE FOR ALL
TO authenticated
USING (name LIKE 'pdf-%');

-- Policy to allow all authenticated users to access PDF objects
CREATE POLICY "pdf_object_access" ON "storage"."objects"
AS PERMISSIVE FOR ALL
TO authenticated
USING (bucket_id::text LIKE 'pdf-%');
