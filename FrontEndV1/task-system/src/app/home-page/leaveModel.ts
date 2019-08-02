export class dateObject{
    fromDate:string=null;
    toDate:string=null;
    comment:string;
}
export class Project{
    projectName:string;
}
export class Developer{
    employeeId:string;
}
export class Details {
    items;
    showCalendar: boolean = false;
    singleCalendarField: boolean = false;
    showSortingCalendar: boolean = false;
    projectInput: boolean = false;
    dId = "nec01";
    dName;
    startDate: string;
    endDate: string;
    dateUpdate: boolean;
    managerView: boolean = true;
    developerInput: boolean = false;
    result;
}