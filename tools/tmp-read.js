const fs = require('fs');
const p = 'apps\\web\\components\\dashboard\\AdsViewV2.tsx';
const text = fs.readFileSync(p, 'utf8');
console.log('has', text.includes('setContextLabel'));
const idx = text.indexOf('setContextLabel');
console.log('idx', idx);
console.log(text.slice(idx - 60, idx + 80));
