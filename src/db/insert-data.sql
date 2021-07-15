\connect xsolla_test;

DO $$ DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = current_schema()) LOOP
    EXECUTE 'delete from "' || quote_ident(r.tablename) || '";';
  END LOOP;
END $$;

insert into products(sku, name, type, price)
values
('hplpa5a24', 'HP Pavilion', 'laptop', 567.0074),
('vblpa9a54', 'VivoBook', 'laptop', 351),
('mslpi5n68', 'MSI', 'laptop', 892)