\connect xsolla_test;

DO $$ DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = current_schema()) LOOP
    EXECUTE 'drop table if exists "' || quote_ident(r.tablename) || '" cascade';
  END LOOP;
END $$;

create table products(
    id serial,
    sku varchar(10) unique,
    name varchar(200),
    type varchar(100),
    price numeric(10,5)
);

alter table products
add constraint pk_product_id primary key(id);

create index product_sku on products(sku);

grant select, insert, update, delete  on all tables in schema public to ecom;
grant all privileges on all sequences in schema public to ecom;