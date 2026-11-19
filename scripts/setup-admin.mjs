// Run with a TTY. Input is deliberately hidden and never saved to disk.
// Input JSON: {url, key, password, action?: "create"|"verify"}
import { createClient } from '@supabase/supabase-js';
process.stdin.setRawMode?.(true);
process.stdin.resume();process.stdin.setEncoding('utf8');
console.log('Ready for hidden Supabase setup JSON on stdin.');
let input='';
for await (const chunk of process.stdin) {
  input+=chunk;
  if(!/[\r\n]/.test(input))continue;
  process.stdin.setRawMode?.(false);process.stdin.pause();
  try {
    const {url,key,password,action='create'}=JSON.parse(input.trim());input='';
    const admin=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
    if(action==='create') {
      const {data,error}=await admin.auth.admin.listUsers({page:1,perPage:1000});if(error)throw error;
      const existing=data.users.find(u=>u.email?.toLowerCase()==='purplefox@gmail.com');
      if(existing) { console.log(JSON.stringify({adminExists:true,id:existing.id,passwordChanged:false})); }
      else { const result=await admin.auth.admin.createUser({email:'purplefox@gmail.com',password,email_confirm:true});if(result.error)throw result.error;console.log(JSON.stringify({created:true,id:result.data.user.id})); }
    } else if(action==='verify') {
      const results={};for(const table of ['admin_users','enquiries','event_plans','media']){const r=await admin.from(table).select('*',{count:'exact',head:true});results[table]={status:r.status,count:r.count,error:r.error?.message};}console.log(JSON.stringify(results));
    }
  } catch(e) { console.error('Setup failed: '+e.message);process.exitCode=1; }
  break;
}
process.exit(process.exitCode||0);
