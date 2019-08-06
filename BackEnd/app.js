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
var moment = require("moment")
var xl = require("excel4node")
var groupBy = require("json-groupby")

var app = express();
app.use(body_parser.json())
app.use(cors({ origin: 'http://localhost:4200' }));
app.listen(3000);


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

    var wb = new xl.Workbook();

    var options = {
        margins: {
            left: 1.5,
            right: 1.5
        },
    };

    var ws1 = wb.addWorksheet('Current Week Log', options)
    var ws2 = wb.addWorksheet('Previous Week Log', options)
    var ws3 = wb.addWorksheet('Next Week Log', options)
    var ws4 = wb.addWorksheet('Work Allocation Summary', options)

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


            res.send(array)

        });
    });




    app.post("/allTasks/:dId", function (req, res) {

        var did = req.params.dId;

        getData(did).then(function (array) {

            array.sort(function (a, b) {
                return a.endDate - b.endDate;
            })
            var output = [];
            for (ele of array) {
                if (ele.statusName === "active" || ele.statusName === "toDo")
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
                if (ele.endDate > fDate && ele.endDate < tDate && (ele.statusName === "active" || ele.statusName === "toDo"))
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

        getData(did).then(function (array) {
            array.sort(function (a, b) {
                return a.projectId - b.projectId;
            })
            var output = [];
            for (ele of array) {
                if ((ele.statusName === "active" || ele.statusName === "toDo") && ele.projectName === req.body.projectName)
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

        var id = parseInt(req.params.id);
        var body = req.body;

        dbName = 'tms';

        var sdate = new Date(body.startDate)
        var edate = new Date(body.endDate)

        return conn.collection('tasks').updateOne({ taskId: id },
            {
                $set: {
                    typeId: body.typeId, startDate: sdate, endDate: edate,
                    total: body.total, statusId: body.statusId,
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


    app.get("/logOut", function (req, res) {

        client.close();
        res.send({ "result": "logged Out" });
    })

    app.post("/takeLeave/:Did", function (req, res) {


        var did = req.params.Did;
        var body = req.body;
        var stdate = body.fromDate;
        console.log(stdate)
        fromDate = new Date(new Date(stdate).toISOString())
        if (body.toDate !== undefined) {
            var endate = body.toDate
            toDate = new Date(new Date(endate).toISOString())
        }
        else
            var toDate = fromDate;
        console.log(toDate);



        return conn.collection('attendance').insertOne({ employeeId: did, fromDate: fromDate, toDate: toDate, comment: body.comment })

            .then(function (dbs) {
                res.status(200).send({ "result": "update successful" });

            }).catch(err => {
                console.log(err);
                res.status(400).send({ "result": "update unsuccessful" });
            })

    })



    app.post("/getWorkingHours/:did", (req, res) => {


        var eid = req.params.did;
        var body = req.body;
        var result = []
        findDate = new Date(body.date)

        console.log(findDate)
        conn
            .collection('tasks')
            .find({ $and: [{ employeeId: eid }, { startDate: { $lte: findDate } }, { endDate: { $gte: findDate } }] }).toArray()
            .then(function (data) {

                // for (let i in data) {
                //     console.log("----------------------")
                //     console.log(data);
                //     var len = data.length


                //     if (logdata.length > 0) {

                //         result.push({ "log": logdata })


                //     }
                //     if (i == (len - 1)) {
                //         res.send(result)
                //     }

                // }

                res.send(data)
            }).catch(err => {
                console.log(err)
            })

    })


    var call = (tid, eid) => {
        return new Promise((resolve, reject) => {
            conn
                .collection('workingHours')
                .find({ $and: [{ employeeId: eid }, { taskId: tid }] }).toArray(function (err, result) {
                    err
                        ? reject(err)
                        : resolve(result);

                })

        })
    }
    app.post("/getLog/:did", (req, res) => {


        var eid = req.params.did;
        var body = req.body

        findDate = new Date(body.date).toISOString().slice(0, 10);
        var output = []
        fDate = new Date(findDate)
        console.log(findDate)
        conn
            .collection('workingHours')
            .find({ $and: [{ employeeId: eid }, { date: fDate }] }).toArray()
            .then(async function (data) {

                for (var item of data) {

                    var newDate = new Date(item.date).toISOString().slice(0, 10);
                    var task = await taskOfemp(body.taskId);
                    if (newDate === findDate) {
                        item.taskName = task.taskName;
                        item.startDate = task.startDate;
                        item.endDate = task.endDate;

                        output.push(item)

                    }
                }
                res.send(output)

            }).catch(err => {
                console.log(err)
            })


    })

    var taskOfemp = (tid) => {
        return new Promise((resolve, reject) => {
            conn.collection('tasks').find({ taskId: tid }).toArray(function (err, task) {
                err
                    ? reject(err)
                    : resolve(task[0]);

            })
        })

    }
    app.post("/deleteLog/:did", (req, res) => {

        console.log(req.body)
        var eid = req.params.did;
        var body = req.body;
        console.log(eid)
        console.log(typeof (body.taskId))
        console.log(typeof (body.workedHours))
        deleteDate = new Date(new Date(body.date)).toISOString()


        updateDate = new Date(new Date(body.date).toISOString())

        console.log(updateDate)
        updateWorkingHours(eid, body.taskId).then(function (remaining) {
            updateHours = remaining.remainingWork + body.workedHours
            conn
                .collection('tasks')
                .updateOne({ $and: [{ employeeId: eid }, { taskId: body.taskId }] }, { $set: { remainingWork: updateHours } })
                .then(function (data) {
                    conn
                        .collection('workingHours')
                        .deleteOne({ $and: [{ employeeId: eid }, { taskId: body.taskId }, { workedHours: body.workedHours }, { date: updateDate }] })
                        .then(function (data) {
                            res.send({ "result": "delete successful" })
                        }).catch(err => {
                            res.send({ "result": "delete unsuccessful" })
                            console.log(err)
                        })
                }).catch(function (err) { })
        })




    })


    app.put("/updateWorkingHours/:did", (req, res) => {
        var eid = req.params.did;
        var body = req.body;
        flag = false;
        newDate = new Date(new Date(body.date).toISOString())

        conn
            .collection('workingHours')
            .find({ $and: [{ employeeId: eid }, { taskId: body.taskId }] }).toArray(function (err, emp) {
                if (err) throw err;

                if (emp !== null) {

                    for (var data of emp) {


                        var date = new Date(data.date)
                        date = date.toISOString().slice(0, 10);

                        if (date === body.date) {
                            return conn.collection('workingHours').updateOne({ $and: [{ employeeId: eid, taskId: body.taskId, date: data.date }] }, { $set: { workedHours: body.workedHours } })

                                .then(function (dbs) {
                                    updateDate = new Date(new Date(body.date).toISOString())
                                    updateWorkingHours(eid, body.taskId).then(function (remaining) {
                                        updateHours = remaining.remainingWork - body.workedHours
                                        conn
                                            .collection('tasks')
                                            .updateOne({ $and: [{ employeeId: eid }, { taskId: body.taskId }] }, { $set: { remainingWork: updateHours } })
                                            .then(function (data) {
                                            }).catch(function (err) { })
                                    })
                                    flag = true;
                                    console.log("here1")
                                    res.status(200).send({ "result": "update successful" });

                                }).catch(err => {
                                    console.log(err);
                                    res.status(400).send({ "result": "update unsuccessful" });
                                })
                        }

                    }
                    if (flag === false) {

                        return conn.collection('workingHours').insertOne({ employeeId: eid, taskId: body.taskId, date: newDate, workedHours: body.workedHours })

                            .then(function (dbs) {
                                updateDate = new Date(new Date(body.date).toISOString())
                                updateWorkingHours(eid, body.taskId).then(function (remaining) {
                                    updateHours = remaining.remainingWork - body.workedHours
                                    conn
                                        .collection('tasks')
                                        .updateOne({ $and: [{ employeeId: eid }, { taskId: body.taskId }] }, { $set: { remainingWork: updateHours } })
                                        .then(function (data) {
                                        }).catch(function (err) { })
                                })
                                console.log("here2")
                                res.status(200).send({ "result": "insert successful" });

                            }).catch(err => {
                                console.log(err);
                                res.status(400).send({ "result": "insert unsuccessful" });
                            })

                    }
                }
                else {
                    return conn.collection('workingHours').insertOne({ employeeId: eid, taskId: body.taskId, date: body.date, workedHours: body.workedHours })

                        .then(function (dbs) {
                            updateDate = new Date(new Date(body.date).toISOString())
                            updateWorkingHours(eid, body.taskId).then(function (remaining) {
                                updateHours = remaining.remainingWork - body.workedHours
                                conn
                                    .collection('tasks')
                                    .updateOne({ $and: [{ employeeId: eid }, { taskId: body.taskId }] }, { $set: { remainingWork: updateHours, date: updateDate } })
                                    .then(function (data) {
                                    }).catch(function (err) { })
                            })
                            console.log("here3")
                            res.status(200).send({ "result": "insert successful" });

                        }).catch(err => {
                            console.log(err);
                            res.status(400).send({ "result": "insert unsuccessful" });
                        })
                }
            })



    })



    var getRemainingHours = (eid, tid) => {

        return new Promise((resolve, reject) => {
            conn
                .collection('tasks')
                .find({ $and: [{ employeeId: eid, taskId: tid }] }).project({ remainingWork: 1 })
                .toArray(function (err, data) {
                    console.log(data[0])
                    err
                        ? reject(err)
                        : resolve(data[0]);

                });
        });
    };



    var updateWorkingHours = async (eid, tid) => {

        var remaining = await (getRemainingHours(eid, tid));
        // var something = await (setRemainingHours(eid, tid, hours, remaining));
        return remaining
    }

    app.get("/getStatistics", (req, res) => {



        var first = moment().startOf('ISOweek');
        var last = moment().endOf('ISOweek').add(-1, "days");
        var firstday = new Date(first)
        var lastday = new Date(last)

        var prevfirst = moment().add(-8, "days").startOf('ISOweek');
        var prevlast = moment().add(-7, "days").endOf('ISOweek')
        var prevfirstday = new Date(prevfirst);
        var prevlastday = new Date(prevlast);

        var nextfirst = moment().add(8, "days").startOf('ISOweek');
        var nextlast = moment().add(7, "days").endOf('ISOweek').add(-1, "days");
        var nextfirstday = new Date(nextfirst);
        var nextlastday = new Date(nextlast);


        getStatistics(firstday, lastday, prevfirstday, prevlastday, new Date(moment()), nextlastday).then(function (result) {

            getAllData().then(function (employeeTasks) {
                excel2(result).then(function (data) {
                    workAllocationSummary(data, ws4)
                    weekLog(result[0].current, employeeTasks, ws1)
                    weekLog(result[0].previous, employeeTasks, ws2)
                    weekLog(result[0].next, employeeTasks, ws3)
                    wb.write('statistics.xlsx', res)

                });




            })

        })

    })
    function setHead(sheet) {

        var style = wb.createStyle({
            font: {
                color: 'white',
                size: '20px'

            },
            fill: {
                type: 'pattern', // Currently only 'pattern' is implemented. Non-implemented option is 'gradient'
                patternType: 'solid', //§18.18.55 ST_PatternType (Pattern Type)
                bgColor: 'blue', // HTML style hex value. defaults to black
                fgColor: 'blue'
            },
            alignment: {
                horizontal: 'center',

            }

        })

        sheet.column(4).setWidth(60)
        sheet.column(12).setWidth(40)
        sheet.column(5).setWidth(20)
        sheet.column(9).setWidth(20)
        sheet.cell(1, 1).string("Resource").style(style)
        sheet.cell(1, 2).string("Type").style(style)
        sheet.cell(1, 3).string("TFS ID").style(style)
        sheet.cell(1, 4).string("Description").style(style)
        sheet.cell(1, 5).string("Remaining Work").style(style)
        sheet.cell(1, 6).string("Start").style(style)
        sheet.cell(1, 7).string("ETA").style(style)
        sheet.cell(1, 8).string("Status").style(style)
        sheet.cell(1, 9).string("Project").style(style)
        sheet.cell(1, 10).string("Sprint").style(style)
        sheet.cell(1, 11).string("Total Hours").style(style)
        sheet.cell(1, 12).string("Comments").style(style)
    }

    var weekLog = (logdetails, tasks, sheet) => {

        setHead(sheet);
        var beauty = wb.createStyle({
            font: {
                color: 'black'
            },
            alignment: {
                horizontal: 'center',

            }
        })

        let row = 1;
        for (let i in logdetails) {
            row++;
            for (let j in tasks) {
                let col = 1;
                //console.log(i+" "+j)

                if (logdetails[i].taskId === tasks[j].taskId) {
                    // console.log("true"+i+" "+j)

                    sheet.cell(row, col).string(tasks[j].employeeId).style(beauty)
                    sheet.cell(row, ++col).string(tasks[j].typeName).style(beauty)
                    sheet.cell(row, ++col).number(tasks[j].taskId).style(beauty)
                    sheet.cell(row, ++col).string(tasks[j].taskDescription).style(beauty)
                    sheet.cell(row, ++col).number(tasks[j].remainingWork).style(beauty)
                    sheet.cell(row, ++col).date(tasks[j].startDate).style(beauty)
                    sheet.cell(row, ++col).date(tasks[j].endDate).style(beauty)
                    sheet.cell(row, ++col).string(tasks[j].statusName).style(beauty)
                    sheet.cell(row, ++col).string(tasks[j].projectName).style(beauty)
                    sheet.cell(row, ++col).string(tasks[j].sprint).style(beauty)
                    sheet.cell(row, ++col).number(tasks[j].totalWork).style(beauty)
                    sheet.cell(row, ++col).string(tasks[j].comments).style(beauty)
                    //console.log("tasks  ::"+j+"   "+tasks[j].employeeId)

                }
            }
        }
    }

    var workAllocationSummary = (array, sheet) => {



        var style = wb.createStyle({
            font: {
                color: 'white',
                size: '20px'

            },
            fill: {
                type: 'pattern', // Currently only 'pattern' is implemented. Non-implemented option is 'gradient'
                patternType: 'solid', //§18.18.55 ST_PatternType (Pattern Type)
                bgColor: 'blue', // HTML style hex value. defaults to black
                fgColor: 'blue'
            },
            alignment: {
                horizontal: 'center',

            }

        })
        sheet.column(4).setWidth(20)
        sheet.column(5).setWidth(20)
        sheet.column(6).setWidth(20)
        sheet.column(9).setWidth(60)
        sheet.column(3).setWidth(70)
        sheet.column(2).setWidth(20)
        sheet.column(7).setWidth(60)
        sheet.column(8).setWidth(60)
        sheet.cell(1, 1).string("Resource").style(style)
        sheet.cell(1, 2).string("Project ID").style(style)
        sheet.cell(1, 3).string("Project Name").style(style)
        sheet.cell(1, 4).string("Previous Week").style(style)
        sheet.cell(1, 5).string("Current Week").style(style)
        sheet.cell(1, 6).string("Next Week").style(style)
        sheet.cell(1, 7).string("From").style(style)
        sheet.cell(1, 8).string("To").style(style)
        sheet.cell(1, 9).string("Comment").style(style)
        var beauty = wb.createStyle({
            font: {
                color: 'black'
            },
            alignment: {
                horizontal: 'center',

            }
        })



        
        
        var row = 2
        for (var item of array) {
            
            var col = 1

            var e = item;

            
            for (var emp of e) {

                
                sheet.cell(row, col).string(emp._id.did).style(beauty)


                col = 2
                sheet.cell(row, col).number(emp._id.pid).style(beauty)

                sheet.cell(row, ++col).string(emp.projectName).style(beauty)
                sheet.cell(row, ++col).number(emp.prevsum).style(beauty)
                sheet.cell(row, ++col).number(emp.cursum).style(beauty)
                sheet.cell(row, ++col).number(emp.nextsum).style(beauty)
                
                sheet.cell(row, ++col).string(emp.leave[0].fromDate).style(beauty)
                sheet.cell(row, ++col).string(emp.leave[0].toDate).style(beauty)
                sheet.cell(row++, ++col).string(emp.leave[0].comment).style(beauty)



            }


        }


    }



    var dataForExcel = (logdetails) => {
        current = logdetails[0].current;
        previous = logdetails[0].previous;
        next = logdetails[0].next;
        leave = logdetails[0].attendance;
        
        return new Promise((resolve, reject) => {
            var data;
            conn.collection('tasks').aggregate([{ $group: { _id: { did: "$employeeId", pid: "$projectId" }, details: { $push: { tid: "$taskId" } } } }]).toArray(function (err, result) {
                data = result;
                for (var item of data) {
                    item.prevsum = 0;
                    item.nextsum = 0;
                    item.cursum = 0;
                    item.leave = []
                    
                    for (var t of item.details) {
                        cursum = 0
                        for (var c of current) {


                            if (c.employeeId === item._id.did && t.tid === c.taskId) {
                                item.cursum += c.workedHours;

                            }
                        }
                        prevsum = 0
                        for (var p of previous) {


                            if (p.employeeId === item._id.did && t.tid === p.taskId) {
                                item.prevsum += p.workedHours;

                            }
                        }
                        nextsum = 0
                        for (var n of next) {
                            if (n.employeeId === item._id.did && t.tid === n.taskId) {
                                item.nextsum += n.remainingWork;

                            }
                        }
                        var from=""
                        var to=""
                        var comment=""
                        for (var l of leave) {
                           
                            if (l.employeeId === item._id.did) {
                                from =from+"     " + l.fromDate.toISOString().slice(0, 10) ;
                                to = to+"     " + l.toDate.toISOString().slice(0, 10) ;
                                comment = comment + ","+l.comment ;
                               
                            }
                            // console.log(item.leave)
                            
                        }
                        item.leave.push({ "fromDate": from, "toDate": to, "comment": comment })

                    }
                }

                err
                    ? reject(err)
                    : resolve(data);

            });
        });

    }

    var projectsForExcel = () => {
        return new Promise((resolve, reject) => {

            conn.collection('projects').find().toArray(function (err, result) {


                err
                    ? reject(err)
                    : resolve(result);

            });
        });

    }

    var excel2 = async (logdetails) => {
        var edata = await dataForExcel(logdetails);
        var pdata = await projectsForExcel();
        for (var data of edata) {
            data.projectName = ""
            for (var pro of pdata) {
                if (data._id.pid === pro.projectId)
                    data.projectName = pro.projectName
            }
        }

        var obj = groupBy(edata, ['_id.did'])
        var myArray = new Array();


        for (var key in obj) {
            jsonobj = obj[key]

            myArray.push(jsonobj)

        }

        return myArray
    }

    var currentWeek = (firstday, lastday) => {

        return new Promise((resolve, reject) => {
            conn
                .collection('workingHours')
                .find({ $and: [{ date: { $lte: lastday } }, { date: { $gte: firstday } }] })
                .toArray(function (err, data) {

                    err
                        ? reject(err)
                        : resolve(data);

                });
        });
    };

    var previousWeek = (prevfirstday, prevlastday) => {

        return new Promise((resolve, reject) => {
            conn
                .collection('workingHours')
                .find({ $and: [{ date: { $lte: prevlastday } }, { date: { $gte: prevfirstday } }] })
                .toArray(function (err, data) {
                    err
                        ? reject(err)
                        : resolve(data);

                });
        });
    };

    var comingWeek = (nextfirstday, nextlastday) => {

        return new Promise((resolve, reject) => {
            conn
                .collection('tasks')
                .find({ $and: [{ endDate: { $lte: nextlastday } }, { endDate: { $gte: nextfirstday } }] })
                .project({ remainingWork: 1, totalWork: 1, endDate: 1, taskId: 1, employeeId: 1 })
                .toArray(function (err, data) {

                    err
                        ? reject(err)
                        : resolve(data);

                });
        });
    };

    var leaveDetails = (fromday, today) => {

        return new Promise((resolve, reject) => {
            conn
                .collection('attendance')
                .find({ $and: [{ fromDate: { $gte: fromday } }, { toDate: { $lte: today } }] })
                .toArray(function (err, data) {
                    err
                        ? reject(err)
                        : resolve(data);

                });
        });
    }; 3

    var getStatistics = async (firstday, lastday, prevfirstday, prevlastday, nextfirstday, nextlastday) => {


        var currWeek = await (currentWeek(firstday, lastday));
        var prevWeek = await (previousWeek(prevfirstday, prevlastday));
        var nextWeek = await (comingWeek(nextfirstday, nextlastday));
        var leave = await (leaveDetails(prevfirstday, nextlastday));

        var array = [{ "current": currWeek, "previous": prevWeek, "next": nextWeek, "attendance": leave }]

        return array
    };

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

    var getAllTask = () => {
        return new Promise((resolve, reject) => {
            conn
                .collection('tasks')
                .find()
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
        return array

    };

    var getAllData = async () => {

        var sresult = [];
        var tresult = [];
        var presult = [];
        var array = [];
        var result = await (getAllTask());


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
})





