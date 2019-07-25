var mongo=require("mongodb").MongoClient
var express=require("express")
var body_parser=require("body-parser")
const cors=require("cors")
mongo.Promise=global.Promise;
var app=express();
app.use(body_parser.json())
app.use(cors({origin:'http://localhost:4200'}));
app.listen(3000);

var conn;
var flag;
const url = 'mongodb://127.0.0.1:27017';
    options = {
    useNewUrlParser: true
    };

 

mongo.connect(url,options,function(err,db){
    conn=db;
    
    if(!err){
        flag=true;
    }
    else{
        flag=false;
    }
})

app.post("/login", function(req,res){
    if(flag==false){
        mongo.connect(url,options,function(err,db){
        conn=db;
        })
    }
    
    var body=req.body;
        dbName="tms"
        return conn.db('tms').collection('employee').find({$and:[{employeeId:body.employeeId},{password:body.password}]}).toArray()
        .then(function (dbs) {
        
        
        if(!dbs.length>0){
            console.log("here")
            res.send({"result":"login unsuccessful"});
            res.send();
        }
        
        res.status(200).send(dbs[0]);
        
    
    }).catch(err=>{
        res.status(400).send({"result":"login unsuccessful"});
    })

})

app.post("/createORcopy/:id",function(req,res){
    if(flag==false){
        mongo.connect(url,options,function(err,db){
        conn=db;
        })
    }
    var id=req.params.id;
    var body=req.body;
    
       dbName = 'tms';
    
    var stdate=new Date(body.startDate)
    var endate=new Date(body.endDate)
    sdate=new Date(new Date(stdate).toISOString())
    edate=new Date(new Date(endate).toISOString())
       
    return conn.db(dbName).collection('tasks').insertOne({taskId:body.taskId,type:body.type,developerId:id,startDate:sdate,endDate:edate,remainingWork:body.remainingWork,total:body.total,comments:body.comments,status:"active",project:body.project,sprint:body.sprint},function(err,result){
        if (err) throw err;
        


    })
    .then(function (dbs) {
        res.status(200).send({"result":"insert successful"});
        
        
    
    }).catch(err=>{
        console.log(err);
        res.status(400).send({"result":"insert unsuccessful"});
    })

})

app.get("/taskDetails/:taskId",function(req,res){
    if(flag==false){
        mongo.connect(url,options,function(err,db){
        conn=db;
        })
    }
    var id=parseInt(req.params.taskId);
    
    
       dbName = 'tms';
    
    
       
    return conn.db(dbName).collection('tasks').find({taskId:id}).toArray()

    
    .then(function (dbs) {
        delete(dbs[0]._id)
        res.status(200).send(dbs[0]);
      
    
    }).catch(err=>{
        console.log(err);
        res.status(400).send({"result":"details retrieval unsuccessful"});
    })

})

app.post("/allTasksByDate/:dId",function(req,res){
    if(flag==false){
        mongo.connect(url,options,function(err,db){
        conn=db;
        })
    }
    var did=req.params.dId;
    
    var body=req.body
    var fromDate=body.fromDate
    var toDate=body.toDate
    fDate=new Date(new Date(fromDate).toISOString())
    tDate=new Date(new Date(toDate).toISOString())
    
   
       dbName = 'tms';
    
    
       
    return conn.db(dbName).collection('tasks').find({$and:[{startDate:{$gte:fDate}},{endDate:{$lte:tDate}},{developerId:did}]}).sort({startDate:-1}).toArray()

    
    .then(function (dbs) {
        res.status(200).send(dbs);
       
    
    }).catch(err=>{
        console.log(err);
        res.status(400).send({"result":"tasks retrieval unsuccessful"});
    })

})

app.post("/allTasksByProject/:dId",function(req,res){
    if(flag==false){
        mongo.connect(url,options,function(err,db){
        conn=db;
        })
    }
    var did=req.params.dId;
    var body=req.body;
    
       dbName = 'tms';
    
    
       
    return conn.db(dbName).collection('tasks').find({$and:[{developerId:did},{project:body.project}]}).sort({project:1}).toArray()

    
    .then(function (dbs) {
        res.status(200).send(dbs);
       
    
    }).catch(err=>{
        console.log(err);
        res.status(400).send({"result":"tasks retrieval unsuccessful"});
    })

})

app.post("/allTasksByDeveloper",function(req,res){
    
    if(flag==false){
        mongo.connect(url,options,function(err,db){
        conn=db;
        })
    }
    var body=req.body;
   
       dbName = 'tms';
    
    
       
    return conn.db(dbName).collection('tasks').find({developerId:body.developerId}).sort({project:1}).toArray()

    
    .then(function (dbs) {
        res.status(200).send(dbs);
        
    
    }).catch(err=>{
        console.log(err);
        res.status(400).send({"result":"tasks retrieval unsuccessful"});
    })

})

app.post("/update/:id",function(req,res){
    if(flag==false){
        mongo.connect(url,options,function(err,db){
        conn=db;
        })
    }
    var id=req.params.id;
    var body=req.body;
   
       dbName = 'tms';
    
    var sdate=new Date(body.startDate)
    var edate=new Date(body.endDate)
       
    return conn.db(dbName).collection('tasks').updateOne({taskId:body.taskId},{$set:{type:body.type,developerId:id,startDate:sdate,endDate:edate,remainingWork:body.remainingWork,total:body.total,status:"active",project:body.project,sprint:body.sprint}},function(err,result){
        if (err) throw err;
        
    

    })
    .then(function (dbs) {
        res.status(200).send({"result":"update successful"});
        
      
    
    }).catch(err=>{
        console.log(err);
        res.status(400).send({"result":"update unsuccessful"});
    })

})

app.post("/complete",function(req,res){
    
    if(flag==false){
        mongo.connect(url,options,function(err,db){
        conn=db;
        })
    }
   
    var body=req.body;
    
    return conn.db(dbName).collection('tasks').updateOne({taskId:body.taskId},{$set:{status:"completed"}},function(err,result){
        if (err) throw err;
        
    })

    
    .then(function (dbs) {
        res.status(200).send({"result":"complete successful"});
        
       
    
    }).catch(err=>{
        console.log(err);
        res.status(400).send({"result":"complete unsuccessful"});
    })

})

app.post("/delete",function(req,res){
    if(flag==false){
        mongo.connect(url,options,function(err,db){
        conn=db;
        })
    }
   
    var body=req.body;
   
       dbName = 'tms';
       
    return conn.db(dbName).collection('tasks').updateOne({taskId:body.taskId},{$set:{status:"inactive"}},function(err,result){
        if (err) throw err;
        
    })

    
    .then(function (dbs) {
        res.status(200).send({"result":"delete successful"});
        
    
    }).catch(err=>{
        console.log(err);
        res.status(400).send({"result":"delete unsuccessful"});
    })

})



app.get("/allTasksDefault/:dId",function(req,res){
    if(flag==false){
        mongo.connect(url,options,function(err,db){
        conn=db;
        })
    }
    var did=req.params.dId;
    
    
    
    
       dbName = 'tms';
    
    
       
    return conn.db(dbName).collection('tasks').find({developerId:did}).sort({endDate:-1}).toArray()

    
    .then(function (dbs) {
        res.status(200).send(dbs);
    
    }).catch(err=>{
        console.log(err);
        res.status(400).send({"result":"tasks retrieval unsuccessful"});
    })

})

app.get("/logOut",function(req,res){

    conn.close();
    res.send({"result":"logged Out"});
})

app.post("/takeLeave/:Did",function(req,res){
    
    if(flag==false){
        mongo.connect(url,options,function(err,db){
        conn=db;
        })
    }
    var did=req.params.Did;
    var body=req.body;
    
       dbName = 'tms';
    
    var stdate=body.fromDate
    fromDate=new Date(new Date(stdate).toISOString())
    if(body.toDate!==null){
        var endate=body.toDate
        toDate=new Date(new Date(endate).toISOString())
    }
    else
       var toDate=null;
    
   
   
    return conn.db(dbName).collection('tasks').updateOne({developerId:did},{$set:{fromDate:fromDate,toDate:toDate}
    }).then(function (dbs) {
        res.status(200).send({"result":"update successful"});
    
    }).catch(err=>{
        console.log(err);
        res.status(400).send({"result":"update unsuccessful"});
    })

})
