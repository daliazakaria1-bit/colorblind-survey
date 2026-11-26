/**
 * Wayfinder survey backend: every finished response from the website becomes ONE ROW in this Google Sheet,
 * like Google Forms. Paste this whole file into Extensions > Apps Script (see README.md).
 *
 *  - Sheet "Responses": column A = respondent number (1, 2, 3 ...), column B = date/time received,
 *    then every answer. Columns are created automatically from the keys the website sends.
 *  - Sheet "Summary": total number of responses and when the last one arrived (updates by itself).
 *  - A response_id that already exists is ignored, so a retry or double tap never creates a duplicate row.
 */
const SHEET_NAME = 'Responses';
const SUMMARY_NAME = 'Summary';
const BASE_COLUMNS = ['response_no', 'received_at'];

// Leave this empty if you opened Apps Script FROM the sheet (Extensions > Apps Script).
// If your script is a separate "Untitled project", paste the sheet's ID here: the long text in the
// sheet's address between /d/ and /edit  (example: docs.google.com/spreadsheets/d/THIS-PART/edit).
const SHEET_ID = '';
function getSS_() {
  return SHEET_ID ? SpreadsheetApp.openById(SHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = getSS_();
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME, 0);
    ensureSummary_(ss);

    // header row
    let header = [];
    if (sheet.getLastRow() === 0) {
      header = BASE_COLUMNS.concat(Object.keys(data));
      sheet.getRange(1, 1, 1, header.length).setValues([header]).setFontWeight('bold');
      sheet.setFrozenRows(1);
      sheet.setFrozenColumns(2);
    } else {
      header = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    }

    // add columns for any new keys
    const missing = BASE_COLUMNS.concat(Object.keys(data)).filter(k => header.indexOf(k) === -1);
    if (missing.length) {
      sheet.getRange(1, header.length + 1, 1, missing.length).setValues([missing]).setFontWeight('bold');
      header = header.concat(missing);
    }

    // ignore duplicates
    const idCol = header.indexOf('response_id') + 1;
    if (idCol > 0 && data.response_id && sheet.getLastRow() > 1) {
      const ids = sheet.getRange(2, idCol, sheet.getLastRow() - 1, 1).getValues().flat();
      if (ids.indexOf(data.response_id) !== -1) return out({ ok: true, duplicate: true });
    }

    const no = sheet.getLastRow(); // header is row 1, so the next respondent number equals the current last row
    const row = header.map(h => {
      if (h === 'response_no') return no;
      if (h === 'received_at') return new Date();
      return clean_(data[h]);
    });
    sheet.appendRow(row);
    const r = sheet.getLastRow();
    sheet.getRange(r, header.indexOf('received_at') + 1).setNumberFormat('yyyy-mm-dd hh:mm:ss');
    return out({ ok: true, response_no: no });
  } catch (err) {
    return out({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Visiting the web-app URL in a browser shows this, so you can check the deployment works.
function doGet() {
  const ss = getSS_();
  const sheet = ss.getSheetByName(SHEET_NAME);
  const n = sheet && sheet.getLastRow() > 1 ? sheet.getLastRow() - 1 : 0;
  return out({ ok: true, message: 'Wayfinder survey backend is running.', responses_so_far: n });
}

// Optional: run this once from the Apps Script editor (Run > setup) to create both sheets before the first response.
function setup() {
  const ss = getSS_();
  if (!ss.getSheetByName(SHEET_NAME)) ss.insertSheet(SHEET_NAME, 0);
  ensureSummary_(ss);
}

function ensureSummary_(ss) {
  if (ss.getSheetByName(SUMMARY_NAME)) return;
  const s = ss.insertSheet(SUMMARY_NAME);
  s.getRange('A1:B3').setValues([
    ['Total responses', '=MAX(0,COUNTA(Responses!A:A)-1)'],
    ['Last response received', '=IFERROR(MAX(Responses!B2:B),"-")'],
    ['Agreed to an email interview', '=IFERROR(COUNTIF(INDEX(Responses!A:ZZ,0,MATCH("interview_by_email",Responses!1:1,0)),"yes"),0)']
  ]);
  s.getRange('A1:A3').setFontWeight('bold');
  s.getRange('B2').setNumberFormat('yyyy-mm-dd hh:mm:ss');
  s.setColumnWidth(1, 240); s.setColumnWidth(2, 180);
}

// Stops text typed by a participant from being run as a spreadsheet formula (e.g. a name starting with "=").
function clean_(v) {
  if (v === undefined || v === null) return '';
  if (typeof v === 'string' && /^[=+\-@]/.test(v)) return "'" + v;
  return v;
}

function out(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
