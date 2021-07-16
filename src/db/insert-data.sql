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
('mslpi5n68', 'MSI', 'laptop', 892),
('smphsm-g7', 'Samsung Galaxy S20', 'mphone', 1529),
('smphsm-g9', 'Samsung Galaxy S21 5G', 'mphone', 2050),
('xiphmirn9', 'Xiaomi Redmi Note 10S', 'mphone', 650),
('xiphxir-9', 'Xiaomi Redmi 9', 'mphone', 417),
('ipphapi11', 'iPhone 11', 'mphone', 1670),
('xiphxir9t', 'Xiaomi Redmi 9T', 'mphone', 464),
('nbphnbma6', 'Nubia Red Magic 6', 'mphone', 1900),
('ibwkdx160', 'iBasso DX160', 'walkman', 2050)






