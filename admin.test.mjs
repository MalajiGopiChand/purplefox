import { test } from 'node:test';
import assert from 'node:assert/strict';
import ExcelJS from 'exceljs';
import { workbookBuffer } from './src/export-workbook.js';

test('Excel export preserves phone numbers, Unicode, multiline notes and untrusted formula-like text as strings', async () => {
  const bytes = await workbookBuffer({ enquiries:[{id:'qa',name:'=HYPERLINK("https://example.com")',phone:'+91 07075505617',details:'Lavender 🌸\nBudget ₹50,000',source:'whatsapp',status:'New'}], plans:[{title:'Garden wedding',budget:0,guests:200}],photos:[{title:'Venue',published:false}] });
  const book=new ExcelJS.Workbook();await book.xlsx.load(bytes);
  assert.equal(book.worksheets.length,3);
  assert.equal(book.getWorksheet('Enquiries').getCell('C2').type,ExcelJS.ValueType.String);
  assert.equal(book.getWorksheet('Enquiries').getCell('D2').value,'+91 07075505617');
  assert.equal(book.getWorksheet('Enquiries').getCell('J2').value,'Lavender 🌸\nBudget ₹50,000');
  assert.equal(book.getWorksheet('Event plans').getCell('I2').value,0);
  assert.equal(book.getWorksheet('Photographs').getCell('H2').value,false);
  assert.equal(book.getWorksheet('Enquiries').views[0].ySplit,1);
});
