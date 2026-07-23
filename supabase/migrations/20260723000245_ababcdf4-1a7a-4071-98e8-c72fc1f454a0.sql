-- Trigger/helper functions: not meant to be called via the API.
revoke execute on function public.set_updated_at() from public, anon, authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.validate_appointment() from public, anon, authenticated;
-- has_role() must remain executable by authenticated (used inside RLS policies),
-- but revoke from anon since anon policies don't reference it.
revoke execute on function public.has_role(uuid, public.app_role) from public, anon;