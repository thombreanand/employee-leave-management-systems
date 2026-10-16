import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable,of,map} from 'rxjs';
import {environment} from '../environments/environment';
import {LeaveRequest} from './leave-request.model';
@Injectable({providedIn:'root'})
export class LeaveService {
 private key='leavewise_rows'; private url=environment.oracleRestBaseUrl;
 constructor(private http:HttpClient){}
 list():Observable<LeaveRequest[]> {if(!environment.useOracleRest)return of(this.localRows());return this.http.get<any>(this.url).pipe(map(x=>Array.isArray(x)?x:(x.items||[])));}
 create(r:LeaveRequest):Observable<any>{if(environment.useOracleRest)return this.http.post(this.url,this.toOracle(r));const made={...r,id:Date.now()};this.save([made,...this.localRows()]);return of(made);}
 update(r:LeaveRequest):Observable<any>{if(environment.useOracleRest)return this.http.put(this.url+r.id,this.toOracle(r));this.save(this.localRows().map(x=>x.id===r.id?r:x));return of(r);}
 delete(id:number):Observable<any>{if(environment.useOracleRest)return this.http.delete(this.url+id);this.save(this.localRows().filter(x=>x.id!==id));return of(null);}
 private toOracle(r:LeaveRequest):any{return {employee_name:r.employee_name,employee_email:r.employee_email,leave_type:r.leave_type,start_date:r.start_date,end_date:r.end_date,reason:r.reason,status:r.status,manager_comment:r.manager_comment||null};}
 private localRows():LeaveRequest[]{const raw=localStorage.getItem(this.key);if(raw){try{return JSON.parse(raw)}catch{return []}}
 const date=(n:number)=>{const d=new Date();d.setDate(d.getDate()+n);return d.toISOString().slice(0,10)};
 const seed:LeaveRequest[]=[{id:1,employee_name:'Anand Thombre',employee_email:'anand@example.com',leave_type:'Vacation',start_date:date(7),end_date:date(9),reason:'Family event',status:'Pending'},{id:2,employee_name:'Priya Sharma',employee_email:'priya@example.com',leave_type:'Sick Leave',start_date:date(-3),end_date:date(-2),reason:'Not feeling well',status:'Approved',manager_comment:'Approved'},{id:3,employee_name:'Rahul Patil',employee_email:'rahul@example.com',leave_type:'Personal',start_date:date(14),end_date:date(14),reason:'Personal work',status:'Rejected'}];this.save(seed);return seed;}
 private save(rows:LeaveRequest[]){localStorage.setItem(this.key,JSON.stringify(rows));}
}
