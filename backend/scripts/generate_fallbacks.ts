import fs from 'fs';
import path from 'path';

const colors = [
    { start: '#0f2c59', end: '#1a4e99' },
    { start: '#c0a080', end: '#e6ccb8' },
    { start: '#005b96', end: '#008bca' },
    { start: '#11335b', end: '#245a8e' },
    { start: '#d4af37', end: '#f3d97f' },
    { start: '#1d4e89', end: '#3b82f6' },
    { start: '#8e7f70', end: '#bfb1a3' },
    { start: '#0f172a', end: '#334155' },
    { start: '#1e3a8a', end: '#3b82f6' },
    { start: '#0369a1', end: '#38bdf8' }
];

const icons = [
    '<path d="M12 22V8"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/><circle cx="12" cy="5" r="3"/>',
    '<path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.6 2 5.2 2 2.5 0 2.5-2 5.2-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.6 2 5.2 2 2.5 0 2.5-2 5.2-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.6 2 5.2 2 2.5 0 2.5-2 5.2-2 1.3 0 1.9.5 2.5 1"/>',
    '<path d="M22 18H2a4 4 0 0 0 4 4h12a4 4 0 0 0 4-4Z"/><path d="M21 14 10 2 3 14h18Z"/><path d="M10 2v16"/>',
    '<path d="M12 2v6"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="M16 18a4 4 0 0 0-8 0"/>'
];

const generateAvatarSVG = (index: number) => {
    const color = colors[index % colors.length];
    const icon = icons[index % icons.length];
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><defs><linearGradient id="grad${index}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:${color.start};stop-opacity:1" /><stop offset="100%" style="stop-color:${color.end};stop-opacity:1" /></linearGradient></defs><rect width="100" height="100" fill="url(#grad${index})" /><svg x="25" y="25" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.8">${icon}</svg></svg>`;
};

const generateCoverSVG = (index: number) => {
    const color = colors[index % colors.length];
    const icon = icons[index % icons.length];
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400" width="1200" height="400"><defs><linearGradient id="cover_grad${index}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:${color.start};stop-opacity:1" /><stop offset="100%" style="stop-color:${color.end};stop-opacity:1" /></linearGradient><pattern id="pattern${index}" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse"><svg x="40" y="40" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.05">${icon}</svg></pattern></defs><rect width="1200" height="400" fill="url(#cover_grad${index})" /><rect width="1200" height="400" fill="url(#pattern${index})" /><svg x="520" y="120" width="160" height="160" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.15">${icon}</svg></svg>`;
};

const outDirAvatar = path.join(__dirname, '../../frontend/public/images/fallbacks/avatar');
const outDirCover = path.join(__dirname, '../../frontend/public/images/fallbacks/cover');

for (let i = 1; i <= 10; i++) {
    fs.writeFileSync(path.join(outDirAvatar, `${i}.svg`), generateAvatarSVG(i - 1));
    fs.writeFileSync(path.join(outDirCover, `${i}.svg`), generateCoverSVG(i - 1));
}

console.log('Successfully generated 10 avatar and 10 cover SVG fallbacks.');
