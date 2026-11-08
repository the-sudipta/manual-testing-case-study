// Shared look of every worksheet: the owner's test case template styling.
const HEADER_FILL = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F3864' } };
const STATUS_FILL = { Pass: 'FFC6EFCE', Fail: 'FFFFC7CE', Blocked: 'FFFFEB9C', 'Not Run': 'FFEDEDED' };
const THIN = { style: 'thin', color: { argb: 'FFBFBFBF' } };

function styleHeader(sheet) {
  const header = sheet.getRow(1);
  header.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  header.fill = HEADER_FILL;
  header.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
  header.height = 28;
  sheet.views = [{ state: 'frozen', ySplit: 1 }];
  sheet.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: sheet.columnCount } };
}

function styleBody(sheet, statusKey) {
  sheet.eachRow((row, index) => {
    if (index === 1) return;
    row.alignment = { vertical: 'top', wrapText: true };
    row.eachCell((cell) => { cell.border = { top: THIN, left: THIN, bottom: THIN, right: THIN }; });
    if (!statusKey) return;
    const cell = row.getCell(statusKey);
    const color = STATUS_FILL[cell.value];
    if (color) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: color } };
  });
}

module.exports = { styleHeader, styleBody };
