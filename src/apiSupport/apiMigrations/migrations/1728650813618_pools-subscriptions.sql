DROP FUNCTION IF EXISTS public.notify_xyk_pool_volume CASCADE;

CREATE FUNCTION public.notify_xyk_pool_volume ()
  RETURNS TRIGGER
  AS $$
BEGIN
  CASE TG_OP
  WHEN 'INSERT' THEN
    PERFORM
      public.notify ('state_changed', 'created', 'xyk_pool_historical_volume', NEW.id); RETURN NEW;
  WHEN 'UPDATE' THEN
    PERFORM
      public.notify ('state_changed', 'updated', 'xyk_pool_historical_volume', NEW.id); RETURN NEW;
  WHEN 'DELETE' THEN
    PERFORM
      public.notify ('state_changed', 'deleted', 'xyk_pool_historical_volume', OLD.id); RETURN OLD;
  END CASE;
END
$$ VOLATILE
LANGUAGE plpgsql;

CREATE TRIGGER _500_gql_update_xyk_pool_historical_volume
  AFTER INSERT OR UPDATE OR DELETE ON public.xyk_pool_historical_volume
  FOR EACH ROW
  EXECUTE PROCEDURE public.notify_xyk_pool_volume ();