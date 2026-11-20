import {createHash} from 'node:crypto';
import {readFile, stat} from 'node:fs/promises';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';

const deliveryRoot=fileURLToPath(new URL('../var/venue-shell-delivery/',import.meta.url));
const sourceHashes=new Map();
const missing=error=>{
  if(error.code!=='ENOENT'&&error.code!=='ENOTDIR')throw error;
};

export async function venueShellVariant(id,file,info,acceptEncoding=''){
  const signature=[info.dev,info.ino,info.size,info.mtimeMs,info.ctimeMs].join(':');
  let source=sourceHashes.get(file);
  if(source?.signature!==signature){
    const bytes=await readFile(file);
    source={signature,hash:createHash('sha256').update(bytes).digest('hex')};
    sourceHashes.set(file,source);
  }
  const directory=join(deliveryRoot,id,source.hash);
  const metadata=await readFile(join(directory,'variants.json'),'utf8').catch(missing);
  if(!metadata)return null;
  const delivery=JSON.parse(metadata);
  if(delivery.sourceBytes!==info.size)return null;

  const accepted=new Map(acceptEncoding.toLowerCase().split(',').map(value=>{
    const [name,...parameters]=value.trim().split(';');
    const quality=parameters.map(parameter=>parameter.trim()).find(parameter=>parameter.startsWith('q='));
    return [name,quality===undefined?1:Number(quality.slice(2))];
  }));
  const gzip=(accepted.get('gzip')??accepted.get('*')??0)>0;
  for(const encoding of gzip?['gzip','identity']:['identity']){
    const variant=delivery.variants[encoding];
    if(!/^[0-9a-f]{64}$/.test(variant?.sha256))continue;
    const path=join(directory,variant.sha256+(encoding==='gzip'?'.glb.gz':'.glb'));
    const size=await stat(path).catch(missing);
    if(size?.isFile()&&size.size===variant.bytes){
      return {path,bytes:size.size,etag:'"'+variant.sha256+'"',encoding};
    }
  }
  return null;
}
