import process from 'node:process'
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const titleMap = {
  'client': '前端',
  'service': '服务端',
  'database': '数据库',
  'other': '其他',
}

function generateMenu(folder: string, prefix = '') {
  const files = readdirSync(folder);
  const menu: any[] = [];
  files.forEach(file => {
    const filePath = join(folder, file);
    const stat = statSync(filePath);

    if (stat.isDirectory()) {
      const readdirList = readdirSync(filePath);
      if (readdirList?.length === 1 && readdirList.includes('index.md')) {
        const title = file.replace('.md', '');
        menu.push({
          text: title,
          link: '/page/' + prefix + title
        })
      } else {
        const items = generateMenu(filePath, prefix + file + '/');
        menu.push({
          text: titleMap[file] ? titleMap[file] : file,
          collapsed: false,
          items
        });
      }
    } else if (file.endsWith('.md')) {
      const title = file.replace('.md', '');
      menu.push({
        text: title,
        link: '/page/' + prefix + title
      });
    }
  });
  return menu;
}
const routes = generateMenu(join(process.cwd(), 'page'));

export default routes