
var express = require("express")
var body_parser = require("body-parser")
const cors = require("cors")
var Promise = require("bluebird")
var assert = require("assert")
var MongoClient = Promise.promisifyAll(require("mongodb")).MongoClient


var app = express();
app.use(body_parser.json())
app.use(cors({ origin: 'http://localhost:4200' }));
app.listen(3000);



var conn
var conn;
var flag;
const url = 'mongodb://127.0.0.1:27017';
options = {
    poolSize: 10,
    useNewUrlParser: true
};

MongoClient.connect("mongodb://127.0.0.1:27017", options, function (err, client) {
    assert.equal(null, err);
    conn = client.db('tms');
})
// mongo.connect(url, options, function (err, db) {
//     conn = db;

//     if (!err) {
//         flag = true;
//     }
//     else {
//         flag = false;
//     }
// })

app.post("/login", function (req, res) {

    var body = req.body;
    dbName = "tms"
    return conn.collection('employee').find({ $and: [{ employeeId: body.employeeId }, { password: body.password }] }).toArray()
        .then(function (dbs) {


            if (!dbs.length > 0) {
                console.log("here")
                res.send({ "result": "login unsuccessful" });
                res.send();
            }

            res.status(200).send(dbs[0]);


        }).catch(err => {
            res.status(400).send({ "result": "login unsuccessful" });
        })

})

app.get("/getTypes", function (req, res) {

    return conn.collection('types').find().toArray()


        .then(function (dbs) {
            for (let i in dbs)
                delete (dbs[i]._id)
            res.status(200).send(dbs);


        }).catch(err => {
            console.log(err);
            res.status(400).send({ "result": "error" });
        })

})

app.get("/getStatus", function (req, res) {


    return conn.collection('status').find().toArray()


        .then(function (dbs) {
            for (let i in dbs)
                delete (dbs[i]._id)
            res.status(200).send(dbs);


        }).catch(err => {
            console.log(err);
            res.status(400).send({ "result": "error" });
        })

})

app.get("/getProjects", function (req, res) {


    return conn.collection('projects').find().toArray()


        .then(function (dbs) {
            for (let i in dbs)
                delete (dbs[i]._id)
            res.status(200).send(dbs);


        }).catch(err => {
            console.log(err);
            res.status(400).send({ "result": "error" });
        })

})

app.post("/createORcopy/:id", function (req, res) {

    var id = req.params.id;
    var body = req.body;

    // var array
    var stdate = new Date(body.startDate)
    var endate = new Date(body.endDate)
    sdate = new Date(new Date(stdate).toISOString())
    edate = new Date(new Date(endate).toISOString())

    return conn.collection('tasks').insertOne({ taskId: body.taskId, typeId: body.typeId, projectId: body.projectId, employeeId: id, statusId: body.statusId, sprint: body.sprint, taskDescription: body.taskDescription, startDate: sdate, endDate: edate, remainingWork: body.remainingWork, totalWork: body.totalWork, taskName: body.taskName, comments: body.comments }



    )
        .then(function (dbs) {
            res.status(200).send({ "result": "insert successful" });



        }).catch(err => {
            console.log(err);
            res.status(400).send({ "result": "insert unsuccessful" });
        })

})

app.get("/taskDetails/:taskId", function (req, res) {

    if (flag == false) {
        mongo.connect(url, options, function (err, db) {
            conn = db;
        })
    }
    var id = parseInt(req.params.taskId);

    var myPromise = (id) => {
        return new Promise((resolve, reject) => {
            console.log("2")
            conn
                .collection('tasks')
                .find({ taskId: id })

                .toArray(function (err, data) {
                    err
                        ? reject(err)
                        : resolve(data[0]);
                    //   console.log(data[0])
                    console.log("3")
                });
        });
    };

    var smyPromise = (result) => {
        console.log(result)
        return new Promise((resolve, reject) => {
            console.log("2")
            conn
                .collection('status')
                .find({ statusId: result.statusId })

                .toArray(function (err, data) {
                    err
                        ? reject(err)
                        : resolve(data[0]);
                    //    console.log(data)
                    console.log("3")
                });
        });
    };

    var tmyPromise = (result) => {
        return new Promise((resolve, reject) => {
            console.log("2")
            conn
                .collection('types')
                .find({ typeId: result.typeId })

                .toArray(function (err, data) {
                    err
                        ? reject(err)
                        : resolve(data[0]);

                    console.log("3")
                });
        });
    };

    var pmyPromise = (result) => {
        return new Promise((resolve, reject) => {
            console.log("2")
            conn
                .collection('projects')
                .find({ projectId: result.projectId })

                .toArray(function (err, data) {
                    err
                        ? reject(err)
                        : resolve(data[0]);

                    console.log("3")
                });
        });
    };

    //Step 2: async promise handler
    var callMyPromise = async (id) => {
        console.log("1")

        var result = await (myPromise(id));
        console.log(result)
        var sresult = await (smyPromise(result));
        var tresult = await (tmyPromise(result));
        var presult = await (pmyPromise(result));

        var array = [result, sresult, tresult, presult]

        //anything here is executed after result is resolved
        console.log("4")
        return array;
    };

    //Step 3: make the call
    callMyPromise(id).then(function (array) {

        console.log("5")
        res.send(array)

    });
}); //end mongo client




app.post("/allTasks/:dId", function (req, res) {
    
    var did = req.params.dId;

    // var body = req.body
    // var fromDate = body.fromDate
    // var toDate = body.toDate
    // fDate = new Date(new Date(fromDate).toISOString())
    // tDate = new Date(new Date(toDate).toISOString())
    getData(did).then(function (array) {

        console.log("5")
        
        
        res.send(array)
    })
})

// app.post("/allTasksByProject/:dId", function (req, res) {
//     if (flag == false) {
//         mongo.connect(url, options, function (err, db) {
//             conn = db;
//         })
//     }
//     var did = req.params.dId;
//     var body = req.body;

//     dbName = 'tms';



//     return conn.db(dbName).collection('tasks').find({ $and: [{ developerId: did }, { project: body.project }] }).sort({ project: 1 }).toArray()


//         .then(function (dbs) {
//             res.status(200).send(dbs);


//         }).catch(err => {
//             console.log(err);
//             res.status(400).send({ "result": "tasks retrieval unsuccessful" });
//         })

// })

// app.post("/allTasksByDeveloper", function (req, res) {

//     if (flag == false) {
//         mongo.connect(url, options, function (err, db) {
//             conn = db;
//         })
//     }
//     var body = req.body;

//     dbName = 'tms';



//     return conn.db(dbName).collection('tasks').find({ developerId: body.developerId }).sort({ project: 1 }).toArray()


//         .then(function (dbs) {
//             res.status(200).send(dbs);


//         }).catch(err => {
//             console.log(err);
//             res.status(400).send({ "result": "tasks retrieval unsuccessful" });
//         })

// })

app.post("/update/:id", function (req, res) {
    if (flag == false) {
        mongo.connect(url, options, function (err, db) {
            conn = db;
        })
    }
    var id = req.params.id;
    var body = req.body;

    dbName = 'tms';

    var sdate = new Date(body.startDate)
    var edate = new Date(body.endDate)

    return conn.collection('tasks').updateOne({ taskId: body.taskId }, { $set: { typeId: body.typeId, startDate: sdate, endDate: edate, remainingWork: body.remainingWork, total: body.total, statusId: body.statusId, projectId: body.projectId, sprint: body.sprint, taskDescription: body.taskDescription, taskName: body.taskName } }



    ).then(function (dbs) {
        res.status(200).send({ "result": "update successful" });



    }).catch(err => {
        console.log(err);
        res.status(400).send({ "result": "update unsuccessful" });
    })

})

app.post("/complete", function (req, res) {

    var body = req.body;
    var smyPromise = () => {
        return new Promise((resolve, reject) => {
            console.log("2")
            conn
                .collection('status')
                .find({ statusName: "completed" })

                .toArray(function (err, data) {
                    err
                        ? reject(err)
                        : resolve(data[0].statusId);
                    //   console.log(data[0])
                    console.log(data)
                    console.log("3")
                });
        });
    };

    var myPromise = function (sid, id) {

        conn
            .collection('tasks')
            .updateOne({ taskId: id }, { $set: { statusId: sid } })

            .then(function (data) {

            }).catch(err => {
                res.send({ "result": "unsuccessful" })
            })

        return { "result": "complete successful" };

    }
    var callMyPromise = async (id) => {
        console.log("1")

        var sresult = await (smyPromise());
        console.log("......" + sresult)
        console.log(typeof (sresult))
        var result = (myPromise(sresult, id));
        console.log(result)
        //anything here is executed after result is resolved
        console.log("4")
        return result
    };

    //Step 3: make the call
    callMyPromise(parseInt(body.taskId)).then(function (result) {

        console.log("5")

        res.send(result)

    })




})

app.post("/delete", function (req, res) {
    var body = req.body;
    var smyPromise = () => {
        return new Promise((resolve, reject) => {
            console.log("2")
            conn
                .collection('status')
                .find({ statusName: "inactive" })

                .toArray(function (err, data) {
                    err
                        ? reject(err)
                        : resolve(data[0].statusId);
                    //   console.log(data[0])
                    console.log(data)
                    console.log("3")
                });
        });
    };

    var myPromise = function (sid, id) {

        conn
            .collection('tasks')
            .updateOne({ taskId: id }, { $set: { statusId: sid } })

            .then(function (data) {

            }).catch(err => {
                res.send({ "result": "delete unsuccessful" })
            })

        return { "result": "delete successful" };

    }
    var callMyPromise = async (id) => {
        console.log("1")

        var sresult = await (smyPromise());
        console.log("......" + sresult)
        console.log(typeof (sresult))
        var result = (myPromise(sresult, id));
        console.log(result)
        //anything here is executed after result is resolved
        console.log("4")
        return result
    };

    //Step 3: make the call
    callMyPromise(parseInt(body.taskId)).then(function (result) {

        console.log("5")

        res.send(result)

    })




})

app.get("/logOut", function (req, res) {

    conn.close();
    res.send({ "result": "logged Out" });
})

app.post("/takeLeave/:Did", function (req, res) {


    var did = req.params.Did;
    var body = req.body;



    var stdate = body.fromDate
    fromDate = new Date(new Date(stdate).toISOString())
    if (body.toDate !== null) {
        var endate = body.toDate
        toDate = new Date(new Date(endate).toISOString())
    }
    else
        var toDate = null;



    return conn.collection('attendance').insertOne({ employeeId: did, fromDate: fromDate, toDate: toDate })

        .then(function (dbs) {
            res.status(200).send({ "result": "update successful" });

        }).catch(err => {
            console.log(err);
            res.status(400).send({ "result": "update unsuccessful" });
        })

})


    var getTask = (id) => {
        return new Promise((resolve, reject) => {
            console.log("in getTask")
            conn
                .collection('tasks')
                .find({ employeeId: id })
                .toArray(function (err, data) {
                    console.log(data)
                    err
                        ? reject(err)
                        : resolve(data);
                    //   console.log(data[0])
                    console.log("3")
                });
        });
    };

    var getStatus = (result) => {
        console.log("....."+result)
        return new Promise((resolve, reject) => {
            console.log("2")
           
                conn
                    .collection('status')
                    .find({ statusId: result.statusId })

                    .toArray(function (err, data) {
                        err
                            ? reject(err)
                            : resolve(data[0]);
                        //    console.log(data)
                        console.log("3")
                    });
                }
            );
        
    };

    var getType = (result) => {
        return new Promise((resolve, reject) => {
            console.log("2")
            conn
                .collection('types')
                .find({ typeId: result.typeId })

                .toArray(function (err, data) {
                    err
                        ? reject(err)
                        : resolve(data[0]);

                    console.log("3")
                });
        });
    };

    var getProject = (result) => {
        return new Promise((resolve, reject) => {
            console.log("2")
            conn
                .collection('projects')
                .find({ projectId: result.projectId })

                .toArray(function (err, data) {
                    err
                        ? reject(err)
                        : resolve(data[0]);

                    console.log("3")
                });
        });
    };

    //Step 2: async promise handler
    var getData = async (id) => {
        console.log("1")
        var sresult=[];
        var tresult=[];
        var presult=[];
        var array=[];
        var result = await (getTask(id));
        console.log(result)
        for(let i in result){
            var data1 = await (getStatus(result[i]));
            sresult.push(data1)
            var data2 = await (getType(result[i]));
            tresult.push(data2)
            var data3 = await (getProject(result[i]));
            presult.push(data3)
        }
        
        var obj;
        for(let index in result){
            obj=result[index]
            obj.statusName=sresult[index].statusName
            obj.typeName=tresult[index].typeName
            obj.projectName=presult[index].projectName
            array.push(obj);
        }
        
        console.log(array)
        //anything here is executed after result is resolved
        console.log("4")
        return array;
    };

    //Step 3: make the call
    // array=callMyPromise(id);
    
    