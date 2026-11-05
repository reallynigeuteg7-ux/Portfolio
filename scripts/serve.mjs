import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.resolve(fileURLToPath(new URL('../dist/',import.meta.url)));
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.woff2':'font/woff2'};
createServer(async(req,res)=>{
 try{
  let name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  let file=path.resolve(root,'.'+name);
  if(file!==root&&!file.startsWith(root+path.sep))throw Error('Invalid path');
  if(name==='/')file=path.join(root,'index.html');
  else if(!path.extname(file))file+='.html';
  try{await stat(file);}catch{res.statusCode=404;file=path.join(root,'404.html');}
  res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');
  res.end(await readFile(file));
 }catch{res.writeHead(400);res.end('Bad request');}
}).listen(4173,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4173'));
