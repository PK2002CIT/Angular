create table user(
    id int primary key not null auto_increment,
    name varchar(255) not null,
    contactNumber varchar(255) not null,
    email varchar(255) not null,
    password varchar(255) not null,
    status varchar(255) not null,
    role varchar(255) not null,
    UNIQUE (email)
);


insert into user(name, contactNumber, email, password, status, role) values('admin', '1234567890', 'admin@gmail.com','admin','true','admin');


create table category(
   id int NOT NULL auto_increment,
   name varchar(255) NOT NULL,
   primary key(id)
);


create table product(
    id int NOT NULL auto_increment,
    name varchar(255) NOT NULL,
    categoryId integer NOT NULL,
    description varchar(255),
    price integer,
    status varchar(20),
    primary key(id)
)


create table bill(
   id int not null auto_increment,
   uuid varchar(200) not null,
   name varchar(255) not null,
   email varchar(255) not null,
   contactNumber varchar(20) not null,
   paymentMethod varchar(50) not null,
   total int not null,
   productDetails JSON default null,
   createdBy varchar(255) not null,
   primary key(id)
);