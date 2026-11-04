import * as THREE from '../vendor/three.module.min.js';

// Round only the rendered edges, inside the shared collision bounds. Both
// levels of detail keep the same seat height, depth and facing convention.
export function chairGeometry(part,rounded=false){
 if(!rounded)return new THREE.BoxGeometry(...part.size).translate(...part.center);
 const horizontal=part.size[1]<part.size[2],width=part.size[0],height=part.size[horizontal?2:1],depth=Math.min(.055,part.size[horizontal?1:2]);
 const bevel=Math.min(.009,depth/5),radius=.016,x=width/2-bevel,y=height/2-bevel;
 const shape=new THREE.Shape();
 shape.moveTo(-x+radius,-y);shape.lineTo(x-radius,-y);shape.quadraticCurveTo(x,-y,x,-y+radius);
 shape.lineTo(x,y-radius);shape.quadraticCurveTo(x,y,x-radius,y);
 shape.lineTo(-x+radius,y);shape.quadraticCurveTo(-x,y,-x,y-radius);
 shape.lineTo(-x,-y+radius);shape.quadraticCurveTo(-x,-y,-x+radius,-y);
 const geometry=new THREE.ExtrudeGeometry(shape,{depth:depth-2*bevel,steps:1,curveSegments:2,bevelEnabled:true,bevelThickness:bevel,bevelSize:bevel,bevelSegments:2});
 geometry.translate(0,0,-depth/2+bevel);
 if(horizontal)geometry.rotateX(-Math.PI/2);
 geometry.translate(...part.center);return geometry;
}
