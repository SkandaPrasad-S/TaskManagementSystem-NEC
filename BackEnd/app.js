// contents{
//     login API :52
//     getType API:75
//     getStatus API:93
//     getProjects API:112
//     createORcopy API:131
//     taskDetails API:159
//     allTasks API:258
//     allTasksByDate API:280
//     allTasksByProject API:306
//     allTasksByDeveloper API:328
//     update API:346
//     complete API:378
//     delete API:433
//     logout API:487
//     takeLeave API:493
//     getStatus method:536
//     getType method:553
//     getProject method:557
//     getData method:583
// }
var express = require("express")
var body_parser = require("body-parser")
const cors = require("cors")
var Promise = require("bluebird")
var assert = require("assert")
var MongoClient = Promise.promisifyAll(require("mongodb")).MongoClient


var app = express();
app.use(body_parser.json())
app.use(cors({ origin: 'http://localhost:4200' }));
app.listen(3001);


var conn;
const url = 'mongodb://127.0.0.1:27017';
options = {
    // conn: {
    //     numberOfRetries: 5
    // },
    poolSize: 10,
    useNewUrlParser: true
};

MongoClient.connect(url, options, function (err, client) {
    assert.equal(null, err);
    conn = client.db('tms');
})


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
    var stdate = new Date(body.startDate)
    var endate = new Date(body.endDate)
    sdate = new Date(new Date(stdate).toISOString())
    edate = new Date(new Date(endate).toISOString())
    query = {
        taskId: body.taskId, typeId: body.typeId,
        projectId: body.projectId, employeeId: id, statusId: body.statusId,
        sprint: body.sprint, taskDescription: body.taskDescription, startDate: sdate,
        endDate: edate, remainingWork: body.remainingWork, totalWork: body.totalWork,
        taskName: body.taskName, comments: body.comments
    }
    return conn.collection('tasks').insertOne(query)
        .then(function (dbs) {
            res.status(200).send({ "result": "insert successful" });



        }).catch(err => {
            console.log(err);
            res.status(400).send({ "result": "insert unsuccessful" });
        })

})

app.get("/taskDetails/:taskId", function (req, res) {


    var id = parseInt(req.params.taskId);

    var myPromise = (id) => {
        return new Promise((resolve, reject) => {

            conn
                .collection('tasks')
                .find({ taskId: id })

                .toArray(function (err, data) {
                    err
                        ? reject(err)
                        : resolve(data[0]);

                });
        });
    };

    var smyPromise = (result) => {

        return new Promise((resolve, reject) => {

            conn
                .collection('status')
                .find({ statusId: result.statusId })

                .toArray(function (err, data) {
                    err
                        ? reject(err)
                        : resolve(data[0]);

                });
        });
    };

    var tmyPromise = (result) => {
        return new Promise((resolve, reject) => {

            conn
                .collection('types')
                .find({ typeId: result.typeId })

                .toArray(function (err, data) {
                    err
                        ? reject(err)
                        : resolve(data[0]);

                });
        });
    };

    var pmyPromise = (result) => {
        return new Promise((resolve, reject) => {

            conn
                .collection('projects')
                .find({ projectId: result.projectId })

                .toArray(function (err, data) {
                    err
                        ? reject(err)
                        : resolve(data[0]);

                });
        });
    };

    //Step 2: async promise handler
    var callMyPromise = async (id) => {

        var result = await (myPromise(id));
        var sresult = await (smyPromise(result));
        var tresult = await (tmyPromise(result));
        var presult = await (pmyPromise(result));

        result.statusName = sresult.statusName;
        result.projectName = presult.projectName;
        result.typeName = tresult.typeName;

        //anything here is executed after result is resolved

        return result;
    };

    //Step 3: make the call
    callMyPromise(id).then(function (array) {

        console.log("5")
        res.send(array)

    });
});




app.post("/allTasks/:dId", function (req, res) {

    var did = req.params.dId;

    getData(did).then(function (array) {

        array.sort(function (a, b) {
            return a.endDate - b.endDate;
        })
        var output=[];
        for(ele of array){
            if(ele.statusName==="active")
                output.push(ele)
        }
       
        if (output.length !== 0)
            res.send(output)
        else
            res.send({ "result": "unsuccessful" });
    })
})

app.post("/allTasksByDate/:dId", function (req, res) {

    var did = req.params.dId;

    var body = req.body
    var fromDate = body.fromDate
    var toDate = body.toDate
    fDate = new Date(new Date(fromDate).toISOString())
    tDate = new Date(new Date(toDate).toISOString())
    var output = [];
    getData(did).then(function (array) {
        for (let ele of array) {
            if (ele.endDate > fDate && ele.endDate < tDate && ele.statusName==="active")
                output.push(ele);
        }
        output.sort(function (a, b) {
            return a.endDate - b.endDate;
        })

        if (output.length !== 0)
            res.send(output)
        else
            res.send({ "result": "unsuccessful" });
    })
})

app.post("/allTasksByProject/:dId", function (req, res) {


    var did = req.params.dId;
    var body=req.body;

    getData(did).then(function (array) {
        array.sort(function (a, b) {
            return a.projectId - b.projectId;
        })
        var output=[];
        for(ele of array){
            if(ele.statusName==="active" && ele.projectName===body.projectName)
                output.push(ele)
        }
        if (output.length !== 0)
            res.send(output)
        else
            res.send({ "result": "unsuccessful" });
    })
})


app.post("/allTasksByDeveloper", function (req, res) {

    var body = req.body;
    var did = body.employeeId;

    getData(did).then(function (array) {
        array.sort(function (a, b) {
            return a.projectId - b.projectId;
        })
        if (array.length !== 0)
            res.send(array)
        else
            res.send({ "result": "unsuccessful" });
    })


})

app.post("/update/:id", function (req, res) {

    var id = req.params.id;
    var body = req.body;

    dbName = 'tms';

    var sdate = new Date(body.startDate)
    var edate = new Date(body.endDate)

    return conn.collection('tasks').updateOne({ taskId: id },
        {
            $set: {
                typeId: body.typeId, startDate: sdate, endDate: edate,
                remainingWork: body.remainingWork, total: body.total, statusId: body.statusId,
                projectId: body.projectId, sprint: body.sprint, taskDescription: body.taskDescription,
                taskName: body.taskName
            }
        }

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

            conn
                .collection('status')
                .find({ statusName: "completed" })

                .toArray(function (err, data) {
                    err
                        ? reject(err)
                        : resolve(data[0].statusId);

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


        var sresult = await (smyPromise());

        var result = (myPromise(sresult, id));

        //anything here is executed after result is resolved

        return result
    };

    //Step 3: make the call
    callMyPromise(parseInt(body.taskId)).then(function (result) {

        res.send(result)

    })

})

app.post("/delete", function (req, res) {
    var body = req.body;
    var smyPromise = () => {
        return new Promise((resolve, reject) => {

            conn
                .collection('status')
                .find({ statusName: "inactive" })

                .toArray(function (err, data) {
                    err
                        ? reject(err)
                        : resolve(data[0].statusId);

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

        var sresult = await (smyPromise());

        var result = (myPromise(sresult, id));

        return result
    };

    //Step 3: make the call
    callMyPromise(parseInt(body.taskId)).then(function (result) {

        res.send(result)

    })




})

app.get("/logOut", function (req, res) {
    conn.close();
    client.close();
    res.send({ "result": "logged Out" });
})

app.post("/takeLeave/:Did", function (req, res) {

   
    var did = req.params.Did;
    console.log(did)
    var body = req.body;
    var stdate = body.fromDate;
    fromDate = new Date(new Date(stdate).toISOString())
    if (body.toDate !== undefined) {
        var endate = body.toDate
        toDate = new Date(new Date(endate).toISOString())
    }
    else
        var toDate =null;
   

    return conn.collection('attendance').insertOne({ employeeId: did, fromDate: fromDate, toDate: toDate, comment:body.comment })

        .then(function (dbs) {
            res.status(200).send({ "result": "update successful" });

        }).catch(err => {
            console.log(err);
            res.status(400).send({ "result": "update unsuccessful" });
        })

})


var getTask = (id) => {
    return new Promise((resolve, reject) => {
        conn
            .collection('tasks')
            .find({ employeeId: id })
            .toArray(function (err, data) {
                err
                    ? reject(err)
                    : resolve(data);
              
            });
    });
};

var getStatus = (result) => {
    return new Promise((resolve, reject) => {
    
        conn
            .collection('status')
            .find({ statusId: result.statusId })

            .toArray(function (err, data) {
                err
                    ? reject(err)
                    : resolve(data[0]);
            });
    }
    );

};

var getType = (result) => {
    return new Promise((resolve, reject) => {
        conn
            .collection('types')
            .find({ typeId: result.typeId })

            .toArray(function (err, data) {
                err
                    ? reject(err)
                    : resolve(data[0]);
            });
    });
};

var getProject = (result) => {
    return new Promise((resolve, reject) => {
      
        conn
            .collection('projects')
            .find({ projectId: result.projectId })

            .toArray(function (err, data) {
                err
                    ? reject(err)
                    : resolve(data[0]);
            });
    });
};

//Step 2: async promise handler
var getData = async (id) => {

    var sresult = [];
    var tresult = [];
    var presult = [];
    var array = [];
    var result = await (getTask(id));

    for (let i in result) {
        var data1 = await (getStatus(result[i]));
        sresult.push(data1)
        var data2 = await (getType(result[i]));
        tresult.push(data2)
        var data3 = await (getProject(result[i]));
        presult.push(data3)
    }

    var obj;
    for (let index in result) {
        obj = result[index]
        obj.statusName = sresult[index].statusName
        obj.typeName = tresult[index].typeName
        obj.projectName = presult[index].projectName
        array.push(obj);
    }

   
    //anything here is executed after result is resolved
   
    return array;
};

   
