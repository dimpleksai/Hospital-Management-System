create trigger t1
before insert on consults
for each row
begin
declare x int; 
set x=(select count(*) from consults c join doctor d on c.doc_id=d.doc_id where pid=new.pid and c.date_c>curdate() and d.dept_name=(select dept_name from doctor where doc_id=new.doc_id));
if x>0
then
signal sqlstate '45000'
set message_text='book only once for each department';
end if;
end;
//
