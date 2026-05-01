CREATE POLICY "Admin can delete contact requests"
ON public.contact_requests
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));