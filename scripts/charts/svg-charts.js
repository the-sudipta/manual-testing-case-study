// Minimal SVG bar charts (no chart library needed).
const COLORS = { Pass: '#2e7d32', Fail: '#c62828', Blocked: '#f9a825', bar: '#1f3864' };
const FONT = 'font-family="Segoe UI, Arial, sans-serif"';

const text = (x, y, value, extra = '') => `<text x="${x}" y="${y}" ${FONT} font-size="13" ${extra}>${value}</text>`;

function frame(width, height, title, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
<rect width="100%" height="100%" fill="#ffffff"/>${text(20, 30, title, 'font-size="17" font-weight="600" fill="#1f3864"')}${body}</svg>`;
}

function stackedBars(title, rows, keys) {
  const width = 720, labelW = 150, barW = 500, rowH = 44, top = 60;
  const max = Math.max(...rows.map((r) => r.values.reduce((a, b) => a + b, 0)));
  let body = '';
  rows.forEach((row, i) => {
    const y = top + i * rowH;
    let x = labelW;
    body += text(20, y + 20, row.label, 'fill="#333"');
    row.values.forEach((v, k) => {
      const w = (v / max) * barW;
      if (v) body += `<rect x="${x}" y="${y}" width="${w}" height="28" fill="${COLORS[keys[k]]}"/>${text(x + w / 2 - 6, y + 19, v, 'fill="#fff" font-weight="600"')}`;
      x += w;
    });
  });
  const legendY = top + rows.length * rowH + 10;
  keys.forEach((k, i) => { body += `<rect x="${labelW + i * 110}" y="${legendY}" width="14" height="14" fill="${COLORS[k]}"/>${text(labelW + 20 + i * 110, legendY + 12, k)}`; });
  return frame(width, legendY + 40, title, body);
}

function simpleBars(title, rows) {
  const width = 720, labelW = 210, barW = 400, rowH = 34, top = 56;
  const max = Math.max(...rows.map((r) => r.value));
  let body = '';
  rows.forEach((row, i) => {
    const y = top + i * rowH;
    const w = (row.value / max) * barW;
    body += text(20, y + 17, row.label, 'fill="#333"');
    body += `<rect x="${labelW}" y="${y}" width="${w}" height="22" fill="${COLORS.bar}"/>`;
    body += text(labelW + w + 8, y + 16, row.note ? `${row.value} (${row.note})` : row.value, 'fill="#333"');
  });
  return frame(width, top + rows.length * rowH + 20, title, body);
}

module.exports = { stackedBars, simpleBars };
