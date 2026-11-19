import ExcelJS from 'exceljs';

export async function workbookBuffer({ enquiries, plans, photos }) {
  const workbook = new ExcelJS.Workbook(); workbook.creator = 'Purple Fox Event Planners'; workbook.created = new Date();
  const definitions = [
    ['Enquiries', enquiries, [['id','Enquiry ID'],['created_at','Received (UTC)'],['name','Name'],['phone','Phone'],['event','Event type'],['event_date','Event date'],['location','City / venue'],['guests','Guests'],['budget','Budget range'],['details','Requirements'],['source','Source'],['page','Website page'],['status','Status'],['admin_notes','Follow-up notes']]],
    ['Event plans', plans, [['id','Plan ID'],['created_at','Created (UTC)'],['title','Title'],['client_name','Client'],['phone','Phone'],['event_date','Event date'],['venue','Venue'],['guests','Guests'],['budget','Budget (INR)'],['status','Status'],['notes','Planning notes']]],
    ['Photographs', photos, [['id','Photo ID'],['created_at','Uploaded (UTC)'],['title','Title'],['alt','Image description'],['caption','Caption'],['placement','Placement'],['event_slug','Event service'],['published','Published'],['storage_path','Storage path']]]
  ];
  for (const [name,rows,columns] of definitions) {
    const sheet=workbook.addWorksheet(name,{views:[{state:'frozen',ySplit:1}]});
    sheet.columns=columns.map(([key,header])=>({key,header,width:['details','notes','admin_notes','caption'].includes(key)?50:24}));
    for(const row of rows)sheet.addRow(Object.fromEntries(columns.map(([key])=>[key,row[key]??''])));
    const header=sheet.getRow(1);header.height=28;header.font={bold:true,color:{argb:'FFFFFFFF'}};header.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FF48205E'}};
    sheet.autoFilter={from:{row:1,column:1},to:{row:Math.max(1,rows.length+1),column:columns.length}};
    sheet.eachRow((row,index)=>{row.alignment={vertical:'top',wrapText:true};if(index>1&&index%2===0)row.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FFF3EDF7'}};});
  }
  return workbook.xlsx.writeBuffer();
}
export async function downloadWorkbook(data) {
  const buffer=await workbookBuffer(data),url=URL.createObjectURL(new Blob([buffer],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}));
  const a=document.createElement('a');a.href=url;a.download='purplefox-studio-'+new Date().toISOString().slice(0,10)+'.xlsx';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);
}
