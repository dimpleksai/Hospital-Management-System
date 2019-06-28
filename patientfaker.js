var faker = require('faker');
var mysql = require('mysql');
var phone = require('phone-regex');

var connection =  mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'selvanmalar',
    database : 'hospital1'
});
var genders = ['female','male'];

var data=[];
for(var i=0; i<150; i++){
    var gend=faker.random.arrayElement(genders)
    data.push([
        faker.name.firstName(gend),
        faker.random.number({min:7776690000, max:9999999999}),
        //phone({ indian: true }).test('9744142626'),
        //faker.phone.phoneNumberFormat(),
        gend,
        faker.random.number({min:15, max:90}),
        faker.random.number({min:40, max:80}),
        faker.random.number({min:140, max:185}),
        faker.address.streetAddress(),
        faker.internet.password()
    ]);
}

var q = 'INSERT INTO patient(name,contact,gender,age,weight,height,address,password) values ?';

connection.query(q,[data],function(err,results,fields){
    if(err) throw err;
    console.log(results);
});
connection.end();
