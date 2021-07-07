create table products(
    id serial,
    sku varchar(6),
    name varchar(200),
    type varchar(100),
    price numeric(10,5)
);

alter table products
add constraint pk_product_id primary key(id)
add constraint ck_product_sku unique(sku);

create index product_sku on products(sku);