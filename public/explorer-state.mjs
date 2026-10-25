const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
export function createMapTransform(viewBox){
 const values=viewBox?.x!==undefined?[viewBox.x,viewBox.y,viewBox.width,viewBox.height]:viewBox;
 return {base:[...values],viewBox:[...values],zoom:1,rotation:0};
}
export function zoomMap(transform,factor){
 const zoom=clamp(transform.zoom*(Number(factor)||1),.75,8),[x,y,w,h]=transform.viewBox;
 const width=w*transform.zoom/zoom,height=h*transform.zoom/zoom;
 return {...transform,zoom,viewBox:[x+(w-width)/2,y+(h-height)/2,width,height]};
}
export function panMap(transform,dx,dy){
 const [x,y,w,h]=transform.viewBox;
 const [baseX,baseY,baseW,baseH]=transform.base;
 // Keep a meaningful slice of the source map visible while still allowing
 // the user to inspect the edges after a zoom. The 75% overscan is symmetric
 // and also works for rotated view boxes whose dimensions exceed the base.
 const marginX=Math.max(w,baseW)*.75,marginY=Math.max(h,baseH)*.75;
 const minX=baseX+baseW-marginX-w,maxX=baseX+marginX;
 const minY=baseY+baseH-marginY-h,maxY=baseY+marginY;
 return {...transform,viewBox:[clamp(x+dx,minX,maxX),clamp(y+dy,minY,maxY),w,h]};
}
export function rotateMap(transform,degrees){
 const rotation=((transform.rotation+(Number(degrees)||0))%360+360)%360;
 const [x,y,w,h]=transform.base,angle=rotation*Math.PI/180;
 const width=(Math.abs(w*Math.cos(angle))+Math.abs(h*Math.sin(angle)))/transform.zoom;
 const height=(Math.abs(w*Math.sin(angle))+Math.abs(h*Math.cos(angle)))/transform.zoom;
 const [currentX,currentY,currentW,currentH]=transform.viewBox;
 const centerX=currentX+currentW/2,centerY=currentY+currentH/2;
 return {...transform,rotation,viewBox:[centerX-width/2,centerY-height/2,width,height]};
}
export function resetMap(transform){return createMapTransform(transform.base);}
export function phoneFrameRect(width,height){
 const w=Math.min(Math.max(1,width-32),Math.max(1,height-32)*4/3),h=w*3/4;
 return {x:(width-w)/2,y:(height-h)/2,width:w,height:h};
}
