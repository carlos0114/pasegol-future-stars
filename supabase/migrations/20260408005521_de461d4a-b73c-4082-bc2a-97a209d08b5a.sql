CREATE POLICY "Admin can view all contact requests"
ON public.contact_requests FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));