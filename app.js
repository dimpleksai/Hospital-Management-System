var express=require('express');
var app= express();
var mysql = require('mysql');
var faker = require('faker');
var bodyparser= require('body-parser');

app.set("view engine","ejs");
app.use(bodyparser.urlencoded({extended:true}));

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "selvanmalar",
  database:"hospital1"
});

app.use(express.static("public"));
 
app.get("/",function(req,res){
    con.query("select count(*) as c from patient",function(err,results1){
        if(err) throw error;
       console.log(results1[0].c);
    con.query("select count(*) as c,dept_name from doctor group by dept_name",function(err,results2){
        if(err) throw err;
        console.log(results2);
    con.query("select count(*) as c,type from room group by type",function(err,results3){
        if(err) throw err;
        console.log(results3);
        
        res.render("hm",{l:results1[0].c,m:results2,n:results3});
    });    
    });    
    });

});


app.get("/login",function(req,res){
res.render("login",{code:"noerror"});
});

app.get('/doctor_login',function(req,res){
res.render("doctor_login",{code:"noerror"});
});    


app.get('/signup', function (req, res) {
res.render("signup");
});

var number;
app.post("/patient",function(req,res){
number=req.body.number;
var pwd=req.body.pwd;
con.query('select * from patient where pid=?',[number],function(err,results){
if(err) throw err; 
else if(results.length>0)
{
	if( results[0].password==pwd)
	{
	con.query("select name,dept_name,date_c from v1 where pid= ?",[number],function(err,results1){
	console.log(results1);
	if(err) throw err; 
	con.query("select b.bno,b.cost from patient p join bill b on p.pid=b.pid where p.pid= ?",[number],function(err,results2){
	console.log(results2);
	if(err) throw err; 
	con.query(" select c.date_c,test_name from consults c join assigns a on c.consult_no=a.consult_no where c.pid = ?",[number],function(err,results3){
	console.log(results3);
	if(err) throw err; 
	con.query("select c.date_c,problem from consults c join diagnosis d on c.consult_no=d.consult_no where c.pid = ?",[number],function(err,results4){
	console.log(results4);
	if(err) throw err;
	/*con.query("select c.date_c,i.room_no,type from consults c join in_patient i join room r on c.consult_no=i.consult_no and i.room_no=r.room_no where c.pid= ?",[number],function(err,results5){
	console.log(results5);
	if(err) throw err; */
	con.query("select sname,doc_id,date_s from surgery where pid= ? and date_s < curdate()",[number],function(err,results6){
	console.log(results6);
	if(err) throw err; 
	con.query(" select c.date_c,m.name,h.noftab,h.dosage from consults c join  diagnosis d join has h join medicine m on c.consult_no=d.consult_no and d.dia_no=h.dia_no and h.med_no=m.med_no where c.date_c in (select  distinct c.date_c from consults c where c.pid= ?)",[number],function(err,results7){
	console.log(results7);
	if(err) throw err; 
	con.query("select d.name,d.dept_name,c.date_c,c.consult_no from patient p join consults c join doctor d on p.pid=c.pid and d.doc_id=c.doc_id where p.pid= ? and c.date_c>curdate() ",[number],function(err,results8){
	console.log(results8);
    

	
	res.render("patient",{p:results[0],s:results1,u:results2,x:results3,t:results4,w:results6,m:results7,y:results8,z:number});
	
	});
	});
	});
	});
	});
	});
	});
	}
	else
	{
		 
		res.render("login",{code:"error1"});
		
	}
}
else
{
	 
	res.render("login",{code:"error2"});
}		

});
});


app.post('/docview',function(req,res){
    //enter the signin code here----------------------------------------------
var docid=req.body.number;
var pwd=req.body.pwd;
con.query('select * from doctor where doc_id = ?',[docid],function(err,results){
if(err) throw err;
else if(results.length>0)
{
    if( results[0].password==pwd){
    con.query('select p.pid ,p.name from  consults c join patient p on c.pid=p.pid where doc_id = ? and date_c=curdate()',[docid],function(err,results1){
if(err) throw err;
console.log(results1);
con.query('select p.pid ,p.name,i.room_no from in_patient i join consults c join patient p where i.consult_no=c.consult_no and c.pid=p.pid and p.pid in (select pid from  consults where doc_id = ? )',[docid],function(err,results2){
if(err) throw err;
con.query('select count(*) as c from consults where doc_id=? and date_c=curdate()',[docid],function(err,results4){
    if (err) throw err;
con.query('select count(*) as o  from in_patient i join consults c on i.consult_no=c.consult_no where doc_id=?',[docid],function(err,results5){
    if (err) throw err;
    console.log(results4[0].c);
    console.log(results4[0].c+results5[0].o);
con.query('select * from  surgery s join patient p on s.pid=p.pid where doc_id = ? and date_s = curdate()',[docid],function(err,results3){
if(err) throw err;
res.render("docview",{s:results1,t:results2,u:results3,v:results4[0].c+results5[0].o,w:docid});
});
});
});
});
});
    }
    else
    {
        res.render("doctor_login",{code:"error1"});
    }
}
else
{
        res.render("doctor_login",{code:"error2"});
}       


});
});


app.post('/patient_signup',function(req,res){
    var person=[];
    person.push([
        //name :
        req.body.name_,
        //password :
        req.body.pwd,
        //age :
        req.body.age,
        //height :  
        req.body.height,
        //weight :  
        req.body.weight,
        //gender :
        req.body.gender,
        //addr :
        req.body.addr,
        //phno :
        req.body.phno
    ]);
    
    var q = 'INSERT INTO patient(name,password,age,height,weight,gender,address,contact) values ?';

    con.query(q,[person],function(err,results,fields){
        if(err) throw err;
        console.log(results);

        con.query('select * from patient order by pid desc limit 1',function(err,results1){
        if(err) throw err;

        res.send("successfully signed in please login to continue!! <br> Your pid = " + results1[0].pid + "<br><a href='/'>Click here to go back home</a>");
    });
});
});

app.post("/book_apt",function(req,res){
res.render("book_apt",{error:"noerror"});
});



app.post("/apt",function(req,res){
var date=req.body.appdate;
var rd=req.body.rd;
console.log(rd);
console.log(date);
if(rd == undefined)
{    
res.render("book_apt",{error:"error"});}
else{//or else res.send(pick a department)
con.query('select * from doctor where dept_name = ?',[rd],function(err,results1){
        if(err) throw err;

console.log(results1);
 var docid=results1[0].doc_id;
console.log(docid);
con.query('select count(*) from consults where doc_id= ? and date_c = ?',[docid,date],function(err,results2){
        if(err) throw err;
console.log(results2);
var count =results2[0];

for(var i=0;i<results1.length;i++)
{
    if(results2[i]<5)
    {
    	if(results2[i]<=count)
    	{
    		docid=results1[i].doc_id;
    	}
    }
    
}
con.query('insert into consults(doc_id,pid,date_c) values ( ?,?,?)',[docid,number,date],function(err,results){
        if(err) res.send("Book only once for each department");
        //console.log(results);
        res.render("book_apt",{error:"noerror1"});
        
        
});
});
});
}
});


app.post('/med_insert',function(req,res){
    var med =req.body.name1;
    var noftab=req.body.name2;
    var dosage=req.body.name3;
    var pid=req.body.eventname;
    console.log(pid);
    console.log(med);
    console.log(noftab);
    console.log(dosage);
    con.query('select consult_no from consults c join patient p where c.pid=p.pid and p.pid = ? order by consult_no desc limit 1',[pid],function(err,results1){
    if(err) throw err;
    console.log(results1[0].consult_no);
   
    con.query('select med_no from medicine where name = ?',[med],function(err,results2){
    if(err) throw err;
   console.log(results2[0].med_no);

   con.query('select count(*) as c from diagnosis',function(err,resultsx){
    if(err) throw err;
   console.log(resultsx[0].c);

    con.query('insert into has values(?,?,?,?)',[resultsx[0].c,results2[0].med_no,noftab,dosage],function(err,resultsi){
    if(err) throw err;
	con.query('insert into bill values(?,?,?)',[results1[0].cousult_no,pid,faker.random.number({min:500,max:10000})],function(err,results3){
	if(err) throw err;
	});	
    });
    });
    });
    });
    res.render("redir",{p:pid});
});
app.post('/delappoint',function(req,res){
    var cons=req.body.dept;
    var delapp=req.body.delap;
    if(delapp==1){
        con.query('delete from consults where consult_no = ?',[cons],function(err,results9){
            if(err) throw err;
        });
    }
    res.send("Successfully cancelled");

});

app.post('/diag',function(req,res){
    var prob =req.body.prob;
    var surrad=req.body.suryes;
    var sur=req.body.sur;
    var labrad=req.body.labyes;
    var lab=req.body.lab;
    var date=req.body.surdate;
    var pid=req.body.eventname;
    console.log(pid);
    con.query('select consult_no from consults c join patient p where c.pid=p.pid and p.pid = ? order by consult_no desc limit 1',[pid],function(err,results1){
    if(err) throw err;
    console.log(results1[0].consult_no);
   
    con.query('select dia_no from diagnosis order by dia_no desc limit 1',function(err,results){
    if(err) throw err;
    var bla=results[0].dia_no+1;
    con.query('insert into diagnosis(dia_no,consult_no,problem) values(?,?,?)',[bla,results1[0].consult_no,prob],function(err,results2){
    if(err) throw err;
   
    con.query('select doc_id from consults where consult_no =?',[results1[0].consult_no],function(err,results3){
    if(err) throw err;
   
    if(surrad=="suryes"){
        con.query('insert into surgery(sname,pid,doc_id,date_s) values(?,?,?,?)',[sur,pid,results3[0].doc_id,date],function(req,res){
        if(err) throw err;
        });
    }
    if(labrad=="labyes"){
        con.query('insert into assigns(consult_no,test_name) values(?,?)',[results1[0].consult_no,lab],function(req,res){
        if(err) throw err;

        con.query('select report_no from report order by report_no desc limit 1',function(err,result){
        if(err) throw err;
        var blah=result[0].report_no+1;
        con.query('insert into report(report_no,consult_no) values(?,?)',[blah,results1[0].consult_no],function(req,res){
        if(err) throw err;
        });
        });
        });
    }
    
    });
    });
    });
    });
    res.render("redir",{p:pid});
});


app.post('/chpass',function(req,res){
    var pid=req.body.eventname;
    con.query("select * from patient where pid = ?",[pid],function(err,results){
    console.log(results[0]);
    if(err) throw err; 
    res.render("change_pass",{p:results[0].password,q:results[0].pid});
});
});

app.post('/changing_pass',function(req,res){
    //var oldpwd = req.body.oldpa;
    //var newpwd = req.body.newpa1;
    var newpwd2 = req.body.newpa2;
    var pid=req.body.eventname;
    con.query("update patient set password= ? where pid = ?",[newpwd2,pid],function(err,results){
    if(err) throw err; 
    res.render("login",{code:"noerror"});

});
});

app.post('/logout',function(req,res){
     con.query("select count(*) as c from patient",function(err,results1){
        if(err) throw error;
    con.query("select count(*) as c,dept_name from doctor group by dept_name",function(err,results2){
        if(err) throw err;
    con.query("select count(*) as c,type from room group by type",function(err,results3){
        if(err) throw err;
        
        res.render("hm",{l:results1[0].c,m:results2,n:results3});
    });    
    });    
    });


});


app.get('/:smtgn',function(req,res){
var x=req.params.smtgn;

var pid=x.substring(0,3);
var docid=x.substring(3,7);
console.log(pid);

console.log("HELLO"+docid);
con.query('select * from patient where pid = ?',[pid],function(err,results){
if(err) throw err;
con.query("select d.name,d.dept_name,c.date_c from doctor d join consults c where c.pid= ? and c.date_c<curdate() and d.doc_id= ?",[pid,docid],function(err,results1){
    console.log(results1);
    if(err) throw err;
    con.query(" select c.date_c,a.test_name from consults c join assigns a on c.consult_no=a.consult_no where c.pid = ? and c.doc_id= ?",[pid,docid],function(err,results2){
    console.log(results2);
    if(err) throw err;
    con.query("select c.date_c,d.problem from consults c join diagnosis d on c.consult_no=d.consult_no where c.pid = ? and c.doc_id= ?",[pid,docid],function(err,results3){
    console.log(results3);
    if(err) throw err;
    con.query("select sname,doc_id,date_s from surgery where pid= ? and date_s<curdate() and doc_id= ?",[pid,docid],function(err,results4){
	console.log(results4);
	if(err) throw err; 
    
   
    res.render("docpro",{p:results[0],s:results1,t:results3,x:results2,w:results4,z:pid});
    });
    });
    });
    });
    });
    });


app.listen(8080,function(){
console.log("Server running on 8080");
});

