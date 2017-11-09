const express = require('express');
const mysql = require('mysql');

const app = express();
app.set('view engine','ejs');

app.use(express.static(__dirname+'/public'))
// Create connection
const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'hospital'
});

// Connect
db.connect((err) => {
    if(err){
        throw err;
    }
    console.log('MySql Connected...');
});

// Create DB
app.get('/createdb', (req, res) => {
    let sql = 'CREATE DATABASE hospital';
    db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('Database created...');
    });
});

app.get('/',function(req,res){
    res.render('home')
})

app.get('/adminhome',function(req,res){
    res.render('adminhome')
})

app.get('/doctorhome',function(req,res){
    res.render('dochome')
})

app.get('/bill',function(req,res){
    res.render('bill')
})
// Create table
/*app.get('/docsubmit', (req, res) => {
    let sql = 'CREATE TABLE doctor(docname VARCHAR(20), docemail VARCHAR(255), docusername VARCHAR(20), docpassword VARCHAR(20) )';
    db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('doctor table created...');
    });
});*/

/*app.get('/docsubmit1', (req, res) => {
    let sql = 'ALTER TABLE docter ADD PRIMARY KEY (docid)';
    let query = db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
        //res.render('dochome');
    });
});*/

// Insert post 1
app.get('/docsubmit', (req, res) => {
    let post = {doctorid: req.query.doctorid ,docname: req.query.firstname, docemail: req.query.email, docusername: req.query.username, docpassword:req.query.pwd};
    let sql = 'INSERT INTO docter SET ?';
    let query = db.query(sql, post, (err, result) => {
        if(err){
            res.send('you r a fake doctor')
        };
        console.log(result);
        res.render('dochome');
    });
});

app.get('/appointment',function(req,res){
let post = {patname:req.query.patname,
        phno:req.query.phno,
        symptoms:req.query.symptoms,
        dept:req.query.dept,
        gen:req.query.gen,
        email:req.query.patemail//id is given
    }
let sql='INSERT INTO patappoint SET ?';
let query =db.query(sql,post, (err,result)=>{
        if(err) throw err;
        console.log(result);
        res.render('home');
})
})

app.get('/signupsubmit', (req, res) => {
    let post = {adminname: req.query.firstname, adminemail: req.query.email, adminusername: req.query.username, adminpassword:req.query.pwd};
    let sql = 'INSERT INTO admin SET ?';
    let query = db.query(sql, post, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.render('adminhome');
    });
});

app.get('/same', (req, res) => {
    let post = {doctorid: req.query.doctorid, doctorname: req.query.doctorname, doctoraddress: req.query.doctoraddress, Specialist:req.query.Specialist};
    let sql = 'INSERT INTO admindoctor SET ?';
    let query = db.query(sql, post, (err, result) => {
        if(err){
            res.send(err)
        };
        console.log(result);
        res.render('adminportal',{result:result});
    });
});

app.get('/samepage', (req, res) => {
    let post = {patientid: req.query.patientid, patientname: req.query.patientname, patientaddress: req.query.patientaddress, roomno:req.query.roomno};
    let sql = 'INSERT INTO adminpat SET ?';
    let query = db.query(sql, post, (err, result) => {
        if(err){
            res.send("error is rendering patient id (PRIMARY)"+err)
        }else{
        console.log(result);
        let sql=`SELECT * FROM adminpat WHERE patientid ='${req.query.patientid}'`
        let query=db.query(sql, (err,result) =>{
           if(err){
            res.send(err)
        }else{
            res.render('adminportal',{result:result});
        } 
        })
        }     
    });
});

app.get('/viewpatient',(req,res)=>{
    let sql=`SELECT * FROM adminpat`
        let query=db.query(sql, (err,result) =>{
           if(err){
            res.send(err)
        }else{
            res.render('adminportal',{result:result});
        } 
        })
})
//select
app.get('/docloginsubmit', (req, res) => {
    let sql = `SELECT * FROM docter WHERE docemail = '${req.query.email}' AND docpassword = '${req.query.pwd}'`;
    let query = db.query(sql, (err, result) => {
        if(err) console.log("error is" + err);
        console.log(result);
       // let sql2 = `SELECT * FROM docter`;
        let sql = `SELECT * FROM patappoint `;
        let query =db.query(sql,(err, result) => {
            res.render('docportal',{result:result});
        })
        });
});

app.get('/loginsubmit', (req, res) => {
    let sql = `SELECT * FROM admin WHERE adminemail = '${req.query.email}' AND adminpassword = '${req.query.pwd}'`;
    let query = db.query(sql, (err, result) => {
        if(err) console.log("error is" + err);
        console.log(result);
        if(result.length>0){
        let sql = `SELECT * FROM admin `;
        let query =db.query(sql,(err, result) => {
            res.render('adminportal',{result:result});
        })
    }else{res.send('email or password is wrong')}
        });
    
});

app.get('/viewdoctor',function(req,res){
let sql = `SELECT * FROM admindoctor`
let query = db.query(sql, (err,result)=>{
    if(err){
        res.send('find error')
    }else{
        res.render('docprofile',{result:result})
    }
})
})

// Select single post
app.get('/getpost/:id', (req, res) => {
    let sql = `SELECT * FROM posts WHERE id = ${req.params.id}`;
    let query = db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.json('Post fetched...' + result);//json or send
    });
});

// Update post
app.get('/updatepost/:id', (req, res) => {
    //let patname = 'Updated Title';
    let sql = `UPDATE patappoint SET patname = '${req.query.updatename}' WHERE id = ${req.params.id}`;
    let query = db.query(sql, (err, result) => {
        if(err) throw err;
        //console.log(result);
        res.send('Post updated...');
    });
});

// Delete post
app.get('/deletepost/:id', (req, res) => {
    let newTitle = 'Updated Title';
    let sql = `DELETE FROM patappoint WHERE id = ${req.params.id}`;
    let query = db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('Post deleted...');
    });
});

app.get('/updatepat/:id', (req, res) => {
    //let patname = 'Updated Title';
    let sql = `UPDATE adminpat SET patientname = '${req.query.updatename}' WHERE patientid = '${req.params.id}'`;
    let query = db.query(sql, (err, result) => {
        if(err) throw err;
        //console.log(result);
        res.send('Post updated...');
    });
});

// Delete post
app.get('/deletepat/:id', (req, res) => {
    let newTitle = 'Updated Title';
    let sql = `DELETE FROM adminpat WHERE patientid = '${req.params.id}'`;
    let query = db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('Post deleted...');
    });
});

app.listen('3000', () => {
    console.log('Server started on port 3000');
});