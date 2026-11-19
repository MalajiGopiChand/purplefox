// Hidden stdin JSON: { url, key, password }. Creates and removes only QA fixtures.
import {createClient} from '@supabase/supabase-js';
import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
process.stdin.setRawMode?.(true);process.stdin.resume();process.stdin.setEncoding('utf8');
console.log('Ready for hidden backend verification JSON.');let input='';
for await(const chunk of process.stdin){input+=chunk;if(!/[\r\n]/.test(input))continue;process.stdin.setRawMode?.(false);process.stdin.pause();
  let service,enquiryId,planId,photoId,path;
  try{
    const {url,key,password}=JSON.parse(input.trim());input='';
    const {supabasePublishableKey}=await import('../src/public-config.mjs');
    const options={auth:{persistSession:false,autoRefreshToken:false}};
    service=createClient(url,key,options);const anon=createClient(url,supabasePublishableKey,options),admin=createClient(url,supabasePublishableKey,options);
    const login=await admin.auth.signInWithPassword({email:'purplefox@gmail.com',password});assert.ifError(login.error);
    const role=await admin.rpc('is_admin');assert.ifError(role.error);assert.equal(role.data,true);
    for(const table of ['enquiries','event_plans','admin_users']){const r=await anon.from(table).select('*');assert.ok(r.error||r.data.length===0,'Anonymous private data denied: '+table);}
    enquiryId=crypto.randomUUID();const payload={id:enquiryId,name:'QA TEST — delete after verification',phone:'+91 0000000001',event:'Wedding Events',event_date:'2027-12-20',location:'QA venue',guests:200,budget:'Let’s discuss',details:'Automated backend verification',source:'whatsapp',page:'/contact/'};
    const save=await anon.rpc('submit_enquiry',{payload});assert.ifError(save.error);
    const retry=await anon.rpc('submit_enquiry',{payload});assert.ifError(retry.error);
    const read=await admin.from('enquiries').select('*').eq('id',enquiryId);assert.ifError(read.error);assert.equal(read.data.length,1);assert.equal(read.data[0].status,'New');
    const update=await admin.from('enquiries').update({status:'Contacted',admin_notes:'QA notes'}).eq('id',enquiryId).select().single();assert.ifError(update.error);assert.equal(update.data.admin_notes,'QA notes');
    const forbidden=await anon.from('enquiries').update({status:'Closed'}).eq('id',enquiryId);assert.ok(forbidden.error);
    const plan=await admin.from('event_plans').insert({title:'QA test event plan',client_name:'QA client',budget:0,guests:200,status:'Planning'}).select().single();assert.ifError(plan.error);planId=plan.data.id;assert.equal(Number(plan.data.budget),0);
    path=crypto.randomUUID()+'.webp';const image=await readFile(new URL('../dist/images/v2-contact-flowers.webp',import.meta.url));
    const upload=await admin.storage.from('event-images').upload(path,image,{contentType:'image/webp'});assert.ifError(upload.error);
    const media=await admin.from('media').insert({title:'QA photograph',alt:'QA floral test image',storage_path:path,placement:'gallery',event_slug:'wedding-events',published:false}).select().single();assert.ifError(media.error);photoId=media.data.id;
    const privatePhoto=await anon.from('media').select('*').eq('id',photoId);assert.ifError(privatePhoto.error);assert.equal(privatePhoto.data.length,0);
    const publish=await admin.from('media').update({published:true}).eq('id',photoId);assert.ifError(publish.error);
    const publicPhoto=await anon.from('media').select('*').eq('id',photoId);assert.ifError(publicPhoto.error);assert.equal(publicPhoto.data.length,1);
    const noUpload=await anon.storage.from('event-images').upload('denied.webp',image,{contentType:'image/webp'});assert.ok(noUpload.error);
    await admin.auth.signOut();
    console.log('PASS: admin login, UUID allowlist, anonymous data isolation, enquiry save/retry/update, event plans, upload, draft/published visibility and anonymous upload denial.');
  }catch(e){console.error('Verification failed: '+e.message);process.exitCode=1;}
  finally{if(service){for(const [table,id]of[['media',photoId],['event_plans',planId],['enquiries',enquiryId]])if(id){const r=await service.from(table).delete().eq('id',id);if(r.error){console.error('QA cleanup failed for '+table);process.exitCode=1;}}if(path){const r=await service.storage.from('event-images').remove([path]);if(r.error){console.error('QA image cleanup failed');process.exitCode=1;}}console.log('QA fixtures removed.');}}
  break;
}
process.exit(process.exitCode||0);
