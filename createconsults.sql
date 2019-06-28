create table consults(consult_no int primary key auto_increment,doc_id int,pid int,date_c date,foreign key(doc_id) references doctor(doc_id),foreign key(pid)references patient(pid));

