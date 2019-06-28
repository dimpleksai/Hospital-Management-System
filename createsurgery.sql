create table surgery(srno int PRIMARY KEY AUTO_INCREMENT,
	sname varchar(30) not null,
	pid int not null,
	doc_id int not null,
	date_s date not null,
	foreign key(pid) references patient(pid),
	foreign key(doc_id) references doctor(doc_id)
);
