export type LeaveStatus='Pending'|'Approved'|'Rejected'; export type LeaveType='Vacation'|'Sick Leave'|'Personal';
export interface LeaveRequest {id?:number;employee_name:string;employee_email:string;leave_type:LeaveType;start_date:string;end_date:string;reason:string;status:LeaveStatus;manager_comment?:string;}
