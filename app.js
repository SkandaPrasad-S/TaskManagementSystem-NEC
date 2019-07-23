var mongo=require("mongodb")
var express=require("express")
var body_parser=require("body-parser")


var app=express();
app.use(body_parser.json())
app.listen(3001);
console.log("listening at 3001");
const url = 'mongodb://127.0.0.1:27017';
    options = {
    useNewUrlParser: true
    };

app.post("/login",function(req,res){
    
    var body=req.body;
    mongo.connect(url, options).then(function (ok) {
        
       db1 = ok;
       dbName = 'tms';
        return db1.db(dbName).collection('employee').find({$and:[{employeeId:body.employeeId},{password:body.password}]}).toArray();

    })
    .then(function (dbs) {
        
        res.status(200).send(dbs);
        
        db1.close();
    
    }).catch(err=>{
        res.status(400).send("login unsuccessful");
    })

})

app.post("/createORcopy/:id",function(req,res){
    
    var id=req.params.id;
    var body=req.body;
    mongo.connect(url, options).then(function (ok) {
        
       db1 = ok;
       dbName = 'tms';
    
    var stdate=new Date(body.startDate)
    var endate=new Date(body.endDate)
    sdate=new Date(new Date(stdate).toISOString())
    edate=new Date(new Date(endate).toISOString())
       
    return db1.db(dbName).collection('tasks').insertOne({taskId:body.taskId,type:body.type,developerId:id,startDate:sdate,endDate:edate,remainingWork:body.remainingWork,total:body.total,comments:body.comments,status:"active",project:body.project,sprint:body.sprint},function(err,result){
        if (err) throw err;
        
    })

    })
    .then(function (dbs) {
        res.status(200).send("insert successful");
        
        db1.close();
    
    }).catch(err=>{
        console.log(err);
        res.status(400).send("insert unsuccessful");
    })

})

app.get("/taskDetails/:taskId",function(req,res){
    
    var id=parseInt(req.params.taskId);
    
    mongo.connect(url, options).then(function (ok) {
        
       db1 = ok;
       dbName = 'tms';
    
    
       
    return db1.db(dbName).collection('tasks').find({taskId:id}).toArray();

    })
    .then(function (dbs) {
        res.status(200).send(dbs[0]);
        db1.close();
    
    }).catch(err=>{
        console.log(err);
        res.status(400).send("details retrieval unsuccessful");
    })

})

app.get("/allTasks/:dId",function(req,res){
    
    var did=req.params.dId;
    
    // var body=req.body
    // var fromDate=body.fromDate
    // var toDate=body.toDate
    // fDate=new Date(new Date(fromDate).toISOString())
    // tDate=new Date(new Date(toDate).toISOString())
    
    mongo.connect(url, options).then(function (ok) {
        
       db1 = ok;
       dbName = 'tms';
    
    
       
    return db1.db(dbName).collection('tasks').find({developerId:did}).sort({endDate:-1}).toArray();

    })
    .then(function (dbs) {
        res.status(200).send(dbs);
        db1.close();
    
    }).catch(err=>{
        console.log(err);
        res.status(400).send(" all tasks retrieval unsuccessful");
    })

})

app.post("/allTasksByDate/:dId",function(req,res){
    
    var did=req.params.dId;
    
    var body=req.body
    var fromDate=body.fromDate
    var toDate=body.toDate
    fDate=new Date(new Date(fromDate).toISOString())
    tDate=new Date(new Date(toDate).toISOString())
    
    mongo.connect(url, options).then(function (ok) {
        
       db1 = ok;
       dbName = 'tms';
    
    
       
    return db1.db(dbName).collection('tasks').find({$and:[{startDate:{$gte:fDate}},{endDate:{$lte:tDate}},{developerId:did}]}).sort({startDate:-1}).toArray();

    })
    .then(function (dbs) {
        res.status(200).send(dbs);
        db1.close();
    
    }).catch(err=>{
        console.log(err);
        res.status(400).send("tasks retrieval unsuccessful");
    })

})

app.post("/allTasksByProject/:dId",function(req,res){
    
    var did=req.params.dId;
    var body=req.body;
    mongo.connect(url, options).then(function (ok) {
        
       db1 = ok;
       dbName = 'tms';
    
    
       
    return db1.db(dbName).collection('tasks').find({$and:[{developerId:did},{project:body.project}]}).sort({project:1}).toArray();

    })
    .then(function (dbs) {
        res.status(200).send(dbs);
        db1.close();
    
    }).catch(err=>{
        console.log(err);
        res.status(400).send("tasks retrieval unsuccessful");
    })

})

app.post("/allTasksByDeveloper",function(req,res){
    
   
    var body=req.body;
    mongo.connect(url, options).then(function (ok) {
        
       db1 = ok;
       dbName = 'tms';
    
    
       
    return db1.db(dbName).collection('tasks').find({developerId:body.developerId}).sort({project:1}).toArray();

    })
    .then(function (dbs) {
        res.status(200).send(dbs);
        db1.close();
    
    }).catch(err=>{
        console.log(err);
        res.status(400).send("tasks retrieval unsuccessful");
    })

})

app.post("/update/:id",function(req,res){
    
    var id=req.params.id;
    var body=req.body;
    mongo.connect(url, options).then(function (ok) {
        
       db1 = ok;
       dbName = 'tms';
    
    var sdate=new Date(body.startDate)
    var edate=new Date(body.endDate)
       
    return db1.db(dbName).collection('tasks').updateOne({taskId:body.taskId},{$set:{type:body.type,developerId:id,startDate:sdate,endDate:edate,remainingWork:body.remainingWork,total:body.total,status:"active",project:body.project,sprint:body.sprint}},function(err,result){
        if (err) throw err;
        
    })

    })
    .then(function (dbs) {
        res.status(200).send("update successful");
        
        db1.close();
    
    }).catch(err=>{
        console.log(err);
        res.status(400).send("update unsuccessful");
    })

})

app.post("/complete",function(req,res){
    
   
    var body=req.body;
    mongo.connect(url, options).then(function (ok) {
        
       db1 = ok;
       dbName = 'tms';
       
    return db1.db(dbName).collection('tasks').updateOne({taskId:body.taskId},{$set:{status:"completed"}},function(err,result){
        if (err) throw err;
        
    })

    })
    .then(function (dbs) {
        res.status(200).send("complete successful");
        
        db1.close();
    
    }).catch(err=>{
        console.log(err);
        res.status(400).send("complete unsuccessful");
    })

})

app.post("/delete",function(req,res){
    
   
    var body=req.body;
    mongo.connect(url, options).then(function (ok) {
        
       db1 = ok;
       dbName = 'tms';
       
    return db1.db(dbName).collection('tasks').updateOne({taskId:body.taskId},{$set:{status:"inactive"}},function(err,result){
        if (err) throw err;
        
    })

    })
    .then(function (dbs) {
        res.status(200).send("delete successful");
        
        db1.close();
    
    }).catch(err=>{
        console.log(err);
        res.status(400).send("delete unsuccessful");
    })

})
