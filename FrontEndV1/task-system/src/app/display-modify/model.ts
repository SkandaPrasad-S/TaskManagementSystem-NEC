export class modifyObject {
    _id:string;
    comments:string;
    employeeId: string;
    endDate: string;
    projectId:number;
    projectName:string;
    remainingWork:number;
    sprint: string;
    startDate: string;
    statusId: number;
    statusName: string;
    taskDescription:string;
    taskId: number;
    taskName:string;
    totalWork: number;
    typeId: number;
    typeName: string;
}
export class displayObject{
  taskIdFromURL;
  viewFlag=false;
  createFlag=false;
  statuscontentedit=true;
  displayObj:any={};
  storeStartDate:String;
  storeEndDate:String;
  buttonaction1="Modify";
  buttonaction2="Copy and Create";
  statusobj;
  projectsobj;
  dateStatus=false;
  responseFromModify;
}