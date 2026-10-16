import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type Role = 'Employee' | 'Manager';
type Status = 'Pending' | 'Approved' | 'Rejected';
interface User { id:string; name:string; email:string; password:string; role:Role; }
interface Leave { id:string; employeeId:string; employeeName:string; email:string; type:string; from:string; to:string; days:number; reason:string; status:Status; comment:string; created:string; }
@Component({selector:'app-root', standalone:true, imports:[CommonModule,FormsModule], templateUrl:'./app.component.html', styleUrl:'./app.component.css'})
export class AppComponent {
 users:User[]=this.load('lw_users',[]); leaves:Leave[]=this.load('lw_leaves',[]); user:User|null=this.load('lw_session',null);
 page:'login'|'signup'='login'; role:Role='Employee'; error=''; notice=''; search=''; filter='All'; editing='';
 loginForm={email:'',password:''}; signup={name:'',email:'',password:'',confirm:'',role:'Employee' as Role}; form={type:'Casual Leave',from:'',to:'',reason:''}; comments:Record<string,string>={};
 constructor(){ if(!this.users.some(u=>u.email==='manager@leavewise.demo')) this.users.push({id:'demo-manager',name:'Demo Manager',email:'manager@leavewise.demo',password:'Manager123!',role:'Manager'},{id:'demo-employee',name:'Demo Employee',email:'employee@leavewise.demo',password:'Employee123!',role:'Employee'}); this.save(); }
 load<T>(k:string,d:T):T { try {const v=localStorage.getItem(k);return v?JSON.parse(v) as T:d;}catch{return d;} }
 save(){localStorage.setItem('lw_users',JSON.stringify(this.users));localStorage.setItem('lw_leaves',JSON.stringify(this.leaves));localStorage.setItem('lw_session',JSON.stringify(this.user));}
 setPage(p:'login'|'signup'){this.page=p;this.error='';this.notice='';}
 login(){this.error='';const u=this.users.find(x=>x.email.toLowerCase()===this.loginForm.email.trim().toLowerCase()&&x.password===this.loginForm.password&&x.role===this.role);if(!u){this.error='Incorrect email, password, or account type.';return;}this.user=u;this.loginForm={email:'',password:''};this.save();}
 signupUser(){this.error='';const email=this.signup.email.trim().toLowerCase();if(!this.signup.name.trim()||!email||!this.signup.password){this.error='Complete all required fields.';return;}if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){this.error='Enter a valid email.';return;}if(this.signup.password.length<8){this.error='Password must contain at least 8 characters.';return;}if(this.signup.password!==this.signup.confirm){this.error='Passwords do not match.';return;}if(this.users.some(x=>x.email.toLowerCase()===email)){this.error='This email already has an account.';return;}this.user={id:this.id(),name:this.signup.name.trim(),email,password:this.signup.password,role:this.signup.role};this.users.push(this.user);this.save();}
 logout(){this.user=null;this.page='login';this.error='';this.notice='';this.save();}
 get manager(){return this.user?.role==='Manager';}
 get mine(){return this.leaves.filter(x=>x.employeeId===this.user?.id).sort((a,b)=>b.created.localeCompare(a.created));}
 get visible(){let arr=this.manager?[...this.leaves]:[...this.mine];if(this.filter!=='All')arr=arr.filter(x=>x.status===this.filter);const q=this.search.toLowerCase().trim();if(q)arr=arr.filter(x=>[x.employeeName,x.email,x.type,x.reason,x.status].some(v=>v.toLowerCase().includes(q)));return arr.sort((a,b)=>b.created.localeCompare(a.created));}
 get pending(){return this.leaves.filter(x=>x.status==='Pending').length;} get approved(){return this.leaves.filter(x=>x.status==='Approved').length;} get rejected(){return this.leaves.filter(x=>x.status==='Rejected').length;} get myPending(){return this.mine.filter(x=>x.status==='Pending').length;} get myApproved(){return this.mine.filter(x=>x.status==='Approved').length;} get myRejected(){return this.mine.filter(x=>x.status==='Rejected').length;}
 submit(){this.error='';this.notice='';if(!this.user||this.manager)return;if(!this.form.from||!this.form.to||!this.form.reason.trim()){this.error='Choose dates and enter a reason.';return;}if(this.form.to<this.form.from){this.error='End date must be on or after start date.';return;}const days=Math.floor((new Date(this.form.to+'T00:00:00').getTime()-new Date(this.form.from+'T00:00:00').getTime())/86400000)+1;
 if(this.editing){const l=this.leaves.find(x=>x.id===this.editing&&x.employeeId===this.user?.id&&x.status==='Pending');if(!l){this.error='Only pending requests can be edited.';return;}Object.assign(l,{type:this.form.type,from:this.form.from,to:this.form.to,days,reason:this.form.reason.trim()});this.notice='Request updated.';}else{this.leaves.push({id:this.id(),employeeId:this.user.id,employeeName:this.user.name,email:this.user.email,type:this.form.type,from:this.form.from,to:this.form.to,days,reason:this.form.reason.trim(),status:'Pending',comment:'',created:new Date().toISOString()});this.notice='Leave request submitted. It is now visible on the manager dashboard.';}this.reset();this.save();}
 edit(l:Leave){this.editing=l.id;this.form={type:l.type,from:l.from,to:l.to,reason:l.reason};this.notice='Editing pending request.';}
 remove(l:Leave){if(l.employeeId!==this.user?.id||l.status!=='Pending')return;this.leaves=this.leaves.filter(x=>x.id!==l.id);this.save();this.notice='Request deleted.';}
 decide(l:Leave,s:Status){if(!this.manager||l.status!=='Pending')return;const c=(this.comments[l.id]||'').trim();if(s==='Rejected'&&!c){this.error='Add a comment before rejecting.';return;}l.status=s;l.comment=c;this.error='';this.notice=`Request ${s.toLowerCase()}. The employee will see the updated status.`;this.save();}
 reset(){this.editing='';this.form={type:'Casual Leave',from:'',to:'',reason:''};} cancel(){this.reset();this.error='';this.notice='';}
 date(s:string){return s?new Date(s+'T00:00:00').toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}):'—';} id(){return Date.now()+'-'+Math.random().toString(36).slice(2,8);}
}
