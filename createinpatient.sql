create table in_patient(consult_no int,room_no int,foreign key(consult_no) references consults(consult_no),foreign key(room_no) references room(room_no),primary key(consult_no,room_no));
