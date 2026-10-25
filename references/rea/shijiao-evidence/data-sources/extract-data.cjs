const fs=require('fs'),path=require('path'),cp=require('child_process'),parser=require('/Users/lilinhai/.npm/_npx/ad9a3fdbcad992c6/node_modules/@babel/parser');
const files=cp.execFileSync('rg',['--files','shijiao-evidence/scripts/files'],{encoding:'utf8'}).trim().split('\n'), input=files.find(x=>x.endsWith('/data-CI2ywFAf.js')), source=fs.readFileSync(input,'utf8');
const ast=parser.parse(source,{sourceType:'module'}),defs=new Map(),resolved=new Map();
for(const n of ast.program.body)if(n.type==='VariableDeclaration')for(const d of n.declarations)if(d.id.type==='Identifier')defs.set(d.id.name,d.init);
function read(n,seen=new Set()){
 if(!n)throw Error('empty');
 switch(n.type){
 case 'StringLiteral':case 'NumericLiteral':case 'BooleanLiteral':return n.value;
 case 'NullLiteral':return null;
 case 'TemplateLiteral':if(!n.expressions.length)return n.quasis[0].value.cooked;break;
 case 'UnaryExpression':{const a=read(n.argument,seen);if(n.operator==='-')return-a;if(n.operator==='+')return+a;if(n.operator==='!')return!a;break;}
 case 'Identifier':{if(resolved.has(n.name))return resolved.get(n.name);if(seen.has(n.name)||!defs.has(n.name))throw Error('unresolved '+n.name);const chain=new Set(seen);chain.add(n.name);const value=read(defs.get(n.name),chain);resolved.set(n.name,value);return value;}
 case 'ArrayExpression':{const a=[];for(const e of n.elements){if(!e)a.push(null);else if(e.type==='SpreadElement')a.push(...read(e.argument,seen));else a.push(read(e,seen));}return a;}
 case 'ObjectExpression':{const o={};for(const p of n.properties){if(p.type==='SpreadElement'){Object.assign(o,read(p.argument,seen));continue;}if(p.type!=='ObjectProperty'||p.computed)throw Error('non literal property');const k=p.key.type==='Identifier'?p.key.name:p.key.value;o[k]=read(p.value,seen);}return o;}
 case 'MemberExpression':{if(!n.computed&&n.object.type==='Identifier'&&n.object.name==='Math'&&n.property.name==='PI')return Math.PI;const o=read(n.object,seen),k=n.computed?read(n.property,seen):n.property.name;if(o!=null&&Object.prototype.hasOwnProperty.call(o,k))return o[k];break;}
 case 'BinaryExpression':{const a=read(n.left,seen),b=read(n.right,seen);switch(n.operator){case '+':return a+b;case '-':return a-b;case '*':return a*b;case '/':return a/b;case '**':return a**b;}break;}
 case 'CallExpression':if(n.callee.type==='MemberExpression'&&!n.callee.computed&&n.callee.object.type==='Identifier'&&n.callee.object.name==='JSON'&&n.callee.property.name==='parse'&&n.arguments.length===1)return JSON.parse(read(n.arguments[0],seen));break;
 }
 throw Error('unsupported '+n.type);
}
const out='shijiao-evidence/data-sources';fs.mkdirSync(out,{recursive:true});
const wanted={t:'reference-layouts-inline',n:'venues-extension',r:'venue-geometry-profiles',s:'section-layout-references',tp:'venues',ep:'kspo-tiers',Qf:'birds-nest-tiers',Zf:'default-view'};
const results=[];
for(const [name,label]of Object.entries(wanted))try{const value=read({type:'Identifier',name});fs.writeFileSync(`${out}/${label}.json`,JSON.stringify(value,null,2));results.push({name,label,entries:Array.isArray(value)?value.length:Object.keys(value).length});}catch(e){results.push({name,label,error:e.message});}
const references=[];function visit(x,p){if(!x||typeof x!=='object')return;if(!Array.isArray(x)&&typeof x.url==='string')references.push({path:p,...x});for(const[k,v]of Object.entries(x))if(v&&typeof v==='object')visit(v,`${p}.${k}`);}
try{visit(read({type:'Identifier',name:'r'}),'geometry');}catch{}
fs.writeFileSync(`${out}/geometry-source-references.json`,JSON.stringify(references,null,2));
let inline=[];for(const[name,def]of defs)if(def?.type==='CallExpression'&&def.callee.type==='MemberExpression'&&def.callee.object.name==='JSON'&&def.callee.property.name==='parse')try{const value=read({type:'Identifier',name});if(Array.isArray(value)&&value.length&&typeof value[0]==='object'&&!Array.isArray(value[0])){const filename=`inline-${name}.json`;fs.writeFileSync(`${out}/${filename}`,JSON.stringify(value,null,2));inline.push({name,entries:value.length,keys:Object.keys(value[0]),filename});}}catch{}
fs.writeFileSync(`${out}/extraction-index.json`,JSON.stringify({input,method:'Babel AST plus literal-only evaluator; target JavaScript was not executed',selected:results,jsonLiteralArrays:inline},null,2));
const route=fs.readFileSync(files.find(x=>x.endsWith('/AppRoute-FKjE7l3d.js')),'utf8');const pattern=/["`]([^"`]+)["`]:new URL\(`(https:\/\/shijiao-static-cn\.oss-cn-beijing\.aliyuncs\.com\/releases\/photo-protection-20261023\/assets\/[^`]+\.json)`/g;const assets=[...route.matchAll(pattern)].map(m=>({venue:m[1],url:m[2]}));fs.writeFileSync(`${out}/seat-asset-urls.json`,JSON.stringify(assets,null,2));console.log(JSON.stringify({selected:results,inlineArrays:inline,seatAssets:assets,sourceReferences:references.length},null,2));
