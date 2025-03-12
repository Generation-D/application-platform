-- NOTE: Execute the both individually!! Without them document upload wont work!

CREATE POLICY "all_cmds" ON "storage"."objects"
AS PERMISSIVE FOR ALL
TO authenticated
USING (((auth.uid() = owner)))
WITH CHECK (((auth.uid() = owner)))

CREATE POLICY "all_cmds" ON "storage"."buckets"
AS PERMISSIVE FOR ALL
TO authenticated
USING (((auth.uid() = owner)))
WITH CHECK (((auth.uid() = owner)))