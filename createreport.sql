create table report(report_no int primary key auto_increment,consult_no int not null,foreign key(consult_no) references consults(consult_no));
