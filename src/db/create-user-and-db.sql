-- Do this script by postgres on table postgres 
drop database if exists xsolla_test;
drop role if exists ecom;
create user ecom with password 'ecom-password';
create database xsolla_test owner ecom;
\connect xsolla_test;

