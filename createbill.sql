create table bill(
	bno int PRIMARY KEY AUTO_INCREMENT,
	pid int not null,
	cost int not null,
	foreign key(pid) references patient(pid)
	
	
);
