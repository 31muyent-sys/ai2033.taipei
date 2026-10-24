// Inventory locked npm dependencies without installing or executing them.
import fs from 'node:fs';
const roots=['.','og','video'];
let out='# npm 套件授權清單\n\n由 `node tools/security/dependency-notices.mjs` 依鎖定檔產生。包含間接依賴與各平台選用套件；版本／授權欄取自 package-lock.json，未提供時明確標示，不能據此推定為 MIT。完整條款以各版本套件的 LICENSE／NOTICE 為準。\n\n';
for(const root of roots){
 const lock=JSON.parse(fs.readFileSync(`${root}/package-lock.json`,'utf8'));
 out+=`## ${root==='.'?'根目錄：僅供本機／CI 測試':root+'/' }\n\n| 套件 | 版本 | 宣告授權 |\n|---|---|---|\n`;
 for(const [location,p] of Object.entries(lock.packages).filter(([l])=>l).sort(([a],[b])=>a.localeCompare(b))){
  const name=location.split('node_modules/').at(-1),url=`https://www.npmjs.com/package/${name}/v/${p.version}`;
  out+=`| [${name}](${url}) | ${p.version} | ${(p.license||'鎖定檔未列；須查該版本授權').replaceAll('|','\\|')} |\n`;
 }
 out+='\n';
}
fs.writeFileSync('DEPENDENCIES.md',out);
