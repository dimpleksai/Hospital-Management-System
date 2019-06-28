create table diagnosis(dia_no int primary key auto_increment,consult_no int not null,problem varchar(50) not null,foreign key(consult_no) references consults(consult_no));
