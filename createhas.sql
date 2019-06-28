create table has(dia_no int ,med_no int,noftab int,dosage varchar(30),PRIMARY KEY(dia_no,med_no),
	foreign key(dia_no) references diagnosis(dia_no),
	foreign key(med_no) references medicine(med_no)
);
	

