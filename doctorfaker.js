var faker = require('faker');
var mysql = require('mysql');

var connection =  mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'selvanmalar',
    database : 'hospital1'
});
var departments = ['Cardiology ','Gynaecology',' General Medicine','Orthopaedics ','Surgery','Neurology','Paediatrics','Nephrology'];

var data=[];
for(var i=0; i<20; i++){
    data.push([
        faker.name.firstName(),
        faker.random.arrayElement(departments)
        faker.internet.password()
    ]);
}

var q = 'INSERT INTO doctor(name,dept_name,password) values ?';

connection.query(q,[data],function(err,results,fields){
    if(err) throw err;
    console.log(results);
});
connection.end();


