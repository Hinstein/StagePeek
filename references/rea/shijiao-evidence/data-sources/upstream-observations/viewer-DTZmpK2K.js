const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/hkc-0MKmUkEr.js","assets/venue-BLbUDHKF.js","assets/stage-production-Ml8Q_MG9.js","assets/site-links-E99H4fnu.js","assets/awe-BVwtCF4o.js","assets/structure-raycast-Cl9g5jIV.js","assets/viva-C4CmZVZh.js","assets/summit-BEJe8GIN.js","assets/flat-venue-fHc0kkeq.js","assets/r11-DiFttFTp.js","assets/tpa-BzVOqAJ-.js","assets/kts-D3A_eNdl.js","assets/ring-venue-BScJFrGF.js","assets/kta-C6NTDEfa.js"])))=>i.map(i=>d[i]);
import{t as ss,a as pu,b as Ah,f as Qs,c as er,e as Rh,d as Ch,i as Ph,m as Lh}from"./site-links-E99H4fnu.js";const Dh="modulepreload",Ih=function(i){return"/"+i},Fl={},Zn=function(e,t,n){let s=Promise.resolve();if(t&&t.length>0){let c=function(l){return Promise.all(l.map(u=>Promise.resolve(u).then(h=>({status:"fulfilled",value:h}),h=>({status:"rejected",reason:h}))))};document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),a=o?.nonce||o?.getAttribute("nonce");s=c(t.map(l=>{if(l=Ih(l),l in Fl)return;Fl[l]=!0;const u=l.endsWith(".css"),h=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${h}`))return;const d=document.createElement("link");if(d.rel=u?"stylesheet":Dh,u||(d.as="script"),d.crossOrigin="",d.href=l,a&&d.setAttribute("nonce",a),document.head.appendChild(d),u)return new Promise((f,g)=>{d.addEventListener("load",f),d.addEventListener("error",()=>g(new Error(`Unable to preload CSS for ${l}`)))})}))}function r(o){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=o,window.dispatchEvent(a),!a.defaultPrevented)throw o}return s.then(o=>{for(const a of o||[])a.status==="rejected"&&r(a.reason);return e().catch(r)})};const Ka="180",rs={ROTATE:0,DOLLY:1,PAN:2},ns={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Uh=0,Ol=1,Nh=2,mu=1,Fh=2,Gn=3,ci=0,tn=1,wn=2,ai=0,os=1,zs=2,Bl=3,zl=4,Oh=5,Ei=100,Bh=101,zh=102,kh=103,Hh=104,Vh=200,Gh=201,Wh=202,Xh=203,jo=204,Zo=205,Yh=206,qh=207,$h=208,Kh=209,jh=210,Zh=211,Jh=212,Qh=213,ed=214,Jo=0,Qo=1,ea=2,cs=3,ta=4,na=5,ia=6,sa=7,ja=0,td=1,nd=2,li=0,id=1,sd=2,rd=3,od=4,ad=5,ld=6,cd=7,gu=300,us=301,hs=302,ra=303,oa=304,Xr=306,aa=1e3,Ti=1001,la=1002,hn=1003,ud=1004,tr=1005,gn=1006,oo=1007,wi=1008,Cn=1009,_u=1010,vu=1011,ks=1012,Za=1013,Ri=1014,An=1015,Ks=1016,Ja=1017,Qa=1018,Hs=1020,xu=35902,yu=35899,Mu=1021,Su=1022,En=1023,Vs=1026,Gs=1027,el=1028,tl=1029,Eu=1030,nl=1031,il=1033,Ir=33776,Ur=33777,Nr=33778,Fr=33779,ca=35840,ua=35841,ha=35842,da=35843,fa=36196,pa=37492,ma=37496,ga=37808,_a=37809,va=37810,xa=37811,ya=37812,Ma=37813,Sa=37814,Ea=37815,ba=37816,Ta=37817,wa=37818,Aa=37819,Ra=37820,Ca=37821,Pa=36492,La=36494,Da=36495,Ia=36283,Ua=36284,Na=36285,Fa=36286,hd=3200,dd=3201,bu=0,fd=1,oi="",un="srgb",ds="srgb-linear",Br="linear",vt="srgb",zi=7680,kl=519,pd=512,md=513,gd=514,Tu=515,_d=516,vd=517,xd=518,yd=519,Hl=35044,Md=35048,Vl="300 es",Rn=2e3,zr=2001;class Di{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const s=n[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}}const Ht=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Gl=1234567;const as=Math.PI/180,fs=180/Math.PI;function Ii(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ht[i&255]+Ht[i>>8&255]+Ht[i>>16&255]+Ht[i>>24&255]+"-"+Ht[e&255]+Ht[e>>8&255]+"-"+Ht[e>>16&15|64]+Ht[e>>24&255]+"-"+Ht[t&63|128]+Ht[t>>8&255]+"-"+Ht[t>>16&255]+Ht[t>>24&255]+Ht[n&255]+Ht[n>>8&255]+Ht[n>>16&255]+Ht[n>>24&255]).toLowerCase()}function st(i,e,t){return Math.max(e,Math.min(t,i))}function sl(i,e){return(i%e+e)%e}function Sd(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function Ed(i,e,t){return i!==e?(t-i)/(e-i):0}function Fs(i,e,t){return(1-t)*i+t*e}function bd(i,e,t,n){return Fs(i,e,1-Math.exp(-t*n))}function Td(i,e=1){return e-Math.abs(sl(i,e*2)-e)}function wd(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function Ad(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function Rd(i,e){return i+Math.floor(Math.random()*(e-i+1))}function Cd(i,e){return i+Math.random()*(e-i)}function Pd(i){return i*(.5-Math.random())}function Ld(i){i!==void 0&&(Gl=i);let e=Gl+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Dd(i){return i*as}function Id(i){return i*fs}function Ud(i){return(i&i-1)===0&&i!==0}function Nd(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Fd(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Od(i,e,t,n,s){const r=Math.cos,o=Math.sin,a=r(t/2),c=o(t/2),l=r((e+n)/2),u=o((e+n)/2),h=r((e-n)/2),d=o((e-n)/2),f=r((n-e)/2),g=o((n-e)/2);switch(s){case"XYX":i.set(a*u,c*h,c*d,a*l);break;case"YZY":i.set(c*d,a*u,c*h,a*l);break;case"ZXZ":i.set(c*h,c*d,a*u,a*l);break;case"XZX":i.set(a*u,c*g,c*f,a*l);break;case"YXY":i.set(c*f,a*u,c*g,a*l);break;case"ZYZ":i.set(c*g,c*f,a*u,a*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function ts(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Yt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const cn={DEG2RAD:as,RAD2DEG:fs,generateUUID:Ii,clamp:st,euclideanModulo:sl,mapLinear:Sd,inverseLerp:Ed,lerp:Fs,damp:bd,pingpong:Td,smoothstep:wd,smootherstep:Ad,randInt:Rd,randFloat:Cd,randFloatSpread:Pd,seededRandom:Ld,degToRad:Dd,radToDeg:Id,isPowerOfTwo:Ud,ceilPowerOfTwo:Nd,floorPowerOfTwo:Fd,setQuaternionFromProperEuler:Od,normalize:Yt,denormalize:ts};class ge{constructor(e=0,t=0){ge.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=st(this.x,e.x,t.x),this.y=st(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=st(this.x,e,t),this.y=st(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(st(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(st(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*s+e.x,this.y=r*s+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class qn{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,o,a){let c=n[s+0],l=n[s+1],u=n[s+2],h=n[s+3];const d=r[o+0],f=r[o+1],g=r[o+2],_=r[o+3];if(a===0){e[t+0]=c,e[t+1]=l,e[t+2]=u,e[t+3]=h;return}if(a===1){e[t+0]=d,e[t+1]=f,e[t+2]=g,e[t+3]=_;return}if(h!==_||c!==d||l!==f||u!==g){let m=1-a;const p=c*d+l*f+u*g+h*_,A=p>=0?1:-1,E=1-p*p;if(E>Number.EPSILON){const D=Math.sqrt(E),R=Math.atan2(D,p*A);m=Math.sin(m*R)/D,a=Math.sin(a*R)/D}const x=a*A;if(c=c*m+d*x,l=l*m+f*x,u=u*m+g*x,h=h*m+_*x,m===1-a){const D=1/Math.sqrt(c*c+l*l+u*u+h*h);c*=D,l*=D,u*=D,h*=D}}e[t]=c,e[t+1]=l,e[t+2]=u,e[t+3]=h}static multiplyQuaternionsFlat(e,t,n,s,r,o){const a=n[s],c=n[s+1],l=n[s+2],u=n[s+3],h=r[o],d=r[o+1],f=r[o+2],g=r[o+3];return e[t]=a*g+u*h+c*f-l*d,e[t+1]=c*g+u*d+l*h-a*f,e[t+2]=l*g+u*f+a*d-c*h,e[t+3]=u*g-a*h-c*d-l*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,s=e._y,r=e._z,o=e._order,a=Math.cos,c=Math.sin,l=a(n/2),u=a(s/2),h=a(r/2),d=c(n/2),f=c(s/2),g=c(r/2);switch(o){case"XYZ":this._x=d*u*h+l*f*g,this._y=l*f*h-d*u*g,this._z=l*u*g+d*f*h,this._w=l*u*h-d*f*g;break;case"YXZ":this._x=d*u*h+l*f*g,this._y=l*f*h-d*u*g,this._z=l*u*g-d*f*h,this._w=l*u*h+d*f*g;break;case"ZXY":this._x=d*u*h-l*f*g,this._y=l*f*h+d*u*g,this._z=l*u*g+d*f*h,this._w=l*u*h-d*f*g;break;case"ZYX":this._x=d*u*h-l*f*g,this._y=l*f*h+d*u*g,this._z=l*u*g-d*f*h,this._w=l*u*h+d*f*g;break;case"YZX":this._x=d*u*h+l*f*g,this._y=l*f*h+d*u*g,this._z=l*u*g-d*f*h,this._w=l*u*h-d*f*g;break;case"XZY":this._x=d*u*h-l*f*g,this._y=l*f*h-d*u*g,this._z=l*u*g+d*f*h,this._w=l*u*h+d*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],s=t[4],r=t[8],o=t[1],a=t[5],c=t[9],l=t[2],u=t[6],h=t[10],d=n+a+h;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(u-c)*f,this._y=(r-l)*f,this._z=(o-s)*f}else if(n>a&&n>h){const f=2*Math.sqrt(1+n-a-h);this._w=(u-c)/f,this._x=.25*f,this._y=(s+o)/f,this._z=(r+l)/f}else if(a>h){const f=2*Math.sqrt(1+a-n-h);this._w=(r-l)/f,this._x=(s+o)/f,this._y=.25*f,this._z=(c+u)/f}else{const f=2*Math.sqrt(1+h-n-a);this._w=(o-s)/f,this._x=(r+l)/f,this._y=(c+u)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(st(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,s=e._y,r=e._z,o=e._w,a=t._x,c=t._y,l=t._z,u=t._w;return this._x=n*u+o*a+s*l-r*c,this._y=s*u+o*c+r*a-n*l,this._z=r*u+o*l+n*c-s*a,this._w=o*u-n*a-s*c-r*l,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,s=this._y,r=this._z,o=this._w;let a=o*e._w+n*e._x+s*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;const c=1-a*a;if(c<=Number.EPSILON){const f=1-t;return this._w=f*o+t*this._w,this._x=f*n+t*this._x,this._y=f*s+t*this._y,this._z=f*r+t*this._z,this.normalize(),this}const l=Math.sqrt(c),u=Math.atan2(l,a),h=Math.sin((1-t)*u)/l,d=Math.sin(t*u)/l;return this._w=o*h+this._w*d,this._x=n*h+this._x*d,this._y=s*h+this._y*d,this._z=r*h+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class L{constructor(e=0,t=0,n=0){L.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Wl.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Wl.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(e){const t=this.x,n=this.y,s=this.z,r=e.x,o=e.y,a=e.z,c=e.w,l=2*(o*s-a*n),u=2*(a*t-r*s),h=2*(r*n-o*t);return this.x=t+c*l+o*h-a*u,this.y=n+c*u+a*l-r*h,this.z=s+c*h+r*u-o*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=st(this.x,e.x,t.x),this.y=st(this.y,e.y,t.y),this.z=st(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=st(this.x,e,t),this.y=st(this.y,e,t),this.z=st(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(st(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,s=e.y,r=e.z,o=t.x,a=t.y,c=t.z;return this.x=s*c-r*a,this.y=r*o-n*c,this.z=n*a-s*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return ao.copy(this).projectOnVector(e),this.sub(ao)}reflect(e){return this.sub(ao.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(st(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const ao=new L,Wl=new qn;class tt{constructor(e,t,n,s,r,o,a,c,l){tt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,c,l)}set(e,t,n,s,r,o,a,c,l){const u=this.elements;return u[0]=e,u[1]=s,u[2]=a,u[3]=t,u[4]=r,u[5]=c,u[6]=n,u[7]=o,u[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[3],c=n[6],l=n[1],u=n[4],h=n[7],d=n[2],f=n[5],g=n[8],_=s[0],m=s[3],p=s[6],A=s[1],E=s[4],x=s[7],D=s[2],R=s[5],C=s[8];return r[0]=o*_+a*A+c*D,r[3]=o*m+a*E+c*R,r[6]=o*p+a*x+c*C,r[1]=l*_+u*A+h*D,r[4]=l*m+u*E+h*R,r[7]=l*p+u*x+h*C,r[2]=d*_+f*A+g*D,r[5]=d*m+f*E+g*R,r[8]=d*p+f*x+g*C,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],u=e[8];return t*o*u-t*a*l-n*r*u+n*a*c+s*r*l-s*o*c}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],u=e[8],h=u*o-a*l,d=a*c-u*r,f=l*r-o*c,g=t*h+n*d+s*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return e[0]=h*_,e[1]=(s*l-u*n)*_,e[2]=(a*n-s*o)*_,e[3]=d*_,e[4]=(u*t-s*c)*_,e[5]=(s*r-a*t)*_,e[6]=f*_,e[7]=(n*c-l*t)*_,e[8]=(o*t-n*r)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,o,a){const c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*o+l*a)+o+e,-s*l,s*c,-s*(-l*o+c*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(lo.makeScale(e,t)),this}rotate(e){return this.premultiply(lo.makeRotation(-e)),this}translate(e,t){return this.premultiply(lo.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const lo=new tt;function wu(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function kr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Bd(){const i=kr("canvas");return i.style.display="block",i}const Xl={};function Ws(i){i in Xl||(Xl[i]=!0,console.warn(i))}function zd(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}const Yl=new tt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),ql=new tt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function kd(){const i={enabled:!0,workingColorSpace:ds,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===vt&&(s.r=Yn(s.r),s.g=Yn(s.g),s.b=Yn(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===vt&&(s.r=ls(s.r),s.g=ls(s.g),s.b=ls(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===oi?Br:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Ws("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Ws("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[ds]:{primaries:e,whitePoint:n,transfer:Br,toXYZ:Yl,fromXYZ:ql,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:un},outputColorSpaceConfig:{drawingBufferColorSpace:un}},[un]:{primaries:e,whitePoint:n,transfer:vt,toXYZ:Yl,fromXYZ:ql,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:un}}}),i}const dt=kd();function Yn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function ls(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let ki;class Hd{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{ki===void 0&&(ki=kr("canvas")),ki.width=e.width,ki.height=e.height;const s=ki.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=ki}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=kr("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Yn(r[o]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Yn(t[n]/255)*255):t[n]=Yn(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Vd=0;class rl{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Vd++}),this.uuid=Ii(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(co(s[o].image)):r.push(co(s[o]))}else r=co(s);n.url=r}return t||(e.images[this.uuid]=n),n}}function co(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Hd.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Gd=0;const uo=new L;class Gt extends Di{constructor(e=Gt.DEFAULT_IMAGE,t=Gt.DEFAULT_MAPPING,n=Ti,s=Ti,r=gn,o=wi,a=En,c=Cn,l=Gt.DEFAULT_ANISOTROPY,u=oi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Gd++}),this.uuid=Ii(),this.name="",this.source=new rl(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new ge(0,0),this.repeat=new ge(1,1),this.center=new ge(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new tt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(uo).x}get height(){return this.source.getSize(uo).y}get depth(){return this.source.getSize(uo).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==gu)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case aa:e.x=e.x-Math.floor(e.x);break;case Ti:e.x=e.x<0?0:1;break;case la:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case aa:e.y=e.y-Math.floor(e.y);break;case Ti:e.y=e.y<0?0:1;break;case la:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Gt.DEFAULT_IMAGE=null;Gt.DEFAULT_MAPPING=gu;Gt.DEFAULT_ANISOTROPY=1;class yt{constructor(e=0,t=0,n=0,s=1){yt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*s+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r;const c=e.elements,l=c[0],u=c[4],h=c[8],d=c[1],f=c[5],g=c[9],_=c[2],m=c[6],p=c[10];if(Math.abs(u-d)<.01&&Math.abs(h-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(u+d)<.1&&Math.abs(h+_)<.1&&Math.abs(g+m)<.1&&Math.abs(l+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const E=(l+1)/2,x=(f+1)/2,D=(p+1)/2,R=(u+d)/4,C=(h+_)/4,I=(g+m)/4;return E>x&&E>D?E<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(E),s=R/n,r=C/n):x>D?x<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(x),n=R/s,r=I/s):D<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(D),n=C/r,s=I/r),this.set(n,s,r,t),this}let A=Math.sqrt((m-g)*(m-g)+(h-_)*(h-_)+(d-u)*(d-u));return Math.abs(A)<.001&&(A=1),this.x=(m-g)/A,this.y=(h-_)/A,this.z=(d-u)/A,this.w=Math.acos((l+f+p-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=st(this.x,e.x,t.x),this.y=st(this.y,e.y,t.y),this.z=st(this.z,e.z,t.z),this.w=st(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=st(this.x,e,t),this.y=st(this.y,e,t),this.z=st(this.z,e,t),this.w=st(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(st(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Wd extends Di{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:gn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new yt(0,0,e,t),this.scissorTest=!1,this.viewport=new yt(0,0,e,t);const s={width:e,height:t,depth:n.depth},r=new Gt(s);this.textures=[];const o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){const t={minFilter:gn,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new rl(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Ci extends Wd{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class Au extends Gt{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=hn,this.minFilter=hn,this.wrapR=Ti,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Xd extends Gt{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=hn,this.minFilter=hn,this.wrapR=Ti,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class hi{constructor(e=new L(1/0,1/0,1/0),t=new L(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(xn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(xn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=xn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,xn):xn.fromBufferAttribute(r,o),xn.applyMatrix4(e.matrixWorld),this.expandByPoint(xn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),nr.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),nr.copy(n.boundingBox)),nr.applyMatrix4(e.matrixWorld),this.union(nr)}const s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,xn),xn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Ts),ir.subVectors(this.max,Ts),Hi.subVectors(e.a,Ts),Vi.subVectors(e.b,Ts),Gi.subVectors(e.c,Ts),Jn.subVectors(Vi,Hi),Qn.subVectors(Gi,Vi),gi.subVectors(Hi,Gi);let t=[0,-Jn.z,Jn.y,0,-Qn.z,Qn.y,0,-gi.z,gi.y,Jn.z,0,-Jn.x,Qn.z,0,-Qn.x,gi.z,0,-gi.x,-Jn.y,Jn.x,0,-Qn.y,Qn.x,0,-gi.y,gi.x,0];return!ho(t,Hi,Vi,Gi,ir)||(t=[1,0,0,0,1,0,0,0,1],!ho(t,Hi,Vi,Gi,ir))?!1:(sr.crossVectors(Jn,Qn),t=[sr.x,sr.y,sr.z],ho(t,Hi,Vi,Gi,ir))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,xn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(xn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Bn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Bn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Bn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Bn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Bn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Bn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Bn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Bn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Bn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Bn=[new L,new L,new L,new L,new L,new L,new L,new L],xn=new L,nr=new hi,Hi=new L,Vi=new L,Gi=new L,Jn=new L,Qn=new L,gi=new L,Ts=new L,ir=new L,sr=new L,_i=new L;function ho(i,e,t,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){_i.fromArray(i,r);const a=s.x*Math.abs(_i.x)+s.y*Math.abs(_i.y)+s.z*Math.abs(_i.z),c=e.dot(_i),l=t.dot(_i),u=n.dot(_i);if(Math.max(-Math.max(c,l,u),Math.min(c,l,u))>a)return!1}return!0}const Yd=new hi,ws=new L,fo=new L;class gs{constructor(e=new L,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):Yd.setFromPoints(e).getCenter(n);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ws.subVectors(e,this.center);const t=ws.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(ws,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(fo.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ws.copy(e.center).add(fo)),this.expandByPoint(ws.copy(e.center).sub(fo))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const zn=new L,po=new L,rr=new L,ei=new L,mo=new L,or=new L,go=new L;class Yr{constructor(e=new L,t=new L(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,zn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=zn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(zn.copy(this.origin).addScaledVector(this.direction,t),zn.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){po.copy(e).add(t).multiplyScalar(.5),rr.copy(t).sub(e).normalize(),ei.copy(this.origin).sub(po);const r=e.distanceTo(t)*.5,o=-this.direction.dot(rr),a=ei.dot(this.direction),c=-ei.dot(rr),l=ei.lengthSq(),u=Math.abs(1-o*o);let h,d,f,g;if(u>0)if(h=o*c-a,d=o*a-c,g=r*u,h>=0)if(d>=-g)if(d<=g){const _=1/u;h*=_,d*=_,f=h*(h+o*d+2*a)+d*(o*h+d+2*c)+l}else d=r,h=Math.max(0,-(o*d+a)),f=-h*h+d*(d+2*c)+l;else d=-r,h=Math.max(0,-(o*d+a)),f=-h*h+d*(d+2*c)+l;else d<=-g?(h=Math.max(0,-(-o*r+a)),d=h>0?-r:Math.min(Math.max(-r,-c),r),f=-h*h+d*(d+2*c)+l):d<=g?(h=0,d=Math.min(Math.max(-r,-c),r),f=d*(d+2*c)+l):(h=Math.max(0,-(o*r+a)),d=h>0?r:Math.min(Math.max(-r,-c),r),f=-h*h+d*(d+2*c)+l);else d=o>0?-r:r,h=Math.max(0,-(o*d+a)),f=-h*h+d*(d+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,h),s&&s.copy(po).addScaledVector(rr,d),f}intersectSphere(e,t){zn.subVectors(e.center,this.origin);const n=zn.dot(this.direction),s=zn.dot(zn)-n*n,r=e.radius*e.radius;if(s>r)return null;const o=Math.sqrt(r-s),a=n-o,c=n+o;return c<0?null:a<0?this.at(c,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,o,a,c;const l=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,d=this.origin;return l>=0?(n=(e.min.x-d.x)*l,s=(e.max.x-d.x)*l):(n=(e.max.x-d.x)*l,s=(e.min.x-d.x)*l),u>=0?(r=(e.min.y-d.y)*u,o=(e.max.y-d.y)*u):(r=(e.max.y-d.y)*u,o=(e.min.y-d.y)*u),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),h>=0?(a=(e.min.z-d.z)*h,c=(e.max.z-d.z)*h):(a=(e.max.z-d.z)*h,c=(e.min.z-d.z)*h),n>c||a>s)||((a>n||n!==n)&&(n=a),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,zn)!==null}intersectTriangle(e,t,n,s,r){mo.subVectors(t,e),or.subVectors(n,e),go.crossVectors(mo,or);let o=this.direction.dot(go),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;ei.subVectors(this.origin,e);const c=a*this.direction.dot(or.crossVectors(ei,or));if(c<0)return null;const l=a*this.direction.dot(mo.cross(ei));if(l<0||c+l>o)return null;const u=-a*ei.dot(go);return u<0?null:this.at(u/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class pt{constructor(e,t,n,s,r,o,a,c,l,u,h,d,f,g,_,m){pt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,c,l,u,h,d,f,g,_,m)}set(e,t,n,s,r,o,a,c,l,u,h,d,f,g,_,m){const p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=s,p[1]=r,p[5]=o,p[9]=a,p[13]=c,p[2]=l,p[6]=u,p[10]=h,p[14]=d,p[3]=f,p[7]=g,p[11]=_,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new pt().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,s=1/Wi.setFromMatrixColumn(e,0).length(),r=1/Wi.setFromMatrixColumn(e,1).length(),o=1/Wi.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,s=e.y,r=e.z,o=Math.cos(n),a=Math.sin(n),c=Math.cos(s),l=Math.sin(s),u=Math.cos(r),h=Math.sin(r);if(e.order==="XYZ"){const d=o*u,f=o*h,g=a*u,_=a*h;t[0]=c*u,t[4]=-c*h,t[8]=l,t[1]=f+g*l,t[5]=d-_*l,t[9]=-a*c,t[2]=_-d*l,t[6]=g+f*l,t[10]=o*c}else if(e.order==="YXZ"){const d=c*u,f=c*h,g=l*u,_=l*h;t[0]=d+_*a,t[4]=g*a-f,t[8]=o*l,t[1]=o*h,t[5]=o*u,t[9]=-a,t[2]=f*a-g,t[6]=_+d*a,t[10]=o*c}else if(e.order==="ZXY"){const d=c*u,f=c*h,g=l*u,_=l*h;t[0]=d-_*a,t[4]=-o*h,t[8]=g+f*a,t[1]=f+g*a,t[5]=o*u,t[9]=_-d*a,t[2]=-o*l,t[6]=a,t[10]=o*c}else if(e.order==="ZYX"){const d=o*u,f=o*h,g=a*u,_=a*h;t[0]=c*u,t[4]=g*l-f,t[8]=d*l+_,t[1]=c*h,t[5]=_*l+d,t[9]=f*l-g,t[2]=-l,t[6]=a*c,t[10]=o*c}else if(e.order==="YZX"){const d=o*c,f=o*l,g=a*c,_=a*l;t[0]=c*u,t[4]=_-d*h,t[8]=g*h+f,t[1]=h,t[5]=o*u,t[9]=-a*u,t[2]=-l*u,t[6]=f*h+g,t[10]=d-_*h}else if(e.order==="XZY"){const d=o*c,f=o*l,g=a*c,_=a*l;t[0]=c*u,t[4]=-h,t[8]=l*u,t[1]=d*h+_,t[5]=o*u,t[9]=f*h-g,t[2]=g*h-f,t[6]=a*u,t[10]=_*h+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(qd,e,$d)}lookAt(e,t,n){const s=this.elements;return an.subVectors(e,t),an.lengthSq()===0&&(an.z=1),an.normalize(),ti.crossVectors(n,an),ti.lengthSq()===0&&(Math.abs(n.z)===1?an.x+=1e-4:an.z+=1e-4,an.normalize(),ti.crossVectors(n,an)),ti.normalize(),ar.crossVectors(an,ti),s[0]=ti.x,s[4]=ar.x,s[8]=an.x,s[1]=ti.y,s[5]=ar.y,s[9]=an.y,s[2]=ti.z,s[6]=ar.z,s[10]=an.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[4],c=n[8],l=n[12],u=n[1],h=n[5],d=n[9],f=n[13],g=n[2],_=n[6],m=n[10],p=n[14],A=n[3],E=n[7],x=n[11],D=n[15],R=s[0],C=s[4],I=s[8],b=s[12],M=s[1],T=s[5],F=s[9],z=s[13],H=s[2],G=s[6],q=s[10],W=s[14],Y=s[3],me=s[7],xe=s[11],De=s[15];return r[0]=o*R+a*M+c*H+l*Y,r[4]=o*C+a*T+c*G+l*me,r[8]=o*I+a*F+c*q+l*xe,r[12]=o*b+a*z+c*W+l*De,r[1]=u*R+h*M+d*H+f*Y,r[5]=u*C+h*T+d*G+f*me,r[9]=u*I+h*F+d*q+f*xe,r[13]=u*b+h*z+d*W+f*De,r[2]=g*R+_*M+m*H+p*Y,r[6]=g*C+_*T+m*G+p*me,r[10]=g*I+_*F+m*q+p*xe,r[14]=g*b+_*z+m*W+p*De,r[3]=A*R+E*M+x*H+D*Y,r[7]=A*C+E*T+x*G+D*me,r[11]=A*I+E*F+x*q+D*xe,r[15]=A*b+E*z+x*W+D*De,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],o=e[1],a=e[5],c=e[9],l=e[13],u=e[2],h=e[6],d=e[10],f=e[14],g=e[3],_=e[7],m=e[11],p=e[15];return g*(+r*c*h-s*l*h-r*a*d+n*l*d+s*a*f-n*c*f)+_*(+t*c*f-t*l*d+r*o*d-s*o*f+s*l*u-r*c*u)+m*(+t*l*h-t*a*f-r*o*h+n*o*f+r*a*u-n*l*u)+p*(-s*a*u-t*c*h+t*a*d+s*o*h-n*o*d+n*c*u)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],u=e[8],h=e[9],d=e[10],f=e[11],g=e[12],_=e[13],m=e[14],p=e[15],A=h*m*l-_*d*l+_*c*f-a*m*f-h*c*p+a*d*p,E=g*d*l-u*m*l-g*c*f+o*m*f+u*c*p-o*d*p,x=u*_*l-g*h*l+g*a*f-o*_*f-u*a*p+o*h*p,D=g*h*c-u*_*c-g*a*d+o*_*d+u*a*m-o*h*m,R=t*A+n*E+s*x+r*D;if(R===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const C=1/R;return e[0]=A*C,e[1]=(_*d*r-h*m*r-_*s*f+n*m*f+h*s*p-n*d*p)*C,e[2]=(a*m*r-_*c*r+_*s*l-n*m*l-a*s*p+n*c*p)*C,e[3]=(h*c*r-a*d*r-h*s*l+n*d*l+a*s*f-n*c*f)*C,e[4]=E*C,e[5]=(u*m*r-g*d*r+g*s*f-t*m*f-u*s*p+t*d*p)*C,e[6]=(g*c*r-o*m*r-g*s*l+t*m*l+o*s*p-t*c*p)*C,e[7]=(o*d*r-u*c*r+u*s*l-t*d*l-o*s*f+t*c*f)*C,e[8]=x*C,e[9]=(g*h*r-u*_*r-g*n*f+t*_*f+u*n*p-t*h*p)*C,e[10]=(o*_*r-g*a*r+g*n*l-t*_*l-o*n*p+t*a*p)*C,e[11]=(u*a*r-o*h*r-u*n*l+t*h*l+o*n*f-t*a*f)*C,e[12]=D*C,e[13]=(u*_*s-g*h*s+g*n*d-t*_*d-u*n*m+t*h*m)*C,e[14]=(g*a*s-o*_*s-g*n*c+t*_*c+o*n*m-t*a*m)*C,e[15]=(o*h*s-u*a*s+u*n*c-t*h*c-o*n*d+t*a*d)*C,this}scale(e){const t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),s=Math.sin(t),r=1-n,o=e.x,a=e.y,c=e.z,l=r*o,u=r*a;return this.set(l*o+n,l*a-s*c,l*c+s*a,0,l*a+s*c,u*a+n,u*c-s*o,0,l*c-s*a,u*c+s*o,r*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,o){return this.set(1,n,r,0,e,1,o,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){const s=this.elements,r=t._x,o=t._y,a=t._z,c=t._w,l=r+r,u=o+o,h=a+a,d=r*l,f=r*u,g=r*h,_=o*u,m=o*h,p=a*h,A=c*l,E=c*u,x=c*h,D=n.x,R=n.y,C=n.z;return s[0]=(1-(_+p))*D,s[1]=(f+x)*D,s[2]=(g-E)*D,s[3]=0,s[4]=(f-x)*R,s[5]=(1-(d+p))*R,s[6]=(m+A)*R,s[7]=0,s[8]=(g+E)*C,s[9]=(m-A)*C,s[10]=(1-(d+_))*C,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){const s=this.elements;let r=Wi.set(s[0],s[1],s[2]).length();const o=Wi.set(s[4],s[5],s[6]).length(),a=Wi.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],yn.copy(this);const l=1/r,u=1/o,h=1/a;return yn.elements[0]*=l,yn.elements[1]*=l,yn.elements[2]*=l,yn.elements[4]*=u,yn.elements[5]*=u,yn.elements[6]*=u,yn.elements[8]*=h,yn.elements[9]*=h,yn.elements[10]*=h,t.setFromRotationMatrix(yn),n.x=r,n.y=o,n.z=a,this}makePerspective(e,t,n,s,r,o,a=Rn,c=!1){const l=this.elements,u=2*r/(t-e),h=2*r/(n-s),d=(t+e)/(t-e),f=(n+s)/(n-s);let g,_;if(c)g=r/(o-r),_=o*r/(o-r);else if(a===Rn)g=-(o+r)/(o-r),_=-2*o*r/(o-r);else if(a===zr)g=-o/(o-r),_=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=u,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=h,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=_,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,s,r,o,a=Rn,c=!1){const l=this.elements,u=2/(t-e),h=2/(n-s),d=-(t+e)/(t-e),f=-(n+s)/(n-s);let g,_;if(c)g=1/(o-r),_=o/(o-r);else if(a===Rn)g=-2/(o-r),_=-(o+r)/(o-r);else if(a===zr)g=-1/(o-r),_=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=u,l[4]=0,l[8]=0,l[12]=d,l[1]=0,l[5]=h,l[9]=0,l[13]=f,l[2]=0,l[6]=0,l[10]=g,l[14]=_,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const Wi=new L,yn=new pt,qd=new L(0,0,0),$d=new L(1,1,1),ti=new L,ar=new L,an=new L,$l=new pt,Kl=new qn;class bn{constructor(e=0,t=0,n=0,s=bn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const s=e.elements,r=s[0],o=s[4],a=s[8],c=s[1],l=s[5],u=s[9],h=s[2],d=s[6],f=s[10];switch(t){case"XYZ":this._y=Math.asin(st(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-st(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-h,r),this._z=0);break;case"ZXY":this._x=Math.asin(st(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-h,f),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-st(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(st(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-u,l),this._y=Math.atan2(-h,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-st(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-u,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return $l.makeRotationFromQuaternion(e),this.setFromRotationMatrix($l,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Kl.setFromEuler(this),this.setFromQuaternion(Kl,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}bn.DEFAULT_ORDER="XYZ";class ol{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Kd=0;const jl=new L,Xi=new qn,kn=new pt,lr=new L,As=new L,jd=new L,Zd=new qn,Zl=new L(1,0,0),Jl=new L(0,1,0),Ql=new L(0,0,1),ec={type:"added"},Jd={type:"removed"},Yi={type:"childadded",child:null},_o={type:"childremoved",child:null};class Tt extends Di{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Kd++}),this.uuid=Ii(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Tt.DEFAULT_UP.clone();const e=new L,t=new bn,n=new qn,s=new L(1,1,1);function r(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new pt},normalMatrix:{value:new tt}}),this.matrix=new pt,this.matrixWorld=new pt,this.matrixAutoUpdate=Tt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Tt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ol,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Xi.setFromAxisAngle(e,t),this.quaternion.multiply(Xi),this}rotateOnWorldAxis(e,t){return Xi.setFromAxisAngle(e,t),this.quaternion.premultiply(Xi),this}rotateX(e){return this.rotateOnAxis(Zl,e)}rotateY(e){return this.rotateOnAxis(Jl,e)}rotateZ(e){return this.rotateOnAxis(Ql,e)}translateOnAxis(e,t){return jl.copy(e).applyQuaternion(this.quaternion),this.position.add(jl.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Zl,e)}translateY(e){return this.translateOnAxis(Jl,e)}translateZ(e){return this.translateOnAxis(Ql,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(kn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?lr.copy(e):lr.set(e,t,n);const s=this.parent;this.updateWorldMatrix(!0,!1),As.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?kn.lookAt(As,lr,this.up):kn.lookAt(lr,As,this.up),this.quaternion.setFromRotationMatrix(kn),s&&(kn.extractRotation(s.matrixWorld),Xi.setFromRotationMatrix(kn),this.quaternion.premultiply(Xi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(ec),Yi.child=e,this.dispatchEvent(Yi),Yi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Jd),_o.child=e,this.dispatchEvent(_o),_o.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),kn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),kn.multiply(e.parent.matrixWorld)),e.applyMatrix4(kn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(ec),Yi.child=e,this.dispatchEvent(Yi),Yi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){const o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(As,e,jd),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(As,Zd,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const c=a.shapes;if(Array.isArray(c))for(let l=0,u=c.length;l<u;l++){const h=c[l];r(e.shapes,h)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(r(e.materials,this.material[c]));s.material=a}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const c=this.animations[a];s.animations.push(r(e.animations,c))}}if(t){const a=o(e.geometries),c=o(e.materials),l=o(e.textures),u=o(e.images),h=o(e.shapes),d=o(e.skeletons),f=o(e.animations),g=o(e.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),u.length>0&&(n.images=u),h.length>0&&(n.shapes=h),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=s,n;function o(a){const c=[];for(const l in a){const u=a[l];delete u.metadata,c.push(u)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const s=e.children[n];this.add(s.clone())}return this}}Tt.DEFAULT_UP=new L(0,1,0);Tt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Tt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Mn=new L,Hn=new L,vo=new L,Vn=new L,qi=new L,$i=new L,tc=new L,xo=new L,yo=new L,Mo=new L,So=new yt,Eo=new yt,bo=new yt;class mn{constructor(e=new L,t=new L,n=new L){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),Mn.subVectors(e,t),s.cross(Mn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){Mn.subVectors(s,t),Hn.subVectors(n,t),vo.subVectors(e,t);const o=Mn.dot(Mn),a=Mn.dot(Hn),c=Mn.dot(vo),l=Hn.dot(Hn),u=Hn.dot(vo),h=o*l-a*a;if(h===0)return r.set(0,0,0),null;const d=1/h,f=(l*c-a*u)*d,g=(o*u-a*c)*d;return r.set(1-f-g,g,f)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,Vn)===null?!1:Vn.x>=0&&Vn.y>=0&&Vn.x+Vn.y<=1}static getInterpolation(e,t,n,s,r,o,a,c){return this.getBarycoord(e,t,n,s,Vn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,Vn.x),c.addScaledVector(o,Vn.y),c.addScaledVector(a,Vn.z),c)}static getInterpolatedAttribute(e,t,n,s,r,o){return So.setScalar(0),Eo.setScalar(0),bo.setScalar(0),So.fromBufferAttribute(e,t),Eo.fromBufferAttribute(e,n),bo.fromBufferAttribute(e,s),o.setScalar(0),o.addScaledVector(So,r.x),o.addScaledVector(Eo,r.y),o.addScaledVector(bo,r.z),o}static isFrontFacing(e,t,n,s){return Mn.subVectors(n,t),Hn.subVectors(e,t),Mn.cross(Hn).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Mn.subVectors(this.c,this.b),Hn.subVectors(this.a,this.b),Mn.cross(Hn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return mn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return mn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return mn.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return mn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return mn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,s=this.b,r=this.c;let o,a;qi.subVectors(s,n),$i.subVectors(r,n),xo.subVectors(e,n);const c=qi.dot(xo),l=$i.dot(xo);if(c<=0&&l<=0)return t.copy(n);yo.subVectors(e,s);const u=qi.dot(yo),h=$i.dot(yo);if(u>=0&&h<=u)return t.copy(s);const d=c*h-u*l;if(d<=0&&c>=0&&u<=0)return o=c/(c-u),t.copy(n).addScaledVector(qi,o);Mo.subVectors(e,r);const f=qi.dot(Mo),g=$i.dot(Mo);if(g>=0&&f<=g)return t.copy(r);const _=f*l-c*g;if(_<=0&&l>=0&&g<=0)return a=l/(l-g),t.copy(n).addScaledVector($i,a);const m=u*g-f*h;if(m<=0&&h-u>=0&&f-g>=0)return tc.subVectors(r,s),a=(h-u)/(h-u+(f-g)),t.copy(s).addScaledVector(tc,a);const p=1/(m+_+d);return o=_*p,a=d*p,t.copy(n).addScaledVector(qi,o).addScaledVector($i,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Ru={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ni={h:0,s:0,l:0},cr={h:0,s:0,l:0};function To(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class $e{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=un){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,dt.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=dt.workingColorSpace){return this.r=e,this.g=t,this.b=n,dt.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=dt.workingColorSpace){if(e=sl(e,1),t=st(t,0,1),n=st(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=To(o,r,e+1/3),this.g=To(o,r,e),this.b=To(o,r,e-1/3)}return dt.colorSpaceToWorking(this,s),this}setStyle(e,t=un){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=un){const n=Ru[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Yn(e.r),this.g=Yn(e.g),this.b=Yn(e.b),this}copyLinearToSRGB(e){return this.r=ls(e.r),this.g=ls(e.g),this.b=ls(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=un){return dt.workingToColorSpace(Vt.copy(this),e),Math.round(st(Vt.r*255,0,255))*65536+Math.round(st(Vt.g*255,0,255))*256+Math.round(st(Vt.b*255,0,255))}getHexString(e=un){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=dt.workingColorSpace){dt.workingToColorSpace(Vt.copy(this),t);const n=Vt.r,s=Vt.g,r=Vt.b,o=Math.max(n,s,r),a=Math.min(n,s,r);let c,l;const u=(a+o)/2;if(a===o)c=0,l=0;else{const h=o-a;switch(l=u<=.5?h/(o+a):h/(2-o-a),o){case n:c=(s-r)/h+(s<r?6:0);break;case s:c=(r-n)/h+2;break;case r:c=(n-s)/h+4;break}c/=6}return e.h=c,e.s=l,e.l=u,e}getRGB(e,t=dt.workingColorSpace){return dt.workingToColorSpace(Vt.copy(this),t),e.r=Vt.r,e.g=Vt.g,e.b=Vt.b,e}getStyle(e=un){dt.workingToColorSpace(Vt.copy(this),e);const t=Vt.r,n=Vt.g,s=Vt.b;return e!==un?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(ni),this.setHSL(ni.h+e,ni.s+t,ni.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(ni),e.getHSL(cr);const n=Fs(ni.h,cr.h,t),s=Fs(ni.s,cr.s,t),r=Fs(ni.l,cr.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Vt=new $e;$e.NAMES=Ru;let Qd=0;class _s extends Di{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Qd++}),this.uuid=Ii(),this.name="",this.type="Material",this.blending=os,this.side=ci,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=jo,this.blendDst=Zo,this.blendEquation=Ei,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new $e(0,0,0),this.blendAlpha=0,this.depthFunc=cs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=kl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=zi,this.stencilZFail=zi,this.stencilZPass=zi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==os&&(n.blending=this.blending),this.side!==ci&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==jo&&(n.blendSrc=this.blendSrc),this.blendDst!==Zo&&(n.blendDst=this.blendDst),this.blendEquation!==Ei&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==cs&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==kl&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==zi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==zi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==zi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const o=[];for(const a in r){const c=r[a];delete c.metadata,o.push(c)}return o}if(t){const r=s(e.textures),o=s(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class ui extends _s{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new $e(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new bn,this.combine=ja,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Rt=new L,ur=new ge;let ef=0;class nn{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:ef++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Hl,this.updateRanges=[],this.gpuType=An,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)ur.fromBufferAttribute(this,t),ur.applyMatrix3(e),this.setXY(t,ur.x,ur.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Rt.fromBufferAttribute(this,t),Rt.applyMatrix3(e),this.setXYZ(t,Rt.x,Rt.y,Rt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Rt.fromBufferAttribute(this,t),Rt.applyMatrix4(e),this.setXYZ(t,Rt.x,Rt.y,Rt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Rt.fromBufferAttribute(this,t),Rt.applyNormalMatrix(e),this.setXYZ(t,Rt.x,Rt.y,Rt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Rt.fromBufferAttribute(this,t),Rt.transformDirection(e),this.setXYZ(t,Rt.x,Rt.y,Rt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=ts(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Yt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=ts(t,this.array)),t}setX(e,t){return this.normalized&&(t=Yt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=ts(t,this.array)),t}setY(e,t){return this.normalized&&(t=Yt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=ts(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Yt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=ts(t,this.array)),t}setW(e,t){return this.normalized&&(t=Yt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Yt(t,this.array),n=Yt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=Yt(t,this.array),n=Yt(n,this.array),s=Yt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=Yt(t,this.array),n=Yt(n,this.array),s=Yt(s,this.array),r=Yt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Hl&&(e.usage=this.usage),e}}class Cu extends nn{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class Pu extends nn{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class bt extends nn{constructor(e,t,n){super(new Float32Array(e),t,n)}}let tf=0;const pn=new pt,wo=new Tt,Ki=new L,ln=new hi,Rs=new hi,Ut=new L;class Wt extends Di{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:tf++}),this.uuid=Ii(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(wu(e)?Pu:Cu)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new tt().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return pn.makeRotationFromQuaternion(e),this.applyMatrix4(pn),this}rotateX(e){return pn.makeRotationX(e),this.applyMatrix4(pn),this}rotateY(e){return pn.makeRotationY(e),this.applyMatrix4(pn),this}rotateZ(e){return pn.makeRotationZ(e),this.applyMatrix4(pn),this}translate(e,t,n){return pn.makeTranslation(e,t,n),this.applyMatrix4(pn),this}scale(e,t,n){return pn.makeScale(e,t,n),this.applyMatrix4(pn),this}lookAt(e){return wo.lookAt(e),wo.updateMatrix(),this.applyMatrix4(wo.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ki).negate(),this.translate(Ki.x,Ki.y,Ki.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let s=0,r=e.length;s<r;s++){const o=e[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new bt(n,3))}else{const n=Math.min(e.length,t.count);for(let s=0;s<n;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new hi);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new L(-1/0,-1/0,-1/0),new L(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){const r=t[n];ln.setFromBufferAttribute(r),this.morphTargetsRelative?(Ut.addVectors(this.boundingBox.min,ln.min),this.boundingBox.expandByPoint(Ut),Ut.addVectors(this.boundingBox.max,ln.max),this.boundingBox.expandByPoint(Ut)):(this.boundingBox.expandByPoint(ln.min),this.boundingBox.expandByPoint(ln.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new gs);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new L,1/0);return}if(e){const n=this.boundingSphere.center;if(ln.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){const a=t[r];Rs.setFromBufferAttribute(a),this.morphTargetsRelative?(Ut.addVectors(ln.min,Rs.min),ln.expandByPoint(Ut),Ut.addVectors(ln.max,Rs.max),ln.expandByPoint(Ut)):(ln.expandByPoint(Rs.min),ln.expandByPoint(Rs.max))}ln.getCenter(n);let s=0;for(let r=0,o=e.count;r<o;r++)Ut.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(Ut));if(t)for(let r=0,o=t.length;r<o;r++){const a=t[r],c=this.morphTargetsRelative;for(let l=0,u=a.count;l<u;l++)Ut.fromBufferAttribute(a,l),c&&(Ki.fromBufferAttribute(e,l),Ut.add(Ki)),s=Math.max(s,n.distanceToSquared(Ut))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new nn(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),a=[],c=[];for(let I=0;I<n.count;I++)a[I]=new L,c[I]=new L;const l=new L,u=new L,h=new L,d=new ge,f=new ge,g=new ge,_=new L,m=new L;function p(I,b,M){l.fromBufferAttribute(n,I),u.fromBufferAttribute(n,b),h.fromBufferAttribute(n,M),d.fromBufferAttribute(r,I),f.fromBufferAttribute(r,b),g.fromBufferAttribute(r,M),u.sub(l),h.sub(l),f.sub(d),g.sub(d);const T=1/(f.x*g.y-g.x*f.y);isFinite(T)&&(_.copy(u).multiplyScalar(g.y).addScaledVector(h,-f.y).multiplyScalar(T),m.copy(h).multiplyScalar(f.x).addScaledVector(u,-g.x).multiplyScalar(T),a[I].add(_),a[b].add(_),a[M].add(_),c[I].add(m),c[b].add(m),c[M].add(m))}let A=this.groups;A.length===0&&(A=[{start:0,count:e.count}]);for(let I=0,b=A.length;I<b;++I){const M=A[I],T=M.start,F=M.count;for(let z=T,H=T+F;z<H;z+=3)p(e.getX(z+0),e.getX(z+1),e.getX(z+2))}const E=new L,x=new L,D=new L,R=new L;function C(I){D.fromBufferAttribute(s,I),R.copy(D);const b=a[I];E.copy(b),E.sub(D.multiplyScalar(D.dot(b))).normalize(),x.crossVectors(R,b);const T=x.dot(c[I])<0?-1:1;o.setXYZW(I,E.x,E.y,E.z,T)}for(let I=0,b=A.length;I<b;++I){const M=A[I],T=M.start,F=M.count;for(let z=T,H=T+F;z<H;z+=3)C(e.getX(z+0)),C(e.getX(z+1)),C(e.getX(z+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new nn(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);const s=new L,r=new L,o=new L,a=new L,c=new L,l=new L,u=new L,h=new L;if(e)for(let d=0,f=e.count;d<f;d+=3){const g=e.getX(d+0),_=e.getX(d+1),m=e.getX(d+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,_),o.fromBufferAttribute(t,m),u.subVectors(o,r),h.subVectors(s,r),u.cross(h),a.fromBufferAttribute(n,g),c.fromBufferAttribute(n,_),l.fromBufferAttribute(n,m),a.add(u),c.add(u),l.add(u),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(_,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let d=0,f=t.count;d<f;d+=3)s.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),o.fromBufferAttribute(t,d+2),u.subVectors(o,r),h.subVectors(s,r),u.cross(h),n.setXYZ(d+0,u.x,u.y,u.z),n.setXYZ(d+1,u.x,u.y,u.z),n.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Ut.fromBufferAttribute(e,t),Ut.normalize(),e.setXYZ(t,Ut.x,Ut.y,Ut.z)}toNonIndexed(){function e(a,c){const l=a.array,u=a.itemSize,h=a.normalized,d=new l.constructor(c.length*u);let f=0,g=0;for(let _=0,m=c.length;_<m;_++){a.isInterleavedBufferAttribute?f=c[_]*a.data.stride+a.offset:f=c[_]*u;for(let p=0;p<u;p++)d[g++]=l[f++]}return new nn(d,u,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Wt,n=this.index.array,s=this.attributes;for(const a in s){const c=s[a],l=e(c,n);t.setAttribute(a,l)}const r=this.morphAttributes;for(const a in r){const c=[],l=r[a];for(let u=0,h=l.length;u<h;u++){const d=l[u],f=e(d,n);c.push(f)}t.morphAttributes[a]=c}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,c=o.length;a<c;a++){const l=o[a];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const c in n){const l=n[c];e.data.attributes[c]=l.toJSON(e.data)}const s={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],u=[];for(let h=0,d=l.length;h<d;h++){const f=l[h];u.push(f.toJSON(e.data))}u.length>0&&(s[c]=u,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const s=e.attributes;for(const l in s){const u=s[l];this.setAttribute(l,u.clone(t))}const r=e.morphAttributes;for(const l in r){const u=[],h=r[l];for(let d=0,f=h.length;d<f;d++)u.push(h[d].clone(t));this.morphAttributes[l]=u}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let l=0,u=o.length;l<u;l++){const h=o[l];this.addGroup(h.start,h.count,h.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const nc=new pt,vi=new Yr,hr=new gs,ic=new L,dr=new L,fr=new L,pr=new L,Ao=new L,mr=new L,sc=new L,gr=new L;class $t extends Tt{constructor(e=new Wt,t=new ui){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(s,e);const a=this.morphTargetInfluences;if(r&&a){mr.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const u=a[c],h=r[c];u!==0&&(Ao.fromBufferAttribute(h,e),o?mr.addScaledVector(Ao,u):mr.addScaledVector(Ao.sub(t),u))}t.add(mr)}return t}raycast(e,t){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),hr.copy(n.boundingSphere),hr.applyMatrix4(r),vi.copy(e.ray).recast(e.near),!(hr.containsPoint(vi.origin)===!1&&(vi.intersectSphere(hr,ic)===null||vi.origin.distanceToSquared(ic)>(e.far-e.near)**2))&&(nc.copy(r).invert(),vi.copy(e.ray).applyMatrix4(nc),!(n.boundingBox!==null&&vi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,vi)))}_computeIntersections(e,t,n){let s;const r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,l=r.attributes.uv,u=r.attributes.uv1,h=r.attributes.normal,d=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,_=d.length;g<_;g++){const m=d[g],p=o[m.materialIndex],A=Math.max(m.start,f.start),E=Math.min(a.count,Math.min(m.start+m.count,f.start+f.count));for(let x=A,D=E;x<D;x+=3){const R=a.getX(x),C=a.getX(x+1),I=a.getX(x+2);s=_r(this,p,e,n,l,u,h,R,C,I),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const g=Math.max(0,f.start),_=Math.min(a.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){const A=a.getX(m),E=a.getX(m+1),x=a.getX(m+2);s=_r(this,o,e,n,l,u,h,A,E,x),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(o))for(let g=0,_=d.length;g<_;g++){const m=d[g],p=o[m.materialIndex],A=Math.max(m.start,f.start),E=Math.min(c.count,Math.min(m.start+m.count,f.start+f.count));for(let x=A,D=E;x<D;x+=3){const R=x,C=x+1,I=x+2;s=_r(this,p,e,n,l,u,h,R,C,I),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const g=Math.max(0,f.start),_=Math.min(c.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){const A=m,E=m+1,x=m+2;s=_r(this,o,e,n,l,u,h,A,E,x),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}}function nf(i,e,t,n,s,r,o,a){let c;if(e.side===tn?c=n.intersectTriangle(o,r,s,!0,a):c=n.intersectTriangle(s,r,o,e.side===ci,a),c===null)return null;gr.copy(a),gr.applyMatrix4(i.matrixWorld);const l=t.ray.origin.distanceTo(gr);return l<t.near||l>t.far?null:{distance:l,point:gr.clone(),object:i}}function _r(i,e,t,n,s,r,o,a,c,l){i.getVertexPosition(a,dr),i.getVertexPosition(c,fr),i.getVertexPosition(l,pr);const u=nf(i,e,t,n,dr,fr,pr,sc);if(u){const h=new L;mn.getBarycoord(sc,dr,fr,pr,h),s&&(u.uv=mn.getInterpolatedAttribute(s,a,c,l,h,new ge)),r&&(u.uv1=mn.getInterpolatedAttribute(r,a,c,l,h,new ge)),o&&(u.normal=mn.getInterpolatedAttribute(o,a,c,l,h,new L),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));const d={a,b:c,c:l,normal:new L,materialIndex:0};mn.getNormal(dr,fr,pr,d.normal),u.face=d,u.barycoord=h}return u}class Ot extends Wt{constructor(e=1,t=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};const a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);const c=[],l=[],u=[],h=[];let d=0,f=0;g("z","y","x",-1,-1,n,t,e,o,r,0),g("z","y","x",1,-1,n,t,-e,o,r,1),g("x","z","y",1,1,e,n,t,s,o,2),g("x","z","y",1,-1,e,n,-t,s,o,3),g("x","y","z",1,-1,e,t,n,s,r,4),g("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new bt(l,3)),this.setAttribute("normal",new bt(u,3)),this.setAttribute("uv",new bt(h,2));function g(_,m,p,A,E,x,D,R,C,I,b){const M=x/C,T=D/I,F=x/2,z=D/2,H=R/2,G=C+1,q=I+1;let W=0,Y=0;const me=new L;for(let xe=0;xe<q;xe++){const De=xe*T-z;for(let qe=0;qe<G;qe++){const Qe=qe*M-F;me[_]=Qe*A,me[m]=De*E,me[p]=H,l.push(me.x,me.y,me.z),me[_]=0,me[m]=0,me[p]=R>0?1:-1,u.push(me.x,me.y,me.z),h.push(qe/C),h.push(1-xe/I),W+=1}}for(let xe=0;xe<I;xe++)for(let De=0;De<C;De++){const qe=d+De+G*xe,Qe=d+De+G*(xe+1),lt=d+(De+1)+G*(xe+1),et=d+(De+1)+G*xe;c.push(qe,Qe,et),c.push(Qe,lt,et),Y+=6}a.addGroup(f,Y,b),f+=Y,d+=W}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ot(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function ps(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function qt(i){const e={};for(let t=0;t<i.length;t++){const n=ps(i[t]);for(const s in n)e[s]=n[s]}return e}function sf(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Lu(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:dt.workingColorSpace}const rf={clone:ps,merge:qt};var of=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,af=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class $n extends _s{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=of,this.fragmentShader=af,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ps(e.uniforms),this.uniformsGroups=sf(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?t.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[s]={type:"m4",value:o.toArray()}:t.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class Du extends Tt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new pt,this.projectionMatrix=new pt,this.projectionMatrixInverse=new pt,this.coordinateSystem=Rn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const ii=new L,rc=new ge,oc=new ge;class Qt extends Du{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=fs*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(as*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return fs*2*Math.atan(Math.tan(as*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){ii.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(ii.x,ii.y).multiplyScalar(-e/ii.z),ii.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(ii.x,ii.y).multiplyScalar(-e/ii.z)}getViewSize(e,t){return this.getViewBounds(e,rc,oc),t.subVectors(oc,rc)}setViewOffset(e,t,n,s,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(as*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const c=o.fullWidth,l=o.fullHeight;r+=o.offsetX*s/c,t-=o.offsetY*n/l,s*=o.width/c,n*=o.height/l}const a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const ji=-90,Zi=1;class lf extends Tt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Qt(ji,Zi,e,t);s.layers=this.layers,this.add(s);const r=new Qt(ji,Zi,e,t);r.layers=this.layers,this.add(r);const o=new Qt(ji,Zi,e,t);o.layers=this.layers,this.add(o);const a=new Qt(ji,Zi,e,t);a.layers=this.layers,this.add(a);const c=new Qt(ji,Zi,e,t);c.layers=this.layers,this.add(c);const l=new Qt(ji,Zi,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,s,r,o,a,c]=t;for(const l of t)this.remove(l);if(e===Rn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===zr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,c,l,u]=this.children,h=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,o),e.setRenderTarget(n,2,s),e.render(t,a),e.setRenderTarget(n,3,s),e.render(t,c),e.setRenderTarget(n,4,s),e.render(t,l),n.texture.generateMipmaps=_,e.setRenderTarget(n,5,s),e.render(t,u),e.setRenderTarget(h,d,f),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Iu extends Gt{constructor(e=[],t=us,n,s,r,o,a,c,l,u){super(e,t,n,s,r,o,a,c,l,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class cf extends Ci{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new Iu(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Ot(5,5,5),r=new $n({name:"CubemapFromEquirect",uniforms:ps(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:tn,blending:ai});r.uniforms.tEquirect.value=t;const o=new $t(s,r),a=t.minFilter;return t.minFilter===wi&&(t.minFilter=gn),new lf(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){const r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,s);e.setRenderTarget(r)}}class Wn extends Tt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const uf={type:"move"};class Ro{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Wn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Wn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new L,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new L),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Wn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new L,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new L),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,o=null;const a=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){o=!0;for(const _ of e.hand.values()){const m=t.getJointPose(_,n),p=this._getHandJoint(l,_);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const u=l.joints["index-finger-tip"],h=l.joints["thumb-tip"],d=u.position.distanceTo(h.position),f=.02,g=.005;l.inputState.pinching&&d>f+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&d<=f-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(uf)))}return a!==null&&(a.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new Wn;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}class al{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new $e(e),this.near=t,this.far=n}clone(){return new al(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class hf extends Tt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new bn,this.environmentIntensity=1,this.environmentRotation=new bn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class df extends Gt{constructor(e=null,t=1,n=1,s,r,o,a,c,l=hn,u=hn,h,d){super(null,o,a,c,l,u,s,r,h,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Oa extends nn{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Ji=new pt,ac=new pt,vr=[],lc=new hi,ff=new pt,Cs=new $t,Ps=new gs;class ll extends $t{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Oa(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,ff)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new hi),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ji),lc.copy(e.boundingBox).applyMatrix4(Ji),this.boundingBox.union(lc)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new gs),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ji),Ps.copy(e.boundingSphere).applyMatrix4(Ji),this.boundingSphere.union(Ps)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,o=e*r+1;for(let a=0;a<n.length;a++)n[a]=s[o+a]}raycast(e,t){const n=this.matrixWorld,s=this.count;if(Cs.geometry=this.geometry,Cs.material=this.material,Cs.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ps.copy(this.boundingSphere),Ps.applyMatrix4(n),e.ray.intersectsSphere(Ps)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Ji),ac.multiplyMatrices(n,Ji),Cs.matrixWorld=ac,Cs.raycast(e,vr);for(let o=0,a=vr.length;o<a;o++){const c=vr[o];c.instanceId=r,c.object=this,t.push(c)}vr.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new Oa(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new df(new Float32Array(s*this.count),s,this.count,el,An));const r=this.morphTexture.source.data.data;let o=0;for(let l=0;l<n.length;l++)o+=n[l];const a=this.geometry.morphTargetsRelative?1:1-o,c=s*e;r[c]=a,r.set(n,c+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const Co=new L,pf=new L,mf=new tt;class si{constructor(e=new L(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const s=Co.subVectors(n,t).cross(pf.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(Co),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||mf.getNormalMatrix(e),s=this.coplanarPoint(Co).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const xi=new gs,gf=new ge(.5,.5),xr=new L;class cl{constructor(e=new si,t=new si,n=new si,s=new si,r=new si,o=new si){this.planes=[e,t,n,s,r,o]}set(e,t,n,s,r,o){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Rn,n=!1){const s=this.planes,r=e.elements,o=r[0],a=r[1],c=r[2],l=r[3],u=r[4],h=r[5],d=r[6],f=r[7],g=r[8],_=r[9],m=r[10],p=r[11],A=r[12],E=r[13],x=r[14],D=r[15];if(s[0].setComponents(l-o,f-u,p-g,D-A).normalize(),s[1].setComponents(l+o,f+u,p+g,D+A).normalize(),s[2].setComponents(l+a,f+h,p+_,D+E).normalize(),s[3].setComponents(l-a,f-h,p-_,D-E).normalize(),n)s[4].setComponents(c,d,m,x).normalize(),s[5].setComponents(l-c,f-d,p-m,D-x).normalize();else if(s[4].setComponents(l-c,f-d,p-m,D-x).normalize(),t===Rn)s[5].setComponents(l+c,f+d,p+m,D+x).normalize();else if(t===zr)s[5].setComponents(c,d,m,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),xi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),xi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(xi)}intersectsSprite(e){xi.center.set(0,0,0);const t=gf.distanceTo(e.center);return xi.radius=.7071067811865476+t,xi.applyMatrix4(e.matrixWorld),this.intersectsSphere(xi)}intersectsSphere(e){const t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const s=t[n];if(xr.x=s.normal.x>0?e.max.x:e.min.x,xr.y=s.normal.y>0?e.max.y:e.min.y,xr.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(xr)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Uu extends _s{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new $e(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Hr=new L,Vr=new L,cc=new pt,Ls=new Yr,yr=new gs,Po=new L,uc=new L;class Nu extends Tt{constructor(e=new Wt,t=new Uu){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)Hr.fromBufferAttribute(t,s-1),Vr.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=Hr.distanceTo(Vr);e.setAttribute("lineDistance",new bt(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),yr.copy(n.boundingSphere),yr.applyMatrix4(s),yr.radius+=r,e.ray.intersectsSphere(yr)===!1)return;cc.copy(s).invert(),Ls.copy(e.ray).applyMatrix4(cc);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=this.isLineSegments?2:1,u=n.index,d=n.attributes.position;if(u!==null){const f=Math.max(0,o.start),g=Math.min(u.count,o.start+o.count);for(let _=f,m=g-1;_<m;_+=l){const p=u.getX(_),A=u.getX(_+1),E=Mr(this,e,Ls,c,p,A,_);E&&t.push(E)}if(this.isLineLoop){const _=u.getX(g-1),m=u.getX(f),p=Mr(this,e,Ls,c,_,m,g-1);p&&t.push(p)}}else{const f=Math.max(0,o.start),g=Math.min(d.count,o.start+o.count);for(let _=f,m=g-1;_<m;_+=l){const p=Mr(this,e,Ls,c,_,_+1,_);p&&t.push(p)}if(this.isLineLoop){const _=Mr(this,e,Ls,c,g-1,f,g-1);_&&t.push(_)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function Mr(i,e,t,n,s,r,o){const a=i.geometry.attributes.position;if(Hr.fromBufferAttribute(a,s),Vr.fromBufferAttribute(a,r),t.distanceSqToSegment(Hr,Vr,Po,uc)>n)return;Po.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(Po);if(!(l<e.near||l>e.far))return{distance:l,point:uc.clone().applyMatrix4(i.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:i}}const hc=new L,dc=new L;class _f extends Nu{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let s=0,r=t.count;s<r;s+=2)hc.fromBufferAttribute(t,s),dc.fromBufferAttribute(t,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+hc.distanceTo(dc);e.setAttribute("lineDistance",new bt(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class rx extends Nu{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}}class vf extends Gt{constructor(e,t,n,s,r=gn,o=gn,a,c,l){super(e,t,n,s,r,o,a,c,l),this.isVideoTexture=!0,this.generateMipmaps=!1,this._requestVideoFrameCallbackId=0;const u=this;function h(){u.needsUpdate=!0,u._requestVideoFrameCallbackId=e.requestVideoFrameCallback(h)}"requestVideoFrameCallback"in e&&(this._requestVideoFrameCallbackId=e.requestVideoFrameCallback(h))}clone(){return new this.constructor(this.image).copy(this)}update(){const e=this.image;"requestVideoFrameCallback"in e===!1&&e.readyState>=e.HAVE_CURRENT_DATA&&(this.needsUpdate=!0)}dispose(){this._requestVideoFrameCallbackId!==0&&this.source.data.cancelVideoFrameCallback(this._requestVideoFrameCallbackId),super.dispose()}}class Fu extends Gt{constructor(e,t,n=Ri,s,r,o,a=hn,c=hn,l,u=Vs,h=1){if(u!==Vs&&u!==Gs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:e,height:t,depth:h};super(d,s,r,o,a,c,u,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new rl(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class Ou extends Gt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Pi extends Wt{constructor(e=1,t=1,n=1,s=32,r=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:c};const l=this;s=Math.floor(s),r=Math.floor(r);const u=[],h=[],d=[],f=[];let g=0;const _=[],m=n/2;let p=0;A(),o===!1&&(e>0&&E(!0),t>0&&E(!1)),this.setIndex(u),this.setAttribute("position",new bt(h,3)),this.setAttribute("normal",new bt(d,3)),this.setAttribute("uv",new bt(f,2));function A(){const x=new L,D=new L;let R=0;const C=(t-e)/n;for(let I=0;I<=r;I++){const b=[],M=I/r,T=M*(t-e)+e;for(let F=0;F<=s;F++){const z=F/s,H=z*c+a,G=Math.sin(H),q=Math.cos(H);D.x=T*G,D.y=-M*n+m,D.z=T*q,h.push(D.x,D.y,D.z),x.set(G,C,q).normalize(),d.push(x.x,x.y,x.z),f.push(z,1-M),b.push(g++)}_.push(b)}for(let I=0;I<s;I++)for(let b=0;b<r;b++){const M=_[b][I],T=_[b+1][I],F=_[b+1][I+1],z=_[b][I+1];(e>0||b!==0)&&(u.push(M,T,z),R+=3),(t>0||b!==r-1)&&(u.push(T,F,z),R+=3)}l.addGroup(p,R,0),p+=R}function E(x){const D=g,R=new ge,C=new L;let I=0;const b=x===!0?e:t,M=x===!0?1:-1;for(let F=1;F<=s;F++)h.push(0,m*M,0),d.push(0,M,0),f.push(.5,.5),g++;const T=g;for(let F=0;F<=s;F++){const H=F/s*c+a,G=Math.cos(H),q=Math.sin(H);C.x=b*q,C.y=m*M,C.z=b*G,h.push(C.x,C.y,C.z),d.push(0,M,0),R.x=G*.5+.5,R.y=q*.5*M+.5,f.push(R.x,R.y),g++}for(let F=0;F<s;F++){const z=D+F,H=T+F;x===!0?u.push(H,H+1,z):u.push(H+1,H,z),I+=3}l.addGroup(p,I,x===!0?1:2),p+=I}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Pi(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class ul extends Pi{constructor(e=1,t=1,n=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,e,t,n,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(e){return new ul(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}const Sr=new L,Er=new L,Lo=new L,br=new mn;class ox extends Wt{constructor(e=null,t=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:t},e!==null){const s=Math.pow(10,4),r=Math.cos(as*t),o=e.getIndex(),a=e.getAttribute("position"),c=o?o.count:a.count,l=[0,0,0],u=["a","b","c"],h=new Array(3),d={},f=[];for(let g=0;g<c;g+=3){o?(l[0]=o.getX(g),l[1]=o.getX(g+1),l[2]=o.getX(g+2)):(l[0]=g,l[1]=g+1,l[2]=g+2);const{a:_,b:m,c:p}=br;if(_.fromBufferAttribute(a,l[0]),m.fromBufferAttribute(a,l[1]),p.fromBufferAttribute(a,l[2]),br.getNormal(Lo),h[0]=`${Math.round(_.x*s)},${Math.round(_.y*s)},${Math.round(_.z*s)}`,h[1]=`${Math.round(m.x*s)},${Math.round(m.y*s)},${Math.round(m.z*s)}`,h[2]=`${Math.round(p.x*s)},${Math.round(p.y*s)},${Math.round(p.z*s)}`,!(h[0]===h[1]||h[1]===h[2]||h[2]===h[0]))for(let A=0;A<3;A++){const E=(A+1)%3,x=h[A],D=h[E],R=br[u[A]],C=br[u[E]],I=`${x}_${D}`,b=`${D}_${x}`;b in d&&d[b]?(Lo.dot(d[b].normal)<=r&&(f.push(R.x,R.y,R.z),f.push(C.x,C.y,C.z)),d[b]=null):I in d||(d[I]={index0:l[A],index1:l[E],normal:Lo.clone()})}}for(const g in d)if(d[g]){const{index0:_,index1:m}=d[g];Sr.fromBufferAttribute(a,_),Er.fromBufferAttribute(a,m),f.push(Sr.x,Sr.y,Sr.z),f.push(Er.x,Er.y,Er.z)}this.setAttribute("position",new bt(f,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}class Pn{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(e,t){const n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let n,s=this.getPoint(0),r=0;t.push(0);for(let o=1;o<=e;o++)n=this.getPoint(o/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const n=this.getLengths();let s=0;const r=n.length;let o;t?o=t:o=e*n[r-1];let a=0,c=r-1,l;for(;a<=c;)if(s=Math.floor(a+(c-a)/2),l=n[s]-o,l<0)a=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,n[s]===o)return s/(r-1);const u=n[s],d=n[s+1]-u,f=(o-u)/d;return(s+f)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);const o=this.getPoint(s),a=this.getPoint(r),c=t||(o.isVector2?new ge:new L);return c.copy(a).sub(o).normalize(),c}getTangentAt(e,t){const n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){const n=new L,s=[],r=[],o=[],a=new L,c=new pt;for(let f=0;f<=e;f++){const g=f/e;s[f]=this.getTangentAt(g,new L)}r[0]=new L,o[0]=new L;let l=Number.MAX_VALUE;const u=Math.abs(s[0].x),h=Math.abs(s[0].y),d=Math.abs(s[0].z);u<=l&&(l=u,n.set(1,0,0)),h<=l&&(l=h,n.set(0,1,0)),d<=l&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let f=1;f<=e;f++){if(r[f]=r[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(s[f-1],s[f]),a.length()>Number.EPSILON){a.normalize();const g=Math.acos(st(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(c.makeRotationAxis(a,g))}o[f].crossVectors(s[f],r[f])}if(t===!0){let f=Math.acos(st(r[0].dot(r[e]),-1,1));f/=e,s[0].dot(a.crossVectors(r[0],r[e]))>0&&(f=-f);for(let g=1;g<=e;g++)r[g].applyMatrix4(c.makeRotationAxis(s[g],f*g)),o[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class hl extends Pn{constructor(e=0,t=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=c}getPoint(e,t=new ge){const n=t,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);const a=this.aStartAngle+e*r;let c=this.aX+this.xRadius*Math.cos(a),l=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const u=Math.cos(this.aRotation),h=Math.sin(this.aRotation),d=c-this.aX,f=l-this.aY;c=d*u-f*h+this.aX,l=d*h+f*u+this.aY}return n.set(c,l)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class xf extends hl{constructor(e,t,n,s,r,o){super(e,t,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}}function dl(){let i=0,e=0,t=0,n=0;function s(r,o,a,c){i=r,e=a,t=-3*r+3*o-2*a-c,n=2*r-2*o+a+c}return{initCatmullRom:function(r,o,a,c,l){s(o,a,l*(a-r),l*(c-o))},initNonuniformCatmullRom:function(r,o,a,c,l,u,h){let d=(o-r)/l-(a-r)/(l+u)+(a-o)/u,f=(a-o)/u-(c-o)/(u+h)+(c-a)/h;d*=u,f*=u,s(o,a,d,f)},calc:function(r){const o=r*r,a=o*r;return i+e*r+t*o+n*a}}}const Tr=new L,Do=new dl,Io=new dl,Uo=new dl;class yf extends Pn{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new L){const n=t,s=this.points,r=s.length,o=(r-(this.closed?0:1))*e;let a=Math.floor(o),c=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:c===0&&a===r-1&&(a=r-2,c=1);let l,u;this.closed||a>0?l=s[(a-1)%r]:(Tr.subVectors(s[0],s[1]).add(s[0]),l=Tr);const h=s[a%r],d=s[(a+1)%r];if(this.closed||a+2<r?u=s[(a+2)%r]:(Tr.subVectors(s[r-1],s[r-2]).add(s[r-1]),u=Tr),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let g=Math.pow(l.distanceToSquared(h),f),_=Math.pow(h.distanceToSquared(d),f),m=Math.pow(d.distanceToSquared(u),f);_<1e-4&&(_=1),g<1e-4&&(g=_),m<1e-4&&(m=_),Do.initNonuniformCatmullRom(l.x,h.x,d.x,u.x,g,_,m),Io.initNonuniformCatmullRom(l.y,h.y,d.y,u.y,g,_,m),Uo.initNonuniformCatmullRom(l.z,h.z,d.z,u.z,g,_,m)}else this.curveType==="catmullrom"&&(Do.initCatmullRom(l.x,h.x,d.x,u.x,this.tension),Io.initCatmullRom(l.y,h.y,d.y,u.y,this.tension),Uo.initCatmullRom(l.z,h.z,d.z,u.z,this.tension));return n.set(Do.calc(c),Io.calc(c),Uo.calc(c)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(new L().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function fc(i,e,t,n,s){const r=(n-e)*.5,o=(s-t)*.5,a=i*i,c=i*a;return(2*t-2*n+r+o)*c+(-3*t+3*n-2*r-o)*a+r*i+t}function Mf(i,e){const t=1-i;return t*t*e}function Sf(i,e){return 2*(1-i)*i*e}function Ef(i,e){return i*i*e}function Os(i,e,t,n){return Mf(i,e)+Sf(i,t)+Ef(i,n)}function bf(i,e){const t=1-i;return t*t*t*e}function Tf(i,e){const t=1-i;return 3*t*t*i*e}function wf(i,e){return 3*(1-i)*i*i*e}function Af(i,e){return i*i*i*e}function Bs(i,e,t,n,s){return bf(i,e)+Tf(i,t)+wf(i,n)+Af(i,s)}class Bu extends Pn{constructor(e=new ge,t=new ge,n=new ge,s=new ge){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new ge){const n=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(Bs(e,s.x,r.x,o.x,a.x),Bs(e,s.y,r.y,o.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Rf extends Pn{constructor(e=new L,t=new L,n=new L,s=new L){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new L){const n=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(Bs(e,s.x,r.x,o.x,a.x),Bs(e,s.y,r.y,o.y,a.y),Bs(e,s.z,r.z,o.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class zu extends Pn{constructor(e=new ge,t=new ge){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new ge){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new ge){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Cf extends Pn{constructor(e=new L,t=new L){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new L){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new L){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class ku extends Pn{constructor(e=new ge,t=new ge,n=new ge){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new ge){const n=t,s=this.v0,r=this.v1,o=this.v2;return n.set(Os(e,s.x,r.x,o.x),Os(e,s.y,r.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Pf extends Pn{constructor(e=new L,t=new L,n=new L){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new L){const n=t,s=this.v0,r=this.v1,o=this.v2;return n.set(Os(e,s.x,r.x,o.x),Os(e,s.y,r.y,o.y),Os(e,s.z,r.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Hu extends Pn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new ge){const n=t,s=this.points,r=(s.length-1)*e,o=Math.floor(r),a=r-o,c=s[o===0?o:o-1],l=s[o],u=s[o>s.length-2?s.length-1:o+1],h=s[o>s.length-3?s.length-1:o+2];return n.set(fc(a,c.x,l.x,u.x,h.x),fc(a,c.y,l.y,u.y,h.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(new ge().fromArray(s))}return this}}var Ba=Object.freeze({__proto__:null,ArcCurve:xf,CatmullRomCurve3:yf,CubicBezierCurve:Bu,CubicBezierCurve3:Rf,EllipseCurve:hl,LineCurve:zu,LineCurve3:Cf,QuadraticBezierCurve:ku,QuadraticBezierCurve3:Pf,SplineCurve:Hu});class Lf extends Pn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Ba[n](t,e))}return this}getPoint(e,t){const n=e*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const o=s[r]-n,a=this.curves[r],c=a.getLength(),l=c===0?0:1-o/c;return a.getPointAt(l,t)}r++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let n=0,s=this.curves.length;n<s;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const o=r[s],a=o.isEllipseCurve?e*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?e*o.points.length:e,c=o.getPoints(a);for(let l=0;l<c.length;l++){const u=c[l];n&&n.equals(u)||(t.push(u),n=u)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){const s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const s=e.curves[t];this.curves.push(new Ba[s.type]().fromJSON(s))}return this}}class pc extends Lf{constructor(e){super(),this.type="Path",this.currentPoint=new ge,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const n=new zu(this.currentPoint.clone(),new ge(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,s){const r=new ku(this.currentPoint.clone(),new ge(e,t),new ge(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(e,t,n,s,r,o){const a=new Bu(this.currentPoint.clone(),new ge(e,t),new ge(n,s),new ge(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),n=new Hu(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,s,r,o){const a=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(e+a,t+c,n,s,r,o),this}absarc(e,t,n,s,r,o){return this.absellipse(e,t,n,n,s,r,o),this}ellipse(e,t,n,s,r,o,a,c){const l=this.currentPoint.x,u=this.currentPoint.y;return this.absellipse(e+l,t+u,n,s,r,o,a,c),this}absellipse(e,t,n,s,r,o,a,c){const l=new hl(e,t,n,s,r,o,a,c);if(this.curves.length>0){const h=l.getPoint(0);h.equals(this.currentPoint)||this.lineTo(h.x,h.y)}this.curves.push(l);const u=l.getPoint(1);return this.currentPoint.copy(u),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class Vu extends pc{constructor(e){super(e),this.uuid=Ii(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let n=0,s=this.holes.length;n<s;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){const s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const s=e.holes[t];this.holes.push(new pc().fromJSON(s))}return this}}function Df(i,e,t=2){const n=e&&e.length,s=n?e[0]*t:i.length;let r=Gu(i,0,s,t,!0);const o=[];if(!r||r.next===r.prev)return o;let a,c,l;if(n&&(r=Of(i,e,r,t)),i.length>80*t){a=1/0,c=1/0;let u=-1/0,h=-1/0;for(let d=t;d<s;d+=t){const f=i[d],g=i[d+1];f<a&&(a=f),g<c&&(c=g),f>u&&(u=f),g>h&&(h=g)}l=Math.max(u-a,h-c),l=l!==0?32767/l:0}return Xs(r,o,t,a,c,l,0),o}function Gu(i,e,t,n,s){let r;if(s===$f(i,e,t,n)>0)for(let o=e;o<t;o+=n)r=mc(o/n|0,i[o],i[o+1],r);else for(let o=t-n;o>=e;o-=n)r=mc(o/n|0,i[o],i[o+1],r);return r&&ms(r,r.next)&&(qs(r),r=r.next),r}function Li(i,e){if(!i)return i;e||(e=i);let t=i,n;do if(n=!1,!t.steiner&&(ms(t,t.next)||At(t.prev,t,t.next)===0)){if(qs(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function Xs(i,e,t,n,s,r,o){if(!i)return;!o&&r&&Vf(i,n,s,r);let a=i;for(;i.prev!==i.next;){const c=i.prev,l=i.next;if(r?Uf(i,n,s,r):If(i)){e.push(c.i,i.i,l.i),qs(i),i=l.next,a=l.next;continue}if(i=l,i===a){o?o===1?(i=Nf(Li(i),e),Xs(i,e,t,n,s,r,2)):o===2&&Ff(i,e,t,n,s,r):Xs(Li(i),e,t,n,s,r,1);break}}}function If(i){const e=i.prev,t=i,n=i.next;if(At(e,t,n)>=0)return!1;const s=e.x,r=t.x,o=n.x,a=e.y,c=t.y,l=n.y,u=Math.min(s,r,o),h=Math.min(a,c,l),d=Math.max(s,r,o),f=Math.max(a,c,l);let g=n.next;for(;g!==e;){if(g.x>=u&&g.x<=d&&g.y>=h&&g.y<=f&&Is(s,a,r,c,o,l,g.x,g.y)&&At(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function Uf(i,e,t,n){const s=i.prev,r=i,o=i.next;if(At(s,r,o)>=0)return!1;const a=s.x,c=r.x,l=o.x,u=s.y,h=r.y,d=o.y,f=Math.min(a,c,l),g=Math.min(u,h,d),_=Math.max(a,c,l),m=Math.max(u,h,d),p=za(f,g,e,t,n),A=za(_,m,e,t,n);let E=i.prevZ,x=i.nextZ;for(;E&&E.z>=p&&x&&x.z<=A;){if(E.x>=f&&E.x<=_&&E.y>=g&&E.y<=m&&E!==s&&E!==o&&Is(a,u,c,h,l,d,E.x,E.y)&&At(E.prev,E,E.next)>=0||(E=E.prevZ,x.x>=f&&x.x<=_&&x.y>=g&&x.y<=m&&x!==s&&x!==o&&Is(a,u,c,h,l,d,x.x,x.y)&&At(x.prev,x,x.next)>=0))return!1;x=x.nextZ}for(;E&&E.z>=p;){if(E.x>=f&&E.x<=_&&E.y>=g&&E.y<=m&&E!==s&&E!==o&&Is(a,u,c,h,l,d,E.x,E.y)&&At(E.prev,E,E.next)>=0)return!1;E=E.prevZ}for(;x&&x.z<=A;){if(x.x>=f&&x.x<=_&&x.y>=g&&x.y<=m&&x!==s&&x!==o&&Is(a,u,c,h,l,d,x.x,x.y)&&At(x.prev,x,x.next)>=0)return!1;x=x.nextZ}return!0}function Nf(i,e){let t=i;do{const n=t.prev,s=t.next.next;!ms(n,s)&&Xu(n,t,t.next,s)&&Ys(n,s)&&Ys(s,n)&&(e.push(n.i,t.i,s.i),qs(t),qs(t.next),t=i=s),t=t.next}while(t!==i);return Li(t)}function Ff(i,e,t,n,s,r){let o=i;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&Xf(o,a)){let c=Yu(o,a);o=Li(o,o.next),c=Li(c,c.next),Xs(o,e,t,n,s,r,0),Xs(c,e,t,n,s,r,0);return}a=a.next}o=o.next}while(o!==i)}function Of(i,e,t,n){const s=[];for(let r=0,o=e.length;r<o;r++){const a=e[r]*n,c=r<o-1?e[r+1]*n:i.length,l=Gu(i,a,c,n,!1);l===l.next&&(l.steiner=!0),s.push(Wf(l))}s.sort(Bf);for(let r=0;r<s.length;r++)t=zf(s[r],t);return t}function Bf(i,e){let t=i.x-e.x;if(t===0&&(t=i.y-e.y,t===0)){const n=(i.next.y-i.y)/(i.next.x-i.x),s=(e.next.y-e.y)/(e.next.x-e.x);t=n-s}return t}function zf(i,e){const t=kf(i,e);if(!t)return e;const n=Yu(t,i);return Li(n,n.next),Li(t,t.next)}function kf(i,e){let t=e;const n=i.x,s=i.y;let r=-1/0,o;if(ms(i,t))return t;do{if(ms(i,t.next))return t.next;if(s<=t.y&&s>=t.next.y&&t.next.y!==t.y){const h=t.x+(s-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(h<=n&&h>r&&(r=h,o=t.x<t.next.x?t:t.next,h===n))return o}t=t.next}while(t!==e);if(!o)return null;const a=o,c=o.x,l=o.y;let u=1/0;t=o;do{if(n>=t.x&&t.x>=c&&n!==t.x&&Wu(s<l?n:r,s,c,l,s<l?r:n,s,t.x,t.y)){const h=Math.abs(s-t.y)/(n-t.x);Ys(t,i)&&(h<u||h===u&&(t.x>o.x||t.x===o.x&&Hf(o,t)))&&(o=t,u=h)}t=t.next}while(t!==a);return o}function Hf(i,e){return At(i.prev,i,e.prev)<0&&At(e.next,i,i.next)<0}function Vf(i,e,t,n){let s=i;do s.z===0&&(s.z=za(s.x,s.y,e,t,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,Gf(s)}function Gf(i){let e,t=1;do{let n=i,s;i=null;let r=null;for(e=0;n;){e++;let o=n,a=0;for(let l=0;l<t&&(a++,o=o.nextZ,!!o);l++);let c=t;for(;a>0||c>0&&o;)a!==0&&(c===0||!o||n.z<=o.z)?(s=n,n=n.nextZ,a--):(s=o,o=o.nextZ,c--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=o}r.nextZ=null,t*=2}while(e>1);return i}function za(i,e,t,n,s){return i=(i-t)*s|0,e=(e-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,i|e<<1}function Wf(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function Wu(i,e,t,n,s,r,o,a){return(s-o)*(e-a)>=(i-o)*(r-a)&&(i-o)*(n-a)>=(t-o)*(e-a)&&(t-o)*(r-a)>=(s-o)*(n-a)}function Is(i,e,t,n,s,r,o,a){return!(i===o&&e===a)&&Wu(i,e,t,n,s,r,o,a)}function Xf(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!Yf(i,e)&&(Ys(i,e)&&Ys(e,i)&&qf(i,e)&&(At(i.prev,i,e.prev)||At(i,e.prev,e))||ms(i,e)&&At(i.prev,i,i.next)>0&&At(e.prev,e,e.next)>0)}function At(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function ms(i,e){return i.x===e.x&&i.y===e.y}function Xu(i,e,t,n){const s=Ar(At(i,e,t)),r=Ar(At(i,e,n)),o=Ar(At(t,n,i)),a=Ar(At(t,n,e));return!!(s!==r&&o!==a||s===0&&wr(i,t,e)||r===0&&wr(i,n,e)||o===0&&wr(t,i,n)||a===0&&wr(t,e,n))}function wr(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function Ar(i){return i>0?1:i<0?-1:0}function Yf(i,e){let t=i;do{if(t.i!==i.i&&t.next.i!==i.i&&t.i!==e.i&&t.next.i!==e.i&&Xu(t,t.next,i,e))return!0;t=t.next}while(t!==i);return!1}function Ys(i,e){return At(i.prev,i,i.next)<0?At(i,e,i.next)>=0&&At(i,i.prev,e)>=0:At(i,e,i.prev)<0||At(i,i.next,e)<0}function qf(i,e){let t=i,n=!1;const s=(i.x+e.x)/2,r=(i.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==i);return n}function Yu(i,e){const t=ka(i.i,i.x,i.y),n=ka(e.i,e.x,e.y),s=i.next,r=e.prev;return i.next=e,e.prev=i,t.next=s,s.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function mc(i,e,t,n){const s=ka(i,e,t);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function qs(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function ka(i,e,t){return{i,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function $f(i,e,t,n){let s=0;for(let r=e,o=t-n;r<t;r+=n)s+=(i[o]-i[r])*(i[r+1]+i[o+1]),o=r;return s}class Kf{static triangulate(e,t,n=2){return Df(e,t,n)}}class Xn{static area(e){const t=e.length;let n=0;for(let s=t-1,r=0;r<t;s=r++)n+=e[s].x*e[r].y-e[r].x*e[s].y;return n*.5}static isClockWise(e){return Xn.area(e)<0}static triangulateShape(e,t){const n=[],s=[],r=[];gc(e),_c(n,e);let o=e.length;t.forEach(gc);for(let c=0;c<t.length;c++)s.push(o),o+=t[c].length,_c(n,t[c]);const a=Kf.triangulate(n,s);for(let c=0;c<a.length;c+=3)r.push(a.slice(c,c+3));return r}}function gc(i){const e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function _c(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}class qu extends Wt{constructor(e=new Vu([new ge(.5,.5),new ge(-.5,.5),new ge(-.5,-.5),new ge(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];const n=this,s=[],r=[];for(let a=0,c=e.length;a<c;a++){const l=e[a];o(l)}this.setAttribute("position",new bt(s,3)),this.setAttribute("uv",new bt(r,2)),this.computeVertexNormals();function o(a){const c=[],l=t.curveSegments!==void 0?t.curveSegments:12,u=t.steps!==void 0?t.steps:1,h=t.depth!==void 0?t.depth:1;let d=t.bevelEnabled!==void 0?t.bevelEnabled:!0,f=t.bevelThickness!==void 0?t.bevelThickness:.2,g=t.bevelSize!==void 0?t.bevelSize:f-.1,_=t.bevelOffset!==void 0?t.bevelOffset:0,m=t.bevelSegments!==void 0?t.bevelSegments:3;const p=t.extrudePath,A=t.UVGenerator!==void 0?t.UVGenerator:jf;let E,x=!1,D,R,C,I;p&&(E=p.getSpacedPoints(u),x=!0,d=!1,D=p.computeFrenetFrames(u,!1),R=new L,C=new L,I=new L),d||(m=0,f=0,g=0,_=0);const b=a.extractPoints(l);let M=b.shape;const T=b.holes;if(!Xn.isClockWise(M)){M=M.reverse();for(let se=0,Q=T.length;se<Q;se++){const ne=T[se];Xn.isClockWise(ne)&&(T[se]=ne.reverse())}}function z(se){const ne=10000000000000001e-36;let ie=se[0];for(let _e=1;_e<=se.length;_e++){const J=_e%se.length,fe=se[J],Ie=fe.x-ie.x,Se=fe.y-ie.y,w=Ie*Ie+Se*Se,y=Math.max(Math.abs(fe.x),Math.abs(fe.y),Math.abs(ie.x),Math.abs(ie.y)),k=ne*y*y;if(w<=k){se.splice(J,1),_e--;continue}ie=fe}}z(M),T.forEach(z);const H=T.length,G=M;for(let se=0;se<H;se++){const Q=T[se];M=M.concat(Q)}function q(se,Q,ne){return Q||console.error("THREE.ExtrudeGeometry: vec does not exist"),se.clone().addScaledVector(Q,ne)}const W=M.length;function Y(se,Q,ne){let ie,_e,J;const fe=se.x-Q.x,Ie=se.y-Q.y,Se=ne.x-se.x,w=ne.y-se.y,y=fe*fe+Ie*Ie,k=fe*w-Ie*Se;if(Math.abs(k)>Number.EPSILON){const V=Math.sqrt(y),te=Math.sqrt(Se*Se+w*w),j=Q.x-Ie/V,Re=Q.y+fe/V,de=ne.x-w/te,Pe=ne.y+Se/te,Le=((de-j)*w-(Pe-Re)*Se)/(fe*w-Ie*Se);ie=j+fe*Le-se.x,_e=Re+Ie*Le-se.y;const le=ie*ie+_e*_e;if(le<=2)return new ge(ie,_e);J=Math.sqrt(le/2)}else{let V=!1;fe>Number.EPSILON?Se>Number.EPSILON&&(V=!0):fe<-Number.EPSILON?Se<-Number.EPSILON&&(V=!0):Math.sign(Ie)===Math.sign(w)&&(V=!0),V?(ie=-Ie,_e=fe,J=Math.sqrt(y)):(ie=fe,_e=Ie,J=Math.sqrt(y/2))}return new ge(ie/J,_e/J)}const me=[];for(let se=0,Q=G.length,ne=Q-1,ie=se+1;se<Q;se++,ne++,ie++)ne===Q&&(ne=0),ie===Q&&(ie=0),me[se]=Y(G[se],G[ne],G[ie]);const xe=[];let De,qe=me.concat();for(let se=0,Q=H;se<Q;se++){const ne=T[se];De=[];for(let ie=0,_e=ne.length,J=_e-1,fe=ie+1;ie<_e;ie++,J++,fe++)J===_e&&(J=0),fe===_e&&(fe=0),De[ie]=Y(ne[ie],ne[J],ne[fe]);xe.push(De),qe=qe.concat(De)}let Qe;if(m===0)Qe=Xn.triangulateShape(G,T);else{const se=[],Q=[];for(let ne=0;ne<m;ne++){const ie=ne/m,_e=f*Math.cos(ie*Math.PI/2),J=g*Math.sin(ie*Math.PI/2)+_;for(let fe=0,Ie=G.length;fe<Ie;fe++){const Se=q(G[fe],me[fe],J);Be(Se.x,Se.y,-_e),ie===0&&se.push(Se)}for(let fe=0,Ie=H;fe<Ie;fe++){const Se=T[fe];De=xe[fe];const w=[];for(let y=0,k=Se.length;y<k;y++){const V=q(Se[y],De[y],J);Be(V.x,V.y,-_e),ie===0&&w.push(V)}ie===0&&Q.push(w)}}Qe=Xn.triangulateShape(se,Q)}const lt=Qe.length,et=g+_;for(let se=0;se<W;se++){const Q=d?q(M[se],qe[se],et):M[se];x?(C.copy(D.normals[0]).multiplyScalar(Q.x),R.copy(D.binormals[0]).multiplyScalar(Q.y),I.copy(E[0]).add(C).add(R),Be(I.x,I.y,I.z)):Be(Q.x,Q.y,0)}for(let se=1;se<=u;se++)for(let Q=0;Q<W;Q++){const ne=d?q(M[Q],qe[Q],et):M[Q];x?(C.copy(D.normals[se]).multiplyScalar(ne.x),R.copy(D.binormals[se]).multiplyScalar(ne.y),I.copy(E[se]).add(C).add(R),Be(I.x,I.y,I.z)):Be(ne.x,ne.y,h/u*se)}for(let se=m-1;se>=0;se--){const Q=se/m,ne=f*Math.cos(Q*Math.PI/2),ie=g*Math.sin(Q*Math.PI/2)+_;for(let _e=0,J=G.length;_e<J;_e++){const fe=q(G[_e],me[_e],ie);Be(fe.x,fe.y,h+ne)}for(let _e=0,J=T.length;_e<J;_e++){const fe=T[_e];De=xe[_e];for(let Ie=0,Se=fe.length;Ie<Se;Ie++){const w=q(fe[Ie],De[Ie],ie);x?Be(w.x,w.y+E[u-1].y,E[u-1].x+ne):Be(w.x,w.y,h+ne)}}}ee(),ae();function ee(){const se=s.length/3;if(d){let Q=0,ne=W*Q;for(let ie=0;ie<lt;ie++){const _e=Qe[ie];Fe(_e[2]+ne,_e[1]+ne,_e[0]+ne)}Q=u+m*2,ne=W*Q;for(let ie=0;ie<lt;ie++){const _e=Qe[ie];Fe(_e[0]+ne,_e[1]+ne,_e[2]+ne)}}else{for(let Q=0;Q<lt;Q++){const ne=Qe[Q];Fe(ne[2],ne[1],ne[0])}for(let Q=0;Q<lt;Q++){const ne=Qe[Q];Fe(ne[0]+W*u,ne[1]+W*u,ne[2]+W*u)}}n.addGroup(se,s.length/3-se,0)}function ae(){const se=s.length/3;let Q=0;Ae(G,Q),Q+=G.length;for(let ne=0,ie=T.length;ne<ie;ne++){const _e=T[ne];Ae(_e,Q),Q+=_e.length}n.addGroup(se,s.length/3-se,1)}function Ae(se,Q){let ne=se.length;for(;--ne>=0;){const ie=ne;let _e=ne-1;_e<0&&(_e=se.length-1);for(let J=0,fe=u+m*2;J<fe;J++){const Ie=W*J,Se=W*(J+1),w=Q+ie+Ie,y=Q+_e+Ie,k=Q+_e+Se,V=Q+ie+Se;nt(w,y,k,V)}}}function Be(se,Q,ne){c.push(se),c.push(Q),c.push(ne)}function Fe(se,Q,ne){je(se),je(Q),je(ne);const ie=s.length/3,_e=A.generateTopUV(n,s,ie-3,ie-2,ie-1);U(_e[0]),U(_e[1]),U(_e[2])}function nt(se,Q,ne,ie){je(se),je(Q),je(ie),je(Q),je(ne),je(ie);const _e=s.length/3,J=A.generateSideWallUV(n,s,_e-6,_e-3,_e-2,_e-1);U(J[0]),U(J[1]),U(J[3]),U(J[1]),U(J[2]),U(J[3])}function je(se){s.push(c[se*3+0]),s.push(c[se*3+1]),s.push(c[se*3+2])}function U(se){r.push(se.x),r.push(se.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return Zf(t,n,e)}static fromJSON(e,t){const n=[];for(let r=0,o=e.shapes.length;r<o;r++){const a=t[e.shapes[r]];n.push(a)}const s=e.options.extrudePath;return s!==void 0&&(e.options.extrudePath=new Ba[s.type]().fromJSON(s)),new qu(n,e.options)}}const jf={generateTopUV:function(i,e,t,n,s){const r=e[t*3],o=e[t*3+1],a=e[n*3],c=e[n*3+1],l=e[s*3],u=e[s*3+1];return[new ge(r,o),new ge(a,c),new ge(l,u)]},generateSideWallUV:function(i,e,t,n,s,r){const o=e[t*3],a=e[t*3+1],c=e[t*3+2],l=e[n*3],u=e[n*3+1],h=e[n*3+2],d=e[s*3],f=e[s*3+1],g=e[s*3+2],_=e[r*3],m=e[r*3+1],p=e[r*3+2];return Math.abs(a-u)<Math.abs(o-l)?[new ge(o,1-c),new ge(l,1-h),new ge(d,1-g),new ge(_,1-p)]:[new ge(a,1-c),new ge(u,1-h),new ge(f,1-g),new ge(m,1-p)]}};function Zf(i,e,t){if(t.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){const r=i[n];t.shapes.push(r.uuid)}else t.shapes.push(i.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}class qr extends Wt{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};const r=e/2,o=t/2,a=Math.floor(n),c=Math.floor(s),l=a+1,u=c+1,h=e/a,d=t/c,f=[],g=[],_=[],m=[];for(let p=0;p<u;p++){const A=p*d-o;for(let E=0;E<l;E++){const x=E*h-r;g.push(x,-A,0),_.push(0,0,1),m.push(E/a),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let A=0;A<a;A++){const E=A+l*p,x=A+l*(p+1),D=A+1+l*(p+1),R=A+1+l*p;f.push(E,x,R),f.push(x,D,R)}this.setIndex(f),this.setAttribute("position",new bt(g,3)),this.setAttribute("normal",new bt(_,3)),this.setAttribute("uv",new bt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new qr(e.width,e.height,e.widthSegments,e.heightSegments)}}class $u extends Wt{constructor(e=new Vu([new ge(0,.5),new ge(-.5,-.5),new ge(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};const n=[],s=[],r=[],o=[];let a=0,c=0;if(Array.isArray(e)===!1)l(e);else for(let u=0;u<e.length;u++)l(e[u]),this.addGroup(a,c,u),a+=c,c=0;this.setIndex(n),this.setAttribute("position",new bt(s,3)),this.setAttribute("normal",new bt(r,3)),this.setAttribute("uv",new bt(o,2));function l(u){const h=s.length/3,d=u.extractPoints(t);let f=d.shape;const g=d.holes;Xn.isClockWise(f)===!1&&(f=f.reverse());for(let m=0,p=g.length;m<p;m++){const A=g[m];Xn.isClockWise(A)===!0&&(g[m]=A.reverse())}const _=Xn.triangulateShape(f,g);for(let m=0,p=g.length;m<p;m++){const A=g[m];f=f.concat(A)}for(let m=0,p=f.length;m<p;m++){const A=f[m];s.push(A.x,A.y,0),r.push(0,0,1),o.push(A.x,A.y)}for(let m=0,p=_.length;m<p;m++){const A=_[m],E=A[0]+h,x=A[1]+h,D=A[2]+h;n.push(E,x,D),c+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes;return Jf(t,e)}static fromJSON(e,t){const n=[];for(let s=0,r=e.shapes.length;s<r;s++){const o=t[e.shapes[s]];n.push(o)}return new $u(n,e.curveSegments)}}function Jf(i,e){if(e.shapes=[],Array.isArray(i))for(let t=0,n=i.length;t<n;t++){const s=i[t];e.shapes.push(s.uuid)}else e.shapes.push(i.uuid);return e}class $r extends Wt{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const c=Math.min(o+a,Math.PI);let l=0;const u=[],h=new L,d=new L,f=[],g=[],_=[],m=[];for(let p=0;p<=n;p++){const A=[],E=p/n;let x=0;p===0&&o===0?x=.5/t:p===n&&c===Math.PI&&(x=-.5/t);for(let D=0;D<=t;D++){const R=D/t;h.x=-e*Math.cos(s+R*r)*Math.sin(o+E*a),h.y=e*Math.cos(o+E*a),h.z=e*Math.sin(s+R*r)*Math.sin(o+E*a),g.push(h.x,h.y,h.z),d.copy(h).normalize(),_.push(d.x,d.y,d.z),m.push(R+x,1-E),A.push(l++)}u.push(A)}for(let p=0;p<n;p++)for(let A=0;A<t;A++){const E=u[p][A+1],x=u[p][A],D=u[p+1][A],R=u[p+1][A+1];(p!==0||o>0)&&f.push(E,x,R),(p!==n-1||c<Math.PI)&&f.push(x,D,R)}this.setIndex(f),this.setAttribute("position",new bt(g,3)),this.setAttribute("normal",new bt(_,3)),this.setAttribute("uv",new bt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new $r(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Ku extends Wt{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);const o=[],a=[],c=[],l=[],u=new L,h=new L,d=new L;for(let f=0;f<=n;f++)for(let g=0;g<=s;g++){const _=g/s*r,m=f/n*Math.PI*2;h.x=(e+t*Math.cos(m))*Math.cos(_),h.y=(e+t*Math.cos(m))*Math.sin(_),h.z=t*Math.sin(m),a.push(h.x,h.y,h.z),u.x=e*Math.cos(_),u.y=e*Math.sin(_),d.subVectors(h,u).normalize(),c.push(d.x,d.y,d.z),l.push(g/s),l.push(f/n)}for(let f=1;f<=n;f++)for(let g=1;g<=s;g++){const _=(s+1)*f+g-1,m=(s+1)*(f-1)+g-1,p=(s+1)*(f-1)+g,A=(s+1)*f+g;o.push(_,m,A),o.push(m,p,A)}this.setIndex(o),this.setAttribute("position",new bt(a,3)),this.setAttribute("normal",new bt(c,3)),this.setAttribute("uv",new bt(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ku(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class ju extends _s{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new $e(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new $e(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=bu,this.normalScale=new ge(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new bn,this.combine=ja,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Qf extends _s{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=hd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class ep extends _s{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class Kr extends Tt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new $e(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class tp extends Kr{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Tt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new $e(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const No=new pt,vc=new L,xc=new L;class fl{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ge(512,512),this.mapType=Cn,this.map=null,this.mapPass=null,this.matrix=new pt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new cl,this._frameExtents=new ge(1,1),this._viewportCount=1,this._viewports=[new yt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;vc.setFromMatrixPosition(e.matrixWorld),t.position.copy(vc),xc.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(xc),t.updateMatrixWorld(),No.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(No,t.coordinateSystem,t.reversedDepth),t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(No)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class np extends fl{constructor(){super(new Qt(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){const t=this.camera,n=fs*2*e.angle*this.focus,s=this.mapSize.width/this.mapSize.height*this.aspect,r=e.distance||t.far;(n!==t.fov||s!==t.aspect||r!==t.far)&&(t.fov=n,t.aspect=s,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}}class ip extends Kr{constructor(e,t,n=0,s=Math.PI/3,r=0,o=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(Tt.DEFAULT_UP),this.updateMatrix(),this.target=new Tt,this.distance=n,this.angle=s,this.penumbra=r,this.decay=o,this.map=null,this.shadow=new np}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}const yc=new pt,Ds=new L,Fo=new L;class sp extends fl{constructor(){super(new Qt(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new ge(4,2),this._viewportCount=6,this._viewports=[new yt(2,1,1,1),new yt(0,1,1,1),new yt(3,1,1,1),new yt(1,1,1,1),new yt(3,0,1,1),new yt(1,0,1,1)],this._cubeDirections=[new L(1,0,0),new L(-1,0,0),new L(0,0,1),new L(0,0,-1),new L(0,1,0),new L(0,-1,0)],this._cubeUps=[new L(0,1,0),new L(0,1,0),new L(0,1,0),new L(0,1,0),new L(0,0,1),new L(0,0,-1)]}updateMatrices(e,t=0){const n=this.camera,s=this.matrix,r=e.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),Ds.setFromMatrixPosition(e.matrixWorld),n.position.copy(Ds),Fo.copy(n.position),Fo.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(Fo),n.updateMatrixWorld(),s.makeTranslation(-Ds.x,-Ds.y,-Ds.z),yc.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(yc,n.coordinateSystem,n.reversedDepth)}}class Zu extends Kr{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new sp}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class Ju extends Du{constructor(e=-1,t=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-e,o=n+e,a=s+t,c=s-t;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,o=r+l*this.view.width,a-=u*this.view.offsetY,c=a-u*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class rp extends fl{constructor(){super(new Ju(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class op extends Kr{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Tt.DEFAULT_UP),this.updateMatrix(),this.target=new Tt,this.shadow=new rp}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class ap extends Qt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}const Mc=new pt;class Sc{constructor(e,t,n=0,s=1/0){this.ray=new Yr(e,t),this.near=n,this.far=s,this.camera=null,this.layers=new ol,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Mc.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Mc),this}intersectObject(e,t=!0,n=[]){return Ha(e,this,n,t),n.sort(Ec),n}intersectObjects(e,t=!0,n=[]){for(let s=0,r=e.length;s<r;s++)Ha(e[s],this,n,t);return n.sort(Ec),n}}function Ec(i,e){return i.distance-e.distance}function Ha(i,e,t,n){let s=!0;if(i.layers.test(e.layers)&&i.raycast(e,t)===!1&&(s=!1),s===!0&&n===!0){const r=i.children;for(let o=0,a=r.length;o<a;o++)Ha(r[o],e,t,!0)}}class bc{constructor(e=1,t=0,n=0){this.radius=e,this.phi=t,this.theta=n}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=st(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(st(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class lp extends Di{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){if(e===void 0){console.warn("THREE.Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}}function Tc(i,e,t,n){const s=cp(n);switch(t){case Mu:return i*e;case el:return i*e/s.components*s.byteLength;case tl:return i*e/s.components*s.byteLength;case Eu:return i*e*2/s.components*s.byteLength;case nl:return i*e*2/s.components*s.byteLength;case Su:return i*e*3/s.components*s.byteLength;case En:return i*e*4/s.components*s.byteLength;case il:return i*e*4/s.components*s.byteLength;case Ir:case Ur:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Nr:case Fr:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case ua:case da:return Math.max(i,16)*Math.max(e,8)/4;case ca:case ha:return Math.max(i,8)*Math.max(e,8)/2;case fa:case pa:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case ma:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case ga:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case _a:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case va:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case xa:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case ya:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case Ma:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case Sa:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case Ea:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case ba:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case Ta:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case wa:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case Aa:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case Ra:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case Ca:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case Pa:case La:case Da:return Math.ceil(i/4)*Math.ceil(e/4)*16;case Ia:case Ua:return Math.ceil(i/4)*Math.ceil(e/4)*8;case Na:case Fa:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function cp(i){switch(i){case Cn:case _u:return{byteLength:1,components:1};case ks:case vu:case Ks:return{byteLength:2,components:1};case Ja:case Qa:return{byteLength:2,components:4};case Ri:case Za:case An:return{byteLength:4,components:1};case xu:case yu:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ka}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ka);function Qu(){let i=null,e=!1,t=null,n=null;function s(r,o){t(r,o),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function up(i){const e=new WeakMap;function t(a,c){const l=a.array,u=a.usage,h=l.byteLength,d=i.createBuffer();i.bindBuffer(c,d),i.bufferData(c,l,u),a.onUploadCallback();let f;if(l instanceof Float32Array)f=i.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)f=i.HALF_FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=i.SHORT;else if(l instanceof Uint32Array)f=i.UNSIGNED_INT;else if(l instanceof Int32Array)f=i.INT;else if(l instanceof Int8Array)f=i.BYTE;else if(l instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:d,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:h}}function n(a,c,l){const u=c.array,h=c.updateRanges;if(i.bindBuffer(l,a),h.length===0)i.bufferSubData(l,0,u);else{h.sort((f,g)=>f.start-g.start);let d=0;for(let f=1;f<h.length;f++){const g=h[d],_=h[f];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++d,h[d]=_)}h.length=d+1;for(let f=0,g=h.length;f<g;f++){const _=h[f];i.bufferSubData(l,_.start*u.BYTES_PER_ELEMENT,u,_.start,_.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const c=e.get(a);c&&(i.deleteBuffer(c.buffer),e.delete(a))}function o(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const u=e.get(a);(!u||u.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const l=e.get(a);if(l===void 0)e.set(a,t(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,a,c),l.version=a.version}}return{get:s,remove:r,update:o}}var hp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,dp=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,fp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,pp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,mp=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,gp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,_p=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,vp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,xp=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,yp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Mp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Sp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Ep=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,bp=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Tp=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,wp=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Ap=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Rp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Cp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Pp=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Lp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Dp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Ip=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,Up=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Np=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Fp=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Op=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Bp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,zp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,kp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Hp="gl_FragColor = linearToOutputTexel( gl_FragColor );",Vp=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Gp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Wp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Xp=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Yp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,qp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,$p=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Kp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,jp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Zp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Jp=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Qp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,em=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,tm=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,nm=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,im=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,sm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,rm=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,om=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,am=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lm=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,cm=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,um=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,hm=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,dm=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,fm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,pm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,mm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,gm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,_m=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,vm=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,xm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,ym=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Mm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Sm=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Em=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,bm=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Tm=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,wm=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Am=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Rm=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Cm=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Pm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Lm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Dm=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Im=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Um=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Nm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Fm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Om=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Bm=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,zm=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,km=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Hm=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Vm=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Gm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Wm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Xm=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Ym=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,qm=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,$m=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Km=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,jm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Zm=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Jm=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Qm=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,eg=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,tg=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,ng=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,ig=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,sg=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,rg=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,og=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,ag=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,lg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,cg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const ug=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,hg=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,dg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,fg=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,pg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,mg=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,gg=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,_g=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,vg=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,xg=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,yg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Mg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Sg=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Eg=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,bg=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Tg=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,wg=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Ag=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Rg=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Cg=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Pg=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Lg=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Dg=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Ig=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ug=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Ng=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Fg=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Og=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Bg=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,zg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,kg=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Hg=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Vg=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Gg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,it={alphahash_fragment:hp,alphahash_pars_fragment:dp,alphamap_fragment:fp,alphamap_pars_fragment:pp,alphatest_fragment:mp,alphatest_pars_fragment:gp,aomap_fragment:_p,aomap_pars_fragment:vp,batching_pars_vertex:xp,batching_vertex:yp,begin_vertex:Mp,beginnormal_vertex:Sp,bsdfs:Ep,iridescence_fragment:bp,bumpmap_pars_fragment:Tp,clipping_planes_fragment:wp,clipping_planes_pars_fragment:Ap,clipping_planes_pars_vertex:Rp,clipping_planes_vertex:Cp,color_fragment:Pp,color_pars_fragment:Lp,color_pars_vertex:Dp,color_vertex:Ip,common:Up,cube_uv_reflection_fragment:Np,defaultnormal_vertex:Fp,displacementmap_pars_vertex:Op,displacementmap_vertex:Bp,emissivemap_fragment:zp,emissivemap_pars_fragment:kp,colorspace_fragment:Hp,colorspace_pars_fragment:Vp,envmap_fragment:Gp,envmap_common_pars_fragment:Wp,envmap_pars_fragment:Xp,envmap_pars_vertex:Yp,envmap_physical_pars_fragment:im,envmap_vertex:qp,fog_vertex:$p,fog_pars_vertex:Kp,fog_fragment:jp,fog_pars_fragment:Zp,gradientmap_pars_fragment:Jp,lightmap_pars_fragment:Qp,lights_lambert_fragment:em,lights_lambert_pars_fragment:tm,lights_pars_begin:nm,lights_toon_fragment:sm,lights_toon_pars_fragment:rm,lights_phong_fragment:om,lights_phong_pars_fragment:am,lights_physical_fragment:lm,lights_physical_pars_fragment:cm,lights_fragment_begin:um,lights_fragment_maps:hm,lights_fragment_end:dm,logdepthbuf_fragment:fm,logdepthbuf_pars_fragment:pm,logdepthbuf_pars_vertex:mm,logdepthbuf_vertex:gm,map_fragment:_m,map_pars_fragment:vm,map_particle_fragment:xm,map_particle_pars_fragment:ym,metalnessmap_fragment:Mm,metalnessmap_pars_fragment:Sm,morphinstance_vertex:Em,morphcolor_vertex:bm,morphnormal_vertex:Tm,morphtarget_pars_vertex:wm,morphtarget_vertex:Am,normal_fragment_begin:Rm,normal_fragment_maps:Cm,normal_pars_fragment:Pm,normal_pars_vertex:Lm,normal_vertex:Dm,normalmap_pars_fragment:Im,clearcoat_normal_fragment_begin:Um,clearcoat_normal_fragment_maps:Nm,clearcoat_pars_fragment:Fm,iridescence_pars_fragment:Om,opaque_fragment:Bm,packing:zm,premultiplied_alpha_fragment:km,project_vertex:Hm,dithering_fragment:Vm,dithering_pars_fragment:Gm,roughnessmap_fragment:Wm,roughnessmap_pars_fragment:Xm,shadowmap_pars_fragment:Ym,shadowmap_pars_vertex:qm,shadowmap_vertex:$m,shadowmask_pars_fragment:Km,skinbase_vertex:jm,skinning_pars_vertex:Zm,skinning_vertex:Jm,skinnormal_vertex:Qm,specularmap_fragment:eg,specularmap_pars_fragment:tg,tonemapping_fragment:ng,tonemapping_pars_fragment:ig,transmission_fragment:sg,transmission_pars_fragment:rg,uv_pars_fragment:og,uv_pars_vertex:ag,uv_vertex:lg,worldpos_vertex:cg,background_vert:ug,background_frag:hg,backgroundCube_vert:dg,backgroundCube_frag:fg,cube_vert:pg,cube_frag:mg,depth_vert:gg,depth_frag:_g,distanceRGBA_vert:vg,distanceRGBA_frag:xg,equirect_vert:yg,equirect_frag:Mg,linedashed_vert:Sg,linedashed_frag:Eg,meshbasic_vert:bg,meshbasic_frag:Tg,meshlambert_vert:wg,meshlambert_frag:Ag,meshmatcap_vert:Rg,meshmatcap_frag:Cg,meshnormal_vert:Pg,meshnormal_frag:Lg,meshphong_vert:Dg,meshphong_frag:Ig,meshphysical_vert:Ug,meshphysical_frag:Ng,meshtoon_vert:Fg,meshtoon_frag:Og,points_vert:Bg,points_frag:zg,shadow_vert:kg,shadow_frag:Hg,sprite_vert:Vg,sprite_frag:Gg},Me={common:{diffuse:{value:new $e(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new tt},alphaMap:{value:null},alphaMapTransform:{value:new tt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new tt}},envmap:{envMap:{value:null},envMapRotation:{value:new tt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new tt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new tt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new tt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new tt},normalScale:{value:new ge(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new tt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new tt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new tt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new tt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new $e(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new $e(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new tt},alphaTest:{value:0},uvTransform:{value:new tt}},sprite:{diffuse:{value:new $e(16777215)},opacity:{value:1},center:{value:new ge(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new tt},alphaMap:{value:null},alphaMapTransform:{value:new tt},alphaTest:{value:0}}},Tn={basic:{uniforms:qt([Me.common,Me.specularmap,Me.envmap,Me.aomap,Me.lightmap,Me.fog]),vertexShader:it.meshbasic_vert,fragmentShader:it.meshbasic_frag},lambert:{uniforms:qt([Me.common,Me.specularmap,Me.envmap,Me.aomap,Me.lightmap,Me.emissivemap,Me.bumpmap,Me.normalmap,Me.displacementmap,Me.fog,Me.lights,{emissive:{value:new $e(0)}}]),vertexShader:it.meshlambert_vert,fragmentShader:it.meshlambert_frag},phong:{uniforms:qt([Me.common,Me.specularmap,Me.envmap,Me.aomap,Me.lightmap,Me.emissivemap,Me.bumpmap,Me.normalmap,Me.displacementmap,Me.fog,Me.lights,{emissive:{value:new $e(0)},specular:{value:new $e(1118481)},shininess:{value:30}}]),vertexShader:it.meshphong_vert,fragmentShader:it.meshphong_frag},standard:{uniforms:qt([Me.common,Me.envmap,Me.aomap,Me.lightmap,Me.emissivemap,Me.bumpmap,Me.normalmap,Me.displacementmap,Me.roughnessmap,Me.metalnessmap,Me.fog,Me.lights,{emissive:{value:new $e(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:it.meshphysical_vert,fragmentShader:it.meshphysical_frag},toon:{uniforms:qt([Me.common,Me.aomap,Me.lightmap,Me.emissivemap,Me.bumpmap,Me.normalmap,Me.displacementmap,Me.gradientmap,Me.fog,Me.lights,{emissive:{value:new $e(0)}}]),vertexShader:it.meshtoon_vert,fragmentShader:it.meshtoon_frag},matcap:{uniforms:qt([Me.common,Me.bumpmap,Me.normalmap,Me.displacementmap,Me.fog,{matcap:{value:null}}]),vertexShader:it.meshmatcap_vert,fragmentShader:it.meshmatcap_frag},points:{uniforms:qt([Me.points,Me.fog]),vertexShader:it.points_vert,fragmentShader:it.points_frag},dashed:{uniforms:qt([Me.common,Me.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:it.linedashed_vert,fragmentShader:it.linedashed_frag},depth:{uniforms:qt([Me.common,Me.displacementmap]),vertexShader:it.depth_vert,fragmentShader:it.depth_frag},normal:{uniforms:qt([Me.common,Me.bumpmap,Me.normalmap,Me.displacementmap,{opacity:{value:1}}]),vertexShader:it.meshnormal_vert,fragmentShader:it.meshnormal_frag},sprite:{uniforms:qt([Me.sprite,Me.fog]),vertexShader:it.sprite_vert,fragmentShader:it.sprite_frag},background:{uniforms:{uvTransform:{value:new tt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:it.background_vert,fragmentShader:it.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new tt}},vertexShader:it.backgroundCube_vert,fragmentShader:it.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:it.cube_vert,fragmentShader:it.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:it.equirect_vert,fragmentShader:it.equirect_frag},distanceRGBA:{uniforms:qt([Me.common,Me.displacementmap,{referencePosition:{value:new L},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:it.distanceRGBA_vert,fragmentShader:it.distanceRGBA_frag},shadow:{uniforms:qt([Me.lights,Me.fog,{color:{value:new $e(0)},opacity:{value:1}}]),vertexShader:it.shadow_vert,fragmentShader:it.shadow_frag}};Tn.physical={uniforms:qt([Tn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new tt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new tt},clearcoatNormalScale:{value:new ge(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new tt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new tt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new tt},sheen:{value:0},sheenColor:{value:new $e(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new tt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new tt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new tt},transmissionSamplerSize:{value:new ge},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new tt},attenuationDistance:{value:0},attenuationColor:{value:new $e(0)},specularColor:{value:new $e(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new tt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new tt},anisotropyVector:{value:new ge},anisotropyMap:{value:null},anisotropyMapTransform:{value:new tt}}]),vertexShader:it.meshphysical_vert,fragmentShader:it.meshphysical_frag};const Rr={r:0,b:0,g:0},yi=new bn,Wg=new pt;function Xg(i,e,t,n,s,r,o){const a=new $e(0);let c=r===!0?0:1,l,u,h=null,d=0,f=null;function g(E){let x=E.isScene===!0?E.background:null;return x&&x.isTexture&&(x=(E.backgroundBlurriness>0?t:e).get(x)),x}function _(E){let x=!1;const D=g(E);D===null?p(a,c):D&&D.isColor&&(p(D,1),x=!0);const R=i.xr.getEnvironmentBlendMode();R==="additive"?n.buffers.color.setClear(0,0,0,1,o):R==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||x)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(E,x){const D=g(x);D&&(D.isCubeTexture||D.mapping===Xr)?(u===void 0&&(u=new $t(new Ot(1,1,1),new $n({name:"BackgroundCubeMaterial",uniforms:ps(Tn.backgroundCube.uniforms),vertexShader:Tn.backgroundCube.vertexShader,fragmentShader:Tn.backgroundCube.fragmentShader,side:tn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(R,C,I){this.matrixWorld.copyPosition(I.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(u)),yi.copy(x.backgroundRotation),yi.x*=-1,yi.y*=-1,yi.z*=-1,D.isCubeTexture&&D.isRenderTargetTexture===!1&&(yi.y*=-1,yi.z*=-1),u.material.uniforms.envMap.value=D,u.material.uniforms.flipEnvMap.value=D.isCubeTexture&&D.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(Wg.makeRotationFromEuler(yi)),u.material.toneMapped=dt.getTransfer(D.colorSpace)!==vt,(h!==D||d!==D.version||f!==i.toneMapping)&&(u.material.needsUpdate=!0,h=D,d=D.version,f=i.toneMapping),u.layers.enableAll(),E.unshift(u,u.geometry,u.material,0,0,null)):D&&D.isTexture&&(l===void 0&&(l=new $t(new qr(2,2),new $n({name:"BackgroundMaterial",uniforms:ps(Tn.background.uniforms),vertexShader:Tn.background.vertexShader,fragmentShader:Tn.background.fragmentShader,side:ci,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=D,l.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,l.material.toneMapped=dt.getTransfer(D.colorSpace)!==vt,D.matrixAutoUpdate===!0&&D.updateMatrix(),l.material.uniforms.uvTransform.value.copy(D.matrix),(h!==D||d!==D.version||f!==i.toneMapping)&&(l.material.needsUpdate=!0,h=D,d=D.version,f=i.toneMapping),l.layers.enableAll(),E.unshift(l,l.geometry,l.material,0,0,null))}function p(E,x){E.getRGB(Rr,Lu(i)),n.buffers.color.setClear(Rr.r,Rr.g,Rr.b,x,o)}function A(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(E,x=1){a.set(E),c=x,p(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(E){c=E,p(a,c)},render:_,addToRenderList:m,dispose:A}}function Yg(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=d(null);let r=s,o=!1;function a(M,T,F,z,H){let G=!1;const q=h(z,F,T);r!==q&&(r=q,l(r.object)),G=f(M,z,F,H),G&&g(M,z,F,H),H!==null&&e.update(H,i.ELEMENT_ARRAY_BUFFER),(G||o)&&(o=!1,x(M,T,F,z),H!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(H).buffer))}function c(){return i.createVertexArray()}function l(M){return i.bindVertexArray(M)}function u(M){return i.deleteVertexArray(M)}function h(M,T,F){const z=F.wireframe===!0;let H=n[M.id];H===void 0&&(H={},n[M.id]=H);let G=H[T.id];G===void 0&&(G={},H[T.id]=G);let q=G[z];return q===void 0&&(q=d(c()),G[z]=q),q}function d(M){const T=[],F=[],z=[];for(let H=0;H<t;H++)T[H]=0,F[H]=0,z[H]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:T,enabledAttributes:F,attributeDivisors:z,object:M,attributes:{},index:null}}function f(M,T,F,z){const H=r.attributes,G=T.attributes;let q=0;const W=F.getAttributes();for(const Y in W)if(W[Y].location>=0){const xe=H[Y];let De=G[Y];if(De===void 0&&(Y==="instanceMatrix"&&M.instanceMatrix&&(De=M.instanceMatrix),Y==="instanceColor"&&M.instanceColor&&(De=M.instanceColor)),xe===void 0||xe.attribute!==De||De&&xe.data!==De.data)return!0;q++}return r.attributesNum!==q||r.index!==z}function g(M,T,F,z){const H={},G=T.attributes;let q=0;const W=F.getAttributes();for(const Y in W)if(W[Y].location>=0){let xe=G[Y];xe===void 0&&(Y==="instanceMatrix"&&M.instanceMatrix&&(xe=M.instanceMatrix),Y==="instanceColor"&&M.instanceColor&&(xe=M.instanceColor));const De={};De.attribute=xe,xe&&xe.data&&(De.data=xe.data),H[Y]=De,q++}r.attributes=H,r.attributesNum=q,r.index=z}function _(){const M=r.newAttributes;for(let T=0,F=M.length;T<F;T++)M[T]=0}function m(M){p(M,0)}function p(M,T){const F=r.newAttributes,z=r.enabledAttributes,H=r.attributeDivisors;F[M]=1,z[M]===0&&(i.enableVertexAttribArray(M),z[M]=1),H[M]!==T&&(i.vertexAttribDivisor(M,T),H[M]=T)}function A(){const M=r.newAttributes,T=r.enabledAttributes;for(let F=0,z=T.length;F<z;F++)T[F]!==M[F]&&(i.disableVertexAttribArray(F),T[F]=0)}function E(M,T,F,z,H,G,q){q===!0?i.vertexAttribIPointer(M,T,F,H,G):i.vertexAttribPointer(M,T,F,z,H,G)}function x(M,T,F,z){_();const H=z.attributes,G=F.getAttributes(),q=T.defaultAttributeValues;for(const W in G){const Y=G[W];if(Y.location>=0){let me=H[W];if(me===void 0&&(W==="instanceMatrix"&&M.instanceMatrix&&(me=M.instanceMatrix),W==="instanceColor"&&M.instanceColor&&(me=M.instanceColor)),me!==void 0){const xe=me.normalized,De=me.itemSize,qe=e.get(me);if(qe===void 0)continue;const Qe=qe.buffer,lt=qe.type,et=qe.bytesPerElement,ee=lt===i.INT||lt===i.UNSIGNED_INT||me.gpuType===Za;if(me.isInterleavedBufferAttribute){const ae=me.data,Ae=ae.stride,Be=me.offset;if(ae.isInstancedInterleavedBuffer){for(let Fe=0;Fe<Y.locationSize;Fe++)p(Y.location+Fe,ae.meshPerAttribute);M.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=ae.meshPerAttribute*ae.count)}else for(let Fe=0;Fe<Y.locationSize;Fe++)m(Y.location+Fe);i.bindBuffer(i.ARRAY_BUFFER,Qe);for(let Fe=0;Fe<Y.locationSize;Fe++)E(Y.location+Fe,De/Y.locationSize,lt,xe,Ae*et,(Be+De/Y.locationSize*Fe)*et,ee)}else{if(me.isInstancedBufferAttribute){for(let ae=0;ae<Y.locationSize;ae++)p(Y.location+ae,me.meshPerAttribute);M.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=me.meshPerAttribute*me.count)}else for(let ae=0;ae<Y.locationSize;ae++)m(Y.location+ae);i.bindBuffer(i.ARRAY_BUFFER,Qe);for(let ae=0;ae<Y.locationSize;ae++)E(Y.location+ae,De/Y.locationSize,lt,xe,De*et,De/Y.locationSize*ae*et,ee)}}else if(q!==void 0){const xe=q[W];if(xe!==void 0)switch(xe.length){case 2:i.vertexAttrib2fv(Y.location,xe);break;case 3:i.vertexAttrib3fv(Y.location,xe);break;case 4:i.vertexAttrib4fv(Y.location,xe);break;default:i.vertexAttrib1fv(Y.location,xe)}}}}A()}function D(){I();for(const M in n){const T=n[M];for(const F in T){const z=T[F];for(const H in z)u(z[H].object),delete z[H];delete T[F]}delete n[M]}}function R(M){if(n[M.id]===void 0)return;const T=n[M.id];for(const F in T){const z=T[F];for(const H in z)u(z[H].object),delete z[H];delete T[F]}delete n[M.id]}function C(M){for(const T in n){const F=n[T];if(F[M.id]===void 0)continue;const z=F[M.id];for(const H in z)u(z[H].object),delete z[H];delete F[M.id]}}function I(){b(),o=!0,r!==s&&(r=s,l(r.object))}function b(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:I,resetDefaultState:b,dispose:D,releaseStatesOfGeometry:R,releaseStatesOfProgram:C,initAttributes:_,enableAttribute:m,disableUnusedAttributes:A}}function qg(i,e,t){let n;function s(l){n=l}function r(l,u){i.drawArrays(n,l,u),t.update(u,n,1)}function o(l,u,h){h!==0&&(i.drawArraysInstanced(n,l,u,h),t.update(u,n,h))}function a(l,u,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,u,0,h);let f=0;for(let g=0;g<h;g++)f+=u[g];t.update(f,n,1)}function c(l,u,h,d){if(h===0)return;const f=e.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<l.length;g++)o(l[g],u[g],d[g]);else{f.multiDrawArraysInstancedWEBGL(n,l,0,u,0,d,0,h);let g=0;for(let _=0;_<h;_++)g+=u[_]*d[_];t.update(g,n,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=c}function $g(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const C=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(C){return!(C!==En&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(C){const I=C===Ks&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(C!==Cn&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==An&&!I)}function c(C){if(C==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp";const u=c(l);u!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",u,"instead."),l=u);const h=t.logarithmicDepthBuffer===!0,d=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),A=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),E=i.getParameter(i.MAX_VARYING_VECTORS),x=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),D=g>0,R=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:h,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:A,maxVaryings:E,maxFragmentUniforms:x,vertexTextures:D,maxSamples:R}}function Kg(i){const e=this;let t=null,n=0,s=!1,r=!1;const o=new si,a=new tt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(h,d){const f=h.length!==0||d||n!==0||s;return s=d,n=h.length,f},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(h,d){t=u(h,d,0)},this.setState=function(h,d,f){const g=h.clippingPlanes,_=h.clipIntersection,m=h.clipShadows,p=i.get(h);if(!s||g===null||g.length===0||r&&!m)r?u(null):l();else{const A=r?0:n,E=A*4;let x=p.clippingState||null;c.value=x,x=u(g,d,E,f);for(let D=0;D!==E;++D)x[D]=t[D];p.clippingState=x,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=A}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function u(h,d,f,g){const _=h!==null?h.length:0;let m=null;if(_!==0){if(m=c.value,g!==!0||m===null){const p=f+_*4,A=d.matrixWorldInverse;a.getNormalMatrix(A),(m===null||m.length<p)&&(m=new Float32Array(p));for(let E=0,x=f;E!==_;++E,x+=4)o.copy(h[E]).applyMatrix4(A,a),o.normal.toArray(m,x),m[x+3]=o.constant}c.value=m,c.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,m}}function jg(i){let e=new WeakMap;function t(o,a){return a===ra?o.mapping=us:a===oa&&(o.mapping=hs),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===ra||a===oa)if(e.has(o)){const c=e.get(o).texture;return t(c,o.mapping)}else{const c=o.image;if(c&&c.height>0){const l=new cf(c.height);return l.fromEquirectangularTexture(i,o),e.set(o,l),o.addEventListener("dispose",s),t(l.texture,o.mapping)}else return null}}return o}function s(o){const a=o.target;a.removeEventListener("dispose",s);const c=e.get(a);c!==void 0&&(e.delete(a),c.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}const is=4,wc=[.125,.215,.35,.446,.526,.582],bi=20,Oo=new Ju,Ac=new $e;let Bo=null,zo=0,ko=0,Ho=!1;const Si=(1+Math.sqrt(5))/2,Qi=1/Si,Rc=[new L(-Si,Qi,0),new L(Si,Qi,0),new L(-Qi,0,Si),new L(Qi,0,Si),new L(0,Si,-Qi),new L(0,Si,Qi),new L(-1,1,-1),new L(1,1,-1),new L(-1,1,1),new L(1,1,1)],Zg=new L;class Cc{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,s=100,r={}){const{size:o=256,position:a=Zg}=r;Bo=this._renderer.getRenderTarget(),zo=this._renderer.getActiveCubeFace(),ko=this._renderer.getActiveMipmapLevel(),Ho=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,n,s,c,a),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Dc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Lc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Bo,zo,ko),this._renderer.xr.enabled=Ho,e.scissorTest=!1,Cr(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===us||e.mapping===hs?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Bo=this._renderer.getRenderTarget(),zo=this._renderer.getActiveCubeFace(),ko=this._renderer.getActiveMipmapLevel(),Ho=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:gn,minFilter:gn,generateMipmaps:!1,type:Ks,format:En,colorSpace:ds,depthBuffer:!1},s=Pc(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Pc(e,t,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Jg(r)),this._blurMaterial=Qg(r,e,t)}return s}_compileMaterial(e){const t=new $t(this._lodPlanes[0],e);this._renderer.compile(t,Oo)}_sceneToCubeUV(e,t,n,s,r){const c=new Qt(90,1,t,n),l=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,f=h.toneMapping;h.getClearColor(Ac),h.toneMapping=li,h.autoClear=!1,h.state.buffers.depth.getReversed()&&(h.setRenderTarget(s),h.clearDepth(),h.setRenderTarget(null));const _=new ui({name:"PMREM.Background",side:tn,depthWrite:!1,depthTest:!1}),m=new $t(new Ot,_);let p=!1;const A=e.background;A?A.isColor&&(_.color.copy(A),e.background=null,p=!0):(_.color.copy(Ac),p=!0);for(let E=0;E<6;E++){const x=E%3;x===0?(c.up.set(0,l[E],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+u[E],r.y,r.z)):x===1?(c.up.set(0,0,l[E]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+u[E],r.z)):(c.up.set(0,l[E],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+u[E]));const D=this._cubeSize;Cr(s,x*D,E>2?D:0,D,D),h.setRenderTarget(s),p&&h.render(m,c),h.render(e,c)}m.geometry.dispose(),m.material.dispose(),h.toneMapping=f,h.autoClear=d,e.background=A}_textureToCubeUV(e,t){const n=this._renderer,s=e.mapping===us||e.mapping===hs;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Dc()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Lc());const r=s?this._cubemapMaterial:this._equirectMaterial,o=new $t(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=e;const c=this._cubeSize;Cr(t,0,0,3*c,2*c),n.setRenderTarget(t),n.render(o,Oo)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=Rc[(s-r-1)%Rc.length];this._blur(e,r-1,r,o,a)}t.autoClear=n}_blur(e,t,n,s,r){const o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,s,"latitudinal",r),this._halfBlur(o,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,o,a){const c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,h=new $t(this._lodPlanes[s],l),d=l.uniforms,f=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*bi-1),_=r/g,m=isFinite(r)?1+Math.floor(u*_):bi;m>bi&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${bi}`);const p=[];let A=0;for(let C=0;C<bi;++C){const I=C/_,b=Math.exp(-I*I/2);p.push(b),C===0?A+=b:C<m&&(A+=2*b)}for(let C=0;C<p.length;C++)p[C]=p[C]/A;d.envMap.value=e.texture,d.samples.value=m,d.weights.value=p,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);const{_lodMax:E}=this;d.dTheta.value=g,d.mipInt.value=E-n;const x=this._sizeLods[s],D=3*x*(s>E-is?s-E+is:0),R=4*(this._cubeSize-x);Cr(t,D,R,3*x,2*x),c.setRenderTarget(t),c.render(h,Oo)}}function Jg(i){const e=[],t=[],n=[];let s=i;const r=i-is+1+wc.length;for(let o=0;o<r;o++){const a=Math.pow(2,s);t.push(a);let c=1/a;o>i-is?c=wc[o-i+is-1]:o===0&&(c=0),n.push(c);const l=1/(a-2),u=-l,h=1+l,d=[u,u,h,u,h,h,u,u,h,h,u,h],f=6,g=6,_=3,m=2,p=1,A=new Float32Array(_*g*f),E=new Float32Array(m*g*f),x=new Float32Array(p*g*f);for(let R=0;R<f;R++){const C=R%3*2/3-1,I=R>2?0:-1,b=[C,I,0,C+2/3,I,0,C+2/3,I+1,0,C,I,0,C+2/3,I+1,0,C,I+1,0];A.set(b,_*g*R),E.set(d,m*g*R);const M=[R,R,R,R,R,R];x.set(M,p*g*R)}const D=new Wt;D.setAttribute("position",new nn(A,_)),D.setAttribute("uv",new nn(E,m)),D.setAttribute("faceIndex",new nn(x,p)),e.push(D),s>is&&s--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function Pc(i,e,t){const n=new Ci(i,e,t);return n.texture.mapping=Xr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Cr(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function Qg(i,e,t){const n=new Float32Array(bi),s=new L(0,1,0);return new $n({name:"SphericalGaussianBlur",defines:{n:bi,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:pl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:ai,depthTest:!1,depthWrite:!1})}function Lc(){return new $n({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:pl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:ai,depthTest:!1,depthWrite:!1})}function Dc(){return new $n({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:pl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ai,depthTest:!1,depthWrite:!1})}function pl(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function e_(i){let e=new WeakMap,t=null;function n(a){if(a&&a.isTexture){const c=a.mapping,l=c===ra||c===oa,u=c===us||c===hs;if(l||u){let h=e.get(a);const d=h!==void 0?h.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==d)return t===null&&(t=new Cc(i)),h=l?t.fromEquirectangular(a,h):t.fromCubemap(a,h),h.texture.pmremVersion=a.pmremVersion,e.set(a,h),h.texture;if(h!==void 0)return h.texture;{const f=a.image;return l&&f&&f.height>0||u&&f&&s(f)?(t===null&&(t=new Cc(i)),h=l?t.fromEquirectangular(a):t.fromCubemap(a),h.texture.pmremVersion=a.pmremVersion,e.set(a,h),a.addEventListener("dispose",r),h.texture):null}}}return a}function s(a){let c=0;const l=6;for(let u=0;u<l;u++)a[u]!==void 0&&c++;return c===l}function r(a){const c=a.target;c.removeEventListener("dispose",r);const l=e.get(c);l!==void 0&&(e.delete(c),l.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function t_(i){const e={};function t(n){if(e[n]!==void 0)return e[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const s=t(n);return s===null&&Ws("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function n_(i,e,t,n){const s={},r=new WeakMap;function o(h){const d=h.target;d.index!==null&&e.remove(d.index);for(const g in d.attributes)e.remove(d.attributes[g]);d.removeEventListener("dispose",o),delete s[d.id];const f=r.get(d);f&&(e.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function a(h,d){return s[d.id]===!0||(d.addEventListener("dispose",o),s[d.id]=!0,t.memory.geometries++),d}function c(h){const d=h.attributes;for(const f in d)e.update(d[f],i.ARRAY_BUFFER)}function l(h){const d=[],f=h.index,g=h.attributes.position;let _=0;if(f!==null){const A=f.array;_=f.version;for(let E=0,x=A.length;E<x;E+=3){const D=A[E+0],R=A[E+1],C=A[E+2];d.push(D,R,R,C,C,D)}}else if(g!==void 0){const A=g.array;_=g.version;for(let E=0,x=A.length/3-1;E<x;E+=3){const D=E+0,R=E+1,C=E+2;d.push(D,R,R,C,C,D)}}else return;const m=new(wu(d)?Pu:Cu)(d,1);m.version=_;const p=r.get(h);p&&e.remove(p),r.set(h,m)}function u(h){const d=r.get(h);if(d){const f=h.index;f!==null&&d.version<f.version&&l(h)}else l(h);return r.get(h)}return{get:a,update:c,getWireframeAttribute:u}}function i_(i,e,t){let n;function s(d){n=d}let r,o;function a(d){r=d.type,o=d.bytesPerElement}function c(d,f){i.drawElements(n,f,r,d*o),t.update(f,n,1)}function l(d,f,g){g!==0&&(i.drawElementsInstanced(n,f,r,d*o,g),t.update(f,n,g))}function u(d,f,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,r,d,0,g);let m=0;for(let p=0;p<g;p++)m+=f[p];t.update(m,n,1)}function h(d,f,g,_){if(g===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<d.length;p++)l(d[p]/o,f[p],_[p]);else{m.multiDrawElementsInstancedWEBGL(n,f,0,r,d,0,_,0,g);let p=0;for(let A=0;A<g;A++)p+=f[A]*_[A];t.update(p,n,1)}}this.setMode=s,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=u,this.renderMultiDrawInstances=h}function s_(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(t.calls++,o){case i.TRIANGLES:t.triangles+=a*(r/3);break;case i.LINES:t.lines+=a*(r/2);break;case i.LINE_STRIP:t.lines+=a*(r-1);break;case i.LINE_LOOP:t.lines+=a*r;break;case i.POINTS:t.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function r_(i,e,t){const n=new WeakMap,s=new yt;function r(o,a,c){const l=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,h=u!==void 0?u.length:0;let d=n.get(a);if(d===void 0||d.count!==h){let b=function(){C.dispose(),n.delete(a),a.removeEventListener("dispose",b)};d!==void 0&&d.texture.dispose();const f=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,_=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],p=a.morphAttributes.normal||[],A=a.morphAttributes.color||[];let E=0;f===!0&&(E=1),g===!0&&(E=2),_===!0&&(E=3);let x=a.attributes.position.count*E,D=1;x>e.maxTextureSize&&(D=Math.ceil(x/e.maxTextureSize),x=e.maxTextureSize);const R=new Float32Array(x*D*4*h),C=new Au(R,x,D,h);C.type=An,C.needsUpdate=!0;const I=E*4;for(let M=0;M<h;M++){const T=m[M],F=p[M],z=A[M],H=x*D*4*M;for(let G=0;G<T.count;G++){const q=G*I;f===!0&&(s.fromBufferAttribute(T,G),R[H+q+0]=s.x,R[H+q+1]=s.y,R[H+q+2]=s.z,R[H+q+3]=0),g===!0&&(s.fromBufferAttribute(F,G),R[H+q+4]=s.x,R[H+q+5]=s.y,R[H+q+6]=s.z,R[H+q+7]=0),_===!0&&(s.fromBufferAttribute(z,G),R[H+q+8]=s.x,R[H+q+9]=s.y,R[H+q+10]=s.z,R[H+q+11]=z.itemSize===4?s.w:1)}}d={count:h,texture:C,size:new ge(x,D)},n.set(a,d),a.addEventListener("dispose",b)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",o.morphTexture,t);else{let f=0;for(let _=0;_<l.length;_++)f+=l[_];const g=a.morphTargetsRelative?1:1-f;c.getUniforms().setValue(i,"morphTargetBaseInfluence",g),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",d.texture,t),c.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:r}}function o_(i,e,t,n){let s=new WeakMap;function r(c){const l=n.render.frame,u=c.geometry,h=e.get(c,u);if(s.get(h)!==l&&(e.update(h),s.set(h,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),s.get(c)!==l&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const d=c.skeleton;s.get(d)!==l&&(d.update(),s.set(d,l))}return h}function o(){s=new WeakMap}function a(c){const l=c.target;l.removeEventListener("dispose",a),t.remove(l.instanceMatrix),l.instanceColor!==null&&t.remove(l.instanceColor)}return{update:r,dispose:o}}const eh=new Gt,Ic=new Fu(1,1),th=new Au,nh=new Xd,ih=new Iu,Uc=[],Nc=[],Fc=new Float32Array(16),Oc=new Float32Array(9),Bc=new Float32Array(4);function vs(i,e,t){const n=i[0];if(n<=0||n>0)return i;const s=e*t;let r=Uc[s];if(r===void 0&&(r=new Float32Array(s),Uc[s]=r),e!==0){n.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,i[o].toArray(r,a)}return r}function Lt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Dt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function jr(i,e){let t=Nc[e];t===void 0&&(t=new Int32Array(e),Nc[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function a_(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function l_(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Lt(t,e))return;i.uniform2fv(this.addr,e),Dt(t,e)}}function c_(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Lt(t,e))return;i.uniform3fv(this.addr,e),Dt(t,e)}}function u_(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Lt(t,e))return;i.uniform4fv(this.addr,e),Dt(t,e)}}function h_(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Lt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Dt(t,e)}else{if(Lt(t,n))return;Bc.set(n),i.uniformMatrix2fv(this.addr,!1,Bc),Dt(t,n)}}function d_(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Lt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Dt(t,e)}else{if(Lt(t,n))return;Oc.set(n),i.uniformMatrix3fv(this.addr,!1,Oc),Dt(t,n)}}function f_(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Lt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Dt(t,e)}else{if(Lt(t,n))return;Fc.set(n),i.uniformMatrix4fv(this.addr,!1,Fc),Dt(t,n)}}function p_(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function m_(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Lt(t,e))return;i.uniform2iv(this.addr,e),Dt(t,e)}}function g_(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Lt(t,e))return;i.uniform3iv(this.addr,e),Dt(t,e)}}function __(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Lt(t,e))return;i.uniform4iv(this.addr,e),Dt(t,e)}}function v_(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function x_(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Lt(t,e))return;i.uniform2uiv(this.addr,e),Dt(t,e)}}function y_(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Lt(t,e))return;i.uniform3uiv(this.addr,e),Dt(t,e)}}function M_(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Lt(t,e))return;i.uniform4uiv(this.addr,e),Dt(t,e)}}function S_(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Ic.compareFunction=Tu,r=Ic):r=eh,t.setTexture2D(e||r,s)}function E_(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||nh,s)}function b_(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||ih,s)}function T_(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||th,s)}function w_(i){switch(i){case 5126:return a_;case 35664:return l_;case 35665:return c_;case 35666:return u_;case 35674:return h_;case 35675:return d_;case 35676:return f_;case 5124:case 35670:return p_;case 35667:case 35671:return m_;case 35668:case 35672:return g_;case 35669:case 35673:return __;case 5125:return v_;case 36294:return x_;case 36295:return y_;case 36296:return M_;case 35678:case 36198:case 36298:case 36306:case 35682:return S_;case 35679:case 36299:case 36307:return E_;case 35680:case 36300:case 36308:case 36293:return b_;case 36289:case 36303:case 36311:case 36292:return T_}}function A_(i,e){i.uniform1fv(this.addr,e)}function R_(i,e){const t=vs(e,this.size,2);i.uniform2fv(this.addr,t)}function C_(i,e){const t=vs(e,this.size,3);i.uniform3fv(this.addr,t)}function P_(i,e){const t=vs(e,this.size,4);i.uniform4fv(this.addr,t)}function L_(i,e){const t=vs(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function D_(i,e){const t=vs(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function I_(i,e){const t=vs(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function U_(i,e){i.uniform1iv(this.addr,e)}function N_(i,e){i.uniform2iv(this.addr,e)}function F_(i,e){i.uniform3iv(this.addr,e)}function O_(i,e){i.uniform4iv(this.addr,e)}function B_(i,e){i.uniform1uiv(this.addr,e)}function z_(i,e){i.uniform2uiv(this.addr,e)}function k_(i,e){i.uniform3uiv(this.addr,e)}function H_(i,e){i.uniform4uiv(this.addr,e)}function V_(i,e,t){const n=this.cache,s=e.length,r=jr(t,s);Lt(n,r)||(i.uniform1iv(this.addr,r),Dt(n,r));for(let o=0;o!==s;++o)t.setTexture2D(e[o]||eh,r[o])}function G_(i,e,t){const n=this.cache,s=e.length,r=jr(t,s);Lt(n,r)||(i.uniform1iv(this.addr,r),Dt(n,r));for(let o=0;o!==s;++o)t.setTexture3D(e[o]||nh,r[o])}function W_(i,e,t){const n=this.cache,s=e.length,r=jr(t,s);Lt(n,r)||(i.uniform1iv(this.addr,r),Dt(n,r));for(let o=0;o!==s;++o)t.setTextureCube(e[o]||ih,r[o])}function X_(i,e,t){const n=this.cache,s=e.length,r=jr(t,s);Lt(n,r)||(i.uniform1iv(this.addr,r),Dt(n,r));for(let o=0;o!==s;++o)t.setTexture2DArray(e[o]||th,r[o])}function Y_(i){switch(i){case 5126:return A_;case 35664:return R_;case 35665:return C_;case 35666:return P_;case 35674:return L_;case 35675:return D_;case 35676:return I_;case 5124:case 35670:return U_;case 35667:case 35671:return N_;case 35668:case 35672:return F_;case 35669:case 35673:return O_;case 5125:return B_;case 36294:return z_;case 36295:return k_;case 36296:return H_;case 35678:case 36198:case 36298:case 36306:case 35682:return V_;case 35679:case 36299:case 36307:return G_;case 35680:case 36300:case 36308:case 36293:return W_;case 36289:case 36303:case 36311:case 36292:return X_}}class q_{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=w_(t.type)}}class $_{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Y_(t.type)}}class K_{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const s=this.seq;for(let r=0,o=s.length;r!==o;++r){const a=s[r];a.setValue(e,t[a.id],n)}}}const Vo=/(\w+)(\])?(\[|\.)?/g;function zc(i,e){i.seq.push(e),i.map[e.id]=e}function j_(i,e,t){const n=i.name,s=n.length;for(Vo.lastIndex=0;;){const r=Vo.exec(n),o=Vo.lastIndex;let a=r[1];const c=r[2]==="]",l=r[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===s){zc(t,l===void 0?new q_(a,i,e):new $_(a,i,e));break}else{let h=t.map[a];h===void 0&&(h=new K_(a),zc(t,h)),t=h}}}class Or{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=e.getActiveUniform(t,s),o=e.getUniformLocation(t,r.name);j_(r,o,this)}}setValue(e,t,n,s){const r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){const s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,o=t.length;r!==o;++r){const a=t[r],c=n[a.id];c.needsUpdate!==!1&&a.setValue(e,c.value,s)}}static seqWithValue(e,t){const n=[];for(let s=0,r=e.length;s!==r;++s){const o=e[s];o.id in t&&n.push(o)}return n}}function kc(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const Z_=37297;let J_=0;function Q_(i,e){const t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=s;o<r;o++){const a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}const Hc=new tt;function e0(i){dt._getMatrix(Hc,dt.workingColorSpace,i);const e=`mat3( ${Hc.elements.map(t=>t.toFixed(4))} )`;switch(dt.getTransfer(i)){case Br:return[e,"LinearTransferOETF"];case vt:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function Vc(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";const o=/ERROR: 0:(\d+)/.exec(r);if(o){const a=parseInt(o[1]);return t.toUpperCase()+`

`+r+`

`+Q_(i.getShaderSource(e),a)}else return r}function t0(i,e){const t=e0(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function n0(i,e){let t;switch(e){case id:t="Linear";break;case sd:t="Reinhard";break;case rd:t="Cineon";break;case od:t="ACESFilmic";break;case ld:t="AgX";break;case cd:t="Neutral";break;case ad:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Pr=new L;function i0(){dt.getLuminanceCoefficients(Pr);const i=Pr.x.toFixed(4),e=Pr.y.toFixed(4),t=Pr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function s0(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Us).join(`
`)}function r0(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function o0(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(e,s),o=r.name;let a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:i.getAttribLocation(e,o),locationSize:a}}return t}function Us(i){return i!==""}function Gc(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Wc(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const a0=/^[ \t]*#include +<([\w\d./]+)>/gm;function Va(i){return i.replace(a0,c0)}const l0=new Map;function c0(i,e){let t=it[e];if(t===void 0){const n=l0.get(e);if(n!==void 0)t=it[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return Va(t)}const u0=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Xc(i){return i.replace(u0,h0)}function h0(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Yc(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function d0(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===mu?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===Fh?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Gn&&(e="SHADOWMAP_TYPE_VSM"),e}function f0(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case us:case hs:e="ENVMAP_TYPE_CUBE";break;case Xr:e="ENVMAP_TYPE_CUBE_UV";break}return e}function p0(i){let e="ENVMAP_MODE_REFLECTION";return i.envMap&&i.envMapMode===hs&&(e="ENVMAP_MODE_REFRACTION"),e}function m0(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case ja:e="ENVMAP_BLENDING_MULTIPLY";break;case td:e="ENVMAP_BLENDING_MIX";break;case nd:e="ENVMAP_BLENDING_ADD";break}return e}function g0(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function _0(i,e,t,n){const s=i.getContext(),r=t.defines;let o=t.vertexShader,a=t.fragmentShader;const c=d0(t),l=f0(t),u=p0(t),h=m0(t),d=g0(t),f=s0(t),g=r0(r),_=s.createProgram();let m,p,A=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Us).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Us).join(`
`),p.length>0&&(p+=`
`)):(m=[Yc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Us).join(`
`),p=[Yc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+u:"",t.envMap?"#define "+h:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==li?"#define TONE_MAPPING":"",t.toneMapping!==li?it.tonemapping_pars_fragment:"",t.toneMapping!==li?n0("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",it.colorspace_pars_fragment,t0("linearToOutputTexel",t.outputColorSpace),i0(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Us).join(`
`)),o=Va(o),o=Gc(o,t),o=Wc(o,t),a=Va(a),a=Gc(a,t),a=Wc(a,t),o=Xc(o),a=Xc(a),t.isRawShaderMaterial!==!0&&(A=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",t.glslVersion===Vl?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Vl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const E=A+m+o,x=A+p+a,D=kc(s,s.VERTEX_SHADER,E),R=kc(s,s.FRAGMENT_SHADER,x);s.attachShader(_,D),s.attachShader(_,R),t.index0AttributeName!==void 0?s.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function C(T){if(i.debug.checkShaderErrors){const F=s.getProgramInfoLog(_)||"",z=s.getShaderInfoLog(D)||"",H=s.getShaderInfoLog(R)||"",G=F.trim(),q=z.trim(),W=H.trim();let Y=!0,me=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(Y=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,_,D,R);else{const xe=Vc(s,D,"vertex"),De=Vc(s,R,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+T.name+`
Material Type: `+T.type+`

Program Info Log: `+G+`
`+xe+`
`+De)}else G!==""?console.warn("THREE.WebGLProgram: Program Info Log:",G):(q===""||W==="")&&(me=!1);me&&(T.diagnostics={runnable:Y,programLog:G,vertexShader:{log:q,prefix:m},fragmentShader:{log:W,prefix:p}})}s.deleteShader(D),s.deleteShader(R),I=new Or(s,_),b=o0(s,_)}let I;this.getUniforms=function(){return I===void 0&&C(this),I};let b;this.getAttributes=function(){return b===void 0&&C(this),b};let M=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=s.getProgramParameter(_,Z_)),M},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=J_++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=D,this.fragmentShader=R,this}let v0=0;class x0{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new y0(e),t.set(e,n)),n}}class y0{constructor(e){this.id=v0++,this.code=e,this.usedTimes=0}}function M0(i,e,t,n,s,r,o){const a=new ol,c=new x0,l=new Set,u=[],h=s.logarithmicDepthBuffer,d=s.vertexTextures;let f=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(b){return l.add(b),b===0?"uv":`uv${b}`}function m(b,M,T,F,z){const H=F.fog,G=z.geometry,q=b.isMeshStandardMaterial?F.environment:null,W=(b.isMeshStandardMaterial?t:e).get(b.envMap||q),Y=W&&W.mapping===Xr?W.image.height:null,me=g[b.type];b.precision!==null&&(f=s.getMaxPrecision(b.precision),f!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",f,"instead."));const xe=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,De=xe!==void 0?xe.length:0;let qe=0;G.morphAttributes.position!==void 0&&(qe=1),G.morphAttributes.normal!==void 0&&(qe=2),G.morphAttributes.color!==void 0&&(qe=3);let Qe,lt,et,ee;if(me){const Ze=Tn[me];Qe=Ze.vertexShader,lt=Ze.fragmentShader}else Qe=b.vertexShader,lt=b.fragmentShader,c.update(b),et=c.getVertexShaderID(b),ee=c.getFragmentShaderID(b);const ae=i.getRenderTarget(),Ae=i.state.buffers.depth.getReversed(),Be=z.isInstancedMesh===!0,Fe=z.isBatchedMesh===!0,nt=!!b.map,je=!!b.matcap,U=!!W,se=!!b.aoMap,Q=!!b.lightMap,ne=!!b.bumpMap,ie=!!b.normalMap,_e=!!b.displacementMap,J=!!b.emissiveMap,fe=!!b.metalnessMap,Ie=!!b.roughnessMap,Se=b.anisotropy>0,w=b.clearcoat>0,y=b.dispersion>0,k=b.iridescence>0,V=b.sheen>0,te=b.transmission>0,j=Se&&!!b.anisotropyMap,Re=w&&!!b.clearcoatMap,de=w&&!!b.clearcoatNormalMap,Pe=w&&!!b.clearcoatRoughnessMap,Le=k&&!!b.iridescenceMap,le=k&&!!b.iridescenceThicknessMap,Ee=V&&!!b.sheenColorMap,We=V&&!!b.sheenRoughnessMap,Oe=!!b.specularMap,ye=!!b.specularColorMap,Ke=!!b.specularIntensityMap,N=te&&!!b.transmissionMap,pe=te&&!!b.thicknessMap,ve=!!b.gradientMap,Ue=!!b.alphaMap,ue=b.alphaTest>0,re=!!b.alphaHash,ze=!!b.extensions;let Ye=li;b.toneMapped&&(ae===null||ae.isXRRenderTarget===!0)&&(Ye=i.toneMapping);const gt={shaderID:me,shaderType:b.type,shaderName:b.name,vertexShader:Qe,fragmentShader:lt,defines:b.defines,customVertexShaderID:et,customFragmentShaderID:ee,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:f,batching:Fe,batchingColor:Fe&&z._colorsTexture!==null,instancing:Be,instancingColor:Be&&z.instanceColor!==null,instancingMorph:Be&&z.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:ae===null?i.outputColorSpace:ae.isXRRenderTarget===!0?ae.texture.colorSpace:ds,alphaToCoverage:!!b.alphaToCoverage,map:nt,matcap:je,envMap:U,envMapMode:U&&W.mapping,envMapCubeUVHeight:Y,aoMap:se,lightMap:Q,bumpMap:ne,normalMap:ie,displacementMap:d&&_e,emissiveMap:J,normalMapObjectSpace:ie&&b.normalMapType===fd,normalMapTangentSpace:ie&&b.normalMapType===bu,metalnessMap:fe,roughnessMap:Ie,anisotropy:Se,anisotropyMap:j,clearcoat:w,clearcoatMap:Re,clearcoatNormalMap:de,clearcoatRoughnessMap:Pe,dispersion:y,iridescence:k,iridescenceMap:Le,iridescenceThicknessMap:le,sheen:V,sheenColorMap:Ee,sheenRoughnessMap:We,specularMap:Oe,specularColorMap:ye,specularIntensityMap:Ke,transmission:te,transmissionMap:N,thicknessMap:pe,gradientMap:ve,opaque:b.transparent===!1&&b.blending===os&&b.alphaToCoverage===!1,alphaMap:Ue,alphaTest:ue,alphaHash:re,combine:b.combine,mapUv:nt&&_(b.map.channel),aoMapUv:se&&_(b.aoMap.channel),lightMapUv:Q&&_(b.lightMap.channel),bumpMapUv:ne&&_(b.bumpMap.channel),normalMapUv:ie&&_(b.normalMap.channel),displacementMapUv:_e&&_(b.displacementMap.channel),emissiveMapUv:J&&_(b.emissiveMap.channel),metalnessMapUv:fe&&_(b.metalnessMap.channel),roughnessMapUv:Ie&&_(b.roughnessMap.channel),anisotropyMapUv:j&&_(b.anisotropyMap.channel),clearcoatMapUv:Re&&_(b.clearcoatMap.channel),clearcoatNormalMapUv:de&&_(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Pe&&_(b.clearcoatRoughnessMap.channel),iridescenceMapUv:Le&&_(b.iridescenceMap.channel),iridescenceThicknessMapUv:le&&_(b.iridescenceThicknessMap.channel),sheenColorMapUv:Ee&&_(b.sheenColorMap.channel),sheenRoughnessMapUv:We&&_(b.sheenRoughnessMap.channel),specularMapUv:Oe&&_(b.specularMap.channel),specularColorMapUv:ye&&_(b.specularColorMap.channel),specularIntensityMapUv:Ke&&_(b.specularIntensityMap.channel),transmissionMapUv:N&&_(b.transmissionMap.channel),thicknessMapUv:pe&&_(b.thicknessMap.channel),alphaMapUv:Ue&&_(b.alphaMap.channel),vertexTangents:!!G.attributes.tangent&&(ie||Se),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,pointsUvs:z.isPoints===!0&&!!G.attributes.uv&&(nt||Ue),fog:!!H,useFog:b.fog===!0,fogExp2:!!H&&H.isFogExp2,flatShading:b.flatShading===!0&&b.wireframe===!1,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:h,reversedDepthBuffer:Ae,skinning:z.isSkinnedMesh===!0,morphTargets:G.morphAttributes.position!==void 0,morphNormals:G.morphAttributes.normal!==void 0,morphColors:G.morphAttributes.color!==void 0,morphTargetsCount:De,morphTextureStride:qe,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:b.dithering,shadowMapEnabled:i.shadowMap.enabled&&T.length>0,shadowMapType:i.shadowMap.type,toneMapping:Ye,decodeVideoTexture:nt&&b.map.isVideoTexture===!0&&dt.getTransfer(b.map.colorSpace)===vt,decodeVideoTextureEmissive:J&&b.emissiveMap.isVideoTexture===!0&&dt.getTransfer(b.emissiveMap.colorSpace)===vt,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===wn,flipSided:b.side===tn,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:ze&&b.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ze&&b.extensions.multiDraw===!0||Fe)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return gt.vertexUv1s=l.has(1),gt.vertexUv2s=l.has(2),gt.vertexUv3s=l.has(3),l.clear(),gt}function p(b){const M=[];if(b.shaderID?M.push(b.shaderID):(M.push(b.customVertexShaderID),M.push(b.customFragmentShaderID)),b.defines!==void 0)for(const T in b.defines)M.push(T),M.push(b.defines[T]);return b.isRawShaderMaterial===!1&&(A(M,b),E(M,b),M.push(i.outputColorSpace)),M.push(b.customProgramCacheKey),M.join()}function A(b,M){b.push(M.precision),b.push(M.outputColorSpace),b.push(M.envMapMode),b.push(M.envMapCubeUVHeight),b.push(M.mapUv),b.push(M.alphaMapUv),b.push(M.lightMapUv),b.push(M.aoMapUv),b.push(M.bumpMapUv),b.push(M.normalMapUv),b.push(M.displacementMapUv),b.push(M.emissiveMapUv),b.push(M.metalnessMapUv),b.push(M.roughnessMapUv),b.push(M.anisotropyMapUv),b.push(M.clearcoatMapUv),b.push(M.clearcoatNormalMapUv),b.push(M.clearcoatRoughnessMapUv),b.push(M.iridescenceMapUv),b.push(M.iridescenceThicknessMapUv),b.push(M.sheenColorMapUv),b.push(M.sheenRoughnessMapUv),b.push(M.specularMapUv),b.push(M.specularColorMapUv),b.push(M.specularIntensityMapUv),b.push(M.transmissionMapUv),b.push(M.thicknessMapUv),b.push(M.combine),b.push(M.fogExp2),b.push(M.sizeAttenuation),b.push(M.morphTargetsCount),b.push(M.morphAttributeCount),b.push(M.numDirLights),b.push(M.numPointLights),b.push(M.numSpotLights),b.push(M.numSpotLightMaps),b.push(M.numHemiLights),b.push(M.numRectAreaLights),b.push(M.numDirLightShadows),b.push(M.numPointLightShadows),b.push(M.numSpotLightShadows),b.push(M.numSpotLightShadowsWithMaps),b.push(M.numLightProbes),b.push(M.shadowMapType),b.push(M.toneMapping),b.push(M.numClippingPlanes),b.push(M.numClipIntersection),b.push(M.depthPacking)}function E(b,M){a.disableAll(),M.supportsVertexTextures&&a.enable(0),M.instancing&&a.enable(1),M.instancingColor&&a.enable(2),M.instancingMorph&&a.enable(3),M.matcap&&a.enable(4),M.envMap&&a.enable(5),M.normalMapObjectSpace&&a.enable(6),M.normalMapTangentSpace&&a.enable(7),M.clearcoat&&a.enable(8),M.iridescence&&a.enable(9),M.alphaTest&&a.enable(10),M.vertexColors&&a.enable(11),M.vertexAlphas&&a.enable(12),M.vertexUv1s&&a.enable(13),M.vertexUv2s&&a.enable(14),M.vertexUv3s&&a.enable(15),M.vertexTangents&&a.enable(16),M.anisotropy&&a.enable(17),M.alphaHash&&a.enable(18),M.batching&&a.enable(19),M.dispersion&&a.enable(20),M.batchingColor&&a.enable(21),M.gradientMap&&a.enable(22),b.push(a.mask),a.disableAll(),M.fog&&a.enable(0),M.useFog&&a.enable(1),M.flatShading&&a.enable(2),M.logarithmicDepthBuffer&&a.enable(3),M.reversedDepthBuffer&&a.enable(4),M.skinning&&a.enable(5),M.morphTargets&&a.enable(6),M.morphNormals&&a.enable(7),M.morphColors&&a.enable(8),M.premultipliedAlpha&&a.enable(9),M.shadowMapEnabled&&a.enable(10),M.doubleSided&&a.enable(11),M.flipSided&&a.enable(12),M.useDepthPacking&&a.enable(13),M.dithering&&a.enable(14),M.transmission&&a.enable(15),M.sheen&&a.enable(16),M.opaque&&a.enable(17),M.pointsUvs&&a.enable(18),M.decodeVideoTexture&&a.enable(19),M.decodeVideoTextureEmissive&&a.enable(20),M.alphaToCoverage&&a.enable(21),b.push(a.mask)}function x(b){const M=g[b.type];let T;if(M){const F=Tn[M];T=rf.clone(F.uniforms)}else T=b.uniforms;return T}function D(b,M){let T;for(let F=0,z=u.length;F<z;F++){const H=u[F];if(H.cacheKey===M){T=H,++T.usedTimes;break}}return T===void 0&&(T=new _0(i,M,b,r),u.push(T)),T}function R(b){if(--b.usedTimes===0){const M=u.indexOf(b);u[M]=u[u.length-1],u.pop(),b.destroy()}}function C(b){c.remove(b)}function I(){c.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:x,acquireProgram:D,releaseProgram:R,releaseShaderCache:C,programs:u,dispose:I}}function S0(){let i=new WeakMap;function e(o){return i.has(o)}function t(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,c){i.get(o)[a]=c}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function E0(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function qc(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function $c(){const i=[];let e=0;const t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function o(h,d,f,g,_,m){let p=i[e];return p===void 0?(p={id:h.id,object:h,geometry:d,material:f,groupOrder:g,renderOrder:h.renderOrder,z:_,group:m},i[e]=p):(p.id=h.id,p.object=h,p.geometry=d,p.material=f,p.groupOrder=g,p.renderOrder=h.renderOrder,p.z=_,p.group=m),e++,p}function a(h,d,f,g,_,m){const p=o(h,d,f,g,_,m);f.transmission>0?n.push(p):f.transparent===!0?s.push(p):t.push(p)}function c(h,d,f,g,_,m){const p=o(h,d,f,g,_,m);f.transmission>0?n.unshift(p):f.transparent===!0?s.unshift(p):t.unshift(p)}function l(h,d){t.length>1&&t.sort(h||E0),n.length>1&&n.sort(d||qc),s.length>1&&s.sort(d||qc)}function u(){for(let h=e,d=i.length;h<d;h++){const f=i[h];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:a,unshift:c,finish:u,sort:l}}function b0(){let i=new WeakMap;function e(n,s){const r=i.get(n);let o;return r===void 0?(o=new $c,i.set(n,[o])):s>=r.length?(o=new $c,r.push(o)):o=r[s],o}function t(){i=new WeakMap}return{get:e,dispose:t}}function T0(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new L,color:new $e};break;case"SpotLight":t={position:new L,direction:new L,color:new $e,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new L,color:new $e,distance:0,decay:0};break;case"HemisphereLight":t={direction:new L,skyColor:new $e,groundColor:new $e};break;case"RectAreaLight":t={color:new $e,position:new L,halfWidth:new L,halfHeight:new L};break}return i[e.id]=t,t}}}function w0(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ge};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ge};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ge,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let A0=0;function R0(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function C0(i){const e=new T0,t=w0(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new L);const s=new L,r=new pt,o=new pt;function a(l){let u=0,h=0,d=0;for(let b=0;b<9;b++)n.probe[b].set(0,0,0);let f=0,g=0,_=0,m=0,p=0,A=0,E=0,x=0,D=0,R=0,C=0;l.sort(R0);for(let b=0,M=l.length;b<M;b++){const T=l[b],F=T.color,z=T.intensity,H=T.distance,G=T.shadow&&T.shadow.map?T.shadow.map.texture:null;if(T.isAmbientLight)u+=F.r*z,h+=F.g*z,d+=F.b*z;else if(T.isLightProbe){for(let q=0;q<9;q++)n.probe[q].addScaledVector(T.sh.coefficients[q],z);C++}else if(T.isDirectionalLight){const q=e.get(T);if(q.color.copy(T.color).multiplyScalar(T.intensity),T.castShadow){const W=T.shadow,Y=t.get(T);Y.shadowIntensity=W.intensity,Y.shadowBias=W.bias,Y.shadowNormalBias=W.normalBias,Y.shadowRadius=W.radius,Y.shadowMapSize=W.mapSize,n.directionalShadow[f]=Y,n.directionalShadowMap[f]=G,n.directionalShadowMatrix[f]=T.shadow.matrix,A++}n.directional[f]=q,f++}else if(T.isSpotLight){const q=e.get(T);q.position.setFromMatrixPosition(T.matrixWorld),q.color.copy(F).multiplyScalar(z),q.distance=H,q.coneCos=Math.cos(T.angle),q.penumbraCos=Math.cos(T.angle*(1-T.penumbra)),q.decay=T.decay,n.spot[_]=q;const W=T.shadow;if(T.map&&(n.spotLightMap[D]=T.map,D++,W.updateMatrices(T),T.castShadow&&R++),n.spotLightMatrix[_]=W.matrix,T.castShadow){const Y=t.get(T);Y.shadowIntensity=W.intensity,Y.shadowBias=W.bias,Y.shadowNormalBias=W.normalBias,Y.shadowRadius=W.radius,Y.shadowMapSize=W.mapSize,n.spotShadow[_]=Y,n.spotShadowMap[_]=G,x++}_++}else if(T.isRectAreaLight){const q=e.get(T);q.color.copy(F).multiplyScalar(z),q.halfWidth.set(T.width*.5,0,0),q.halfHeight.set(0,T.height*.5,0),n.rectArea[m]=q,m++}else if(T.isPointLight){const q=e.get(T);if(q.color.copy(T.color).multiplyScalar(T.intensity),q.distance=T.distance,q.decay=T.decay,T.castShadow){const W=T.shadow,Y=t.get(T);Y.shadowIntensity=W.intensity,Y.shadowBias=W.bias,Y.shadowNormalBias=W.normalBias,Y.shadowRadius=W.radius,Y.shadowMapSize=W.mapSize,Y.shadowCameraNear=W.camera.near,Y.shadowCameraFar=W.camera.far,n.pointShadow[g]=Y,n.pointShadowMap[g]=G,n.pointShadowMatrix[g]=T.shadow.matrix,E++}n.point[g]=q,g++}else if(T.isHemisphereLight){const q=e.get(T);q.skyColor.copy(T.color).multiplyScalar(z),q.groundColor.copy(T.groundColor).multiplyScalar(z),n.hemi[p]=q,p++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Me.LTC_FLOAT_1,n.rectAreaLTC2=Me.LTC_FLOAT_2):(n.rectAreaLTC1=Me.LTC_HALF_1,n.rectAreaLTC2=Me.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=h,n.ambient[2]=d;const I=n.hash;(I.directionalLength!==f||I.pointLength!==g||I.spotLength!==_||I.rectAreaLength!==m||I.hemiLength!==p||I.numDirectionalShadows!==A||I.numPointShadows!==E||I.numSpotShadows!==x||I.numSpotMaps!==D||I.numLightProbes!==C)&&(n.directional.length=f,n.spot.length=_,n.rectArea.length=m,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=A,n.directionalShadowMap.length=A,n.pointShadow.length=E,n.pointShadowMap.length=E,n.spotShadow.length=x,n.spotShadowMap.length=x,n.directionalShadowMatrix.length=A,n.pointShadowMatrix.length=E,n.spotLightMatrix.length=x+D-R,n.spotLightMap.length=D,n.numSpotLightShadowsWithMaps=R,n.numLightProbes=C,I.directionalLength=f,I.pointLength=g,I.spotLength=_,I.rectAreaLength=m,I.hemiLength=p,I.numDirectionalShadows=A,I.numPointShadows=E,I.numSpotShadows=x,I.numSpotMaps=D,I.numLightProbes=C,n.version=A0++)}function c(l,u){let h=0,d=0,f=0,g=0,_=0;const m=u.matrixWorldInverse;for(let p=0,A=l.length;p<A;p++){const E=l[p];if(E.isDirectionalLight){const x=n.directional[h];x.direction.setFromMatrixPosition(E.matrixWorld),s.setFromMatrixPosition(E.target.matrixWorld),x.direction.sub(s),x.direction.transformDirection(m),h++}else if(E.isSpotLight){const x=n.spot[f];x.position.setFromMatrixPosition(E.matrixWorld),x.position.applyMatrix4(m),x.direction.setFromMatrixPosition(E.matrixWorld),s.setFromMatrixPosition(E.target.matrixWorld),x.direction.sub(s),x.direction.transformDirection(m),f++}else if(E.isRectAreaLight){const x=n.rectArea[g];x.position.setFromMatrixPosition(E.matrixWorld),x.position.applyMatrix4(m),o.identity(),r.copy(E.matrixWorld),r.premultiply(m),o.extractRotation(r),x.halfWidth.set(E.width*.5,0,0),x.halfHeight.set(0,E.height*.5,0),x.halfWidth.applyMatrix4(o),x.halfHeight.applyMatrix4(o),g++}else if(E.isPointLight){const x=n.point[d];x.position.setFromMatrixPosition(E.matrixWorld),x.position.applyMatrix4(m),d++}else if(E.isHemisphereLight){const x=n.hemi[_];x.direction.setFromMatrixPosition(E.matrixWorld),x.direction.transformDirection(m),_++}}}return{setup:a,setupView:c,state:n}}function Kc(i){const e=new C0(i),t=[],n=[];function s(u){l.camera=u,t.length=0,n.length=0}function r(u){t.push(u)}function o(u){n.push(u)}function a(){e.setup(t)}function c(u){e.setupView(t,u)}const l={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:a,setupLightsView:c,pushLight:r,pushShadow:o}}function P0(i){let e=new WeakMap;function t(s,r=0){const o=e.get(s);let a;return o===void 0?(a=new Kc(i),e.set(s,[a])):r>=o.length?(a=new Kc(i),o.push(a)):a=o[r],a}function n(){e=new WeakMap}return{get:t,dispose:n}}const L0=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,D0=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function I0(i,e,t){let n=new cl;const s=new ge,r=new ge,o=new yt,a=new Qf({depthPacking:dd}),c=new ep,l={},u=t.maxTextureSize,h={[ci]:tn,[tn]:ci,[wn]:wn},d=new $n({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ge},radius:{value:4}},vertexShader:L0,fragmentShader:D0}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const g=new Wt;g.setAttribute("position",new nn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new $t(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=mu;let p=this.type;this.render=function(R,C,I){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||R.length===0)return;const b=i.getRenderTarget(),M=i.getActiveCubeFace(),T=i.getActiveMipmapLevel(),F=i.state;F.setBlending(ai),F.buffers.depth.getReversed()===!0?F.buffers.color.setClear(0,0,0,0):F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);const z=p!==Gn&&this.type===Gn,H=p===Gn&&this.type!==Gn;for(let G=0,q=R.length;G<q;G++){const W=R[G],Y=W.shadow;if(Y===void 0){console.warn("THREE.WebGLShadowMap:",W,"has no shadow.");continue}if(Y.autoUpdate===!1&&Y.needsUpdate===!1)continue;s.copy(Y.mapSize);const me=Y.getFrameExtents();if(s.multiply(me),r.copy(Y.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/me.x),s.x=r.x*me.x,Y.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/me.y),s.y=r.y*me.y,Y.mapSize.y=r.y)),Y.map===null||z===!0||H===!0){const De=this.type!==Gn?{minFilter:hn,magFilter:hn}:{};Y.map!==null&&Y.map.dispose(),Y.map=new Ci(s.x,s.y,De),Y.map.texture.name=W.name+".shadowMap",Y.camera.updateProjectionMatrix()}i.setRenderTarget(Y.map),i.clear();const xe=Y.getViewportCount();for(let De=0;De<xe;De++){const qe=Y.getViewport(De);o.set(r.x*qe.x,r.y*qe.y,r.x*qe.z,r.y*qe.w),F.viewport(o),Y.updateMatrices(W,De),n=Y.getFrustum(),x(C,I,Y.camera,W,this.type)}Y.isPointLightShadow!==!0&&this.type===Gn&&A(Y,I),Y.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(b,M,T)};function A(R,C){const I=e.update(_);d.defines.VSM_SAMPLES!==R.blurSamples&&(d.defines.VSM_SAMPLES=R.blurSamples,f.defines.VSM_SAMPLES=R.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),R.mapPass===null&&(R.mapPass=new Ci(s.x,s.y)),d.uniforms.shadow_pass.value=R.map.texture,d.uniforms.resolution.value=R.mapSize,d.uniforms.radius.value=R.radius,i.setRenderTarget(R.mapPass),i.clear(),i.renderBufferDirect(C,null,I,d,_,null),f.uniforms.shadow_pass.value=R.mapPass.texture,f.uniforms.resolution.value=R.mapSize,f.uniforms.radius.value=R.radius,i.setRenderTarget(R.map),i.clear(),i.renderBufferDirect(C,null,I,f,_,null)}function E(R,C,I,b){let M=null;const T=I.isPointLight===!0?R.customDistanceMaterial:R.customDepthMaterial;if(T!==void 0)M=T;else if(M=I.isPointLight===!0?c:a,i.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){const F=M.uuid,z=C.uuid;let H=l[F];H===void 0&&(H={},l[F]=H);let G=H[z];G===void 0&&(G=M.clone(),H[z]=G,C.addEventListener("dispose",D)),M=G}if(M.visible=C.visible,M.wireframe=C.wireframe,b===Gn?M.side=C.shadowSide!==null?C.shadowSide:C.side:M.side=C.shadowSide!==null?C.shadowSide:h[C.side],M.alphaMap=C.alphaMap,M.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,M.map=C.map,M.clipShadows=C.clipShadows,M.clippingPlanes=C.clippingPlanes,M.clipIntersection=C.clipIntersection,M.displacementMap=C.displacementMap,M.displacementScale=C.displacementScale,M.displacementBias=C.displacementBias,M.wireframeLinewidth=C.wireframeLinewidth,M.linewidth=C.linewidth,I.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const F=i.properties.get(M);F.light=I}return M}function x(R,C,I,b,M){if(R.visible===!1)return;if(R.layers.test(C.layers)&&(R.isMesh||R.isLine||R.isPoints)&&(R.castShadow||R.receiveShadow&&M===Gn)&&(!R.frustumCulled||n.intersectsObject(R))){R.modelViewMatrix.multiplyMatrices(I.matrixWorldInverse,R.matrixWorld);const z=e.update(R),H=R.material;if(Array.isArray(H)){const G=z.groups;for(let q=0,W=G.length;q<W;q++){const Y=G[q],me=H[Y.materialIndex];if(me&&me.visible){const xe=E(R,me,b,M);R.onBeforeShadow(i,R,C,I,z,xe,Y),i.renderBufferDirect(I,null,z,xe,R,Y),R.onAfterShadow(i,R,C,I,z,xe,Y)}}}else if(H.visible){const G=E(R,H,b,M);R.onBeforeShadow(i,R,C,I,z,G,null),i.renderBufferDirect(I,null,z,G,R,null),R.onAfterShadow(i,R,C,I,z,G,null)}}const F=R.children;for(let z=0,H=F.length;z<H;z++)x(F[z],C,I,b,M)}function D(R){R.target.removeEventListener("dispose",D);for(const I in l){const b=l[I],M=R.target.uuid;M in b&&(b[M].dispose(),delete b[M])}}}const U0={[Jo]:Qo,[ea]:ia,[ta]:sa,[cs]:na,[Qo]:Jo,[ia]:ea,[sa]:ta,[na]:cs};function N0(i,e){function t(){let N=!1;const pe=new yt;let ve=null;const Ue=new yt(0,0,0,0);return{setMask:function(ue){ve!==ue&&!N&&(i.colorMask(ue,ue,ue,ue),ve=ue)},setLocked:function(ue){N=ue},setClear:function(ue,re,ze,Ye,gt){gt===!0&&(ue*=Ye,re*=Ye,ze*=Ye),pe.set(ue,re,ze,Ye),Ue.equals(pe)===!1&&(i.clearColor(ue,re,ze,Ye),Ue.copy(pe))},reset:function(){N=!1,ve=null,Ue.set(-1,0,0,0)}}}function n(){let N=!1,pe=!1,ve=null,Ue=null,ue=null;return{setReversed:function(re){if(pe!==re){const ze=e.get("EXT_clip_control");re?ze.clipControlEXT(ze.LOWER_LEFT_EXT,ze.ZERO_TO_ONE_EXT):ze.clipControlEXT(ze.LOWER_LEFT_EXT,ze.NEGATIVE_ONE_TO_ONE_EXT),pe=re;const Ye=ue;ue=null,this.setClear(Ye)}},getReversed:function(){return pe},setTest:function(re){re?ae(i.DEPTH_TEST):Ae(i.DEPTH_TEST)},setMask:function(re){ve!==re&&!N&&(i.depthMask(re),ve=re)},setFunc:function(re){if(pe&&(re=U0[re]),Ue!==re){switch(re){case Jo:i.depthFunc(i.NEVER);break;case Qo:i.depthFunc(i.ALWAYS);break;case ea:i.depthFunc(i.LESS);break;case cs:i.depthFunc(i.LEQUAL);break;case ta:i.depthFunc(i.EQUAL);break;case na:i.depthFunc(i.GEQUAL);break;case ia:i.depthFunc(i.GREATER);break;case sa:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}Ue=re}},setLocked:function(re){N=re},setClear:function(re){ue!==re&&(pe&&(re=1-re),i.clearDepth(re),ue=re)},reset:function(){N=!1,ve=null,Ue=null,ue=null,pe=!1}}}function s(){let N=!1,pe=null,ve=null,Ue=null,ue=null,re=null,ze=null,Ye=null,gt=null;return{setTest:function(Ze){N||(Ze?ae(i.STENCIL_TEST):Ae(i.STENCIL_TEST))},setMask:function(Ze){pe!==Ze&&!N&&(i.stencilMask(Ze),pe=Ze)},setFunc:function(Ze,sn,dn){(ve!==Ze||Ue!==sn||ue!==dn)&&(i.stencilFunc(Ze,sn,dn),ve=Ze,Ue=sn,ue=dn)},setOp:function(Ze,sn,dn){(re!==Ze||ze!==sn||Ye!==dn)&&(i.stencilOp(Ze,sn,dn),re=Ze,ze=sn,Ye=dn)},setLocked:function(Ze){N=Ze},setClear:function(Ze){gt!==Ze&&(i.clearStencil(Ze),gt=Ze)},reset:function(){N=!1,pe=null,ve=null,Ue=null,ue=null,re=null,ze=null,Ye=null,gt=null}}}const r=new t,o=new n,a=new s,c=new WeakMap,l=new WeakMap;let u={},h={},d=new WeakMap,f=[],g=null,_=!1,m=null,p=null,A=null,E=null,x=null,D=null,R=null,C=new $e(0,0,0),I=0,b=!1,M=null,T=null,F=null,z=null,H=null;const G=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let q=!1,W=0;const Y=i.getParameter(i.VERSION);Y.indexOf("WebGL")!==-1?(W=parseFloat(/^WebGL (\d)/.exec(Y)[1]),q=W>=1):Y.indexOf("OpenGL ES")!==-1&&(W=parseFloat(/^OpenGL ES (\d)/.exec(Y)[1]),q=W>=2);let me=null,xe={};const De=i.getParameter(i.SCISSOR_BOX),qe=i.getParameter(i.VIEWPORT),Qe=new yt().fromArray(De),lt=new yt().fromArray(qe);function et(N,pe,ve,Ue){const ue=new Uint8Array(4),re=i.createTexture();i.bindTexture(N,re),i.texParameteri(N,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(N,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let ze=0;ze<ve;ze++)N===i.TEXTURE_3D||N===i.TEXTURE_2D_ARRAY?i.texImage3D(pe,0,i.RGBA,1,1,Ue,0,i.RGBA,i.UNSIGNED_BYTE,ue):i.texImage2D(pe+ze,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,ue);return re}const ee={};ee[i.TEXTURE_2D]=et(i.TEXTURE_2D,i.TEXTURE_2D,1),ee[i.TEXTURE_CUBE_MAP]=et(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),ee[i.TEXTURE_2D_ARRAY]=et(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),ee[i.TEXTURE_3D]=et(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),ae(i.DEPTH_TEST),o.setFunc(cs),ne(!1),ie(Ol),ae(i.CULL_FACE),se(ai);function ae(N){u[N]!==!0&&(i.enable(N),u[N]=!0)}function Ae(N){u[N]!==!1&&(i.disable(N),u[N]=!1)}function Be(N,pe){return h[N]!==pe?(i.bindFramebuffer(N,pe),h[N]=pe,N===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=pe),N===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=pe),!0):!1}function Fe(N,pe){let ve=f,Ue=!1;if(N){ve=d.get(pe),ve===void 0&&(ve=[],d.set(pe,ve));const ue=N.textures;if(ve.length!==ue.length||ve[0]!==i.COLOR_ATTACHMENT0){for(let re=0,ze=ue.length;re<ze;re++)ve[re]=i.COLOR_ATTACHMENT0+re;ve.length=ue.length,Ue=!0}}else ve[0]!==i.BACK&&(ve[0]=i.BACK,Ue=!0);Ue&&i.drawBuffers(ve)}function nt(N){return g!==N?(i.useProgram(N),g=N,!0):!1}const je={[Ei]:i.FUNC_ADD,[Bh]:i.FUNC_SUBTRACT,[zh]:i.FUNC_REVERSE_SUBTRACT};je[kh]=i.MIN,je[Hh]=i.MAX;const U={[Vh]:i.ZERO,[Gh]:i.ONE,[Wh]:i.SRC_COLOR,[jo]:i.SRC_ALPHA,[jh]:i.SRC_ALPHA_SATURATE,[$h]:i.DST_COLOR,[Yh]:i.DST_ALPHA,[Xh]:i.ONE_MINUS_SRC_COLOR,[Zo]:i.ONE_MINUS_SRC_ALPHA,[Kh]:i.ONE_MINUS_DST_COLOR,[qh]:i.ONE_MINUS_DST_ALPHA,[Zh]:i.CONSTANT_COLOR,[Jh]:i.ONE_MINUS_CONSTANT_COLOR,[Qh]:i.CONSTANT_ALPHA,[ed]:i.ONE_MINUS_CONSTANT_ALPHA};function se(N,pe,ve,Ue,ue,re,ze,Ye,gt,Ze){if(N===ai){_===!0&&(Ae(i.BLEND),_=!1);return}if(_===!1&&(ae(i.BLEND),_=!0),N!==Oh){if(N!==m||Ze!==b){if((p!==Ei||x!==Ei)&&(i.blendEquation(i.FUNC_ADD),p=Ei,x=Ei),Ze)switch(N){case os:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case zs:i.blendFunc(i.ONE,i.ONE);break;case Bl:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case zl:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}else switch(N){case os:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case zs:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Bl:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case zl:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}A=null,E=null,D=null,R=null,C.set(0,0,0),I=0,m=N,b=Ze}return}ue=ue||pe,re=re||ve,ze=ze||Ue,(pe!==p||ue!==x)&&(i.blendEquationSeparate(je[pe],je[ue]),p=pe,x=ue),(ve!==A||Ue!==E||re!==D||ze!==R)&&(i.blendFuncSeparate(U[ve],U[Ue],U[re],U[ze]),A=ve,E=Ue,D=re,R=ze),(Ye.equals(C)===!1||gt!==I)&&(i.blendColor(Ye.r,Ye.g,Ye.b,gt),C.copy(Ye),I=gt),m=N,b=!1}function Q(N,pe){N.side===wn?Ae(i.CULL_FACE):ae(i.CULL_FACE);let ve=N.side===tn;pe&&(ve=!ve),ne(ve),N.blending===os&&N.transparent===!1?se(ai):se(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),o.setFunc(N.depthFunc),o.setTest(N.depthTest),o.setMask(N.depthWrite),r.setMask(N.colorWrite);const Ue=N.stencilWrite;a.setTest(Ue),Ue&&(a.setMask(N.stencilWriteMask),a.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),a.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),J(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?ae(i.SAMPLE_ALPHA_TO_COVERAGE):Ae(i.SAMPLE_ALPHA_TO_COVERAGE)}function ne(N){M!==N&&(N?i.frontFace(i.CW):i.frontFace(i.CCW),M=N)}function ie(N){N!==Uh?(ae(i.CULL_FACE),N!==T&&(N===Ol?i.cullFace(i.BACK):N===Nh?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Ae(i.CULL_FACE),T=N}function _e(N){N!==F&&(q&&i.lineWidth(N),F=N)}function J(N,pe,ve){N?(ae(i.POLYGON_OFFSET_FILL),(z!==pe||H!==ve)&&(i.polygonOffset(pe,ve),z=pe,H=ve)):Ae(i.POLYGON_OFFSET_FILL)}function fe(N){N?ae(i.SCISSOR_TEST):Ae(i.SCISSOR_TEST)}function Ie(N){N===void 0&&(N=i.TEXTURE0+G-1),me!==N&&(i.activeTexture(N),me=N)}function Se(N,pe,ve){ve===void 0&&(me===null?ve=i.TEXTURE0+G-1:ve=me);let Ue=xe[ve];Ue===void 0&&(Ue={type:void 0,texture:void 0},xe[ve]=Ue),(Ue.type!==N||Ue.texture!==pe)&&(me!==ve&&(i.activeTexture(ve),me=ve),i.bindTexture(N,pe||ee[N]),Ue.type=N,Ue.texture=pe)}function w(){const N=xe[me];N!==void 0&&N.type!==void 0&&(i.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function y(){try{i.compressedTexImage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function k(){try{i.compressedTexImage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function V(){try{i.texSubImage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function te(){try{i.texSubImage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function j(){try{i.compressedTexSubImage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Re(){try{i.compressedTexSubImage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function de(){try{i.texStorage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Pe(){try{i.texStorage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Le(){try{i.texImage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function le(){try{i.texImage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Ee(N){Qe.equals(N)===!1&&(i.scissor(N.x,N.y,N.z,N.w),Qe.copy(N))}function We(N){lt.equals(N)===!1&&(i.viewport(N.x,N.y,N.z,N.w),lt.copy(N))}function Oe(N,pe){let ve=l.get(pe);ve===void 0&&(ve=new WeakMap,l.set(pe,ve));let Ue=ve.get(N);Ue===void 0&&(Ue=i.getUniformBlockIndex(pe,N.name),ve.set(N,Ue))}function ye(N,pe){const Ue=l.get(pe).get(N);c.get(pe)!==Ue&&(i.uniformBlockBinding(pe,Ue,N.__bindingPointIndex),c.set(pe,Ue))}function Ke(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),u={},me=null,xe={},h={},d=new WeakMap,f=[],g=null,_=!1,m=null,p=null,A=null,E=null,x=null,D=null,R=null,C=new $e(0,0,0),I=0,b=!1,M=null,T=null,F=null,z=null,H=null,Qe.set(0,0,i.canvas.width,i.canvas.height),lt.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:ae,disable:Ae,bindFramebuffer:Be,drawBuffers:Fe,useProgram:nt,setBlending:se,setMaterial:Q,setFlipSided:ne,setCullFace:ie,setLineWidth:_e,setPolygonOffset:J,setScissorTest:fe,activeTexture:Ie,bindTexture:Se,unbindTexture:w,compressedTexImage2D:y,compressedTexImage3D:k,texImage2D:Le,texImage3D:le,updateUBOMapping:Oe,uniformBlockBinding:ye,texStorage2D:de,texStorage3D:Pe,texSubImage2D:V,texSubImage3D:te,compressedTexSubImage2D:j,compressedTexSubImage3D:Re,scissor:Ee,viewport:We,reset:Ke}}function F0(i,e,t,n,s,r,o){const a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new ge,u=new WeakMap;let h;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(w,y){return f?new OffscreenCanvas(w,y):kr("canvas")}function _(w,y,k){let V=1;const te=Se(w);if((te.width>k||te.height>k)&&(V=k/Math.max(te.width,te.height)),V<1)if(typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&w instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&w instanceof ImageBitmap||typeof VideoFrame<"u"&&w instanceof VideoFrame){const j=Math.floor(V*te.width),Re=Math.floor(V*te.height);h===void 0&&(h=g(j,Re));const de=y?g(j,Re):h;return de.width=j,de.height=Re,de.getContext("2d").drawImage(w,0,0,j,Re),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+te.width+"x"+te.height+") to ("+j+"x"+Re+")."),de}else return"data"in w&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+te.width+"x"+te.height+")."),w;return w}function m(w){return w.generateMipmaps}function p(w){i.generateMipmap(w)}function A(w){return w.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:w.isWebGL3DRenderTarget?i.TEXTURE_3D:w.isWebGLArrayRenderTarget||w.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function E(w,y,k,V,te=!1){if(w!==null){if(i[w]!==void 0)return i[w];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+w+"'")}let j=y;if(y===i.RED&&(k===i.FLOAT&&(j=i.R32F),k===i.HALF_FLOAT&&(j=i.R16F),k===i.UNSIGNED_BYTE&&(j=i.R8)),y===i.RED_INTEGER&&(k===i.UNSIGNED_BYTE&&(j=i.R8UI),k===i.UNSIGNED_SHORT&&(j=i.R16UI),k===i.UNSIGNED_INT&&(j=i.R32UI),k===i.BYTE&&(j=i.R8I),k===i.SHORT&&(j=i.R16I),k===i.INT&&(j=i.R32I)),y===i.RG&&(k===i.FLOAT&&(j=i.RG32F),k===i.HALF_FLOAT&&(j=i.RG16F),k===i.UNSIGNED_BYTE&&(j=i.RG8)),y===i.RG_INTEGER&&(k===i.UNSIGNED_BYTE&&(j=i.RG8UI),k===i.UNSIGNED_SHORT&&(j=i.RG16UI),k===i.UNSIGNED_INT&&(j=i.RG32UI),k===i.BYTE&&(j=i.RG8I),k===i.SHORT&&(j=i.RG16I),k===i.INT&&(j=i.RG32I)),y===i.RGB_INTEGER&&(k===i.UNSIGNED_BYTE&&(j=i.RGB8UI),k===i.UNSIGNED_SHORT&&(j=i.RGB16UI),k===i.UNSIGNED_INT&&(j=i.RGB32UI),k===i.BYTE&&(j=i.RGB8I),k===i.SHORT&&(j=i.RGB16I),k===i.INT&&(j=i.RGB32I)),y===i.RGBA_INTEGER&&(k===i.UNSIGNED_BYTE&&(j=i.RGBA8UI),k===i.UNSIGNED_SHORT&&(j=i.RGBA16UI),k===i.UNSIGNED_INT&&(j=i.RGBA32UI),k===i.BYTE&&(j=i.RGBA8I),k===i.SHORT&&(j=i.RGBA16I),k===i.INT&&(j=i.RGBA32I)),y===i.RGB&&(k===i.UNSIGNED_INT_5_9_9_9_REV&&(j=i.RGB9_E5),k===i.UNSIGNED_INT_10F_11F_11F_REV&&(j=i.R11F_G11F_B10F)),y===i.RGBA){const Re=te?Br:dt.getTransfer(V);k===i.FLOAT&&(j=i.RGBA32F),k===i.HALF_FLOAT&&(j=i.RGBA16F),k===i.UNSIGNED_BYTE&&(j=Re===vt?i.SRGB8_ALPHA8:i.RGBA8),k===i.UNSIGNED_SHORT_4_4_4_4&&(j=i.RGBA4),k===i.UNSIGNED_SHORT_5_5_5_1&&(j=i.RGB5_A1)}return(j===i.R16F||j===i.R32F||j===i.RG16F||j===i.RG32F||j===i.RGBA16F||j===i.RGBA32F)&&e.get("EXT_color_buffer_float"),j}function x(w,y){let k;return w?y===null||y===Ri||y===Hs?k=i.DEPTH24_STENCIL8:y===An?k=i.DEPTH32F_STENCIL8:y===ks&&(k=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):y===null||y===Ri||y===Hs?k=i.DEPTH_COMPONENT24:y===An?k=i.DEPTH_COMPONENT32F:y===ks&&(k=i.DEPTH_COMPONENT16),k}function D(w,y){return m(w)===!0||w.isFramebufferTexture&&w.minFilter!==hn&&w.minFilter!==gn?Math.log2(Math.max(y.width,y.height))+1:w.mipmaps!==void 0&&w.mipmaps.length>0?w.mipmaps.length:w.isCompressedTexture&&Array.isArray(w.image)?y.mipmaps.length:1}function R(w){const y=w.target;y.removeEventListener("dispose",R),I(y),y.isVideoTexture&&u.delete(y)}function C(w){const y=w.target;y.removeEventListener("dispose",C),M(y)}function I(w){const y=n.get(w);if(y.__webglInit===void 0)return;const k=w.source,V=d.get(k);if(V){const te=V[y.__cacheKey];te.usedTimes--,te.usedTimes===0&&b(w),Object.keys(V).length===0&&d.delete(k)}n.remove(w)}function b(w){const y=n.get(w);i.deleteTexture(y.__webglTexture);const k=w.source,V=d.get(k);delete V[y.__cacheKey],o.memory.textures--}function M(w){const y=n.get(w);if(w.depthTexture&&(w.depthTexture.dispose(),n.remove(w.depthTexture)),w.isWebGLCubeRenderTarget)for(let V=0;V<6;V++){if(Array.isArray(y.__webglFramebuffer[V]))for(let te=0;te<y.__webglFramebuffer[V].length;te++)i.deleteFramebuffer(y.__webglFramebuffer[V][te]);else i.deleteFramebuffer(y.__webglFramebuffer[V]);y.__webglDepthbuffer&&i.deleteRenderbuffer(y.__webglDepthbuffer[V])}else{if(Array.isArray(y.__webglFramebuffer))for(let V=0;V<y.__webglFramebuffer.length;V++)i.deleteFramebuffer(y.__webglFramebuffer[V]);else i.deleteFramebuffer(y.__webglFramebuffer);if(y.__webglDepthbuffer&&i.deleteRenderbuffer(y.__webglDepthbuffer),y.__webglMultisampledFramebuffer&&i.deleteFramebuffer(y.__webglMultisampledFramebuffer),y.__webglColorRenderbuffer)for(let V=0;V<y.__webglColorRenderbuffer.length;V++)y.__webglColorRenderbuffer[V]&&i.deleteRenderbuffer(y.__webglColorRenderbuffer[V]);y.__webglDepthRenderbuffer&&i.deleteRenderbuffer(y.__webglDepthRenderbuffer)}const k=w.textures;for(let V=0,te=k.length;V<te;V++){const j=n.get(k[V]);j.__webglTexture&&(i.deleteTexture(j.__webglTexture),o.memory.textures--),n.remove(k[V])}n.remove(w)}let T=0;function F(){T=0}function z(){const w=T;return w>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+w+" texture units while this GPU supports only "+s.maxTextures),T+=1,w}function H(w){const y=[];return y.push(w.wrapS),y.push(w.wrapT),y.push(w.wrapR||0),y.push(w.magFilter),y.push(w.minFilter),y.push(w.anisotropy),y.push(w.internalFormat),y.push(w.format),y.push(w.type),y.push(w.generateMipmaps),y.push(w.premultiplyAlpha),y.push(w.flipY),y.push(w.unpackAlignment),y.push(w.colorSpace),y.join()}function G(w,y){const k=n.get(w);if(w.isVideoTexture&&fe(w),w.isRenderTargetTexture===!1&&w.isExternalTexture!==!0&&w.version>0&&k.__version!==w.version){const V=w.image;if(V===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(V.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{ee(k,w,y);return}}else w.isExternalTexture&&(k.__webglTexture=w.sourceTexture?w.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,k.__webglTexture,i.TEXTURE0+y)}function q(w,y){const k=n.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&k.__version!==w.version){ee(k,w,y);return}t.bindTexture(i.TEXTURE_2D_ARRAY,k.__webglTexture,i.TEXTURE0+y)}function W(w,y){const k=n.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&k.__version!==w.version){ee(k,w,y);return}t.bindTexture(i.TEXTURE_3D,k.__webglTexture,i.TEXTURE0+y)}function Y(w,y){const k=n.get(w);if(w.version>0&&k.__version!==w.version){ae(k,w,y);return}t.bindTexture(i.TEXTURE_CUBE_MAP,k.__webglTexture,i.TEXTURE0+y)}const me={[aa]:i.REPEAT,[Ti]:i.CLAMP_TO_EDGE,[la]:i.MIRRORED_REPEAT},xe={[hn]:i.NEAREST,[ud]:i.NEAREST_MIPMAP_NEAREST,[tr]:i.NEAREST_MIPMAP_LINEAR,[gn]:i.LINEAR,[oo]:i.LINEAR_MIPMAP_NEAREST,[wi]:i.LINEAR_MIPMAP_LINEAR},De={[pd]:i.NEVER,[yd]:i.ALWAYS,[md]:i.LESS,[Tu]:i.LEQUAL,[gd]:i.EQUAL,[xd]:i.GEQUAL,[_d]:i.GREATER,[vd]:i.NOTEQUAL};function qe(w,y){if(y.type===An&&e.has("OES_texture_float_linear")===!1&&(y.magFilter===gn||y.magFilter===oo||y.magFilter===tr||y.magFilter===wi||y.minFilter===gn||y.minFilter===oo||y.minFilter===tr||y.minFilter===wi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(w,i.TEXTURE_WRAP_S,me[y.wrapS]),i.texParameteri(w,i.TEXTURE_WRAP_T,me[y.wrapT]),(w===i.TEXTURE_3D||w===i.TEXTURE_2D_ARRAY)&&i.texParameteri(w,i.TEXTURE_WRAP_R,me[y.wrapR]),i.texParameteri(w,i.TEXTURE_MAG_FILTER,xe[y.magFilter]),i.texParameteri(w,i.TEXTURE_MIN_FILTER,xe[y.minFilter]),y.compareFunction&&(i.texParameteri(w,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(w,i.TEXTURE_COMPARE_FUNC,De[y.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(y.magFilter===hn||y.minFilter!==tr&&y.minFilter!==wi||y.type===An&&e.has("OES_texture_float_linear")===!1)return;if(y.anisotropy>1||n.get(y).__currentAnisotropy){const k=e.get("EXT_texture_filter_anisotropic");i.texParameterf(w,k.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(y.anisotropy,s.getMaxAnisotropy())),n.get(y).__currentAnisotropy=y.anisotropy}}}function Qe(w,y){let k=!1;w.__webglInit===void 0&&(w.__webglInit=!0,y.addEventListener("dispose",R));const V=y.source;let te=d.get(V);te===void 0&&(te={},d.set(V,te));const j=H(y);if(j!==w.__cacheKey){te[j]===void 0&&(te[j]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,k=!0),te[j].usedTimes++;const Re=te[w.__cacheKey];Re!==void 0&&(te[w.__cacheKey].usedTimes--,Re.usedTimes===0&&b(y)),w.__cacheKey=j,w.__webglTexture=te[j].texture}return k}function lt(w,y,k){return Math.floor(Math.floor(w/k)/y)}function et(w,y,k,V){const j=w.updateRanges;if(j.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,y.width,y.height,k,V,y.data);else{j.sort((le,Ee)=>le.start-Ee.start);let Re=0;for(let le=1;le<j.length;le++){const Ee=j[Re],We=j[le],Oe=Ee.start+Ee.count,ye=lt(We.start,y.width,4),Ke=lt(Ee.start,y.width,4);We.start<=Oe+1&&ye===Ke&&lt(We.start+We.count-1,y.width,4)===ye?Ee.count=Math.max(Ee.count,We.start+We.count-Ee.start):(++Re,j[Re]=We)}j.length=Re+1;const de=i.getParameter(i.UNPACK_ROW_LENGTH),Pe=i.getParameter(i.UNPACK_SKIP_PIXELS),Le=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,y.width);for(let le=0,Ee=j.length;le<Ee;le++){const We=j[le],Oe=Math.floor(We.start/4),ye=Math.ceil(We.count/4),Ke=Oe%y.width,N=Math.floor(Oe/y.width),pe=ye,ve=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,Ke),i.pixelStorei(i.UNPACK_SKIP_ROWS,N),t.texSubImage2D(i.TEXTURE_2D,0,Ke,N,pe,ve,k,V,y.data)}w.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,de),i.pixelStorei(i.UNPACK_SKIP_PIXELS,Pe),i.pixelStorei(i.UNPACK_SKIP_ROWS,Le)}}function ee(w,y,k){let V=i.TEXTURE_2D;(y.isDataArrayTexture||y.isCompressedArrayTexture)&&(V=i.TEXTURE_2D_ARRAY),y.isData3DTexture&&(V=i.TEXTURE_3D);const te=Qe(w,y),j=y.source;t.bindTexture(V,w.__webglTexture,i.TEXTURE0+k);const Re=n.get(j);if(j.version!==Re.__version||te===!0){t.activeTexture(i.TEXTURE0+k);const de=dt.getPrimaries(dt.workingColorSpace),Pe=y.colorSpace===oi?null:dt.getPrimaries(y.colorSpace),Le=y.colorSpace===oi||de===Pe?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,y.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,y.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Le);let le=_(y.image,!1,s.maxTextureSize);le=Ie(y,le);const Ee=r.convert(y.format,y.colorSpace),We=r.convert(y.type);let Oe=E(y.internalFormat,Ee,We,y.colorSpace,y.isVideoTexture);qe(V,y);let ye;const Ke=y.mipmaps,N=y.isVideoTexture!==!0,pe=Re.__version===void 0||te===!0,ve=j.dataReady,Ue=D(y,le);if(y.isDepthTexture)Oe=x(y.format===Gs,y.type),pe&&(N?t.texStorage2D(i.TEXTURE_2D,1,Oe,le.width,le.height):t.texImage2D(i.TEXTURE_2D,0,Oe,le.width,le.height,0,Ee,We,null));else if(y.isDataTexture)if(Ke.length>0){N&&pe&&t.texStorage2D(i.TEXTURE_2D,Ue,Oe,Ke[0].width,Ke[0].height);for(let ue=0,re=Ke.length;ue<re;ue++)ye=Ke[ue],N?ve&&t.texSubImage2D(i.TEXTURE_2D,ue,0,0,ye.width,ye.height,Ee,We,ye.data):t.texImage2D(i.TEXTURE_2D,ue,Oe,ye.width,ye.height,0,Ee,We,ye.data);y.generateMipmaps=!1}else N?(pe&&t.texStorage2D(i.TEXTURE_2D,Ue,Oe,le.width,le.height),ve&&et(y,le,Ee,We)):t.texImage2D(i.TEXTURE_2D,0,Oe,le.width,le.height,0,Ee,We,le.data);else if(y.isCompressedTexture)if(y.isCompressedArrayTexture){N&&pe&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Ue,Oe,Ke[0].width,Ke[0].height,le.depth);for(let ue=0,re=Ke.length;ue<re;ue++)if(ye=Ke[ue],y.format!==En)if(Ee!==null)if(N){if(ve)if(y.layerUpdates.size>0){const ze=Tc(ye.width,ye.height,y.format,y.type);for(const Ye of y.layerUpdates){const gt=ye.data.subarray(Ye*ze/ye.data.BYTES_PER_ELEMENT,(Ye+1)*ze/ye.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ue,0,0,Ye,ye.width,ye.height,1,Ee,gt)}y.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ue,0,0,0,ye.width,ye.height,le.depth,Ee,ye.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,ue,Oe,ye.width,ye.height,le.depth,0,ye.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else N?ve&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,ue,0,0,0,ye.width,ye.height,le.depth,Ee,We,ye.data):t.texImage3D(i.TEXTURE_2D_ARRAY,ue,Oe,ye.width,ye.height,le.depth,0,Ee,We,ye.data)}else{N&&pe&&t.texStorage2D(i.TEXTURE_2D,Ue,Oe,Ke[0].width,Ke[0].height);for(let ue=0,re=Ke.length;ue<re;ue++)ye=Ke[ue],y.format!==En?Ee!==null?N?ve&&t.compressedTexSubImage2D(i.TEXTURE_2D,ue,0,0,ye.width,ye.height,Ee,ye.data):t.compressedTexImage2D(i.TEXTURE_2D,ue,Oe,ye.width,ye.height,0,ye.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):N?ve&&t.texSubImage2D(i.TEXTURE_2D,ue,0,0,ye.width,ye.height,Ee,We,ye.data):t.texImage2D(i.TEXTURE_2D,ue,Oe,ye.width,ye.height,0,Ee,We,ye.data)}else if(y.isDataArrayTexture)if(N){if(pe&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Ue,Oe,le.width,le.height,le.depth),ve)if(y.layerUpdates.size>0){const ue=Tc(le.width,le.height,y.format,y.type);for(const re of y.layerUpdates){const ze=le.data.subarray(re*ue/le.data.BYTES_PER_ELEMENT,(re+1)*ue/le.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,re,le.width,le.height,1,Ee,We,ze)}y.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,le.width,le.height,le.depth,Ee,We,le.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Oe,le.width,le.height,le.depth,0,Ee,We,le.data);else if(y.isData3DTexture)N?(pe&&t.texStorage3D(i.TEXTURE_3D,Ue,Oe,le.width,le.height,le.depth),ve&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,le.width,le.height,le.depth,Ee,We,le.data)):t.texImage3D(i.TEXTURE_3D,0,Oe,le.width,le.height,le.depth,0,Ee,We,le.data);else if(y.isFramebufferTexture){if(pe)if(N)t.texStorage2D(i.TEXTURE_2D,Ue,Oe,le.width,le.height);else{let ue=le.width,re=le.height;for(let ze=0;ze<Ue;ze++)t.texImage2D(i.TEXTURE_2D,ze,Oe,ue,re,0,Ee,We,null),ue>>=1,re>>=1}}else if(Ke.length>0){if(N&&pe){const ue=Se(Ke[0]);t.texStorage2D(i.TEXTURE_2D,Ue,Oe,ue.width,ue.height)}for(let ue=0,re=Ke.length;ue<re;ue++)ye=Ke[ue],N?ve&&t.texSubImage2D(i.TEXTURE_2D,ue,0,0,Ee,We,ye):t.texImage2D(i.TEXTURE_2D,ue,Oe,Ee,We,ye);y.generateMipmaps=!1}else if(N){if(pe){const ue=Se(le);t.texStorage2D(i.TEXTURE_2D,Ue,Oe,ue.width,ue.height)}ve&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,Ee,We,le)}else t.texImage2D(i.TEXTURE_2D,0,Oe,Ee,We,le);m(y)&&p(V),Re.__version=j.version,y.onUpdate&&y.onUpdate(y)}w.__version=y.version}function ae(w,y,k){if(y.image.length!==6)return;const V=Qe(w,y),te=y.source;t.bindTexture(i.TEXTURE_CUBE_MAP,w.__webglTexture,i.TEXTURE0+k);const j=n.get(te);if(te.version!==j.__version||V===!0){t.activeTexture(i.TEXTURE0+k);const Re=dt.getPrimaries(dt.workingColorSpace),de=y.colorSpace===oi?null:dt.getPrimaries(y.colorSpace),Pe=y.colorSpace===oi||Re===de?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,y.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,y.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Pe);const Le=y.isCompressedTexture||y.image[0].isCompressedTexture,le=y.image[0]&&y.image[0].isDataTexture,Ee=[];for(let re=0;re<6;re++)!Le&&!le?Ee[re]=_(y.image[re],!0,s.maxCubemapSize):Ee[re]=le?y.image[re].image:y.image[re],Ee[re]=Ie(y,Ee[re]);const We=Ee[0],Oe=r.convert(y.format,y.colorSpace),ye=r.convert(y.type),Ke=E(y.internalFormat,Oe,ye,y.colorSpace),N=y.isVideoTexture!==!0,pe=j.__version===void 0||V===!0,ve=te.dataReady;let Ue=D(y,We);qe(i.TEXTURE_CUBE_MAP,y);let ue;if(Le){N&&pe&&t.texStorage2D(i.TEXTURE_CUBE_MAP,Ue,Ke,We.width,We.height);for(let re=0;re<6;re++){ue=Ee[re].mipmaps;for(let ze=0;ze<ue.length;ze++){const Ye=ue[ze];y.format!==En?Oe!==null?N?ve&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,ze,0,0,Ye.width,Ye.height,Oe,Ye.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,ze,Ke,Ye.width,Ye.height,0,Ye.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):N?ve&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,ze,0,0,Ye.width,Ye.height,Oe,ye,Ye.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,ze,Ke,Ye.width,Ye.height,0,Oe,ye,Ye.data)}}}else{if(ue=y.mipmaps,N&&pe){ue.length>0&&Ue++;const re=Se(Ee[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,Ue,Ke,re.width,re.height)}for(let re=0;re<6;re++)if(le){N?ve&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,0,0,Ee[re].width,Ee[re].height,Oe,ye,Ee[re].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,Ke,Ee[re].width,Ee[re].height,0,Oe,ye,Ee[re].data);for(let ze=0;ze<ue.length;ze++){const gt=ue[ze].image[re].image;N?ve&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,ze+1,0,0,gt.width,gt.height,Oe,ye,gt.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,ze+1,Ke,gt.width,gt.height,0,Oe,ye,gt.data)}}else{N?ve&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,0,0,Oe,ye,Ee[re]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,Ke,Oe,ye,Ee[re]);for(let ze=0;ze<ue.length;ze++){const Ye=ue[ze];N?ve&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,ze+1,0,0,Oe,ye,Ye.image[re]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,ze+1,Ke,Oe,ye,Ye.image[re])}}}m(y)&&p(i.TEXTURE_CUBE_MAP),j.__version=te.version,y.onUpdate&&y.onUpdate(y)}w.__version=y.version}function Ae(w,y,k,V,te,j){const Re=r.convert(k.format,k.colorSpace),de=r.convert(k.type),Pe=E(k.internalFormat,Re,de,k.colorSpace),Le=n.get(y),le=n.get(k);if(le.__renderTarget=y,!Le.__hasExternalTextures){const Ee=Math.max(1,y.width>>j),We=Math.max(1,y.height>>j);te===i.TEXTURE_3D||te===i.TEXTURE_2D_ARRAY?t.texImage3D(te,j,Pe,Ee,We,y.depth,0,Re,de,null):t.texImage2D(te,j,Pe,Ee,We,0,Re,de,null)}t.bindFramebuffer(i.FRAMEBUFFER,w),J(y)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,V,te,le.__webglTexture,0,_e(y)):(te===i.TEXTURE_2D||te>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&te<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,V,te,le.__webglTexture,j),t.bindFramebuffer(i.FRAMEBUFFER,null)}function Be(w,y,k){if(i.bindRenderbuffer(i.RENDERBUFFER,w),y.depthBuffer){const V=y.depthTexture,te=V&&V.isDepthTexture?V.type:null,j=x(y.stencilBuffer,te),Re=y.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,de=_e(y);J(y)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,de,j,y.width,y.height):k?i.renderbufferStorageMultisample(i.RENDERBUFFER,de,j,y.width,y.height):i.renderbufferStorage(i.RENDERBUFFER,j,y.width,y.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Re,i.RENDERBUFFER,w)}else{const V=y.textures;for(let te=0;te<V.length;te++){const j=V[te],Re=r.convert(j.format,j.colorSpace),de=r.convert(j.type),Pe=E(j.internalFormat,Re,de,j.colorSpace),Le=_e(y);k&&J(y)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Le,Pe,y.width,y.height):J(y)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Le,Pe,y.width,y.height):i.renderbufferStorage(i.RENDERBUFFER,Pe,y.width,y.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Fe(w,y){if(y&&y.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,w),!(y.depthTexture&&y.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const V=n.get(y.depthTexture);V.__renderTarget=y,(!V.__webglTexture||y.depthTexture.image.width!==y.width||y.depthTexture.image.height!==y.height)&&(y.depthTexture.image.width=y.width,y.depthTexture.image.height=y.height,y.depthTexture.needsUpdate=!0),G(y.depthTexture,0);const te=V.__webglTexture,j=_e(y);if(y.depthTexture.format===Vs)J(y)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,te,0,j):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,te,0);else if(y.depthTexture.format===Gs)J(y)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,te,0,j):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,te,0);else throw new Error("Unknown depthTexture format")}function nt(w){const y=n.get(w),k=w.isWebGLCubeRenderTarget===!0;if(y.__boundDepthTexture!==w.depthTexture){const V=w.depthTexture;if(y.__depthDisposeCallback&&y.__depthDisposeCallback(),V){const te=()=>{delete y.__boundDepthTexture,delete y.__depthDisposeCallback,V.removeEventListener("dispose",te)};V.addEventListener("dispose",te),y.__depthDisposeCallback=te}y.__boundDepthTexture=V}if(w.depthTexture&&!y.__autoAllocateDepthBuffer){if(k)throw new Error("target.depthTexture not supported in Cube render targets");const V=w.texture.mipmaps;V&&V.length>0?Fe(y.__webglFramebuffer[0],w):Fe(y.__webglFramebuffer,w)}else if(k){y.__webglDepthbuffer=[];for(let V=0;V<6;V++)if(t.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer[V]),y.__webglDepthbuffer[V]===void 0)y.__webglDepthbuffer[V]=i.createRenderbuffer(),Be(y.__webglDepthbuffer[V],w,!1);else{const te=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,j=y.__webglDepthbuffer[V];i.bindRenderbuffer(i.RENDERBUFFER,j),i.framebufferRenderbuffer(i.FRAMEBUFFER,te,i.RENDERBUFFER,j)}}else{const V=w.texture.mipmaps;if(V&&V.length>0?t.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer),y.__webglDepthbuffer===void 0)y.__webglDepthbuffer=i.createRenderbuffer(),Be(y.__webglDepthbuffer,w,!1);else{const te=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,j=y.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,j),i.framebufferRenderbuffer(i.FRAMEBUFFER,te,i.RENDERBUFFER,j)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function je(w,y,k){const V=n.get(w);y!==void 0&&Ae(V.__webglFramebuffer,w,w.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),k!==void 0&&nt(w)}function U(w){const y=w.texture,k=n.get(w),V=n.get(y);w.addEventListener("dispose",C);const te=w.textures,j=w.isWebGLCubeRenderTarget===!0,Re=te.length>1;if(Re||(V.__webglTexture===void 0&&(V.__webglTexture=i.createTexture()),V.__version=y.version,o.memory.textures++),j){k.__webglFramebuffer=[];for(let de=0;de<6;de++)if(y.mipmaps&&y.mipmaps.length>0){k.__webglFramebuffer[de]=[];for(let Pe=0;Pe<y.mipmaps.length;Pe++)k.__webglFramebuffer[de][Pe]=i.createFramebuffer()}else k.__webglFramebuffer[de]=i.createFramebuffer()}else{if(y.mipmaps&&y.mipmaps.length>0){k.__webglFramebuffer=[];for(let de=0;de<y.mipmaps.length;de++)k.__webglFramebuffer[de]=i.createFramebuffer()}else k.__webglFramebuffer=i.createFramebuffer();if(Re)for(let de=0,Pe=te.length;de<Pe;de++){const Le=n.get(te[de]);Le.__webglTexture===void 0&&(Le.__webglTexture=i.createTexture(),o.memory.textures++)}if(w.samples>0&&J(w)===!1){k.__webglMultisampledFramebuffer=i.createFramebuffer(),k.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,k.__webglMultisampledFramebuffer);for(let de=0;de<te.length;de++){const Pe=te[de];k.__webglColorRenderbuffer[de]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,k.__webglColorRenderbuffer[de]);const Le=r.convert(Pe.format,Pe.colorSpace),le=r.convert(Pe.type),Ee=E(Pe.internalFormat,Le,le,Pe.colorSpace,w.isXRRenderTarget===!0),We=_e(w);i.renderbufferStorageMultisample(i.RENDERBUFFER,We,Ee,w.width,w.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+de,i.RENDERBUFFER,k.__webglColorRenderbuffer[de])}i.bindRenderbuffer(i.RENDERBUFFER,null),w.depthBuffer&&(k.__webglDepthRenderbuffer=i.createRenderbuffer(),Be(k.__webglDepthRenderbuffer,w,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(j){t.bindTexture(i.TEXTURE_CUBE_MAP,V.__webglTexture),qe(i.TEXTURE_CUBE_MAP,y);for(let de=0;de<6;de++)if(y.mipmaps&&y.mipmaps.length>0)for(let Pe=0;Pe<y.mipmaps.length;Pe++)Ae(k.__webglFramebuffer[de][Pe],w,y,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+de,Pe);else Ae(k.__webglFramebuffer[de],w,y,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+de,0);m(y)&&p(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Re){for(let de=0,Pe=te.length;de<Pe;de++){const Le=te[de],le=n.get(Le);let Ee=i.TEXTURE_2D;(w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(Ee=w.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(Ee,le.__webglTexture),qe(Ee,Le),Ae(k.__webglFramebuffer,w,Le,i.COLOR_ATTACHMENT0+de,Ee,0),m(Le)&&p(Ee)}t.unbindTexture()}else{let de=i.TEXTURE_2D;if((w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(de=w.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(de,V.__webglTexture),qe(de,y),y.mipmaps&&y.mipmaps.length>0)for(let Pe=0;Pe<y.mipmaps.length;Pe++)Ae(k.__webglFramebuffer[Pe],w,y,i.COLOR_ATTACHMENT0,de,Pe);else Ae(k.__webglFramebuffer,w,y,i.COLOR_ATTACHMENT0,de,0);m(y)&&p(de),t.unbindTexture()}w.depthBuffer&&nt(w)}function se(w){const y=w.textures;for(let k=0,V=y.length;k<V;k++){const te=y[k];if(m(te)){const j=A(w),Re=n.get(te).__webglTexture;t.bindTexture(j,Re),p(j),t.unbindTexture()}}}const Q=[],ne=[];function ie(w){if(w.samples>0){if(J(w)===!1){const y=w.textures,k=w.width,V=w.height;let te=i.COLOR_BUFFER_BIT;const j=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Re=n.get(w),de=y.length>1;if(de)for(let Le=0;Le<y.length;Le++)t.bindFramebuffer(i.FRAMEBUFFER,Re.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Le,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,Re.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Le,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,Re.__webglMultisampledFramebuffer);const Pe=w.texture.mipmaps;Pe&&Pe.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Re.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Re.__webglFramebuffer);for(let Le=0;Le<y.length;Le++){if(w.resolveDepthBuffer&&(w.depthBuffer&&(te|=i.DEPTH_BUFFER_BIT),w.stencilBuffer&&w.resolveStencilBuffer&&(te|=i.STENCIL_BUFFER_BIT)),de){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Re.__webglColorRenderbuffer[Le]);const le=n.get(y[Le]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,le,0)}i.blitFramebuffer(0,0,k,V,0,0,k,V,te,i.NEAREST),c===!0&&(Q.length=0,ne.length=0,Q.push(i.COLOR_ATTACHMENT0+Le),w.depthBuffer&&w.resolveDepthBuffer===!1&&(Q.push(j),ne.push(j),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,ne)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Q))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),de)for(let Le=0;Le<y.length;Le++){t.bindFramebuffer(i.FRAMEBUFFER,Re.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Le,i.RENDERBUFFER,Re.__webglColorRenderbuffer[Le]);const le=n.get(y[Le]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,Re.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Le,i.TEXTURE_2D,le,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Re.__webglMultisampledFramebuffer)}else if(w.depthBuffer&&w.resolveDepthBuffer===!1&&c){const y=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[y])}}}function _e(w){return Math.min(s.maxSamples,w.samples)}function J(w){const y=n.get(w);return w.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&y.__useRenderToTexture!==!1}function fe(w){const y=o.render.frame;u.get(w)!==y&&(u.set(w,y),w.update())}function Ie(w,y){const k=w.colorSpace,V=w.format,te=w.type;return w.isCompressedTexture===!0||w.isVideoTexture===!0||k!==ds&&k!==oi&&(dt.getTransfer(k)===vt?(V!==En||te!==Cn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",k)),y}function Se(w){return typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement?(l.width=w.naturalWidth||w.width,l.height=w.naturalHeight||w.height):typeof VideoFrame<"u"&&w instanceof VideoFrame?(l.width=w.displayWidth,l.height=w.displayHeight):(l.width=w.width,l.height=w.height),l}this.allocateTextureUnit=z,this.resetTextureUnits=F,this.setTexture2D=G,this.setTexture2DArray=q,this.setTexture3D=W,this.setTextureCube=Y,this.rebindTextures=je,this.setupRenderTarget=U,this.updateRenderTargetMipmap=se,this.updateMultisampleRenderTarget=ie,this.setupDepthRenderbuffer=nt,this.setupFrameBufferTexture=Ae,this.useMultisampledRTT=J}function O0(i,e){function t(n,s=oi){let r;const o=dt.getTransfer(s);if(n===Cn)return i.UNSIGNED_BYTE;if(n===Ja)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Qa)return i.UNSIGNED_SHORT_5_5_5_1;if(n===xu)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===yu)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===_u)return i.BYTE;if(n===vu)return i.SHORT;if(n===ks)return i.UNSIGNED_SHORT;if(n===Za)return i.INT;if(n===Ri)return i.UNSIGNED_INT;if(n===An)return i.FLOAT;if(n===Ks)return i.HALF_FLOAT;if(n===Mu)return i.ALPHA;if(n===Su)return i.RGB;if(n===En)return i.RGBA;if(n===Vs)return i.DEPTH_COMPONENT;if(n===Gs)return i.DEPTH_STENCIL;if(n===el)return i.RED;if(n===tl)return i.RED_INTEGER;if(n===Eu)return i.RG;if(n===nl)return i.RG_INTEGER;if(n===il)return i.RGBA_INTEGER;if(n===Ir||n===Ur||n===Nr||n===Fr)if(o===vt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Ir)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Ur)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Nr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Fr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Ir)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Ur)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Nr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Fr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===ca||n===ua||n===ha||n===da)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===ca)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===ua)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===ha)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===da)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===fa||n===pa||n===ma)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===fa||n===pa)return o===vt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===ma)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===ga||n===_a||n===va||n===xa||n===ya||n===Ma||n===Sa||n===Ea||n===ba||n===Ta||n===wa||n===Aa||n===Ra||n===Ca)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===ga)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===_a)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===va)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===xa)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===ya)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Ma)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Sa)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Ea)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===ba)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Ta)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===wa)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Aa)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Ra)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Ca)return o===vt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Pa||n===La||n===Da)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===Pa)return o===vt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===La)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Da)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Ia||n===Ua||n===Na||n===Fa)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===Ia)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Ua)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Na)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Fa)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Hs?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}const B0=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,z0=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class k0{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new Ou(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new $n({vertexShader:B0,fragmentShader:z0,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new $t(new qr(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class H0 extends Di{constructor(e,t){super();const n=this;let s=null,r=1,o=null,a="local-floor",c=1,l=null,u=null,h=null,d=null,f=null,g=null;const _=typeof XRWebGLBinding<"u",m=new k0,p={},A=t.getContextAttributes();let E=null,x=null;const D=[],R=[],C=new ge;let I=null;const b=new Qt;b.viewport=new yt;const M=new Qt;M.viewport=new yt;const T=[b,M],F=new ap;let z=null,H=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(ee){let ae=D[ee];return ae===void 0&&(ae=new Ro,D[ee]=ae),ae.getTargetRaySpace()},this.getControllerGrip=function(ee){let ae=D[ee];return ae===void 0&&(ae=new Ro,D[ee]=ae),ae.getGripSpace()},this.getHand=function(ee){let ae=D[ee];return ae===void 0&&(ae=new Ro,D[ee]=ae),ae.getHandSpace()};function G(ee){const ae=R.indexOf(ee.inputSource);if(ae===-1)return;const Ae=D[ae];Ae!==void 0&&(Ae.update(ee.inputSource,ee.frame,l||o),Ae.dispatchEvent({type:ee.type,data:ee.inputSource}))}function q(){s.removeEventListener("select",G),s.removeEventListener("selectstart",G),s.removeEventListener("selectend",G),s.removeEventListener("squeeze",G),s.removeEventListener("squeezestart",G),s.removeEventListener("squeezeend",G),s.removeEventListener("end",q),s.removeEventListener("inputsourceschange",W);for(let ee=0;ee<D.length;ee++){const ae=R[ee];ae!==null&&(R[ee]=null,D[ee].disconnect(ae))}z=null,H=null,m.reset();for(const ee in p)delete p[ee];e.setRenderTarget(E),f=null,d=null,h=null,s=null,x=null,et.stop(),n.isPresenting=!1,e.setPixelRatio(I),e.setSize(C.width,C.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(ee){r=ee,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(ee){a=ee,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(ee){l=ee},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return h===null&&_&&(h=new XRWebGLBinding(s,t)),h},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(ee){if(s=ee,s!==null){if(E=e.getRenderTarget(),s.addEventListener("select",G),s.addEventListener("selectstart",G),s.addEventListener("selectend",G),s.addEventListener("squeeze",G),s.addEventListener("squeezestart",G),s.addEventListener("squeezeend",G),s.addEventListener("end",q),s.addEventListener("inputsourceschange",W),A.xrCompatible!==!0&&await t.makeXRCompatible(),I=e.getPixelRatio(),e.getSize(C),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let Ae=null,Be=null,Fe=null;A.depth&&(Fe=A.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Ae=A.stencil?Gs:Vs,Be=A.stencil?Hs:Ri);const nt={colorFormat:t.RGBA8,depthFormat:Fe,scaleFactor:r};h=this.getBinding(),d=h.createProjectionLayer(nt),s.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),x=new Ci(d.textureWidth,d.textureHeight,{format:En,type:Cn,depthTexture:new Fu(d.textureWidth,d.textureHeight,Be,void 0,void 0,void 0,void 0,void 0,void 0,Ae),stencilBuffer:A.stencil,colorSpace:e.outputColorSpace,samples:A.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const Ae={antialias:A.antialias,alpha:!0,depth:A.depth,stencil:A.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,t,Ae),s.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),x=new Ci(f.framebufferWidth,f.framebufferHeight,{format:En,type:Cn,colorSpace:e.outputColorSpace,stencilBuffer:A.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await s.requestReferenceSpace(a),et.setContext(s),et.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function W(ee){for(let ae=0;ae<ee.removed.length;ae++){const Ae=ee.removed[ae],Be=R.indexOf(Ae);Be>=0&&(R[Be]=null,D[Be].disconnect(Ae))}for(let ae=0;ae<ee.added.length;ae++){const Ae=ee.added[ae];let Be=R.indexOf(Ae);if(Be===-1){for(let nt=0;nt<D.length;nt++)if(nt>=R.length){R.push(Ae),Be=nt;break}else if(R[nt]===null){R[nt]=Ae,Be=nt;break}if(Be===-1)break}const Fe=D[Be];Fe&&Fe.connect(Ae)}}const Y=new L,me=new L;function xe(ee,ae,Ae){Y.setFromMatrixPosition(ae.matrixWorld),me.setFromMatrixPosition(Ae.matrixWorld);const Be=Y.distanceTo(me),Fe=ae.projectionMatrix.elements,nt=Ae.projectionMatrix.elements,je=Fe[14]/(Fe[10]-1),U=Fe[14]/(Fe[10]+1),se=(Fe[9]+1)/Fe[5],Q=(Fe[9]-1)/Fe[5],ne=(Fe[8]-1)/Fe[0],ie=(nt[8]+1)/nt[0],_e=je*ne,J=je*ie,fe=Be/(-ne+ie),Ie=fe*-ne;if(ae.matrixWorld.decompose(ee.position,ee.quaternion,ee.scale),ee.translateX(Ie),ee.translateZ(fe),ee.matrixWorld.compose(ee.position,ee.quaternion,ee.scale),ee.matrixWorldInverse.copy(ee.matrixWorld).invert(),Fe[10]===-1)ee.projectionMatrix.copy(ae.projectionMatrix),ee.projectionMatrixInverse.copy(ae.projectionMatrixInverse);else{const Se=je+fe,w=U+fe,y=_e-Ie,k=J+(Be-Ie),V=se*U/w*Se,te=Q*U/w*Se;ee.projectionMatrix.makePerspective(y,k,V,te,Se,w),ee.projectionMatrixInverse.copy(ee.projectionMatrix).invert()}}function De(ee,ae){ae===null?ee.matrixWorld.copy(ee.matrix):ee.matrixWorld.multiplyMatrices(ae.matrixWorld,ee.matrix),ee.matrixWorldInverse.copy(ee.matrixWorld).invert()}this.updateCamera=function(ee){if(s===null)return;let ae=ee.near,Ae=ee.far;m.texture!==null&&(m.depthNear>0&&(ae=m.depthNear),m.depthFar>0&&(Ae=m.depthFar)),F.near=M.near=b.near=ae,F.far=M.far=b.far=Ae,(z!==F.near||H!==F.far)&&(s.updateRenderState({depthNear:F.near,depthFar:F.far}),z=F.near,H=F.far),F.layers.mask=ee.layers.mask|6,b.layers.mask=F.layers.mask&3,M.layers.mask=F.layers.mask&5;const Be=ee.parent,Fe=F.cameras;De(F,Be);for(let nt=0;nt<Fe.length;nt++)De(Fe[nt],Be);Fe.length===2?xe(F,b,M):F.projectionMatrix.copy(b.projectionMatrix),qe(ee,F,Be)};function qe(ee,ae,Ae){Ae===null?ee.matrix.copy(ae.matrixWorld):(ee.matrix.copy(Ae.matrixWorld),ee.matrix.invert(),ee.matrix.multiply(ae.matrixWorld)),ee.matrix.decompose(ee.position,ee.quaternion,ee.scale),ee.updateMatrixWorld(!0),ee.projectionMatrix.copy(ae.projectionMatrix),ee.projectionMatrixInverse.copy(ae.projectionMatrixInverse),ee.isPerspectiveCamera&&(ee.fov=fs*2*Math.atan(1/ee.projectionMatrix.elements[5]),ee.zoom=1)}this.getCamera=function(){return F},this.getFoveation=function(){if(!(d===null&&f===null))return c},this.setFoveation=function(ee){c=ee,d!==null&&(d.fixedFoveation=ee),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=ee)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(F)},this.getCameraTexture=function(ee){return p[ee]};let Qe=null;function lt(ee,ae){if(u=ae.getViewerPose(l||o),g=ae,u!==null){const Ae=u.views;f!==null&&(e.setRenderTargetFramebuffer(x,f.framebuffer),e.setRenderTarget(x));let Be=!1;Ae.length!==F.cameras.length&&(F.cameras.length=0,Be=!0);for(let U=0;U<Ae.length;U++){const se=Ae[U];let Q=null;if(f!==null)Q=f.getViewport(se);else{const ie=h.getViewSubImage(d,se);Q=ie.viewport,U===0&&(e.setRenderTargetTextures(x,ie.colorTexture,ie.depthStencilTexture),e.setRenderTarget(x))}let ne=T[U];ne===void 0&&(ne=new Qt,ne.layers.enable(U),ne.viewport=new yt,T[U]=ne),ne.matrix.fromArray(se.transform.matrix),ne.matrix.decompose(ne.position,ne.quaternion,ne.scale),ne.projectionMatrix.fromArray(se.projectionMatrix),ne.projectionMatrixInverse.copy(ne.projectionMatrix).invert(),ne.viewport.set(Q.x,Q.y,Q.width,Q.height),U===0&&(F.matrix.copy(ne.matrix),F.matrix.decompose(F.position,F.quaternion,F.scale)),Be===!0&&F.cameras.push(ne)}const Fe=s.enabledFeatures;if(Fe&&Fe.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&_){h=n.getBinding();const U=h.getDepthInformation(Ae[0]);U&&U.isValid&&U.texture&&m.init(U,s.renderState)}if(Fe&&Fe.includes("camera-access")&&_){e.state.unbindTexture(),h=n.getBinding();for(let U=0;U<Ae.length;U++){const se=Ae[U].camera;if(se){let Q=p[se];Q||(Q=new Ou,p[se]=Q);const ne=h.getCameraImage(se);Q.sourceTexture=ne}}}}for(let Ae=0;Ae<D.length;Ae++){const Be=R[Ae],Fe=D[Ae];Be!==null&&Fe!==void 0&&Fe.update(Be,ae,l||o)}Qe&&Qe(ee,ae),ae.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ae}),g=null}const et=new Qu;et.setAnimationLoop(lt),this.setAnimationLoop=function(ee){Qe=ee},this.dispose=function(){}}}const Mi=new bn,V0=new pt;function G0(i,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,Lu(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,A,E,x){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(m,p):p.isMeshToonMaterial?(r(m,p),h(m,p)):p.isMeshPhongMaterial?(r(m,p),u(m,p)):p.isMeshStandardMaterial?(r(m,p),d(m,p),p.isMeshPhysicalMaterial&&f(m,p,x)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),_(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?c(m,p,A,E):p.isSpriteMaterial?l(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===tn&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===tn&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const A=e.get(p),E=A.envMap,x=A.envMapRotation;E&&(m.envMap.value=E,Mi.copy(x),Mi.x*=-1,Mi.y*=-1,Mi.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(Mi.y*=-1,Mi.z*=-1),m.envMapRotation.value.setFromMatrix4(V0.makeRotationFromEuler(Mi)),m.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,A,E){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*A,m.scale.value=E*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function u(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function h(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,A){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===tn&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=A.texture,m.transmissionSamplerSize.value.set(A.width,A.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function _(m,p){const A=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(A.matrixWorld),m.nearDistance.value=A.shadow.camera.near,m.farDistance.value=A.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function W0(i,e,t,n){let s={},r={},o=[];const a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(A,E){const x=E.program;n.uniformBlockBinding(A,x)}function l(A,E){let x=s[A.id];x===void 0&&(g(A),x=u(A),s[A.id]=x,A.addEventListener("dispose",m));const D=E.program;n.updateUBOMapping(A,D);const R=e.render.frame;r[A.id]!==R&&(d(A),r[A.id]=R)}function u(A){const E=h();A.__bindingPointIndex=E;const x=i.createBuffer(),D=A.__size,R=A.usage;return i.bindBuffer(i.UNIFORM_BUFFER,x),i.bufferData(i.UNIFORM_BUFFER,D,R),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,E,x),x}function h(){for(let A=0;A<a;A++)if(o.indexOf(A)===-1)return o.push(A),A;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(A){const E=s[A.id],x=A.uniforms,D=A.__cache;i.bindBuffer(i.UNIFORM_BUFFER,E);for(let R=0,C=x.length;R<C;R++){const I=Array.isArray(x[R])?x[R]:[x[R]];for(let b=0,M=I.length;b<M;b++){const T=I[b];if(f(T,R,b,D)===!0){const F=T.__offset,z=Array.isArray(T.value)?T.value:[T.value];let H=0;for(let G=0;G<z.length;G++){const q=z[G],W=_(q);typeof q=="number"||typeof q=="boolean"?(T.__data[0]=q,i.bufferSubData(i.UNIFORM_BUFFER,F+H,T.__data)):q.isMatrix3?(T.__data[0]=q.elements[0],T.__data[1]=q.elements[1],T.__data[2]=q.elements[2],T.__data[3]=0,T.__data[4]=q.elements[3],T.__data[5]=q.elements[4],T.__data[6]=q.elements[5],T.__data[7]=0,T.__data[8]=q.elements[6],T.__data[9]=q.elements[7],T.__data[10]=q.elements[8],T.__data[11]=0):(q.toArray(T.__data,H),H+=W.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,F,T.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(A,E,x,D){const R=A.value,C=E+"_"+x;if(D[C]===void 0)return typeof R=="number"||typeof R=="boolean"?D[C]=R:D[C]=R.clone(),!0;{const I=D[C];if(typeof R=="number"||typeof R=="boolean"){if(I!==R)return D[C]=R,!0}else if(I.equals(R)===!1)return I.copy(R),!0}return!1}function g(A){const E=A.uniforms;let x=0;const D=16;for(let C=0,I=E.length;C<I;C++){const b=Array.isArray(E[C])?E[C]:[E[C]];for(let M=0,T=b.length;M<T;M++){const F=b[M],z=Array.isArray(F.value)?F.value:[F.value];for(let H=0,G=z.length;H<G;H++){const q=z[H],W=_(q),Y=x%D,me=Y%W.boundary,xe=Y+me;x+=me,xe!==0&&D-xe<W.storage&&(x+=D-xe),F.__data=new Float32Array(W.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=x,x+=W.storage}}}const R=x%D;return R>0&&(x+=D-R),A.__size=x,A.__cache={},this}function _(A){const E={boundary:0,storage:0};return typeof A=="number"||typeof A=="boolean"?(E.boundary=4,E.storage=4):A.isVector2?(E.boundary=8,E.storage=8):A.isVector3||A.isColor?(E.boundary=16,E.storage=12):A.isVector4?(E.boundary=16,E.storage=16):A.isMatrix3?(E.boundary=48,E.storage=48):A.isMatrix4?(E.boundary=64,E.storage=64):A.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",A),E}function m(A){const E=A.target;E.removeEventListener("dispose",m);const x=o.indexOf(E.__bindingPointIndex);o.splice(x,1),i.deleteBuffer(s[E.id]),delete s[E.id],delete r[E.id]}function p(){for(const A in s)i.deleteBuffer(s[A]);o=[],s={},r={}}return{bind:c,update:l,dispose:p}}class X0{constructor(e={}){const{canvas:t=Bd(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1,reversedDepthBuffer:d=!1}=e;this.isWebGLRenderer=!0;let f;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=n.getContextAttributes().alpha}else f=o;const g=new Uint32Array(4),_=new Int32Array(4);let m=null,p=null;const A=[],E=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=li,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const x=this;let D=!1;this._outputColorSpace=un;let R=0,C=0,I=null,b=-1,M=null;const T=new yt,F=new yt;let z=null;const H=new $e(0);let G=0,q=t.width,W=t.height,Y=1,me=null,xe=null;const De=new yt(0,0,q,W),qe=new yt(0,0,q,W);let Qe=!1;const lt=new cl;let et=!1,ee=!1;const ae=new pt,Ae=new L,Be=new yt,Fe={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let nt=!1;function je(){return I===null?Y:1}let U=n;function se(S,O){return t.getContext(S,O)}try{const S={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Ka}`),t.addEventListener("webglcontextlost",ve,!1),t.addEventListener("webglcontextrestored",Ue,!1),t.addEventListener("webglcontextcreationerror",ue,!1),U===null){const O="webgl2";if(U=se(O,S),U===null)throw se(O)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(S){throw console.error("THREE.WebGLRenderer: "+S.message),S}let Q,ne,ie,_e,J,fe,Ie,Se,w,y,k,V,te,j,Re,de,Pe,Le,le,Ee,We,Oe,ye,Ke;function N(){Q=new t_(U),Q.init(),Oe=new O0(U,Q),ne=new $g(U,Q,e,Oe),ie=new N0(U,Q),ne.reversedDepthBuffer&&d&&ie.buffers.depth.setReversed(!0),_e=new s_(U),J=new S0,fe=new F0(U,Q,ie,J,ne,Oe,_e),Ie=new jg(x),Se=new e_(x),w=new up(U),ye=new Yg(U,w),y=new n_(U,w,_e,ye),k=new o_(U,y,w,_e),le=new r_(U,ne,fe),de=new Kg(J),V=new M0(x,Ie,Se,Q,ne,ye,de),te=new G0(x,J),j=new b0,Re=new P0(Q),Le=new Xg(x,Ie,Se,ie,k,f,c),Pe=new I0(x,k,ne),Ke=new W0(U,_e,ne,ie),Ee=new qg(U,Q,_e),We=new i_(U,Q,_e),_e.programs=V.programs,x.capabilities=ne,x.extensions=Q,x.properties=J,x.renderLists=j,x.shadowMap=Pe,x.state=ie,x.info=_e}N();const pe=new H0(x,U);this.xr=pe,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){const S=Q.get("WEBGL_lose_context");S&&S.loseContext()},this.forceContextRestore=function(){const S=Q.get("WEBGL_lose_context");S&&S.restoreContext()},this.getPixelRatio=function(){return Y},this.setPixelRatio=function(S){S!==void 0&&(Y=S,this.setSize(q,W,!1))},this.getSize=function(S){return S.set(q,W)},this.setSize=function(S,O,K=!0){if(pe.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}q=S,W=O,t.width=Math.floor(S*Y),t.height=Math.floor(O*Y),K===!0&&(t.style.width=S+"px",t.style.height=O+"px"),this.setViewport(0,0,S,O)},this.getDrawingBufferSize=function(S){return S.set(q*Y,W*Y).floor()},this.setDrawingBufferSize=function(S,O,K){q=S,W=O,Y=K,t.width=Math.floor(S*K),t.height=Math.floor(O*K),this.setViewport(0,0,S,O)},this.getCurrentViewport=function(S){return S.copy(T)},this.getViewport=function(S){return S.copy(De)},this.setViewport=function(S,O,K,$){S.isVector4?De.set(S.x,S.y,S.z,S.w):De.set(S,O,K,$),ie.viewport(T.copy(De).multiplyScalar(Y).round())},this.getScissor=function(S){return S.copy(qe)},this.setScissor=function(S,O,K,$){S.isVector4?qe.set(S.x,S.y,S.z,S.w):qe.set(S,O,K,$),ie.scissor(F.copy(qe).multiplyScalar(Y).round())},this.getScissorTest=function(){return Qe},this.setScissorTest=function(S){ie.setScissorTest(Qe=S)},this.setOpaqueSort=function(S){me=S},this.setTransparentSort=function(S){xe=S},this.getClearColor=function(S){return S.copy(Le.getClearColor())},this.setClearColor=function(){Le.setClearColor(...arguments)},this.getClearAlpha=function(){return Le.getClearAlpha()},this.setClearAlpha=function(){Le.setClearAlpha(...arguments)},this.clear=function(S=!0,O=!0,K=!0){let $=0;if(S){let B=!1;if(I!==null){const ce=I.texture.format;B=ce===il||ce===nl||ce===tl}if(B){const ce=I.texture.type,he=ce===Cn||ce===Ri||ce===ks||ce===Hs||ce===Ja||ce===Qa,we=Le.getClearColor(),Te=Le.getClearAlpha(),Xe=we.r,Ve=we.g,ke=we.b;he?(g[0]=Xe,g[1]=Ve,g[2]=ke,g[3]=Te,U.clearBufferuiv(U.COLOR,0,g)):(_[0]=Xe,_[1]=Ve,_[2]=ke,_[3]=Te,U.clearBufferiv(U.COLOR,0,_))}else $|=U.COLOR_BUFFER_BIT}O&&($|=U.DEPTH_BUFFER_BIT),K&&($|=U.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),U.clear($)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",ve,!1),t.removeEventListener("webglcontextrestored",Ue,!1),t.removeEventListener("webglcontextcreationerror",ue,!1),Le.dispose(),j.dispose(),Re.dispose(),J.dispose(),Ie.dispose(),Se.dispose(),k.dispose(),ye.dispose(),Ke.dispose(),V.dispose(),pe.dispose(),pe.removeEventListener("sessionstart",dn),pe.removeEventListener("sessionend",Ui),Ln.stop()};function ve(S){S.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),D=!0}function Ue(){console.log("THREE.WebGLRenderer: Context Restored."),D=!1;const S=_e.autoReset,O=Pe.enabled,K=Pe.autoUpdate,$=Pe.needsUpdate,B=Pe.type;N(),_e.autoReset=S,Pe.enabled=O,Pe.autoUpdate=K,Pe.needsUpdate=$,Pe.type=B}function ue(S){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",S.statusMessage)}function re(S){const O=S.target;O.removeEventListener("dispose",re),ze(O)}function ze(S){Ye(S),J.remove(S)}function Ye(S){const O=J.get(S).programs;O!==void 0&&(O.forEach(function(K){V.releaseProgram(K)}),S.isShaderMaterial&&V.releaseShaderCache(S))}this.renderBufferDirect=function(S,O,K,$,B,ce){O===null&&(O=Fe);const he=B.isMesh&&B.matrixWorld.determinant()<0,we=ys(S,O,K,$,B);ie.setMaterial($,he);let Te=K.index,Xe=1;if($.wireframe===!0){if(Te=y.getWireframeAttribute(K),Te===void 0)return;Xe=2}const Ve=K.drawRange,ke=K.attributes.position;let rt=Ve.start*Xe,ct=(Ve.start+Ve.count)*Xe;ce!==null&&(rt=Math.max(rt,ce.start*Xe),ct=Math.min(ct,(ce.start+ce.count)*Xe)),Te!==null?(rt=Math.max(rt,0),ct=Math.min(ct,Te.count)):ke!=null&&(rt=Math.max(rt,0),ct=Math.min(ct,ke.count));const ot=ct-rt;if(ot<0||ot===1/0)return;ye.setup(B,$,we,K,Te);let ht,ut=Ee;if(Te!==null&&(ht=w.get(Te),ut=We,ut.setIndex(ht)),B.isMesh)$.wireframe===!0?(ie.setLineWidth($.wireframeLinewidth*je()),ut.setMode(U.LINES)):ut.setMode(U.TRIANGLES);else if(B.isLine){let Ne=$.linewidth;Ne===void 0&&(Ne=1),ie.setLineWidth(Ne*je()),B.isLineSegments?ut.setMode(U.LINES):B.isLineLoop?ut.setMode(U.LINE_LOOP):ut.setMode(U.LINE_STRIP)}else B.isPoints?ut.setMode(U.POINTS):B.isSprite&&ut.setMode(U.TRIANGLES);if(B.isBatchedMesh)if(B._multiDrawInstances!==null)Ws("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),ut.renderMultiDrawInstances(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount,B._multiDrawInstances);else if(Q.get("WEBGL_multi_draw"))ut.renderMultiDraw(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount);else{const Ne=B._multiDrawStarts,ft=B._multiDrawCounts,at=B._multiDrawCount,zt=Te?w.get(Te).bytesPerElement:1,Dn=J.get($).currentProgram.getUniforms();for(let Ct=0;Ct<at;Ct++)Dn.setValue(U,"_gl_DrawID",Ct),ut.render(Ne[Ct]/zt,ft[Ct])}else if(B.isInstancedMesh)ut.renderInstances(rt,ot,B.count);else if(K.isInstancedBufferGeometry){const Ne=K._maxInstanceCount!==void 0?K._maxInstanceCount:1/0,ft=Math.min(K.instanceCount,Ne);ut.renderInstances(rt,ot,ft)}else ut.render(rt,ot)};function gt(S,O,K){S.transparent===!0&&S.side===wn&&S.forceSinglePass===!1?(S.side=tn,S.needsUpdate=!0,Kn(S,O,K),S.side=ci,S.needsUpdate=!0,Kn(S,O,K),S.side=wn):Kn(S,O,K)}this.compile=function(S,O,K=null){K===null&&(K=S),p=Re.get(K),p.init(O),E.push(p),K.traverseVisible(function(B){B.isLight&&B.layers.test(O.layers)&&(p.pushLight(B),B.castShadow&&p.pushShadow(B))}),S!==K&&S.traverseVisible(function(B){B.isLight&&B.layers.test(O.layers)&&(p.pushLight(B),B.castShadow&&p.pushShadow(B))}),p.setupLights();const $=new Set;return S.traverse(function(B){if(!(B.isMesh||B.isPoints||B.isLine||B.isSprite))return;const ce=B.material;if(ce)if(Array.isArray(ce))for(let he=0;he<ce.length;he++){const we=ce[he];gt(we,K,B),$.add(we)}else gt(ce,K,B),$.add(ce)}),p=E.pop(),$},this.compileAsync=function(S,O,K=null){const $=this.compile(S,O,K);return new Promise(B=>{function ce(){if($.forEach(function(he){J.get(he).currentProgram.isReady()&&$.delete(he)}),$.size===0){B(S);return}setTimeout(ce,10)}Q.get("KHR_parallel_shader_compile")!==null?ce():setTimeout(ce,10)})};let Ze=null;function sn(S){Ze&&Ze(S)}function dn(){Ln.stop()}function Ui(){Ln.start()}const Ln=new Qu;Ln.setAnimationLoop(sn),typeof self<"u"&&Ln.setContext(self),this.setAnimationLoop=function(S){Ze=S,pe.setAnimationLoop(S),S===null?Ln.stop():Ln.start()},pe.addEventListener("sessionstart",dn),pe.addEventListener("sessionend",Ui),this.render=function(S,O){if(O!==void 0&&O.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(D===!0)return;if(S.matrixWorldAutoUpdate===!0&&S.updateMatrixWorld(),O.parent===null&&O.matrixWorldAutoUpdate===!0&&O.updateMatrixWorld(),pe.enabled===!0&&pe.isPresenting===!0&&(pe.cameraAutoUpdate===!0&&pe.updateCamera(O),O=pe.getCamera()),S.isScene===!0&&S.onBeforeRender(x,S,O,I),p=Re.get(S,E.length),p.init(O),E.push(p),ae.multiplyMatrices(O.projectionMatrix,O.matrixWorldInverse),lt.setFromProjectionMatrix(ae,Rn,O.reversedDepth),ee=this.localClippingEnabled,et=de.init(this.clippingPlanes,ee),m=j.get(S,A.length),m.init(),A.push(m),pe.enabled===!0&&pe.isPresenting===!0){const ce=x.xr.getDepthSensingMesh();ce!==null&&rn(ce,O,-1/0,x.sortObjects)}rn(S,O,0,x.sortObjects),m.finish(),x.sortObjects===!0&&m.sort(me,xe),nt=pe.enabled===!1||pe.isPresenting===!1||pe.hasDepthSensing()===!1,nt&&Le.addToRenderList(m,S),this.info.render.frame++,et===!0&&de.beginShadows();const K=p.state.shadowsArray;Pe.render(K,S,O),et===!0&&de.endShadows(),this.info.autoReset===!0&&this.info.reset();const $=m.opaque,B=m.transmissive;if(p.setupLights(),O.isArrayCamera){const ce=O.cameras;if(B.length>0)for(let he=0,we=ce.length;he<we;he++){const Te=ce[he];Je($,B,S,Te)}nt&&Le.render(S);for(let he=0,we=ce.length;he<we;he++){const Te=ce[he];Kt(m,S,Te,Te.viewport)}}else B.length>0&&Je($,B,S,O),nt&&Le.render(S),Kt(m,S,O);I!==null&&C===0&&(fe.updateMultisampleRenderTarget(I),fe.updateRenderTargetMipmap(I)),S.isScene===!0&&S.onAfterRender(x,S,O),ye.resetDefaultState(),b=-1,M=null,E.pop(),E.length>0?(p=E[E.length-1],et===!0&&de.setGlobalState(x.clippingPlanes,p.state.camera)):p=null,A.pop(),A.length>0?m=A[A.length-1]:m=null};function rn(S,O,K,$){if(S.visible===!1)return;if(S.layers.test(O.layers)){if(S.isGroup)K=S.renderOrder;else if(S.isLOD)S.autoUpdate===!0&&S.update(O);else if(S.isLight)p.pushLight(S),S.castShadow&&p.pushShadow(S);else if(S.isSprite){if(!S.frustumCulled||lt.intersectsSprite(S)){$&&Be.setFromMatrixPosition(S.matrixWorld).applyMatrix4(ae);const he=k.update(S),we=S.material;we.visible&&m.push(S,he,we,K,Be.z,null)}}else if((S.isMesh||S.isLine||S.isPoints)&&(!S.frustumCulled||lt.intersectsObject(S))){const he=k.update(S),we=S.material;if($&&(S.boundingSphere!==void 0?(S.boundingSphere===null&&S.computeBoundingSphere(),Be.copy(S.boundingSphere.center)):(he.boundingSphere===null&&he.computeBoundingSphere(),Be.copy(he.boundingSphere.center)),Be.applyMatrix4(S.matrixWorld).applyMatrix4(ae)),Array.isArray(we)){const Te=he.groups;for(let Xe=0,Ve=Te.length;Xe<Ve;Xe++){const ke=Te[Xe],rt=we[ke.materialIndex];rt&&rt.visible&&m.push(S,he,rt,K,Be.z,ke)}}else we.visible&&m.push(S,he,we,K,Be.z,null)}}const ce=S.children;for(let he=0,we=ce.length;he<we;he++)rn(ce[he],O,K,$)}function Kt(S,O,K,$){const B=S.opaque,ce=S.transmissive,he=S.transparent;p.setupLightsView(K),et===!0&&de.setGlobalState(x.clippingPlanes,K),$&&ie.viewport(T.copy($)),B.length>0&&St(B,O,K),ce.length>0&&St(ce,O,K),he.length>0&&St(he,O,K),ie.buffers.depth.setTest(!0),ie.buffers.depth.setMask(!0),ie.buffers.color.setMask(!0),ie.setPolygonOffset(!1)}function Je(S,O,K,$){if((K.isScene===!0?K.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[$.id]===void 0&&(p.state.transmissionRenderTarget[$.id]=new Ci(1,1,{generateMipmaps:!0,type:Q.has("EXT_color_buffer_half_float")||Q.has("EXT_color_buffer_float")?Ks:Cn,minFilter:wi,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:dt.workingColorSpace}));const ce=p.state.transmissionRenderTarget[$.id],he=$.viewport||T;ce.setSize(he.z*x.transmissionResolutionScale,he.w*x.transmissionResolutionScale);const we=x.getRenderTarget(),Te=x.getActiveCubeFace(),Xe=x.getActiveMipmapLevel();x.setRenderTarget(ce),x.getClearColor(H),G=x.getClearAlpha(),G<1&&x.setClearColor(16777215,.5),x.clear(),nt&&Le.render(K);const Ve=x.toneMapping;x.toneMapping=li;const ke=$.viewport;if($.viewport!==void 0&&($.viewport=void 0),p.setupLightsView($),et===!0&&de.setGlobalState(x.clippingPlanes,$),St(S,K,$),fe.updateMultisampleRenderTarget(ce),fe.updateRenderTargetMipmap(ce),Q.has("WEBGL_multisampled_render_to_texture")===!1){let rt=!1;for(let ct=0,ot=O.length;ct<ot;ct++){const ht=O[ct],ut=ht.object,Ne=ht.geometry,ft=ht.material,at=ht.group;if(ft.side===wn&&ut.layers.test($.layers)){const zt=ft.side;ft.side=tn,ft.needsUpdate=!0,Ni(ut,K,$,Ne,ft,at),ft.side=zt,ft.needsUpdate=!0,rt=!0}}rt===!0&&(fe.updateMultisampleRenderTarget(ce),fe.updateRenderTargetMipmap(ce))}x.setRenderTarget(we,Te,Xe),x.setClearColor(H,G),ke!==void 0&&($.viewport=ke),x.toneMapping=Ve}function St(S,O,K){const $=O.isScene===!0?O.overrideMaterial:null;for(let B=0,ce=S.length;B<ce;B++){const he=S[B],we=he.object,Te=he.geometry,Xe=he.group;let Ve=he.material;Ve.allowOverride===!0&&$!==null&&(Ve=$),we.layers.test(K.layers)&&Ni(we,O,K,Te,Ve,Xe)}}function Ni(S,O,K,$,B,ce){S.onBeforeRender(x,O,K,$,B,ce),S.modelViewMatrix.multiplyMatrices(K.matrixWorldInverse,S.matrixWorld),S.normalMatrix.getNormalMatrix(S.modelViewMatrix),B.onBeforeRender(x,O,K,$,S,ce),B.transparent===!0&&B.side===wn&&B.forceSinglePass===!1?(B.side=tn,B.needsUpdate=!0,x.renderBufferDirect(K,O,$,B,S,ce),B.side=ci,B.needsUpdate=!0,x.renderBufferDirect(K,O,$,B,S,ce),B.side=wn):x.renderBufferDirect(K,O,$,B,S,ce),S.onAfterRender(x,O,K,$,B,ce)}function Kn(S,O,K){O.isScene!==!0&&(O=Fe);const $=J.get(S),B=p.state.lights,ce=p.state.shadowsArray,he=B.state.version,we=V.getParameters(S,B.state,ce,O,K),Te=V.getProgramCacheKey(we);let Xe=$.programs;$.environment=S.isMeshStandardMaterial?O.environment:null,$.fog=O.fog,$.envMap=(S.isMeshStandardMaterial?Se:Ie).get(S.envMap||$.environment),$.envMapRotation=$.environment!==null&&S.envMap===null?O.environmentRotation:S.envMapRotation,Xe===void 0&&(S.addEventListener("dispose",re),Xe=new Map,$.programs=Xe);let Ve=Xe.get(Te);if(Ve!==void 0){if($.currentProgram===Ve&&$.lightsStateVersion===he)return di(S,we),Ve}else we.uniforms=V.getUniforms(S),S.onBeforeCompile(we,x),Ve=V.acquireProgram(we,Te),Xe.set(Te,Ve),$.uniforms=we.uniforms;const ke=$.uniforms;return(!S.isShaderMaterial&&!S.isRawShaderMaterial||S.clipping===!0)&&(ke.clippingPlanes=de.uniform),di(S,we),$.needsLights=Jr(S),$.lightsStateVersion=he,$.needsLights&&(ke.ambientLightColor.value=B.state.ambient,ke.lightProbe.value=B.state.probe,ke.directionalLights.value=B.state.directional,ke.directionalLightShadows.value=B.state.directionalShadow,ke.spotLights.value=B.state.spot,ke.spotLightShadows.value=B.state.spotShadow,ke.rectAreaLights.value=B.state.rectArea,ke.ltc_1.value=B.state.rectAreaLTC1,ke.ltc_2.value=B.state.rectAreaLTC2,ke.pointLights.value=B.state.point,ke.pointLightShadows.value=B.state.pointShadow,ke.hemisphereLights.value=B.state.hemi,ke.directionalShadowMap.value=B.state.directionalShadowMap,ke.directionalShadowMatrix.value=B.state.directionalShadowMatrix,ke.spotShadowMap.value=B.state.spotShadowMap,ke.spotLightMatrix.value=B.state.spotLightMatrix,ke.spotLightMap.value=B.state.spotLightMap,ke.pointShadowMap.value=B.state.pointShadowMap,ke.pointShadowMatrix.value=B.state.pointShadowMatrix),$.currentProgram=Ve,$.uniformsList=null,Ve}function Fi(S){if(S.uniformsList===null){const O=S.currentProgram.getUniforms();S.uniformsList=Or.seqWithValue(O.seq,S.uniforms)}return S.uniformsList}function di(S,O){const K=J.get(S);K.outputColorSpace=O.outputColorSpace,K.batching=O.batching,K.batchingColor=O.batchingColor,K.instancing=O.instancing,K.instancingColor=O.instancingColor,K.instancingMorph=O.instancingMorph,K.skinning=O.skinning,K.morphTargets=O.morphTargets,K.morphNormals=O.morphNormals,K.morphColors=O.morphColors,K.morphTargetsCount=O.morphTargetsCount,K.numClippingPlanes=O.numClippingPlanes,K.numIntersection=O.numClipIntersection,K.vertexAlphas=O.vertexAlphas,K.vertexTangents=O.vertexTangents,K.toneMapping=O.toneMapping}function ys(S,O,K,$,B){O.isScene!==!0&&(O=Fe),fe.resetTextureUnits();const ce=O.fog,he=$.isMeshStandardMaterial?O.environment:null,we=I===null?x.outputColorSpace:I.isXRRenderTarget===!0?I.texture.colorSpace:ds,Te=($.isMeshStandardMaterial?Se:Ie).get($.envMap||he),Xe=$.vertexColors===!0&&!!K.attributes.color&&K.attributes.color.itemSize===4,Ve=!!K.attributes.tangent&&(!!$.normalMap||$.anisotropy>0),ke=!!K.morphAttributes.position,rt=!!K.morphAttributes.normal,ct=!!K.morphAttributes.color;let ot=li;$.toneMapped&&(I===null||I.isXRRenderTarget===!0)&&(ot=x.toneMapping);const ht=K.morphAttributes.position||K.morphAttributes.normal||K.morphAttributes.color,ut=ht!==void 0?ht.length:0,Ne=J.get($),ft=p.state.lights;if(et===!0&&(ee===!0||S!==M)){const wt=S===M&&$.id===b;de.setState($,S,wt)}let at=!1;$.version===Ne.__version?(Ne.needsLights&&Ne.lightsStateVersion!==ft.state.version||Ne.outputColorSpace!==we||B.isBatchedMesh&&Ne.batching===!1||!B.isBatchedMesh&&Ne.batching===!0||B.isBatchedMesh&&Ne.batchingColor===!0&&B.colorTexture===null||B.isBatchedMesh&&Ne.batchingColor===!1&&B.colorTexture!==null||B.isInstancedMesh&&Ne.instancing===!1||!B.isInstancedMesh&&Ne.instancing===!0||B.isSkinnedMesh&&Ne.skinning===!1||!B.isSkinnedMesh&&Ne.skinning===!0||B.isInstancedMesh&&Ne.instancingColor===!0&&B.instanceColor===null||B.isInstancedMesh&&Ne.instancingColor===!1&&B.instanceColor!==null||B.isInstancedMesh&&Ne.instancingMorph===!0&&B.morphTexture===null||B.isInstancedMesh&&Ne.instancingMorph===!1&&B.morphTexture!==null||Ne.envMap!==Te||$.fog===!0&&Ne.fog!==ce||Ne.numClippingPlanes!==void 0&&(Ne.numClippingPlanes!==de.numPlanes||Ne.numIntersection!==de.numIntersection)||Ne.vertexAlphas!==Xe||Ne.vertexTangents!==Ve||Ne.morphTargets!==ke||Ne.morphNormals!==rt||Ne.morphColors!==ct||Ne.toneMapping!==ot||Ne.morphTargetsCount!==ut)&&(at=!0):(at=!0,Ne.__version=$.version);let zt=Ne.currentProgram;at===!0&&(zt=Kn($,O,B));let Dn=!1,Ct=!1,fi=!1;const Et=zt.getUniforms(),jt=Ne.uniforms;if(ie.useProgram(zt.program)&&(Dn=!0,Ct=!0,fi=!0),$.id!==b&&(b=$.id,Ct=!0),Dn||M!==S){ie.buffers.depth.getReversed()&&S.reversedDepth!==!0&&(S._reversedDepth=!0,S.updateProjectionMatrix()),Et.setValue(U,"projectionMatrix",S.projectionMatrix),Et.setValue(U,"viewMatrix",S.matrixWorldInverse);const mt=Et.map.cameraPosition;mt!==void 0&&mt.setValue(U,Ae.setFromMatrixPosition(S.matrixWorld)),ne.logarithmicDepthBuffer&&Et.setValue(U,"logDepthBufFC",2/(Math.log(S.far+1)/Math.LN2)),($.isMeshPhongMaterial||$.isMeshToonMaterial||$.isMeshLambertMaterial||$.isMeshBasicMaterial||$.isMeshStandardMaterial||$.isShaderMaterial)&&Et.setValue(U,"isOrthographic",S.isOrthographicCamera===!0),M!==S&&(M=S,Ct=!0,fi=!0)}if(B.isSkinnedMesh){Et.setOptional(U,B,"bindMatrix"),Et.setOptional(U,B,"bindMatrixInverse");const wt=B.skeleton;wt&&(wt.boneTexture===null&&wt.computeBoneTexture(),Et.setValue(U,"boneTexture",wt.boneTexture,fe))}B.isBatchedMesh&&(Et.setOptional(U,B,"batchingTexture"),Et.setValue(U,"batchingTexture",B._matricesTexture,fe),Et.setOptional(U,B,"batchingIdTexture"),Et.setValue(U,"batchingIdTexture",B._indirectTexture,fe),Et.setOptional(U,B,"batchingColorTexture"),B._colorsTexture!==null&&Et.setValue(U,"batchingColorTexture",B._colorsTexture,fe));const Zt=K.morphAttributes;if((Zt.position!==void 0||Zt.normal!==void 0||Zt.color!==void 0)&&le.update(B,K,zt),(Ct||Ne.receiveShadow!==B.receiveShadow)&&(Ne.receiveShadow=B.receiveShadow,Et.setValue(U,"receiveShadow",B.receiveShadow)),$.isMeshGouraudMaterial&&$.envMap!==null&&(jt.envMap.value=Te,jt.flipEnvMap.value=Te.isCubeTexture&&Te.isRenderTargetTexture===!1?-1:1),$.isMeshStandardMaterial&&$.envMap===null&&O.environment!==null&&(jt.envMapIntensity.value=O.environmentIntensity),Ct&&(Et.setValue(U,"toneMappingExposure",x.toneMappingExposure),Ne.needsLights&&Zr(jt,fi),ce&&$.fog===!0&&te.refreshFogUniforms(jt,ce),te.refreshMaterialUniforms(jt,$,Y,W,p.state.transmissionRenderTarget[S.id]),Or.upload(U,Fi(Ne),jt,fe)),$.isShaderMaterial&&$.uniformsNeedUpdate===!0&&(Or.upload(U,Fi(Ne),jt,fe),$.uniformsNeedUpdate=!1),$.isSpriteMaterial&&Et.setValue(U,"center",B.center),Et.setValue(U,"modelViewMatrix",B.modelViewMatrix),Et.setValue(U,"normalMatrix",B.normalMatrix),Et.setValue(U,"modelMatrix",B.matrixWorld),$.isShaderMaterial||$.isRawShaderMaterial){const wt=$.uniformsGroups;for(let mt=0,_n=wt.length;mt<_n;mt++){const It=wt[mt];Ke.update(It,zt),Ke.bind(It,zt)}}return zt}function Zr(S,O){S.ambientLightColor.needsUpdate=O,S.lightProbe.needsUpdate=O,S.directionalLights.needsUpdate=O,S.directionalLightShadows.needsUpdate=O,S.pointLights.needsUpdate=O,S.pointLightShadows.needsUpdate=O,S.spotLights.needsUpdate=O,S.spotLightShadows.needsUpdate=O,S.rectAreaLights.needsUpdate=O,S.hemisphereLights.needsUpdate=O}function Jr(S){return S.isMeshLambertMaterial||S.isMeshToonMaterial||S.isMeshPhongMaterial||S.isMeshStandardMaterial||S.isShadowMaterial||S.isShaderMaterial&&S.lights===!0}this.getActiveCubeFace=function(){return R},this.getActiveMipmapLevel=function(){return C},this.getRenderTarget=function(){return I},this.setRenderTargetTextures=function(S,O,K){const $=J.get(S);$.__autoAllocateDepthBuffer=S.resolveDepthBuffer===!1,$.__autoAllocateDepthBuffer===!1&&($.__useRenderToTexture=!1),J.get(S.texture).__webglTexture=O,J.get(S.depthTexture).__webglTexture=$.__autoAllocateDepthBuffer?void 0:K,$.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(S,O){const K=J.get(S);K.__webglFramebuffer=O,K.__useDefaultFramebuffer=O===void 0};const Bt=U.createFramebuffer();this.setRenderTarget=function(S,O=0,K=0){I=S,R=O,C=K;let $=!0,B=null,ce=!1,he=!1;if(S){const Te=J.get(S);if(Te.__useDefaultFramebuffer!==void 0)ie.bindFramebuffer(U.FRAMEBUFFER,null),$=!1;else if(Te.__webglFramebuffer===void 0)fe.setupRenderTarget(S);else if(Te.__hasExternalTextures)fe.rebindTextures(S,J.get(S.texture).__webglTexture,J.get(S.depthTexture).__webglTexture);else if(S.depthBuffer){const ke=S.depthTexture;if(Te.__boundDepthTexture!==ke){if(ke!==null&&J.has(ke)&&(S.width!==ke.image.width||S.height!==ke.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");fe.setupDepthRenderbuffer(S)}}const Xe=S.texture;(Xe.isData3DTexture||Xe.isDataArrayTexture||Xe.isCompressedArrayTexture)&&(he=!0);const Ve=J.get(S).__webglFramebuffer;S.isWebGLCubeRenderTarget?(Array.isArray(Ve[O])?B=Ve[O][K]:B=Ve[O],ce=!0):S.samples>0&&fe.useMultisampledRTT(S)===!1?B=J.get(S).__webglMultisampledFramebuffer:Array.isArray(Ve)?B=Ve[K]:B=Ve,T.copy(S.viewport),F.copy(S.scissor),z=S.scissorTest}else T.copy(De).multiplyScalar(Y).floor(),F.copy(qe).multiplyScalar(Y).floor(),z=Qe;if(K!==0&&(B=Bt),ie.bindFramebuffer(U.FRAMEBUFFER,B)&&$&&ie.drawBuffers(S,B),ie.viewport(T),ie.scissor(F),ie.setScissorTest(z),ce){const Te=J.get(S.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_CUBE_MAP_POSITIVE_X+O,Te.__webglTexture,K)}else if(he){const Te=O;for(let Xe=0;Xe<S.textures.length;Xe++){const Ve=J.get(S.textures[Xe]);U.framebufferTextureLayer(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0+Xe,Ve.__webglTexture,K,Te)}}else if(S!==null&&K!==0){const Te=J.get(S.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,Te.__webglTexture,K)}b=-1},this.readRenderTargetPixels=function(S,O,K,$,B,ce,he,we=0){if(!(S&&S.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Te=J.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&he!==void 0&&(Te=Te[he]),Te){ie.bindFramebuffer(U.FRAMEBUFFER,Te);try{const Xe=S.textures[we],Ve=Xe.format,ke=Xe.type;if(!ne.textureFormatReadable(Ve)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!ne.textureTypeReadable(ke)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}O>=0&&O<=S.width-$&&K>=0&&K<=S.height-B&&(S.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+we),U.readPixels(O,K,$,B,Oe.convert(Ve),Oe.convert(ke),ce))}finally{const Xe=I!==null?J.get(I).__webglFramebuffer:null;ie.bindFramebuffer(U.FRAMEBUFFER,Xe)}}},this.readRenderTargetPixelsAsync=async function(S,O,K,$,B,ce,he,we=0){if(!(S&&S.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Te=J.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&he!==void 0&&(Te=Te[he]),Te)if(O>=0&&O<=S.width-$&&K>=0&&K<=S.height-B){ie.bindFramebuffer(U.FRAMEBUFFER,Te);const Xe=S.textures[we],Ve=Xe.format,ke=Xe.type;if(!ne.textureFormatReadable(Ve))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!ne.textureTypeReadable(ke))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const rt=U.createBuffer();U.bindBuffer(U.PIXEL_PACK_BUFFER,rt),U.bufferData(U.PIXEL_PACK_BUFFER,ce.byteLength,U.STREAM_READ),S.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+we),U.readPixels(O,K,$,B,Oe.convert(Ve),Oe.convert(ke),0);const ct=I!==null?J.get(I).__webglFramebuffer:null;ie.bindFramebuffer(U.FRAMEBUFFER,ct);const ot=U.fenceSync(U.SYNC_GPU_COMMANDS_COMPLETE,0);return U.flush(),await zd(U,ot,4),U.bindBuffer(U.PIXEL_PACK_BUFFER,rt),U.getBufferSubData(U.PIXEL_PACK_BUFFER,0,ce),U.deleteBuffer(rt),U.deleteSync(ot),ce}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(S,O=null,K=0){const $=Math.pow(2,-K),B=Math.floor(S.image.width*$),ce=Math.floor(S.image.height*$),he=O!==null?O.x:0,we=O!==null?O.y:0;fe.setTexture2D(S,0),U.copyTexSubImage2D(U.TEXTURE_2D,K,0,0,he,we,B,ce),ie.unbindTexture()};const Ms=U.createFramebuffer(),Oi=U.createFramebuffer();this.copyTextureToTexture=function(S,O,K=null,$=null,B=0,ce=null){ce===null&&(B!==0?(Ws("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),ce=B,B=0):ce=0);let he,we,Te,Xe,Ve,ke,rt,ct,ot;const ht=S.isCompressedTexture?S.mipmaps[ce]:S.image;if(K!==null)he=K.max.x-K.min.x,we=K.max.y-K.min.y,Te=K.isBox3?K.max.z-K.min.z:1,Xe=K.min.x,Ve=K.min.y,ke=K.isBox3?K.min.z:0;else{const Zt=Math.pow(2,-B);he=Math.floor(ht.width*Zt),we=Math.floor(ht.height*Zt),S.isDataArrayTexture?Te=ht.depth:S.isData3DTexture?Te=Math.floor(ht.depth*Zt):Te=1,Xe=0,Ve=0,ke=0}$!==null?(rt=$.x,ct=$.y,ot=$.z):(rt=0,ct=0,ot=0);const ut=Oe.convert(O.format),Ne=Oe.convert(O.type);let ft;O.isData3DTexture?(fe.setTexture3D(O,0),ft=U.TEXTURE_3D):O.isDataArrayTexture||O.isCompressedArrayTexture?(fe.setTexture2DArray(O,0),ft=U.TEXTURE_2D_ARRAY):(fe.setTexture2D(O,0),ft=U.TEXTURE_2D),U.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,O.flipY),U.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,O.premultiplyAlpha),U.pixelStorei(U.UNPACK_ALIGNMENT,O.unpackAlignment);const at=U.getParameter(U.UNPACK_ROW_LENGTH),zt=U.getParameter(U.UNPACK_IMAGE_HEIGHT),Dn=U.getParameter(U.UNPACK_SKIP_PIXELS),Ct=U.getParameter(U.UNPACK_SKIP_ROWS),fi=U.getParameter(U.UNPACK_SKIP_IMAGES);U.pixelStorei(U.UNPACK_ROW_LENGTH,ht.width),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,ht.height),U.pixelStorei(U.UNPACK_SKIP_PIXELS,Xe),U.pixelStorei(U.UNPACK_SKIP_ROWS,Ve),U.pixelStorei(U.UNPACK_SKIP_IMAGES,ke);const Et=S.isDataArrayTexture||S.isData3DTexture,jt=O.isDataArrayTexture||O.isData3DTexture;if(S.isDepthTexture){const Zt=J.get(S),wt=J.get(O),mt=J.get(Zt.__renderTarget),_n=J.get(wt.__renderTarget);ie.bindFramebuffer(U.READ_FRAMEBUFFER,mt.__webglFramebuffer),ie.bindFramebuffer(U.DRAW_FRAMEBUFFER,_n.__webglFramebuffer);for(let It=0;It<Te;It++)Et&&(U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,J.get(S).__webglTexture,B,ke+It),U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,J.get(O).__webglTexture,ce,ot+It)),U.blitFramebuffer(Xe,Ve,he,we,rt,ct,he,we,U.DEPTH_BUFFER_BIT,U.NEAREST);ie.bindFramebuffer(U.READ_FRAMEBUFFER,null),ie.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else if(B!==0||S.isRenderTargetTexture||J.has(S)){const Zt=J.get(S),wt=J.get(O);ie.bindFramebuffer(U.READ_FRAMEBUFFER,Ms),ie.bindFramebuffer(U.DRAW_FRAMEBUFFER,Oi);for(let mt=0;mt<Te;mt++)Et?U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Zt.__webglTexture,B,ke+mt):U.framebufferTexture2D(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,Zt.__webglTexture,B),jt?U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,wt.__webglTexture,ce,ot+mt):U.framebufferTexture2D(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,wt.__webglTexture,ce),B!==0?U.blitFramebuffer(Xe,Ve,he,we,rt,ct,he,we,U.COLOR_BUFFER_BIT,U.NEAREST):jt?U.copyTexSubImage3D(ft,ce,rt,ct,ot+mt,Xe,Ve,he,we):U.copyTexSubImage2D(ft,ce,rt,ct,Xe,Ve,he,we);ie.bindFramebuffer(U.READ_FRAMEBUFFER,null),ie.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else jt?S.isDataTexture||S.isData3DTexture?U.texSubImage3D(ft,ce,rt,ct,ot,he,we,Te,ut,Ne,ht.data):O.isCompressedArrayTexture?U.compressedTexSubImage3D(ft,ce,rt,ct,ot,he,we,Te,ut,ht.data):U.texSubImage3D(ft,ce,rt,ct,ot,he,we,Te,ut,Ne,ht):S.isDataTexture?U.texSubImage2D(U.TEXTURE_2D,ce,rt,ct,he,we,ut,Ne,ht.data):S.isCompressedTexture?U.compressedTexSubImage2D(U.TEXTURE_2D,ce,rt,ct,ht.width,ht.height,ut,ht.data):U.texSubImage2D(U.TEXTURE_2D,ce,rt,ct,he,we,ut,Ne,ht);U.pixelStorei(U.UNPACK_ROW_LENGTH,at),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,zt),U.pixelStorei(U.UNPACK_SKIP_PIXELS,Dn),U.pixelStorei(U.UNPACK_SKIP_ROWS,Ct),U.pixelStorei(U.UNPACK_SKIP_IMAGES,fi),ce===0&&O.generateMipmaps&&U.generateMipmap(ft),ie.unbindTexture()},this.initRenderTarget=function(S){J.get(S).__webglFramebuffer===void 0&&fe.setupRenderTarget(S)},this.initTexture=function(S){S.isCubeTexture?fe.setTextureCube(S,0):S.isData3DTexture?fe.setTexture3D(S,0):S.isDataArrayTexture||S.isCompressedArrayTexture?fe.setTexture2DArray(S,0):fe.setTexture2D(S,0),ie.unbindTexture()},this.resetState=function(){R=0,C=0,I=null,ie.reset(),ye.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Rn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=dt._getDrawingBufferColorSpace(e),t.unpackColorSpace=dt._getUnpackColorSpace()}}const jc={type:"change"},ml={type:"start"},sh={type:"end"},Lr=new Yr,Zc=new si,Y0=Math.cos(70*cn.DEG2RAD),Pt=new L,Jt=2*Math.PI,xt={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Go=1e-6;class q0 extends lp{constructor(e,t=null){super(e,t),this.state=xt.NONE,this.target=new L,this.cursor=new L,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:rs.ROTATE,MIDDLE:rs.DOLLY,RIGHT:rs.PAN},this.touches={ONE:ns.ROTATE,TWO:ns.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new L,this._lastQuaternion=new qn,this._lastTargetPosition=new L,this._quat=new qn().setFromUnitVectors(e.up,new L(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new bc,this._sphericalDelta=new bc,this._scale=1,this._panOffset=new L,this._rotateStart=new ge,this._rotateEnd=new ge,this._rotateDelta=new ge,this._panStart=new ge,this._panEnd=new ge,this._panDelta=new ge,this._dollyStart=new ge,this._dollyEnd=new ge,this._dollyDelta=new ge,this._dollyDirection=new L,this._mouse=new ge,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=K0.bind(this),this._onPointerDown=$0.bind(this),this._onPointerUp=j0.bind(this),this._onContextMenu=iv.bind(this),this._onMouseWheel=Q0.bind(this),this._onKeyDown=ev.bind(this),this._onTouchStart=tv.bind(this),this._onTouchMove=nv.bind(this),this._onMouseDown=Z0.bind(this),this._onMouseMove=J0.bind(this),this._interceptControlDown=sv.bind(this),this._interceptControlUp=rv.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(jc),this.update(),this.state=xt.NONE}update(e=null){const t=this.object.position;Pt.copy(t).sub(this.target),Pt.applyQuaternion(this._quat),this._spherical.setFromVector3(Pt),this.autoRotate&&this.state===xt.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(n)&&isFinite(s)&&(n<-Math.PI?n+=Jt:n>Math.PI&&(n-=Jt),s<-Math.PI?s+=Jt:s>Math.PI&&(s-=Jt),n<=s?this._spherical.theta=Math.max(n,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+s)/2?Math.max(n,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=o!=this._spherical.radius}if(Pt.setFromSpherical(this._spherical),Pt.applyQuaternion(this._quatInverse),t.copy(this.target).add(Pt),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){const a=Pt.length();o=this._clampDistance(a*this._scale);const c=a-o;this.object.position.addScaledVector(this._dollyDirection,c),this.object.updateMatrixWorld(),r=!!c}else if(this.object.isOrthographicCamera){const a=new L(this._mouse.x,this._mouse.y,0);a.unproject(this.object);const c=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=c!==this.object.zoom;const l=new L(this._mouse.x,this._mouse.y,0);l.unproject(this.object),this.object.position.sub(l).add(a),this.object.updateMatrixWorld(),o=Pt.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(Lr.origin.copy(this.object.position),Lr.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Lr.direction))<Y0?this.object.lookAt(this.target):(Zc.setFromNormalAndCoplanarPoint(this.object.up,this.target),Lr.intersectPlane(Zc,this.target))))}else if(this.object.isOrthographicCamera){const o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>Go||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Go||this._lastTargetPosition.distanceToSquared(this.target)>Go?(this.dispatchEvent(jc),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?Jt/60*this.autoRotateSpeed*e:Jt/60/60*this.autoRotateSpeed}_getZoomScale(e){const t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){Pt.setFromMatrixColumn(t,0),Pt.multiplyScalar(-e),this._panOffset.add(Pt)}_panUp(e,t){this.screenSpacePanning===!0?Pt.setFromMatrixColumn(t,1):(Pt.setFromMatrixColumn(t,0),Pt.crossVectors(this.object.up,Pt)),Pt.multiplyScalar(e),this._panOffset.add(Pt)}_pan(e,t){const n=this.domElement;if(this.object.isPerspectiveCamera){const s=this.object.position;Pt.copy(s).sub(this.target);let r=Pt.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*r/n.clientHeight,this.object.matrix),this._panUp(2*t*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const n=this.domElement.getBoundingClientRect(),s=e-n.left,r=t-n.top,o=n.width,a=n.height;this._mouse.x=s/o*2-1,this._mouse.y=-(r/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(Jt*this._rotateDelta.x/t.clientHeight),this._rotateUp(Jt*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(Jt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-Jt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(Jt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-Jt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._rotateStart.set(n,s)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panStart.set(n,s)}}_handleTouchStartDolly(e){const t=this._getSecondPointerPosition(e),n=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(n*n+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),s=.5*(e.pageX+n.x),r=.5*(e.pageY+n.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(Jt*this._rotateDelta.x/t.clientHeight),this._rotateUp(Jt*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panEnd.set(n,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const t=this._getSecondPointerPosition(e),n=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(n*n+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const o=(e.pageX+t.x)*.5,a=(e.pageY+t.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new ge,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){const t=e.deltaMode,n={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}}function $0(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(i)&&(this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i)))}function K0(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function j0(i){switch(this._removePointer(i),this._pointers.length){case 0:this.domElement.releasePointerCapture(i.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(sh),this.state=xt.NONE;break;case 1:const e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function Z0(i){let e;switch(i.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case rs.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(i),this.state=xt.DOLLY;break;case rs.ROTATE:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=xt.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=xt.ROTATE}break;case rs.PAN:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=xt.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=xt.PAN}break;default:this.state=xt.NONE}this.state!==xt.NONE&&this.dispatchEvent(ml)}function J0(i){switch(this.state){case xt.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(i);break;case xt.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(i);break;case xt.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(i);break}}function Q0(i){this.enabled===!1||this.enableZoom===!1||this.state!==xt.NONE||(i.preventDefault(),this.dispatchEvent(ml),this._handleMouseWheel(this._customWheelEvent(i)),this.dispatchEvent(sh))}function ev(i){this.enabled!==!1&&this._handleKeyDown(i)}function tv(i){switch(this._trackPointer(i),this._pointers.length){case 1:switch(this.touches.ONE){case ns.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(i),this.state=xt.TOUCH_ROTATE;break;case ns.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(i),this.state=xt.TOUCH_PAN;break;default:this.state=xt.NONE}break;case 2:switch(this.touches.TWO){case ns.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(i),this.state=xt.TOUCH_DOLLY_PAN;break;case ns.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(i),this.state=xt.TOUCH_DOLLY_ROTATE;break;default:this.state=xt.NONE}break;default:this.state=xt.NONE}this.state!==xt.NONE&&this.dispatchEvent(ml)}function nv(i){switch(this._trackPointer(i),this.state){case xt.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(i),this.update();break;case xt.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(i),this.update();break;case xt.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(i),this.update();break;case xt.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(i),this.update();break;default:this.state=xt.NONE}}function iv(i){this.enabled!==!1&&i.preventDefault()}function sv(i){i.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function rv(i){i.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function Ai(i,e=!1){const t=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},o={},a=i[0].morphTargetsRelative,c=new Wt;let l=0;for(let u=0;u<i.length;++u){const h=i[u];let d=0;if(t!==(h.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const f in h.attributes){if(!n.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;r[f]===void 0&&(r[f]=[]),r[f].push(h.attributes[f]),d++}if(d!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". Make sure all geometries have the same number of attributes."),null;if(a!==h.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const f in h.morphAttributes){if(!s.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+".  .morphAttributes must be consistent throughout all geometries."),null;o[f]===void 0&&(o[f]=[]),o[f].push(h.morphAttributes[f])}if(e){let f;if(t)f=h.index.count;else if(h.attributes.position!==void 0)f=h.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,f,u),l+=f}}if(t){let u=0;const h=[];for(let d=0;d<i.length;++d){const f=i[d].index;for(let g=0;g<f.count;++g)h.push(f.getX(g)+u);u+=i[d].attributes.position.count}c.setIndex(h)}for(const u in r){const h=Jc(r[u]);if(!h)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" attribute."),null;c.setAttribute(u,h)}for(const u in o){const h=o[u][0].length;if(h===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[u]=[];for(let d=0;d<h;++d){const f=[];for(let _=0;_<o[u].length;++_)f.push(o[u][_][d]);const g=Jc(f);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" morphAttribute."),null;c.morphAttributes[u].push(g)}}return c}function Jc(i){let e,t,n,s=-1,r=0;for(let l=0;l<i.length;++l){const u=i[l];if(e===void 0&&(e=u.array.constructor),e!==u.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=u.itemSize),t!==u.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=u.normalized),n!==u.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=u.gpuType),s!==u.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=u.count*t}const o=new e(r),a=new nn(o,t,n);let c=0;for(let l=0;l<i.length;++l){const u=i[l];if(u.isInterleavedBufferAttribute){const h=c/t;for(let d=0,f=u.count;d<f;d++)for(let g=0;g<t;g++){const _=u.getComponent(d,g);a.setComponent(d+h,g,_)}}else o.set(u.array,c);c+=u.count*t}return s!==void 0&&(a.gpuType=s),a}const rh=1.7,oh=.45,ah=i=>oh+.44*i,Ga=i=>.93*i,Qc=.3,Wa={fill:0,order:"random",posture:"sit",heightMode:"fixed",height:1.7,heightMin:1.55,heightMax:1.85,handsUp:0,phone:0,board:0,sign:0,glow:0,hold:"chest",glowColor:5951999,sway:!1,jump:!1,wave:!1},Ns={uTime:{value:0},uSway:{value:0},uJump:{value:0},uWave:{value:0}};function Sn(i,e){let t=Math.imul(i^e,2246822519);return t=Math.imul(t^t>>>13,3266489917),((t^t>>>16)>>>0)/4294967296}function en(i,e){const t=i.attributes.position.count,n=new Float32Array(t*3).fill(e);return i.setAttribute("color",new nn(n,3)),i}const lh=i=>new $r(.095,10,7).scale(1,1.19,1.06).translate(0,i,0),ov=new L(0,1,0);function Gr(i,e,t,n){const s=new L(i[0],i[1],i[2]??0),r=new L(e[0],e[1],e[2]??0).sub(s),o=r.length()||.01,a=new Ot(t,o,t);return a.applyQuaternion(new qn().setFromUnitVectors(ov,r.normalize())),a.translate(s.x+r.x*o/2,s.y+r.y*o/2,s.z+r.z*o/2),en(a,n)}function ch(i,e,t){const n=[];for(const s of[-1,1])n.push(Gr([s*.2,i],[s*e[0],e[1]],.085,1)),n.push(Gr([s*e[0],e[1]],[s*t[0],t[1]],.075,1.05));return n}function eu(i){return Ai([en(new Ot(.4,.22,.46).translate(0,-.11,.15),.5),en(new Ot(.36,.3,.25).translate(0,.16,0),.82),en(new Ot(.44,.28,.26).translate(0,.45,0),.95),en(new Ot(.11,.05,.11).translate(0,.6,0),1.05),en(lh(.72),1.15),...i?ch(.53,[.3,.36],[.26,.9]):[]])}function Xa(i){return Ai([en(new Ot(.3,.86,.24).translate(0,.43,0),.5),en(new Ot(.34,.3,.25).translate(0,1.01,0),.82),en(new Ot(.44,.28,.26).translate(0,1.3,0),.95),en(new Ot(.11,.05,.11).translate(0,1.465,0),1.05),en(lh(1.587),1.15),...i?ch(1.4,[.32,1.2],[.28,1.74]):[]])}const uh=-.87,tu=[.2,1.4,0],xs={phone:{chest:{at:[0,1.52,.36],elbow:[.24,1.2,.2],hand:[.05,1.47,.34]},high:{at:[0,1.92,.22],elbow:[.28,1.62,.12],hand:[.05,1.86,.2]}},board:{chest:{at:[0,1.36,.3],elbow:[.3,1.14,.12],hand:[.28,1.36,.28]},high:{at:[0,1.96,.14],elbow:[.34,1.66,.06],hand:[.28,1.94,.13]}},sign:{chest:{at:[0,1.33,.3],elbow:[.28,1.14,.12],hand:[.2,1.36,.29]},high:{at:[0,2,.14],elbow:[.32,1.68,.06],hand:[.2,1.97,.13]}},glow:{chest:{at:[.24,1.26,.3],elbow:[.3,1.06,.14],hand:[.24,1.26,.3],one:!0},high:{at:[.26,1.82,.14],elbow:[.34,1.58,.08],hand:[.26,1.82,.14],one:!0}}},$s=Object.keys(xs),Ya=.12,Wr=.2;function av(i,e){const{elbow:t,hand:n,one:s}=xs[i][e];return(s?[1]:[-1,1]).flatMap(r=>[Gr([r*tu[0],tu[1],0],[r*t[0],t[1],t[2]],.085,1),Gr([r*t[0],t[1],t[2]],[r*n[0],n[1],n[2]],.075,1.05)])}const es=(i,e,t,[n,s,r],o)=>en(new Ot(i,e,t).translate(n,s,r),o);function lv(i,e){const{at:t}=xs[i][e],[n,s,r]=t;switch(i){case"phone":return Ai([es(.075,.155,.009,t,.06),es(.068,.145,.002,[n,s,r-.0055],1)]);case"board":return Ai([es(.6,.22,.03,t,.07),es(.58,.2,.002,[n,s,r+.016],1)]);case"sign":return Ai([es(.42,.3,.004,t,.92),es(.4,.28,.002,[n,s,r+.003],1)]);case"glow":{const o=new Pi(.018,.018,Ya,8).translate(n,s,r),a=new Pi(.022,.022,Wr,8).translate(n,s+Ya/2+Wr/2,r);return hh(Ai([en(o,.08),en(a,1)]),s)}}}function cv(i){const[e,t,n]=xs.glow[i].at,s=new Pi(.055,.055,Wr+.06,10).translate(e,t+Ya/2+Wr/2,n);return hh(s,t)}function hh(i,e){const t=i.attributes.position,n=new Float32Array(t.count);for(let s=0;s<t.count;s++)n[s]=Math.max(t.getY(s)-e,0);return i.setAttribute("aWave",new nn(n,1)),i}function gl(i,e,t=!1){return i.onBeforeCompile=n=>{Object.assign(n.uniforms,Ns),n.vertexShader=`uniform float uTime;
uniform float uSway;
uniform float uJump;
uniform float uWave;
attribute vec2 aAnim;
`+(t?`attribute float aWave;
`:"")+n.vertexShader.replace("#include <begin_vertex>",`
        #include <begin_vertex>
        // 搖擺同跳係兩條獨立嘅波，可以同時開。
        // 相位散開嘅幅度刻意細：現場係跟拍子一齊郁，唔係逐個亂跳，
        // 相位撒到成 2π 嘅話成班人爆米花咁彈，同真實差好遠。
        // 搖擺慢一半（兩拍一個來回），跳快一倍（一拍一下）。
        float ph = aAnim.x * 6.2831853;
        float ts = uTime * 2.0 + ph * 0.5;
        float tj = uTime * 4.0 + ph * 0.3;
        ${t?`// 以手為軸轉（一拍揮一下）：aWave ＝ 離手高度，轉角 ±uWave rad，支棒長度不變
        float wa = sin(uTime * 4.0 + ph * 0.2) * uWave;
        transformed.x += sin(wa) * aWave;
        transformed.y += (cos(wa) - 1.0) * aWave;`:""}
        // 先用原本嘅 y 算橫向偏移，跳起之後再加高度，兩者互不影響
        transformed.x += sin(ts) * uSway * max(transformed.y, 0.0);
        transformed.y += max(sin(tj), 0.0) * uJump * aAnim.y;
      `)},i.customProgramCacheKey=()=>e,i}const uv=()=>gl(new ju({vertexColors:!0}),"crowd-anim");function hv(i){return gl(new ui({vertexColors:!0}),i==="glow"?"crowd-anim-basic-wave":"crowd-anim-basic",i==="glow")}const dv=()=>gl(new ui({transparent:!0,opacity:.28,blending:zs,depthWrite:!1}),"crowd-anim-halo",!0),nu=[16727435,4040191,16765501,10181887,4063152,16777215],fv={board:739982445,sign:695872825,phone:1540483477,glow:1759714724},pv=["board","sign","phone","glow"];function mv(i,e){for(const t of pv)if(Sn(i,fv[t])<e[t])return t;return null}function gv(i,e,t){if(!xs[e])return i?Xa(e==="hands"):eu(e==="hands");const n=i?0:uh;return Ai([i?Xa(!1):eu(!1),...av(e,t).map(s=>s.translate(0,n,0))])}function iu(i,e){if(e.heightMode!=="random")return e.height;const t=Math.min(e.heightMin,e.heightMax),n=Math.max(e.heightMin,e.heightMax);return t+(n-t)*Sn(i,2246822507)}function su(i,e,t){const n=new Uint8Array(i);if(e.order==="demand"&&t){const s=Array.from({length:i},(o,a)=>a).sort((o,a)=>t(a)+Sn(a,461845907)*.18-t(o)-Sn(o,461845907)*.18),r=Math.round(e.fill*i);for(let o=0;o<r;o++)n[s[o]]=1}else for(let s=0;s<i;s++)Sn(s,2654435761)<e.fill&&(n[s]=1);return n}const _v=2.3;function vv(i,e,t){if(e<i.x-i.w/2||e>i.x+i.w/2||t<i.z-i.d/2||t>i.z+i.d/2)return!1;if(!i.polygon)return!0;let n=!1;for(let s=0,r=i.polygon.length-1;s<i.polygon.length;r=s++){const[o,a]=i.polygon[s],[c,l]=i.polygon[r];a>t!=l>t&&e<(c-o)*(t-a)/(l-a)+o&&(n=!n)}return n}function xv(i,e,t,n,s){const r={...Wa,...e};if(!(r.fill>0))return null;const o=[],a=new Int32Array(i.length).fill(-1),c=su(i.length,r,s?T=>s(i[T],n):null);i.forEach((T,F)=>{if(!c[F]||T.seatType==="wheelchair"||T.closed)return;const z=iu(F,r),H=r.posture==="stand",G=T.fx??-T.x,q=T.fz??-T.z,W=Math.hypot(G,q)||1,Y=H?T.x+G/W*Qc:T.x,me=H?T.z+q/W*Qc:T.z;a[F]=o.length,o.push({seatIndex:F,key:F,x:Y,z:me,deck:T.y,h:z,standing:H,eyeY:T.y+(H?Ga(z):ah(z)),fx:T.fx??-T.x,fz:T.fz??-T.z,hue:Sn(F,3266489909)})});const l=[];let u=0;for(const T of t??[]){const F=Math.sqrt(1/_v),z=Math.floor(T.w/F),H=Math.floor(T.d/F);for(let G=0;G<z;G++)for(let q=0;q<H;q++){const W=1358954496+u++,Y={key:W,zone:T.name,x:T.x-T.w/2+(G+.15+.7*Sn(W,668265263))*F,z:T.z-T.d/2+(q+.15+.7*Sn(W,374761393))*F};vv(T,Y.x,Y.z)&&l.push(Y)}}const h=su(l.length,r,T=>-Math.hypot(l[T].x-n.x,l[T].z-n.z));l.forEach((T,F)=>{if(!h[F])return;const z=iu(T.key,r);o.push({seatIndex:-1,key:T.key,zone:T.zone,x:T.x,z:T.z,deck:0,h:z,standing:!0,eyeY:Ga(z),fx:n.x-T.x,fz:n.z-T.z,hue:Sn(T.key,3266489909)})});for(const T of o)T.prop=mv(T.key,r),T.handsUp=!T.prop&&Sn(T.key,1332534557)<r.handsUp;const d=new Tt,f=new L;o.forEach((T,F)=>{T.index=F,T.parts=[];const z=T.deck+(T.standing?0:oh);d.position.set(T.x,z,T.z);const H=Math.hypot(T.fx,T.fz)||1;f.set(T.x+T.fx/H*5,z,T.z+T.fz/H*5),d.lookAt(f),d.scale.setScalar(T.h/rh),d.updateMatrix(),T.matrix=d.matrix.clone()});const g=new Wn,_=[],m=[],p=[],A=new $e,E=new $e(r.glowColor);function x(T,F,z,H,G,q=!0){const W=new ll(F,z,H.length);W.name=T;const Y=new Float32Array(H.length*2);return H.forEach((me,xe)=>{Y[xe*2]=me.hue,Y[xe*2+1]=me.standing?1:0,W.setMatrixAt(xe,me.matrix),W.setColorAt(xe,G(me)),me.parts.push({mesh:W,id:xe})}),F.setAttribute("aAnim",new Oa(Y,2)),W.instanceMatrix.needsUpdate=!0,W.instanceColor.needsUpdate=!0,W.userData.people=H,q?_.push(W):W.raycast=()=>{},g.add(W),m.push(W),W}function D(T){return p.push(T),T}const R=new Map;for(const T of o){const F=T.prop??(T.handsUp?"hands":"rest"),z=`${T.standing?"standing":"seated"}${F==="rest"?"":"-"+F}`;R.has(z)||R.set(z,{standing:T.standing,pose:F,list:[]}),R.get(z).list.push(T)}const C=D(uv()),I={};let b=null;for(const[T,{standing:F,pose:z,list:H}]of R){x(`crowd-${T}`,gv(F,z,r.hold),C,H,W=>A.setHSL(.02+W.hue*.72,.26,.36));const G=xs[z]?z:null;if(!G)continue;const q=F?0:uh;I[G]??=G==="sign"?C:D(hv(G)),x(`crowd-${T}-prop`,lv(G,r.hold).translate(0,q,0),I[G],H,W=>{const Y=Sn(W.key,1013904242);return G==="phone"?A.setHSL(.58,.28,.7+Y*.2):G==="board"?A.setHex(nu[Math.floor(Y*nu.length)]):G==="sign"?A.setHSL(Y,.5,.86):E}),G==="glow"&&(b??=D(dv()),x(`crowd-${T}-halo`,cv(r.hold).translate(0,q,0),b,H,()=>E,!1))}const M=Object.fromEntries($s.map(T=>[T,0]));for(const T of o)T.prop&&M[T.prop]++;return{group:g,meshes:_,all:m,people:o,bySeat:a,materials:p,props:M}}const yv=new pt().makeScale(0,0,0);function Wo(i,e,t){if(!i||e<0||e>=i.people.length)return;const n=i.people[e];for(const{mesh:s,id:r}of n.parts)s.setMatrixAt(r,t?yv:n.matrix),s.instanceMatrix.needsUpdate=!0,s.computeBoundingSphere()}function ru(i){if(i){for(const e of i.all)e.geometry.dispose();for(const e of i.materials)e.dispose()}}const ou=1.75;function Mv(i){const e=Math.hypot(i.x,i.z),t=e<1,n=[];if(t){n.push({x:i.x,z:i.z,dx:0,dz:1,lead:!0});for(let g=0;g<4;g++){const _=g*Math.PI/2+Math.PI/4;n.push({x:i.x+Math.sin(_)*i.width*.26,z:i.z+Math.cos(_)*i.depth*.26,dx:Math.sin(_),dz:Math.cos(_),lead:!1})}}else{const g=-i.x/e,_=-i.z/e,m=-_,p=g,A=(E,x,D)=>n.push({x:i.x+m*E+g*x,z:i.z+p*E+_*x,dx:g,dz:_,lead:D});A(0,i.depth*.26,!0),A(-i.width*.3,-i.depth*.1,!1),A(i.width*.3,-i.depth*.1,!1),A(-i.width*.15,-i.depth*.26,!1),A(i.width*.15,-i.depth*.26,!1)}const s=Xa(),r=new ju({vertexColors:!0,emissive:2756656}),o=new ll(s,r,n.length);o.name="stage-cast";const a=new Tt,c=new $e,l=new L,u=i.height;n.forEach((g,_)=>{a.position.set(g.x,u,g.z),l.set(g.x+g.dx*5,u,g.z+g.dz*5),a.lookAt(l),a.scale.setScalar(ou/rh),a.updateMatrix(),o.setMatrixAt(_,a.matrix),o.setColorAt(_,g.lead?c.setHSL(.11,.62,.66):c.setHSL(.52,.34,.5))}),o.instanceMatrix.needsUpdate=!0,o.instanceColor.needsUpdate=!0;const h=[],d=(g,_,m=0)=>{const p=-g.dz,A=g.dx;return new L(g.x+p*m,u+_*ou,g.z+A*m)};for(const g of n)g.lead?h.push(d(g,.93),d(g,.72,-.12),d(g,.72,.12),d(g,.55)):h.push(d(g,.93),d(g,.72));const f=new Wn;return f.add(o),{group:f,mesh:o,samples:h,material:r}}function au(i){i&&(i.mesh.geometry.dispose(),i.material.dispose())}const dh=(i,e)=>`${i}|${e}`;function Sv(i){const e=new Map,t=new Map;for(const n of i){if(n.standing||n.section===void 0)continue;const s=dh(n.tierName,n.section);let r=e.get(s);if(!r){r={key:s,tierName:n.tierName,section:String(n.section),rows:new Map,labelRows:new Map,seats:[]},e.set(s,r);const l=t.get(r.section)??[];l.push(r),t.set(r.section,l)}r.seats.push(n);let o=r.rows.get(n.row);o||(o={row:n.row,rowLabel:n.rowLabel??String(n.row),seats:[]},r.rows.set(n.row,o)),o.seats.push(n);const a=String(n.ticketRow??n.rowLabel??n.row);let c=r.labelRows.get(a);c||(c={row:n.row,rowLabel:a,seats:[]},r.labelRows.set(a,c)),c.seats.push(n)}for(const n of e.values())for(const s of[...n.rows.values(),...n.labelRows.values()])s.seats.some(r=>r.seat>0)&&s.seats.sort((r,o)=>r.seat-o.seat);return{groups:e,bySection:t}}const Xo=i=>i[Math.floor((i.length-1)/2)];function Ev(i,{tierName:e,section:t}){if(t==null)return[];if(e!==void 0){const n=i.groups.get(dh(e,t));return n?[n]:[]}return i.bySection.get(String(t))??[]}function bv(i,e){if(e==null)return null;const t=typeof e=="number"?e:Number(e);return Number.isFinite(t)&&i.rows.has(t)?i.rows.get(t):i.labelRows.get(String(e))??null}function Tv(i,e){return e.ticketRow!==void 0?i.labelRows.get(String(e.ticketRow)):i.rows.get(e.row)}function wv(i,e){for(const t of Ev(i,e)){const n=Av(t,e);if(n)return n}return null}function Av(i,e){if(e.row===void 0||e.row===null){const r=[...i.rows.values()].sort((o,a)=>o.row-a.row);return Xo(Xo(r).seats)}const t=bv(i,e.row);if(!t)return null;if(e.seat===void 0||e.seat===null)return Xo(t.seats);const n=Number(e.seat);return!Number.isFinite(n)||n<1?null:(t.seats.some(r=>r.seat>0)?t.seats.find(r=>r.seat===n):t.seats[n-1])??null}function Yo(i){return{tierName:i.tierName,section:String(i.section),row:i.ticketRow??i.row,seat:i.seat||void 0}}function fh(i){if(!i)return null;const[e,t,n]=String(i).split("-");return e?{section:e,...t!==void 0&&{row:t},...n!==void 0&&{seat:n}}:null}function Rv(i){return[i.section,i.row,i.seat].filter(e=>e!=null).join("-")}const Cv="0x4AAAAAAFAtTn9ho5_bgM_Z",Pv=["new_venue","mode_issue","seat_issue","other"],Lv={new_venue:"typeNewVenue",mode_issue:"typeModeIssue",seat_issue:"typeSeatIssue",other:"typeOther"};let Dr=null;function Dv(){return window.turnstile?Promise.resolve():Dr||(Dr=new Promise((i,e)=>{const t=document.createElement("script");t.src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit",t.async=!0,t.defer=!0,t.onload=i,t.onerror=e,document.head.append(t)}),Dr)}function Iv(i,{t:e,getState:t}){const n=document.createElement("dialog");n.id="feedback",n.innerHTML=`
    <form method="dialog" novalidate>
      <header><h2>${e("feedback.title")}</h2><button type="button" class="close" data-close aria-label="${e("feedback.close")}">×</button></header>
      <label>${e("feedback.type")}</label>
      <div class="row wrap" id="fbType">${Pv.map((u,h)=>`<button type="button" data-type="${u}"${h===2?' class="on"':""}>${e(`feedback.${Lv[u]}`)}</button>`).join("")}</div>
      <label for="fbMessage">${e("feedback.message")}</label>
      <textarea id="fbMessage" rows="5" maxlength="1000" placeholder="${e("feedback.messagePlaceholder")}"></textarea>
      <label for="fbContact">${e("feedback.contact")}</label>
      <input id="fbContact" type="email" maxlength="200" autocomplete="email" />
      <p class="hint">${e("feedback.context")}</p>
      <div id="fbTurnstile"></div>
      <p class="hint" id="fbStatus" aria-live="polite"></p>
      <div class="row">
        <button type="button" data-close>${e("feedback.close")}</button>
        <button type="submit" class="primary" id="fbSubmit">${e("feedback.submit")}</button>
      </div>
    </form>`,i.append(n);let s="seat_issue",r=null,o=null;const a=u=>n.querySelector(u),c=a("#fbStatus");a("#fbType").addEventListener("click",u=>{const h=u.target.closest("button");if(h){s=h.dataset.type;for(const d of a("#fbType").children)d.classList.toggle("on",d===h)}});for(const u of n.querySelectorAll("[data-close]"))u.addEventListener("click",()=>n.close());async function l(){c.textContent="",n.showModal();try{await Dv(),o===null?o=window.turnstile.render("#fbTurnstile",{sitekey:Cv,theme:"dark",language:e.lang==="zh-Hant"?"zh-tw":e.lang,callback:u=>{r=u},"expired-callback":()=>{r=null},"error-callback":()=>{r=null}}):(window.turnstile.reset(o),r=null)}catch{}}return n.querySelector("form").addEventListener("submit",async u=>{u.preventDefault();const h=a("#fbMessage").value.trim();if(!h){a("#fbMessage").focus();return}if(!r){c.textContent=e("feedback.captcha");return}const d=t(),f=a("#fbSubmit");f.disabled=!0,c.textContent=e("feedback.sending");try{const g=await fetch("/api/feedback",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({type:s,message:h,contact:a("#fbContact").value.trim()||void 0,venue:d.venue,mode:d.mode,model:d.model??void 0,seat:d.ref?[d.ref.section,d.ref.row,d.ref.seat].filter(_=>_!=null).join("-"):void 0,lang:e.lang,url:location.href,turnstileToken:r})});g.status===201?(c.textContent=e("feedback.done"),ss("venue_feedback_submit",{venue:d.venue,venue_feedback_type:s}),a("#fbMessage").value="",setTimeout(()=>n.close(),1200)):g.status===429?c.textContent=e("feedback.rateLimited"):g.status===403?(c.textContent=e("feedback.captcha"),o!==null&&(window.turnstile.reset(o),r=null)):c.textContent=e("feedback.failed")}catch{c.textContent=e("feedback.failed")}finally{f.disabled=!1}}),{open:l,dispose:()=>n.remove()}}const Uv=.05,lu=[16723379,3528447,16761963],Nv=i=>new $n({uniforms:{uColor:{value:new $e(i)},uHaze:{value:0},uGain:{value:1},uLen:{value:1},uTime:{value:0},uSeed:{value:0}},vertexShader:`
    uniform float uLen;
    varying vec3 vN; varying vec3 vV; varying float vT; varying float vD;
    void main() {
      vec4 wp = modelMatrix * vec4(position, 1.0);
      vN = normalize(mat3(modelMatrix) * normal);
      vec3 toCam = cameraPosition - wp.xyz;
      vD = length(toCam);
      vV = toCam / max(vD, 1e-4);
      vT = clamp(-position.y / uLen, 0.0, 1.0);
      gl_Position = projectionMatrix * viewMatrix * wp;
    }
  `,fragmentShader:`
    uniform vec3 uColor; uniform float uHaze; uniform float uGain;
    uniform float uTime; uniform float uSeed;
    varying vec3 vN; varying vec3 vV; varying float vT; varying float vD;
    // 一條乾淨嘅圓錐望落好假 —— 真光柱係一嚿煙飄過就斷一截。
    // 呢兩條係最平嘅 1D value noise，用嚟沿住光束切碎個強度。
    float h1(float x) { return fract(sin(x * 127.1) * 43758.5453); }
    float n1(float x) { float i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
      return mix(h1(i), h1(i + 1.0), f); }
    void main() {
      // 望穿圓錐中心嗰陣光程最長，邊緣係掠射。|N·V| 就係呢個積分嘅平價
      // 近似：中心 → 1，邊緣 → 0，出嚟係一條軟邊光柱而唔係一個空殼輪廓。
      float core = pow(abs(dot(normalize(vN), normalize(vV))), 3.0);
      // 越遠越散越暗；燈嘴嗰頭亦要收一收，唔好見到個尖點。
      float along = mix(1.0, 0.12, vT) * smoothstep(0.0, 0.06, vT);
      // 第一人稱企喺人群入面，掃燈會直接掃過你個鏡頭。冇呢個近距離淡出，
      // 個錐一貼面就佔滿成個畫面變一大塊純色，仲會俾 near plane 切出直邊。
      float near = smoothstep(1.0, 9.0, vD);
      // 兩層唔同頻率嘅噪聲各自飄，模擬煙一嚿嚿咁穿過光束。
      float grain = 0.55
        + 0.55 * n1(vT * 7.0 - uTime * 0.45 + uSeed)
        + 0.25 * n1(vT * 19.0 - uTime * 0.9 + uSeed * 3.1);
      gl_FragColor = vec4(uColor * uGain, core * along * near * grain * uHaze);
    }
  `,transparent:!0,blending:zs,depthWrite:!1,side:wn});function Fv(i,e=22,t={}){const n=new Wn;n.name="stage-beams";const s=Math.max(i.height+4,Math.min(e-2.5,t.rigHeight??i.height+11)),r=t.audienceReach?t.audienceReach.far+10:62,o=new ul(Math.tan(Uv)*r,r,18,1,!0).translate(0,-r/2,0),a=Math.hypot(i.x,i.z),c=a<1?0:-i.x/a,l=a<1?1:-i.z/a,u=-l,h=c,d=[],f=10;for(let g=0;g<f;g++){const _=(g/(f-1)-.5)*i.width*1.1,m=new Tt;if(m.position.set(i.x+u*_+c*i.depth*.1,s,i.z+h*_+l*i.depth*.1),m.rotation.y=Math.atan2(c,l),a<1){const E=g*2*Math.PI/f;m.position.set(i.x+Math.sin(E)*i.width*.32,s,i.z+Math.cos(E)*i.depth*.32),m.rotation.y=E}const p=Nv(lu[g%lu.length]);p.uniforms.uLen.value=r,p.uniforms.uGain.value=t.beamGain??.22,p.uniforms.uSeed.value=g*13.77;const A=new $t(o,p);A.raycast=()=>{},m.add(A),n.add(m),d.push({pivot:m,mesh:A,side:_,mat:p,phase:g*2.39996%(Math.PI*2),dir:g%2?1:-1})}return{group:n,beams:d,geometry:o,audienceReach:t.audienceReach,fx:c,fz:l,lx:u,lz:h,len:r}}const Ov=new L(0,-1,0),qo=new L;function cu(i,e,t){if(i)for(const n of i.beams){if(i.audienceReach){const s=i.audienceReach,r=s.near+(s.far-s.near)*(.5+.5*Math.sin(e*.24+n.phase)),o=Math.sin(e*.19+n.phase)*s.halfWidth-n.side;qo.set(i.fx*r+i.lx*o,s.downHeight-n.pivot.position.y,i.fz*r+i.lz*o);const a=qo.length();n.pivot.quaternion.setFromUnitVectors(Ov,qo.normalize()),n.mesh.scale.setScalar(a/i.len)}else n.pivot.rotation.z=Math.sin(e*.55+n.phase)*.62*n.dir,n.pivot.rotation.x=-(.55+Math.sin(e*.4+n.phase*1.7)*.42);n.mat.uniforms.uTime.value=e,n.mat.uniforms.uHaze.value=t}}function Bv(i){if(i){i.geometry.dispose();for(const e of i.beams)e.mat.dispose()}}function zv(i,e={}){const t=new Wn;t.name="concert-lasers";const n=new Pi(1,1,1,6,1,!0),s=e.laserRaysPerFan??7,r=8*s,o=R=>{const C=new ui({color:16777215,transparent:!0,opacity:R,blending:zs,depthWrite:!1,toneMapped:!1}),I=new ll(n,C,r);return I.instanceMatrix.setUsage(Md),I.frustumCulled=!1,I.raycast=()=>{},t.add(I),I},a=o(.055),c=o(.85),l=[],u=e.ceiling??1/0,h=Math.min(e.rigHeight??i.height+12,u-2.5),d=Math.min(e.upperLaserHeight??i.height+21,u-1),g=Math.hypot(i.x,i.z)<1?Math.PI/2:Math.atan2(-i.z,-i.x),_=[3735446,4247551,10842367,16730300];for(const R of["down","up"])for(let C=0;C<4;C++){const I=C===0||C===3?-1:1,b=C<2?-1:1;l.push({direction:R,phase:C*1.7,angle:Math.atan2(b,I),origin:new L(i.x+I*i.width*.4,R==="down"?h:i.height+.15,i.z+b*i.depth*.4),color:new $e(_[(C+(R==="up"?1:0))%4])})}for(let R=0;R<r;R++){const C=l[Math.floor(R/s)].color;c.setColorAt(R,C),a.setColorAt(R,C)}const m=new Tt,p=new L(0,1,0),A=new L,E=new L;function x(R){let C=0;for(const I of l){const b=Math.sin(R*.32+I.phase)*.2;for(let M=0;M<s;M++){const T=(s-1)/2,F=(M-T)/Math.max(1,T);if(e.audienceReach){const H=e.audienceReach,G=H.near+(H.far-H.near)*(.5+.5*Math.sin(R*.27+I.phase)),q=(F*.72+Math.sin(R*.23+I.phase)*.28)*H.halfWidth;E.set(i.x+Math.cos(g)*G-Math.sin(g)*q,I.direction==="up"?d:H.downHeight,i.z+Math.sin(g)*G+Math.cos(g)*q)}else if(I.direction==="up"){const H=I.angle+b+F*(.34+.08*Math.sin(R*.23+I.phase)),G=10+2*Math.sin(R*.27+I.phase);E.set(I.origin.x+Math.cos(H)*G,d,I.origin.z+Math.sin(H)*G)}else{const H=I.angle+Math.PI+b,G=Math.min(i.width,i.depth)*.28;E.set(I.origin.x+Math.cos(H)*G-Math.sin(H)*F*2.2,i.height+.04,I.origin.z+Math.sin(H)*G+Math.cos(H)*F*2.2)}A.subVectors(E,I.origin);const z=A.length();m.position.copy(I.origin).add(E).multiplyScalar(.5),m.quaternion.setFromUnitVectors(p,A.normalize()),m.scale.set(.018,z,.018),m.updateMatrix(),c.setMatrixAt(C,m.matrix),m.scale.set(.075,z,.075),m.updateMatrix(),a.setMatrixAt(C,m.matrix),C++}}c.instanceMatrix.needsUpdate=!0,a.instanceMatrix.needsUpdate=!0}function D(){t.removeFromParent(),c.dispose(),a.dispose(),n.dispose(),c.material.dispose(),a.material.dispose()}return x(0),{group:t,step:x,dispose:D,core:c,fixtures:l,count:r}}const _l=["clear","dark","concert"],kv={clear:{ambient:1.15,key:.7,stage:900,background:658975},dark:{ambient:.018,key:.012,stage:180,background:66055},concert:{ambient:.028,key:.018,stage:320,background:66055}};function Hv({scene:i,ambient:e,key:t,stageLight:n}){let s=null,r=null,o=null,a=[],c=null,l=0,u="clear",h=!0,d=!1,f=!0,g=!0,_=1900;const m=i.background.clone(),p=i.fog.color.clone(),A=n.color.clone();function E(){o&&(o.removeFromParent(),Bv(s),r?.dispose(),r=null,o.traverse(M=>{M.userData.lightingFixture&&(M.geometry.dispose(),M.material.dispose())}),s=null,o=null,a=[],c=null)}function x(M,T,F={}){E(),l=0,_=F.concertWashIntensity??1900,o=new Wn,o.name="concert-lighting",s=Fv(M,F.ceiling??22,F),o.add(s.group),r=zv(M,F),o.add(r.group);for(let z=0;z<s.beams.length;z++){const H=s.beams[z],G=new $t(new $r(.1,6,4),new ui({color:H.mat.uniforms.uColor.value}));G.userData.lightingFixture=!0,G.raycast=()=>{},H.pivot.add(G)}{const z=new ip(15002623,0,40,.72,.85,2);z.position.set(M.x,M.height+10,M.z),z.target.position.set(M.x,M.height+1,M.z),o.add(z,z.target),a.push(z)}c=new Zu(7585256,0,28,2),c.position.set(M.x+(T==="end"?M.width*.38:0),T==="end"?M.height+4:12,M.z),F.screenGlowPosition&&c.position.set(...F.screenGlowPosition),o.add(c),i.add(o),D()}function D(){const M=kv[u];e.intensity=M.ambient,t.intensity=M.key,n.intensity=M.stage,n.color.copy(u==="clear"?A:new $e(u==="dark"?11979245:10179291)),i.background.copy(u==="clear"?m:new $e(M.background)),i.fog.color.copy(u==="clear"?p:new $e(M.background)),o&&(s.group.visible=u==="concert",r.group.visible=u==="concert"&&g,r.group.visible&&r.step(l),a.forEach(T=>{T.intensity=u==="clear"?0:u==="concert"?_:1900}),c.intensity=u!=="clear"&&f?160:0,cu(s,l,u==="concert"?.58:0))}function R(M={}){_l.includes(M.mode)&&(u=M.mode),typeof M.motion=="boolean"&&(h=M.motion),typeof M.reduced=="boolean"&&(d=M.reduced),typeof M.screens=="boolean"&&(f=M.screens),typeof M.lasers=="boolean"&&(g=M.lasers),D()}function C(M){u==="concert"&&h&&!d&&(l+=Math.min(.05,Math.max(0,M)),cu(s,l,.58),g&&r?.step(l))}function I(){return{mode:u,motion:h,playing:u==="concert"&&h&&!d,reduced:d,time:l,ambient:e.intensity,key:t.intensity,stage:n.intensity,screenGlow:c?.intensity??0,beamCount:s?.beams.length??0,spotCount:a.length,lasers:g,lasersVisible:r?.group.visible??!1,laserCount:r?.count??0}}function b(){R({mode:"clear"}),E()}return{build:x,set:R,step:C,state:I,dispose:b}}function Vv({onChange:i=()=>{}}={}){let e=null,t=null,n=null,s=null,r="",o="",a=!1,c=!0,l=!1,u=!1;function h(){s?.setScreenVideo?.(t,e?.videoWidth/e?.videoHeight||16/9)}function d(){return{loaded:!!e,name:r,error:o,blocked:a,enabled:c,paused:e?.paused??!0,muted:e?.muted??!0,time:e?.currentTime??0,duration:e?.duration||0,ready:!!e&&e.readyState>=2,width:e?.videoWidth??0,height:e?.videoHeight??0}}function f(){l||i(d())}function g(){const R=e;e=null,R&&(R.pause(),R.removeAttribute("src"),R.load()),t?.dispose(),t=null,n&&URL.revokeObjectURL(n),n=null,r="",o="",a=!1,u=!1,h(),f()}async function _(){const R=e;if(!(!R||!c)){a=!1,o="";try{await R.play()}catch(C){if(e!==R||l||C.name==="AbortError")return;C.name==="NotAllowedError"?a=!0:o="playback"}e===R&&f()}}function m(R,C){g();const I=document.createElement("video");e=I,r=C,I.muted=!0,I.defaultMuted=!0,I.playsInline=!0,I.loop=!0,I.preload="auto",I.setAttribute("playsinline",""),R instanceof Blob?(n=URL.createObjectURL(R),I.src=n):I.src=R,t=new vf(I),t.colorSpace=un;for(const b of["loadedmetadata","loadeddata","play","pause","volumechange","error"])I.addEventListener(b,()=>{e!==I||l||(b==="loadedmetadata"&&h(),b==="error"&&(o="decode",I.pause()),f())});h(),f(),c?_():u=!0}function p(R,C=!0){s=R,A(!!R?.setScreenVideo&&C),h(),f()}function A(R){R!==c&&(c=R,c?u&&(u=!1,_()):(u=!!e&&!e.paused,e?.pause()),f())}function E(){u=!1,e?.pause()}function x(R){e&&(e.muted=R)}function D(){l=!0,s=null,g()}return{load:m,clear:g,play:_,pause:E,mute:x,bind:p,setEnabled:A,state:d,dispose:D}}function Gv(i){const e=i.array.slice(),t=e.slice(),n=e.slice();let s=[],r=[];const o=d=>d.map(f=>f.index),a=(d,f)=>d.length===f.length&&d.every((g,_)=>g===f[_]);function c(d){for(let f=0;f<d.length;){const g=d[f];let _=g;for(;++f<d.length&&d[f]===_+1;)_=d[f];i.addUpdateRange(g*3,(_-g+1)*3)}i.needsUpdate=!0}function l(d){if(n.set(e),d.length){for(let f=0;f<n.length;f++)n[f]*=.22;for(const f of d){const g=f.index*3;n[g]=1,n[g+1]=.78,n[g+2]=.3}}t.set(n),i.array.set(n),s=[],r=[],i.clearUpdateRanges(),i.addUpdateRange(0,n.length),i.needsUpdate=!0}function u(d){const f=o(d);if(a(f,r))return;const g=[...new Set([...r,...f,...s])].sort((_,m)=>_-m);for(const _ of r)for(let m=0;m<3;m++)n[_*3+m]=t[_*3+m];for(const _ of f)for(let m=0;m<3;m++)n[_*3+m]=t[_*3+m]+(1-t[_*3+m])*.42;for(const _ of g)for(let m=0;m<3;m++)i.array[_*3+m]=n[_*3+m];r=f,s=[],c(g)}function h(d){const f=o(d);if(a(f,s))return;const g=[...new Set([...s,...f])].sort((m,p)=>m-p),_=i.array;for(const m of s)for(let p=0;p<3;p++)_[m*3+p]=n[m*3+p];for(const m of f)for(let p=0;p<3;p++)_[m*3+p]=n[m*3+p]+(1-n[m*3+p])*.55;s=f,c(g)}return{setSection:l,setFocus:u,highlight:h}}const Wv="(hover: hover) and (pointer: fine) and (min-width: 641px)",ph="venue-view-pin",uu=24,Xv=350,Yv='<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M8 3h8v2l-1.5 1v5l3 3v2h-5v5l-.5 1-.5-1v-5h-5v-2l3-3V6L8 5z"/></svg>',hu=(i,e)=>`<button type="button" class="pinBtn" id="${i}" aria-pressed="true" aria-label="${e("panel.pinLabel")}">${Yv}</button>`,du=(i,e)=>`<button type="button" class="edgeTab" id="${i}" aria-label="${e}"><span aria-hidden="true"></span></button>`;function qv(){try{const i=JSON.parse(localStorage.getItem(ph));return{left:i?.left!==!1,right:i?.right!==!1}}catch{return{left:!0,right:!0}}}function $v({sides:i,t:e,on:t}){const n=matchMedia(Wv),s=qv(),r={},o=(l,u)=>{clearTimeout(r[l]),r[l]=null,i[l].el.dataset.peek=String(u)},a=l=>{r[l]||(r[l]=setTimeout(()=>{r[l]=null;const{el:u}=i[l];u.matches(":hover")||u.querySelector(":focus-visible")||(u.dataset.peek="false")},Xv))};function c(l,u,h){const{el:d,pin:f}=i[l];if(s[l]=u,d.dataset.pinned=String(u),f.setAttribute("aria-pressed",String(u)),f.title=e(u?"panel.pinOn":"panel.pinOff"),o(l,!u&&h&&(d.matches(":hover")||d.contains(document.activeElement))),!!h){try{localStorage.setItem(ph,JSON.stringify(s))}catch{}ss("venue_panel_pin",{venue_panel:l,venue_pinned:String(u)})}}for(const[l,{el:u,pin:h,edge:d}]of Object.entries(i))c(l,s[l],!1),h.addEventListener("click",()=>c(l,!s[l],!0)),u.addEventListener("pointerenter",()=>{s[l]||o(l,!0)}),u.addEventListener("pointerleave",()=>{s[l]||a(l)}),u.addEventListener("focusin",()=>{s[l]||o(l,!0)}),u.addEventListener("focusout",()=>{s[l]||a(l)}),d.addEventListener("click",()=>{o(l,!0),h.focus({preventScroll:!0})});return t(window,"pointermove",l=>{if(!(l.pointerType!=="mouse"||l.buttons||!n.matches))for(const[u,{el:h}]of Object.entries(i)){if(s[u]||h.hidden)continue;(u==="left"?l.clientX<=uu:l.clientX>=innerWidth-uu)||h.contains(l.target)?o(u,!0):h.dataset.peek==="true"&&a(u)}}),t(document.documentElement,"mouseleave",()=>{for(const l of Object.keys(i))s[l]||a(l)}),{dispose:()=>Object.values(r).forEach(clearTimeout)}}const qa={hkc:{load:()=>Zn(()=>import("./hkc-0MKmUkEr.js"),__vite__mapDeps([0,1,2,3]))},awe:{load:()=>Zn(()=>import("./awe-BVwtCF4o.js"),__vite__mapDeps([4,1,2,5,3]))},viva:{load:()=>Zn(()=>import("./viva-C4CmZVZh.js"),__vite__mapDeps([6,1,3]))},summit:{load:()=>Zn(()=>import("./summit-BEJe8GIN.js"),__vite__mapDeps([7,8,1,3]))},r11:{load:()=>Zn(()=>import("./r11-DiFttFTp.js"),__vite__mapDeps([9,8,1,3]))},tpa:{load:()=>Zn(()=>import("./tpa-BzVOqAJ-.js"),__vite__mapDeps([10,1,3]))},kts:{load:()=>Zn(()=>import("./kts-D3A_eNdl.js"),__vite__mapDeps([11,1,12,5,2,3]))},kta:{load:()=>Zn(()=>import("./kta-C6NTDEfa.js"),__vite__mapDeps([13,1,12,3]))}},Kv=i=>`
<canvas id="scene"></canvas>
<div id="labels"></div>

<div id="topbar">
  <button id="barBack" type="button" hidden><span aria-hidden="true">←</span><span id="barBackLabel"></span></button>
  <div data-slot="bar"></div>
  <span id="barTitle"></span>
  <button id="optionsBtn" type="button" aria-expanded="false" aria-controls="panel">${i("panel.options")}</button>
</div>

<div id="scrim" hidden></div>

<div id="panel" data-open="false" data-tab="display" data-pinned="true">
  ${hu("panelPin",i)}
  <button id="sheetHandle" type="button" aria-label="${i("panel.closeOptions")}"><span></span></button>
  <div id="panelTabs" role="tablist">
    <button type="button" role="tab" data-tab="display" class="on" aria-selected="true">${i("panel.tabDisplay")}</button>
    <button type="button" role="tab" data-tab="crowd" aria-selected="false">${i("panel.tabCrowd")}</button>
    <button type="button" role="tab" data-tab="more" aria-selected="false">${i("panel.tabMore")}</button>
  </div>
  <div class="panelBody">
    <div data-slot="head"></div>

    <section class="group" data-tab="display" data-tabhead>
      <h3>${i("panel.stage")}</h3>
      <div class="row wrap" id="mode"></div>
      <p id="modeNote" class="hint" hidden></p>
      <div id="tpaModel" class="row wrap" hidden></div>
      <p id="tpaModelNote" class="hint" hidden></p>
    </section>

    <section class="group" id="productionOptions" data-tab="display" hidden>
      <h3>${i("production.title")}</h3>
      <label class="check"><input id="productionScreens" type="checkbox" checked /> ${i("production.screens")}</label>
      <label class="check"><input id="productionAudio" type="checkbox" checked /> ${i("production.audio")}</label>
      <div id="screenVideoControls">
        <button type="button" id="screenVideoChoose">${i("screenVideo.choose")}</button>
        <input type="file" id="screenVideoFile" accept="video/mp4,video/webm,video/quicktime" hidden />
        <p class="hint" id="screenVideoName"></p>
        <div class="row">
          <button type="button" id="screenVideoPlay" disabled>${i("screenVideo.play")}</button>
          <button type="button" id="screenVideoClear" disabled>${i("screenVideo.clear")}</button>
        </div>
        <label class="check"><input type="checkbox" id="screenVideoMuted" checked disabled /> ${i("screenVideo.muted")}</label>
        <p class="hint" id="screenVideoStatus" role="status"></p>
      </div>
      <p class="hint">${i("production.note")}</p>
    </section>

    <section class="group" id="lightingOptions" data-tab="display" hidden>
      <h3>${i("lighting.title")}</h3>
      <div class="row" id="lighting" role="group" aria-label="${i("lighting.title")}">
        ${_l.map(e=>`<button type="button" data-lighting="${e}" aria-pressed="false">${i(`lighting.${e}`)}</button>`).join("")}
      </div>
      <label class="check"><input id="lightingMotion" type="checkbox" checked /> ${i("lighting.motion")}</label>
      <label class="check"><input id="lightingLasers" type="checkbox" checked /> ${i("lighting.lasers")}</label>
      <p class="hint">${i("lighting.note")}</p>
      <p class="hint" id="lightingReduced" hidden>${i("lighting.reduced")}</p>
    </section>

    <section class="group" data-tab="display">
      <h3>${i("panel.tint")}</h3>
      <div class="row" id="tint"></div>
      <!-- 視線射線係研究／校準用嘅嘢（睇邊條被擋），一般用戶唔需要，出街版收起，
           同模型候選、校準對照圖一樣淨係 ?dev=1 先出。element 要留喺 DOM，
           drawRays() 每幀都會讀佢個 checked。 -->
      <label class="check" id="raysRow" hidden><input id="rays" type="checkbox" /> ${i("panel.rays")}</label>
    </section>

    <section class="group" id="sectionReview" data-tab="display" hidden>
      <h3>${i("sectionReview.title")}</h3>
      <label for="sectionChoice">${i("sectionReview.section")}</label>
      <select id="sectionChoice"></select>
      <label for="sectionTier">${i("sectionReview.tier")}</label>
      <select id="sectionTier"></select>
      <p id="sectionSummary" class="hint" aria-live="polite"></p>
      <button id="sectionClear" type="button">${i("sectionReview.clear")}</button>
    </section>

    <section class="group" data-tab="crowd" data-tabhead>
      <h3>${i("panel.fill")}</h3>
      <div class="row tight" id="fill">
        <button data-fill="0" class="on">${i("panel.fillEmpty")}</button>
        <button data-fill="30">30%</button>
        <button data-fill="50">50%</button>
        <button data-fill="80">80%</button>
        <button data-fill="100">100%</button>
      </div>

      <div id="crowdOpts" hidden>
        <label>${i("panel.order")}</label>
        <div class="row" id="order">
          <button data-order="random" class="on">${i("panel.orderRandom")}</button>
          <button data-order="demand">${i("panel.orderDemand")}</button>
        </div>

        <label>${i("panel.posture")}</label>
        <div class="row" id="posture">
          <button data-posture="sit" class="on">${i("panel.postureSit")}</button>
          <button data-posture="stand">${i("panel.postureStand")}</button>
        </div>

        <label>${i("panel.height")}</label>
        <div class="row" id="hmode">
          <button data-hmode="fixed" class="on">${i("panel.heightFixed")}</button>
          <button data-hmode="random">${i("panel.heightRandom")}</button>
        </div>
        <div class="num" id="hFixedBox">
          <input id="hFixed" type="number" min="1.2" max="2.1" step="0.01" value="1.70" /><span>m</span>
        </div>
        <div class="num" id="hRangeBox" hidden>
          <input id="hMin" type="number" min="1.2" max="2.1" step="0.01" value="1.55" /><span>–</span>
          <input id="hMax" type="number" min="1.2" max="2.1" step="0.01" value="1.85" /><span>m</span>
        </div>

        <label>${i("panel.hands")}</label>
        <div class="row tight" id="hands">
          <button data-hands="0" class="on">${i("panel.handsNone")}</button>
          <button data-hands="30">30%</button>
          <button data-hands="70">70%</button>
          <button data-hands="100">${i("panel.handsAll")}</button>
        </div>

        <label>${i("panel.props")}</label>
        <div class="props">
          ${$s.map(e=>{const t=$a(e);return`<span>${i("panel."+t)}</span>
          <div class="row tight" id="${t}">
            ${mh[e].map((n,s)=>`<button data-${t.replace(/[A-Z]/g,r=>"-"+r.toLowerCase())}="${n}"${s?"":' class="on"'}>${n?n+"%":i("panel.handsNone")}</button>`).join("")}
          </div>`}).join(`
`)}
          <span>${i("panel.propHold")}</span>
          <div class="row tight" id="propHold">
            <button data-prop-hold="chest" class="on">${i("panel.holdChest")}</button>
            <button data-prop-hold="high">${i("panel.holdHigh")}</button>
          </div>
        </div>

        <label>${i("panel.motion")}</label>
        <div class="row" id="motion">
          <button data-motion="sway">${i("panel.motionSway")}</button>
          <button data-motion="jump">${i("panel.motionJump")}</button>
          <button data-motion="wave">${i("panel.motionWave")}</button>
        </div>

        <p class="hint">${i("panel.crowdNote")}</p>
        <p class="hint" id="propsActual" hidden></p>
        <p class="hint">${i("panel.propsNote")}</p>
      </div>
    </section>

    <div data-slot="foot" data-tab="more" data-tabhead></div>

    <button type="button" id="feedbackBtn" class="ghost" data-tab="more">${i("panel.feedback")}</button>
    <p class="hint" id="keysHint" data-tab="more">${i("panel.keysHint")} ${i("panel.keysHintSeat")}</p>
    <p class="stat" id="count" data-tab="more"></p>
    <div data-slot="provenance" data-tab="more"></div>
  </div>
</div>
<!-- 自動隱藏時邊緣嘅拉手；緊跟喺面板後面，CSS 用 + 揀（面板收埋先出） -->
${du("panelEdge",i("panel.showOptions"))}

<div id="readout" hidden data-open="false" data-pinned="true">
  ${hu("readoutPin",i)}
  <button id="readoutHandle" type="button" aria-expanded="false" aria-controls="readoutBody">
    <span class="briefText">
      <span id="readoutSeat"></span>
      <span id="readoutBrief"></span>
    </span>
  </button>
  <div class="readoutBody" id="readoutBody">
  <button id="back">← ${i("readout.back")}<span class="key">Esc</span></button>
  <h2 id="seatLabel"></h2>
  <p id="seatIdentityNote" class="hint" hidden></p>
  <dl>
    <dt>${i("readout.dist")}</dt><dd id="dist"></dd>
    <dt>${i("readout.vis")}</dt><dd id="vis"></dd>
    <dt>${i("readout.cval")}</dt><dd id="cval"></dd>
    <dt>${i("readout.ang")}</dt><dd id="ang"></dd>
  </dl>
  <label>${i("readout.myHeight")}</label>
  <div class="me">
    <div class="num"><input id="meH" type="number" min="1.2" max="2.1" step="0.01" value="1.70" /><span>m</span></div>
    <div class="row" id="mePose">
      <button data-me-pose="sit" class="on">${i("readout.sit")}</button>
      <button data-me-pose="stand">${i("readout.stand")}</button>
    </div>
  </div>
  <details id="viewSettings">
    <summary>${i("readout.viewSettings")}</summary>
    <div class="vsBody">
      <h3>${i("panel.fov")} <span class="value"><span id="fovVal">50</span>°</span></h3>
      <input id="fov" type="range" min="30" max="80" value="50" />
    </div>
  </details>
  <p class="hint" id="viewHint">${i("readout.hintDefault")}</p>
  <p class="hint">${i("readout.visNote")}</p>
  </div>
</div>
${du("readoutEdge",i("panel.showReadout"))}

<p id="tip">${i("tip.overview")}</p>
<button id="zoomBadge" type="button" hidden></button>
<div id="drill" hidden>
  <button id="drillBack" hidden>← ${i("drill.back")}</button>
  <span id="drillLabel"></span>
  <button id="drillEnter">${i("drill.enter")}</button>
</div>
<div id="seatTip" hidden></div>
<div id="toast" hidden role="status"></div>
`,mh={phone:[0,30,70],board:[0,10,30],sign:[0,10,30],glow:[0,50,100]};for(const i of $s)mh[i]??=[0,30,70];const $a=i=>"prop"+i[0].toUpperCase()+i.slice(1);function jv(i,e={}){const t=e.t??pu(e.lang??"zh-Hant"),n=e.dev===!0;i.innerHTML=Kv(t);const s=v=>i.querySelector(v),r={head:s('[data-slot="head"]'),bar:s('[data-slot="bar"]'),foot:s('[data-slot="foot"]'),provenance:s('[data-slot="provenance"]')};s("#raysRow").hidden=!n;const o=Iv(i,{t,getState:()=>to()});s("#feedbackBtn").addEventListener("click",()=>o.open());const a=s("#panel"),c=s("#scrim"),l=s("#optionsBtn");function u(v){a.dataset.open=String(v),c.hidden=!v,l.setAttribute("aria-expanded",String(v)),l.classList.toggle("on",v)}l.addEventListener("click",()=>u(a.dataset.open!=="true"));const h=s("#readout");s("#readoutHandle").addEventListener("click",()=>{const v=h.dataset.open!=="true";h.dataset.open=String(v),s("#readoutHandle").setAttribute("aria-expanded",String(v))}),s("#barBack").addEventListener("click",()=>{Je!=="transit"&&(Rl()==="seat"?ke(!1):eo())}),s("#sheetHandle").addEventListener("click",()=>u(!1)),c.addEventListener("click",()=>u(!1)),s("#panelTabs").addEventListener("click",v=>{const P=v.target.closest("button[data-tab]");if(P){a.dataset.tab=P.dataset.tab;for(const X of a.querySelectorAll("#panelTabs button")){const Z=X===P;X.classList.toggle("on",Z),X.setAttribute("aria-selected",String(Z))}}});const d=[],f=(v,P,X,Z)=>{v.addEventListener(P,X,Z),d.push(()=>v.removeEventListener(P,X,Z))},g=$v({t,on:f,sides:{left:{el:a,pin:s("#panelPin"),edge:s("#panelEdge")},right:{el:h,pin:s("#readoutPin"),edge:s("#readoutEdge")}}});let _=e.venue??"hkc",m=null;const p=s("#scene"),A=new X0({canvas:p,antialias:!0});A.setPixelRatio(Math.min(devicePixelRatio,2));const E=new hf;E.background=new $e(658975),E.fog=new al(658975,120,380);const x=new Qt(55,1,.1,600),D={pos:new L(0,62,94),target:new L(0,4,0)},R=v=>{let P=1/0,X=-1/0,Z=1/0,oe=-1/0;const Ce=new L;for(const Ge of v)Ce.copy(Ge).project(x),P=Math.min(P,Ce.x),X=Math.max(X,Ce.x),Z=Math.min(Z,Ce.y),oe=Math.max(oe,Ce.y);return{n:v.length,x0:P,x1:X,y0:Z,y1:oe}};let C=[],I=60;function b(v,P,X=1200){if(!v)return[];const Z=[];v.traverse(He=>{He.isMesh&&He.geometry?.attributes?.position&&Z.push(He)});const oe=Z.reduce((He,_t)=>He+_t.geometry.attributes.position.count,0),Ce=Math.max(1,Math.ceil(oe/X)),Ge=[],be=new L;for(const He of Z){He.updateWorldMatrix(!0,!1);const _t=He.geometry.attributes.position;for(let Mt=0;Mt<_t.count;Mt+=Ce)be.fromBufferAttribute(_t,Mt).applyMatrix4(He.matrixWorld),Math.hypot(be.x,be.z)<=P&&Ge.push(be.clone())}return Ge}function M(v,P){const Z=new Array(64).fill(null),oe=new Array(64).fill(null);let Ce=0;for(const He of v){const _t=Math.hypot(He.x,He.z);Ce=Math.max(Ce,_t);const Mt=Math.floor((Math.atan2(He.z,He.x)+Math.PI)/(2*Math.PI)*64)%64;(!Z[Mt]||_t>Z[Mt].r)&&(Z[Mt]={x:He.x,y:He.y,z:He.z,r:_t}),(!oe[Mt]||He.y>oe[Mt].y)&&(oe[Mt]={x:He.x,y:He.y,z:He.z,r:_t})}I=Ce;const Ge=Math.max(1,Math.floor(v.length/1500)),be=[];for(let He=0;He<v.length;He+=Ge)be.push(v[He]);C=[...Z,...oe,...be].filter(Boolean).map(He=>new L(He.x,He.y+1.2,He.z)).concat(b(P,Ce*1.35))}const T=new L(0,.55,.84).normalize(),F=new L(0,1,0),z=33,H=62;function G(v){const P=cn.clamp((1.2-v)/.7,0,1),X=cn.degToRad(cn.lerp(z,H,P)),Z=(te?.z??0)>1?-1:1;return T.set(0,Math.sin(X),Z*Math.cos(X)).normalize()}function q(){const v=cn.degToRad(55)/2,P=Math.atan(Math.tan(v)*x.aspect);G(x.aspect);const X=Math.tan(v),Z=Math.tan(P),oe=C;if(!oe.length)return;const Ce=new L,Ge=new L,be=new L,He=new L,_t=new L,Mt=kt=>{Ce.copy(T).multiplyScalar(kt).add(D.target),Ge.copy(D.target).sub(Ce).normalize(),be.crossVectors(Ge,F).normalize(),He.crossVectors(be,Ge).normalize();for(const On of oe){_t.copy(On).sub(Ce);const ro=_t.dot(Ge);if(ro<=.1||Math.abs(_t.dot(be))>Z*ro||Math.abs(_t.dot(He))>X*ro)return!1}return!0};let Xt=I*.4,Nn=I*8;for(let kt=0;kt<36;kt++){const On=(Xt+Nn)/2;Mt(On)?Nn=On:Xt=On}const Fn=Nn*1.04;D.pos.copy(T).multiplyScalar(Fn).add(D.target),W.maxDistance=Math.max(300,Fn*1.6),E.fog.near=Math.max(40,Fn-I*1.25),E.fog.far=Fn+I*2.8}x.position.copy(D.pos);const W=new q0(x,p);W.target.copy(D.target),W.enableDamping=!0,W.maxPolarAngle=Math.PI/2.05;const Y=20;W.minDistance=Y,W.maxDistance=300;const me=v=>{W.minDistance=Math.min(Y,Math.max(1.2,v*.45))},xe=new tp(9412863,658975,1.15);E.add(xe);const De=new op(16777215,.7);De.position.set(40,80,30),E.add(De);const qe=new Zu(16723379,900,120,2);E.add(qe);const Qe=Hv({scene:E,ambient:xe,key:De,stageLight:qe});let lt=!1,et=_l.includes(e.lighting)?e.lighting:"clear",ee=e.lightingMotion!==!1,ae=e.lightingLasers!==!1;const Ae=matchMedia("(prefers-reduced-motion: reduce)");function Be(){const v=lt;Qe.set({mode:v?et:"clear",motion:ee,reduced:Ae.matches,screens:Q.screens,lasers:ae}),i.dataset.lighting=v?et:"clear",s("#lightingOptions").hidden=!v;for(const P of s("#lighting").children){const X=P.dataset.lighting===et;P.classList.toggle("on",X),P.setAttribute("aria-pressed",String(X))}s("#lightingMotion").checked=ee&&!Ae.matches,s("#lightingMotion").disabled=et!=="concert"||Ae.matches,s("#lightingLasers").checked=ae,s("#lightingLasers").disabled=et!=="concert",s("#lightingReduced").hidden=!Ae.matches}f(Ae,"change",Be),s("#lighting").addEventListener("click",v=>{const P=v.target.closest("button");P&&(et=P.dataset.lighting,Be(),In())}),s("#lightingMotion").addEventListener("change",v=>{ee=v.target.checked,Be(),In()}),s("#lightingLasers").addEventListener("change",v=>{ae=v.target.checked,Be(),In()});const Fe=new Sc,nt=new ge;let je="centre",U="zone",se=e.model??null;const Q={screens:!0,audio:!0};function ne(){return m?.MODEL_OPTIONS??[]}function ie(){return m?.DEFAULT_MODEL??"original"}function _e(){ne().some(P=>P.id===se)||(se=ie())}let J=null,fe=null;const Ie={...Wa};let Se=[],w=null,y=null;function k(){y?.traverse(v=>{v.geometry?.dispose(),Array.isArray(v.material)?v.material.forEach(P=>P.dispose()):v.material?.dispose()})}let V=null,te=null;const j=Vv({onChange:v=>{s("#screenVideoName").textContent=v.name,s("#screenVideoPlay").textContent=t(v.paused?"screenVideo.play":"screenVideo.pause"),s("#screenVideoPlay").disabled=!v.loaded||!v.enabled||!!v.error,s("#screenVideoClear").disabled=!v.loaded,s("#screenVideoMuted").checked=v.muted,s("#screenVideoMuted").disabled=!v.loaded;const P=v.error?"error":v.blocked?"blocked":v.loaded?v.enabled?v.ready?v.paused?"paused":"playing":"loading":"hidden":"local";s("#screenVideoStatus").textContent=t(`screenVideo.${P}`)}});s("#screenVideoChoose").addEventListener("click",()=>s("#screenVideoFile").click()),s("#screenVideoFile").addEventListener("change",v=>{const P=v.target.files?.[0];P&&(e.screenVideoDemo=!1,j.load(P,P.name),In()),v.target.value=""}),s("#screenVideoPlay").addEventListener("click",()=>{j.state().paused?j.play():j.pause()}),s("#screenVideoMuted").addEventListener("change",v=>j.mute(v.target.checked)),s("#screenVideoClear").addEventListener("click",()=>{j.clear(),e.screenVideoDemo=!1,In()});const Re=new $t(new Ot(.6,.62,.6),new ui({color:16777215,transparent:!0,opacity:.28}));Re.visible=!1,E.add(Re);const de=new $t(new Ot(.66,.7,.66),new ui({color:16723379,wireframe:!0}));de.visible=!1,E.add(de);const Pe=new _f(new Wt,new Uu({vertexColors:!0}));Pe.visible=!1,E.add(Pe);const Le=s("#labels");let le=[];const Ee=new WeakMap,We=new ResizeObserver(v=>{for(const P of v){const X=P.borderBoxSize[0];Ee.set(P.target,{width:X.inlineSize,height:X.blockSize})}});d.push(()=>We.disconnect());let Oe=0,ye=0;const Ke=new Sc,N=new L,pe=new pt,ve=new pt;function Ue(v){const P=N.subVectors(v.pos,x.position).length();return Ke.set(x.position,N.normalize()),Ke.far=Math.max(0,P-.15),Ke.intersectObjects(V.occluders??[],!1).length>0}function ue(v){return Je!=="overview"||v.el.style.display==="none"||Ue(v)?!1:Js(v.el.dataset.sectionKey,"all")}function re(v){return Le.hidden?null:le.find(P=>{if(!P.el.dataset.sectionKey||P.el.style.display==="none")return!1;const X=Ee.get(P.el);return X&&X.width>0&&Math.abs(v.clientX-P.screenX)<=X.width/2+3&&Math.abs(v.clientY-P.screenY)<=X.height/2+3})}function ze(v){We.disconnect(),Le.replaceChildren(),le=[],V.group.updateMatrixWorld(!0),Oe=0,ye=0;const P=new $e;for(const X of v){const Z=document.createElement(X.sectionKey?"button":"span"),oe={el:Z,pos:new L(X.x,X.y,X.z),occluded:!1};if(Z.textContent=X.text,X.sectionKey){Z.type="button",Z.className="section-marker",Z.dataset.sectionKey=X.sectionKey;const Ce=Qr.get(X.sectionKey);Z.setAttribute("aria-label",t("sectionReview.show",{section:Ce?Qs(Ce.seat,t):X.text})),Z.addEventListener("click",()=>ue(oe))}X.tint!==void 0&&(Z.style.color=`#${P.setHex(X.tint).offsetHSL(0,.1,.28).getHexString()}`),Le.append(Z),X.sectionKey&&We.observe(Z,{box:"border-box"}),le.push(oe)}}let Ye=[];function gt(v){const P=m.rowMarkers?.(je,v);if(P){Ye=P.map(oe=>{const Ce=document.createElement("span");return Ce.className="row",Ce.textContent=oe.text,Ce.dataset.stairId=oe.stairId,Ce.dataset.row=oe.text,Le.append(Ce),{el:Ce,pos:new L(oe.x,oe.y,oe.z),near:new L(...oe.near)}});return}const X=new Map;for(const oe of v){if(oe.tier<0)continue;const Ce=`${oe.tierName}|${oe.geometrySection??oe.section}`,Ge=`${Ce}|${oe.ticketRow??""}|${oe.row}`,be=X.get(Ge);be?(oe.geometrySeat??oe.seat)<(be.a.geometrySeat??be.a.seat)?(be.b=be.a,be.a=oe):(!be.b||(oe.geometrySeat??oe.seat)<(be.b.geometrySeat??be.b.seat))&&(be.b=oe):X.set(Ge,{row:oe.row,prefix:Ce,a:oe,b:null})}const Z=new Map;for(const oe of X.values()){const Ce=`${oe.prefix}|${oe.row}`;Z.has(Ce)||Z.set(Ce,[]),Z.get(Ce).push(oe)}Ye=[];for(const[oe,Ce]of X){const{a:Ge,b:be}=Ce;let He=0,_t=0;if(be){const kt=Math.hypot(Ge.x-be.x,Ge.z-be.z)||1;He=(Ge.x-be.x)/kt*.75,_t=(Ge.z-be.z)/kt*.75}const Mt=document.createElement("span");Mt.className="row",Mt.textContent=Ge.rowLabel??String(Ce.row),Le.append(Mt);const Xt=(Z.get(`${Ce.prefix}|${Ce.row-1}`)??[]).reduce((kt,On)=>!kt||Math.hypot(On.a.x-Ge.x,On.a.z-Ge.z)<Math.hypot(kt.a.x-Ge.x,kt.a.z-Ge.z)?On:kt,null),Nn=new L(Ge.x+He,Ge.y+.55,Ge.z+_t),Fn=Xt?new L(Xt.a.x+He,Xt.a.y+.55,Xt.a.z+_t):Nn.clone().setY(Nn.y+Ge.rowDepth);Ye.push({el:Mt,pos:Nn,near:Fn})}}const Ze=new L,sn=new L;function dn(){const v=Je==="overview";if(Le.hidden!==!v&&(Le.hidden=!v),!v)return;x.updateMatrixWorld();const P=performance.now();if((!pe.equals(x.matrixWorld)||!ve.equals(x.projectionMatrix))&&(pe.copy(x.matrixWorld),ve.copy(x.projectionMatrix),Oe=0,ye=P+100),P>=ye)for(let oe=0;oe<4&&Oe<le.length;oe++){const Ce=le[Oe++];Ce.el.dataset.sectionKey&&(Ce.occluded=Ue(Ce))}const X=innerWidth/2,Z=innerHeight/2;for(const oe of le){if(Ze.copy(oe.pos).project(x),Ze.z<-1||Ze.z>1||Math.abs(Ze.x)>1||Math.abs(Ze.y)>1||oe.occluded){oe.el.style.display="none";continue}oe.el.style.display="",oe.screenX=(Ze.x+1)*X,oe.screenY=(1-Ze.y)*Z,oe.el.style.transform=`translate(-50%, -50%) translate(${oe.screenX}px, ${oe.screenY}px)`}for(const oe of Ye){Ze.copy(oe.pos).project(x),sn.copy(oe.near).project(x);const Ce=Math.hypot((Ze.x-sn.x)*X,(Ze.y-sn.y)*Z);if(Ze.z>1||Ce<7){oe.el.style.display="none";continue}oe.el.style.display="",oe.el.style.transform=`translate(-50%, -50%) translate(${(Ze.x+1)*X}px, ${(1-Ze.y)*Z}px)`}}function Ui({keepSeat:v=!1}={}){V&&(E.remove(V.group),V.disposeProduction?.(),V.group.traverse(Ge=>{Ge.geometry?.dispose?.()})),y&&(E.remove(y),k()),fe&&(E.remove(fe.group),au(fe)),te=m.stagePos(je);const P=m.MODE_NOTES?.[je];s("#modeNote").hidden=!P,s("#modeNote").textContent=P?t(P):"",_e(),m.buildLayout?{structure:V,seats:Se}=m.buildLayout(je,{model:se,equipment:Q}):(V=m.buildStructure(je,{model:se,equipment:Q}),Se=m.buildSeats(je,{model:se})),j.bind(V,Q.screens),s("#productionOptions").hidden=!V.setProductionOptions,s("#productionScreens").checked=Q.screens,s("#productionAudio").checked=Q.audio,s("#productionAudio").closest("label").hidden=V.productionCapabilities?.audio===!1;const X=ne(),Z=s("#tpaModel");Z.hidden=!n||X.length<2,Z.classList.toggle("tpa-variants",_==="tpa"||X.length>3),Z.innerHTML=X.map(Ge=>`<button data-tpa-model="${Ge.id}">${Ge.label}</button>`).join(""),Kt("tpaModel",se);const oe=s("#tpaModelNote"),Ce=m.MODEL_NOTES?.[se];oe.hidden=!n||!Ce,oe.textContent=Ce??"",E.add(V.group),fe=Mv(te),E.add(fe.group),qe.position.set(te.x,9,te.z),lt=!!V.lightingOptions,lt?Qe.build(te,je,V.lightingOptions):Qe.dispose(),Be(),M(Se,V.group),D.target.set(0,6,0),q(),on=[],Se.forEach((Ge,be)=>{Ge.index=be}),w=Sv(Se),Ss=m.sectionGroups?.(Se)??[],Qr=new Map(Ss.map(Ge=>[Ge.key,Ge])),y=m.createSeatMesh(Se,te),vl(),E.add(y),ze(m.aisleMarkers(je,Se).concat(m.wheelchairMarkers(je,Se))),gt(Se),rn(),v||ke(!0),xh()}function Ln(v){s("#count").textContent=v}function rn(){ce=-1,J&&(E.remove(J.group),ru(J),J=null),J=xv(Se,Ie,m.standingZones(je),te,m.seatScore),J&&E.add(J.group);for(const Z of Se)delete Z.eyeY;if(J)for(const Z of J.people)Z.seatIndex>=0&&(Se[Z.seatIndex].eyeY=Z.eyeY);const v=m.countSections?.(Se)??new Set(Se.map(Z=>`${Z.tierName}${Z.section}`)).size,P=Z=>Z.toLocaleString("en");Ln(J?t("panel.statusCrowd",{seats:P(Se.length),zones:P(v),people:P(J.people.length)}):t("panel.status",{seats:P(Se.length),zones:P(v)}));const X=J?$s.filter(Z=>J.props[Z]>0):[];if(s("#propsActual").hidden=!X.length,X.length){const Z=oe=>Math.round(J.props[oe]/J.people.length*100);s("#propsActual").textContent=t("panel.propsActual",{list:X.map(oe=>`${t("panel."+$a(oe))} ${Z(oe)}%`).join(t("panel.listSep"))})}we&&he&&Se[he.index]===he&&Ve(he,!0)}function Kt(v,P){for(const X of s("#"+v).children)X.classList.toggle("on",X.dataset[v]===P)}let Je="overview",St=null,Ni=0,Kn=0,Fi=0,di=0,ys=50;const Zr=.5,Jr=10;let Bt=1,Ms=!1;const Oi=()=>Math.min(120,cn.radToDeg(2*Math.atan(Math.tan(cn.degToRad(ys)/2)/Bt)));function S(){const v=s("#zoomBadge");v.hidden=!we;const P=Bt>=9.95?"10":Bt.toFixed(1);v.textContent=`${P}×`,v.classList.toggle("zoomed",Bt!==1),v.setAttribute("aria-label",t("zoom.label",{zoom:P})),v.title=t("zoom.label",{zoom:P})}function O(v,P=!1){Bt=cn.clamp(v,Zr,Jr),Math.abs(Bt-1)<.02&&(Bt=1),Je==="seat"?(x.fov=Oi(),x.updateProjectionMatrix()):Je==="transit"&&St&&we&&(St.f1=Oi()),S(),P&&!Ms&&(Ms=!0,ss("venue_seat_zoom",{venue:_}))}const K=v=>v<.5?4*v*v*v:1-Math.pow(-2*v+2,3)/2;function $(v,P){const X=P.x-v.x,Z=P.y-v.y,oe=P.z-v.z,Ce=Math.hypot(X,oe);return{yaw:Math.atan2(-X,-oe),pitch:Math.atan2(Z,Ce)}}function B(v,P,X,Z,oe){const Ce=new qn().setFromEuler(new bn(X,P,0,"YXZ"));St={t:0,dur:1100,onDone:oe,p0:x.position.clone(),p1:v.clone(),q0:x.quaternion.clone(),q1:Ce,f0:x.fov,f1:Z},Je="transit",W.enabled=!1}let ce=-1,he=null,we=!1;const Te={h:1.7,standing:!1};function Xe(v){const P=v.standing||Te.standing;return new L(v.x,v.y+(P?Ga(Te.h):ah(Te.h)),v.z)}function Ve(v,P=!1,X="click"){P||ss("venue_seat_enter",{venue:_,venue_level:"seat",venue_via:X}),!P&&Je!=="seat"&&(Bt=1,Ms=!1),P||(we=!0,u(!1)),ce>=0&&Wo(J,ce,!1),ce=v.person??(J?J.bySeat[v.index]:-1),Wo(J,ce,!0);const Z=Xe(v),oe=$(Z,new L(te.x,te.height+1.2,te.z));P||(Ni=oe.yaw,Kn=oe.pitch,Fi=0,di=0),V.group.updateMatrixWorld(!0);const Ce=J?V.occluders.concat(J.meshes):V.occluders,Ge=m.visibility({...v,eyeY:Z.y},fe.samples,Ce,Fe),be=v.standing?null:m.cValue(v,te),He=Math.hypot(v.x-te.x,v.z-te.z);he=v,Re.visible=!1,Bi([]),bs(null),rt(Z,Ge.rays),de.position.set(v.x,v.y+.3,v.z),de.visible=!0;const _t=s("#readout");_t.hidden=!1,s("#seatLabel").textContent=er(v,t),s("#readoutSeat").textContent=er(v,t,{note:!1});const Mt=s("#seatIdentityNote");if(Mt.textContent=[v.seatType==="wheelchair"?t("readout.wheelchairBay"):v.seatType==="companion"?t("readout.companionSeat"):"",v.identityStatus==="simulated"?t("readout.simulatedIdentity"):v.identityStatus==="partial"?t("readout.partialIdentity"):"",v.sectionStatus==="cad-block-ticket-boundary-unverified"?t("readout.cadBlockIdentity"):"",v.closed?t("readout.closedInSource"):"",v.layoutVersion?.startsWith("manifest-2023")?t("readout.manifestStandEstimate"):"",v.referenceScope==="general-numbering"?t("readout.aweKnownStandEstimate"):"",v.sectionCoverage==="partial"?t("readout.awePartialStand"):""].filter(Boolean).join(" · "),Mt.hidden=!Mt.textContent,s("#dist").textContent=`${He.toFixed(1)} m`,s("#vis").textContent=`${Math.round(Ge.ratio*100)}%`,s("#readoutBrief").textContent=`${He.toFixed(1)} m · ${t("readout.visShort")} ${Math.round(Ge.ratio*100)}%`,s("#cval").textContent=be===null?t("readout.cStanding"):be===1/0?t(_==="hkc"?"readout.cFrontRow":"readout.cNoSeatAhead"):`${Math.round(be)} mm（${t(be<60?"readout.cBad":be<90?"readout.cWeak":be<120?"readout.cGood":"readout.cGreat")}）`,s("#ang").textContent=`${m.subtendedAngle(v,te).toFixed(0)}°`,s("#tip").textContent=t("tip.seat"),s("#viewHint").textContent=t("readout.hintSeat",{eye:(Z.y-v.y).toFixed(2),height:Te.h.toFixed(2),pose:t(v.standing||Te.standing?"readout.poseStanding":"readout.poseSitting")}),P){Je==="seat"?x.position.copy(Z):Je==="transit"&&St&&St.p1.copy(Z);return}B(Z,Ni,Kn,Oi(),()=>{Je="seat"}),In(),Un()}s("#meH").addEventListener("input",v=>{const P=Number(v.target.value);P>=1.2&&P<=2.1&&(Te.h=P,he&&Ve(he,!0))}),s("#mePose").addEventListener("click",v=>{const P=v.target.closest("button");P&&(Te.standing=P.dataset.mePose==="stand",Kt("mePose",P.dataset.mePose),he&&Ve(he,!0))});function ke(v){if(we=!1,s("#tip").textContent=t("tip.overview"),Wo(J,ce,!1),ce=-1,v){mt=[],Es=null,W.minDistance=Y,bs(null),he=null,s("#readout").hidden=!0,de.visible=!1,Pe.visible=!1,Je="overview",St=null,x.position.copy(D.pos),x.fov=55,x.updateProjectionMatrix(),W.target.copy(D.target),W.enabled=!0,W.update(),Un();return}Un(),s("#viewHint").textContent=t("readout.hintBack");const P=Es??D;W.minDistance=P.minDistance??Y;const X=$(P.pos,P.target);B(P.pos,X.yaw,X.pitch,55,()=>{Je="overview",W.target.copy(P.target),W.enabled=!0,W.update(),Un()})}function rt(v,P){const X=[],Z=[],oe=new $e(4973476),Ce=new $e(16733296);for(const be of P){const He=be.blocked?Ce:oe;X.push(v.x,v.y,v.z,be.to.x,be.to.y,be.to.z),Z.push(He.r,He.g,He.b,He.r,He.g,He.b)}const Ge=Pe.geometry;Ge.setAttribute("position",new bt(X,3)),Ge.setAttribute("color",new bt(Z,3)),Pe.visible=s("#rays").checked}let ct=!1,ot=null;const ht=new Set;let ut=!1;const Ne=new Map;let ft=null;const at=()=>{const[v,P]=[...Ne.values()];return Math.max(1,Math.hypot(v.x-P.x,v.y-P.y))};function zt(v){const P=p.getBoundingClientRect();nt.x=(v.clientX-P.left)/P.width*2-1,nt.y=-((v.clientY-P.top)/P.height)*2+1}p.addEventListener("pointermove",v=>{if(Ne.has(v.pointerId)&&Ne.set(v.pointerId,{x:v.clientX,y:v.clientY}),ft){Je==="seat"&&Ne.size>=2&&O(ft.z0*at()/ft.d0,!0);return}if(Je==="seat"&&ot){const P=1/Bt;Fi-=(v.clientX-ot.x)*.0032*P,di=cn.clamp(di-(v.clientY-ot.y)*.0028*P,-.85,.75),ot={...ot,x:v.clientX,y:v.clientY};return}zt(v),jn.x=v.clientX,jn.y=v.clientY,ct=!0}),p.addEventListener("pointerleave",()=>{Re.visible=!1,mi.hidden=!0,Je==="overview"&&Bi([])});const Dn=v=>{ht.delete(v.pointerId),Ne.delete(v.pointerId),Ne.size<2&&(ft=null),ot=null,ht.size||(ut=!1)};p.addEventListener("pointercancel",Dn),p.addEventListener("lostpointercapture",Dn),f(window,"blur",()=>{ht.clear(),Ne.clear(),ft=null,ot=null,ut=!1}),p.addEventListener("pointerdown",v=>{ht.size?ut=!0:ut=!1,ht.add(v.pointerId),p.setPointerCapture(v.pointerId),ot={x:v.clientX,y:v.clientY,sx:v.clientX,sy:v.clientY},Ne.set(v.pointerId,{x:v.clientX,y:v.clientY}),Je==="seat"&&Ne.size===2&&(ft={d0:at(),z0:Bt},ot=null)});let Ct=null;p.addEventListener("wheel",v=>{if(Je!=="seat"||Ct)return;v.preventDefault();const P=v.deltaY*(v.deltaMode===1?16:v.deltaMode===2?400:1);O(Bt*Math.exp(-P*(v.ctrlKey?.01:.002)),!0)},{passive:!1}),p.addEventListener("gesturestart",v=>{Je!=="seat"||Ne.size>=2||(v.preventDefault(),Ct={z0:Bt})}),p.addEventListener("gesturechange",v=>{!Ct||Je!=="seat"||Ne.size>=2||(v.preventDefault(),O(Ct.z0*v.scale,!0))}),p.addEventListener("gestureend",()=>{Ct=null}),s("#zoomBadge").addEventListener("click",()=>O(1,!0));function fi(v){return{index:-1,person:v.index,standing:!0,x:v.x,y:v.deck,z:v.z,eyeY:v.eyeY,zone:v.zone,label:`${v.zone??"企位"}（模擬位置）`}}function Et(){Fe.setFromCamera(nt,x);const v=J?[y,...J.meshes]:[y];for(const P of Fe.intersectObjects(v,!0)){if(P.object.userData.seatIndices)return Se[P.object.userData.seatIndices[P.instanceId]];if(P.object===y)return Se[P.instanceId];const X=P.object.userData.people[P.instanceId];if(X)return X.seatIndex>=0?Se[X.seatIndex]:fi(X)}return null}const jt=26,Zt=11;let wt=null,mt=[],_n=null,It=null,on=[],Ss=[],Qr=new Map,Es=null;function vl(){m.paintSeats(y,Se,U,te),wt=Gv(y.instanceColor),wt.setSection(on),wt.setFocus(_n?.level==="row"?_n.members:[])}function xl(v,P){const X=x.position.distanceTo(new L(v.x,v.y,v.z)),Z=(i.clientHeight||innerHeight)/(2*Math.tan(cn.degToRad(x.fov)/2));return P/X*Z}function yl(v){return Je==="seat"||v.standing||!w||xl(v,m.VENUE?.seatWidth??.5)>=jt?"seat":xl(v,v.rowDepth??.85)>=Zt?"row":"section"}const _h=v=>Qs(v,t),vh=v=>Rh(v,t);function Ml(v){const P=yl(v);if(P==="seat")return{level:P,seat:v,members:[v],label:er(v,t,{note:!1})};const X=w.groups.get(`${v.tierName}|${v.section}`);if(!X)return{level:"seat",seat:v,members:[v],label:er(v,t,{note:!1})};if(P==="row"){const Z=Tv(X,v);return{level:P,seat:v,group:X,row:Z,members:Z.seats,label:vh(v),ref:{tierName:X.tierName,section:X.section,row:v.ticketRow??v.row}}}return{level:P,seat:v,group:X,members:X.seats,label:_h(v),ref:{tierName:X.tierName,section:X.section}}}function Bi(v){wt?.highlight(v)}function xh(){s("#sectionReview").hidden=!Ss.length,s('label[for="sectionChoice"]').textContent=t(m.SECTION_LABEL_KEY??"sectionReview.section");const v=s("#sectionChoice");v.replaceChildren(new Option(t("sectionReview.choose"),""));for(const P of Ss)v.add(new Option(Qs(P.seat,t),P.key));It&&Ss.some(P=>P.key===It.key)?Js(It.key,It.tier,!1):Zs()}function Zs(){It=null,on=[],wt?.setSection([]),s("#sectionChoice").value="",s("#sectionTier").replaceChildren(new Option(t("sectionReview.all"),"all")),s("#sectionTier").disabled=!0,s("#sectionClear").disabled=!0,s("#sectionSummary").textContent=t("sectionReview.hint");for(const{el:v}of le)v.dataset.sectionKey&&v.setAttribute("aria-pressed","false")}function Js(v,P="all",X=!0){const Z=Qr.get(v);if(!Z)return!1;X&&we&&ke(!0);const oe=s("#sectionTier");oe.replaceChildren(new Option(t("sectionReview.all"),"all"));const Ce=[...new Set(Z.members.map(be=>be.tier))].sort((be,He)=>be-He);for(const be of Ce)oe.add(new Option(Z.tierLabels?.[be]?Ah(Z.tierLabels[be],t):t(`sectionReview.level${be<0?"Floor":be}`),String(be)));P!=="all"&&!Ce.includes(Number(P))&&(P="all"),oe.value=P,oe.disabled=!1,s("#sectionClear").disabled=!1,s("#sectionChoice").value=v,It={key:v,tier:P},on=Z.members.filter(be=>P==="all"||String(be.tier)===P);const Ge=[...new Set(on.map(be=>be.ticketRow??be.row))];s("#sectionSummary").textContent=t("sectionReview.summary",{count:on.length,rows:Ge.length});for(const{el:be}of le)be.dataset.sectionKey&&be.setAttribute("aria-pressed",String(be.dataset.sectionKey===v));if(wt?.setSection(on),X){const be=on[Math.floor(on.length/2)],He=Qs(be,t);bs({level:"section",seat:be,members:on,label:He,ref:Yo(be)});const _t=on.reduce((Mt,Xt)=>Mt.add(new L(Xt.facingX??-Xt.x,0,Xt.facingZ??-Xt.z)),new L);El(on,"section",He,_t),u(!1)}return!0}s("#sectionChoice").addEventListener("change",v=>{v.target.value?Js(v.target.value):Zs()}),s("#sectionTier").addEventListener("change",v=>{It&&Js(It.key,v.target.value)});for(const[v,P]of[["screens","productionScreens"],["audio","productionAudio"]])s(`#${P}`).addEventListener("change",X=>{V?.setProductionOptions&&(Q[v]=X.target.checked,V.setProductionOptions(Q),Oe=0,ye=0,j.setEnabled(Q.screens),Be(),he&&we&&Ve(he,!0))});s("#sectionClear").addEventListener("click",Zs);const Sl={section:1,row:2};function El(v,P="section",X="",Z=null){const oe=new hi;for(const kt of v)oe.expandByPoint(new L(kt.x,kt.y+.6,kt.z));const Ce=oe.getCenter(new L),Ge=Math.max(oe.getSize(new L).length()/2,2),be=cn.degToRad(55),He=Ge/Math.sin(Math.min(be,be*x.aspect)/2)*1.15,_t=Z?.clone()??new L().subVectors(x.position,W.target);_t.y=0,_t.lengthSq()<1e-4&&_t.set(0,0,1),_t.normalize().multiplyScalar(Math.cos(.61)).setY(Math.sin(.61));const Mt=Ce.clone().addScaledVector(_t,He),Xt=$(Mt,Ce),Nn=Sl[P]??1;let Fn={pos:x.position.clone(),target:W.target.clone(),minDistance:W.minDistance};for(;mt.length&&(Sl[mt.at(-1).level]??1)>=Nn;)Fn=mt.pop();mt.push({...Fn,level:P,label:X}),Es={pos:Mt.clone(),target:Ce.clone(),dist:He,minDistance:Math.min(Y,Math.max(1.2,He*.45))},me(He),B(Mt,Xt.yaw,Xt.pitch,55,()=>{Je="overview",W.target.copy(Ce),W.enabled=!0,W.update(),ct=!0}),Un()}function eo(){const v=mt.pop();if(!v)return!1;!mt.length&&It&&Zs(),W.minDistance=v.minDistance??Y,Es=mt.length?v:null;const P=$(v.pos,v.target);return B(v.pos,P.yaw,P.pitch,55,()=>{Je="overview",W.target.copy(v.target),W.enabled=!0,W.update(),ct=!0,Un()}),bs(null),!0}const bl=s("#drill"),Tl=s("#drillLabel"),wl=s("#drillBack");function bs(v){if(_n=v,wt?.setFocus(v?.level==="row"?v.members:[]),Un(),wl.hidden=mt.length===0,!v||v.level==="seat"){bl.hidden=mt.length===0,Tl.textContent="",s("#drillEnter").hidden=!0;return}bl.hidden=!1,Tl.textContent=v.label,s("#drillEnter").hidden=!1}s("#drillEnter").addEventListener("click",()=>{_n?.ref&&no(_n.ref,!1,"shortcut")}),wl.addEventListener("click",eo),p.addEventListener("pointerup",v=>{const P=!ot||ut||Math.hypot(v.clientX-ot.sx,v.clientY-ot.sy)>4;if(ht.delete(v.pointerId),Ne.delete(v.pointerId),Ne.size<2&&(ft=null),ot=null,P||Je!=="overview"&&Je!=="seat"||!y)return;const X=Je==="overview"?re(v):null;if(X&&ue(X))return;zt(v);const Z=Et();if(!Z)return;const oe=Ml(Z);if(oe.level==="seat"){Z!==he&&Ve(Z);return}Bi(oe.members),bs(oe),El(oe.members,oe.level,oe.label)}),s("#back").addEventListener("click",()=>ke(!1));function Al(v){return!m.MODES.some(P=>P.id===v)||v===je?!1:(je=v,Kt("mode",je),Ui(),In(),!0)}s("#mode").addEventListener("click",v=>{const P=v.target.closest("button");P&&Al(P.dataset.mode)});function to(){const v=ne().length>1&&se!==ie(),P=he&&!he.standing?Yo(he):null;return{venue:_,venueName:t(`venues.${_}.name`),mode:je,model:v?se:null,view:Je,seat:he,ref:P,lighting:lt?et:"clear",lightingMotion:ee,lightingLasers:ae,screenVideoDemo:!1}}function no(v,P=!1,X="deeplink"){const Z=w&&v?wv(w,v)??m.resolveLegacyRef?.(Se,v):null;return Z?(Ve(Z,P,X),!0):!1}function In(){e.onStateChange?.(to())}function Rl(){return we?"seat":mt.length?"drill":null}function Un(){const v=Rl(),P=v==="seat",X=mt.length;s("#barBackLabel").textContent=v?P?X?mt[X-1].label:t("drill.overview"):X>=2?mt[X-2].label:t("drill.overview"):"",s("#barTitle").textContent=v?"":t(`venues.${_}.name`),s("#barBack").hidden=!v,r.bar.hidden=!!v,i.dataset.seated=String(P),S(),s("#viewSettings").hidden=!P}function yh(v){const P=(Z,oe,Ce)=>{const Ge=s("#"+Z);Ge.replaceChildren();for(const be of oe){const He=document.createElement("button");He.dataset[Z]=be.id,He.textContent=be.label,Ge.append(He)}Kt(Z,Ce)};je=m.MODES.some(Z=>Z.id===v)?v:m.MODES[0].id,U=m.TINTS.some(Z=>Z.id===m.DEFAULT_TINT)?m.DEFAULT_TINT:m.TINTS[0].id;const X=(Z,oe)=>oe.map(Ce=>{const Ge=`${Z}.${Ce.id}`,be=t(Ge);return{id:Ce.id,label:be===Ge?Ce.label:be}});P("mode",X(`modes.${_}`,m.MODES),je),P("tint",X("tints",m.TINTS),U)}async function Mh(v,P){if(!qa[v])throw new Error(`unknown venue: ${v}`);const X=await qa[v].load();_=v,m=X,yh(P),Ui(),In(),Un(),ss("venue_view_open",{venue:_,venue_mode:je}),Cl||(Cl=!0,so=requestAnimationFrame(Ul))}let Cl=!1;function Pl(v){if(!ne().some(Z=>Z.id===v)||v===se)return!1;const P=Je==="overview"?{position:x.position.clone(),target:W.target.clone(),fov:x.fov}:null,X=we&&he?Yo(he):null;return se=v,Ui({keepSeat:!!X}),X&&!no(X,!0,"model")&&ke(!0),Un(),In(),P&&(x.position.copy(P.position),x.fov=P.fov,x.updateProjectionMatrix(),W.target.copy(P.target),W.update()),!0}s("#tpaModel").addEventListener("click",v=>{const P=v.target.closest("button");P&&Pl(P.dataset.tpaModel)}),s("#tint").addEventListener("click",v=>{const P=v.target.closest("button");if(P){U=P.dataset.tint;for(const X of v.currentTarget.children)X.classList.toggle("on",X===P);vl()}}),s("#fill").addEventListener("click",v=>{const P=v.target.closest("button");P&&(Ie.fill=Number(P.dataset.fill)/100,Kt("fill",P.dataset.fill),s("#crowdOpts").hidden=Ie.fill===0,rn())}),s("#order").addEventListener("click",v=>{const P=v.target.closest("button");P&&(Ie.order=P.dataset.order,Kt("order",Ie.order),rn())}),s("#hands").addEventListener("click",v=>{const P=v.target.closest("button");P&&(Ie.handsUp=Number(P.dataset.hands)/100,Kt("hands",P.dataset.hands),rn())});for(const v of $s){const P=$a(v);s("#"+P).addEventListener("click",X=>{const Z=X.target.closest("button");Z&&(Ie[v]=Number(Z.dataset[P])/100,Kt(P,Z.dataset[P]),rn())})}s("#propHold").addEventListener("click",v=>{const P=v.target.closest("button");P&&(Ie.hold=P.dataset.propHold,Kt("propHold",Ie.hold),rn())});function Sh(){Ns.uSway.value=Ie.sway?.1:0,Ns.uJump.value=Ie.jump?.18:0,Ns.uWave.value=Ie.wave?.8:0}s("#motion").addEventListener("click",v=>{const P=v.target.closest("button");if(!P)return;const X=P.dataset.motion;Ie[X]=!Ie[X],P.classList.toggle("on",Ie[X]),Sh()}),s("#posture").addEventListener("click",v=>{const P=v.target.closest("button");P&&(Ie.posture=P.dataset.posture,Kt("posture",Ie.posture),rn())}),s("#hmode").addEventListener("click",v=>{const P=v.target.closest("button");P&&(Ie.heightMode=P.dataset.hmode,Kt("hmode",Ie.heightMode),s("#hFixedBox").hidden=Ie.heightMode!=="fixed",s("#hRangeBox").hidden=Ie.heightMode!=="random",rn())});for(const[v,P]of[["hFixed","height"],["hMin","heightMin"],["hMax","heightMax"]])s("#"+v).addEventListener("change",X=>{const Z=cn.clamp(Number(X.target.value)||Wa[P],1.2,2.1);Ie[P]=Z,X.target.value=Z.toFixed(2),rn()});s("#fov").addEventListener("input",v=>{ys=Number(v.target.value),s("#fovVal").textContent=ys,Je==="seat"&&(x.fov=Oi(),x.updateProjectionMatrix())}),s("#rays").addEventListener("change",v=>{Pe.visible=v.target.checked&&de.visible});const fn=new Set,Eh=new Set(["KeyW","KeyS","KeyA","KeyD","KeyQ","KeyE","ShiftLeft","ShiftRight"]);f(window,"keydown",v=>{const P=v.target;if(!(P&&(P.tagName==="INPUT"||P.tagName==="TEXTAREA"||P.tagName==="SELECT"||P.isContentEditable))){if(v.key==="Escape"&&a.dataset.open==="true"){u(!1);return}if(v.key==="Escape"&&Je==="seat"){ke(!1);return}if(!(v.key==="Escape"&&Je==="overview"&&eo())){if(Je==="seat"&&!v.metaKey&&!v.ctrlKey){const X={"+":1.25,"=":1.25,"-":.8,_:.8}[v.key];if(X){O(Bt*X,!0),v.preventDefault();return}if(v.key==="0"){O(1,!0),v.preventDefault();return}}Eh.has(v.code)&&(fn.add(v.code),v.preventDefault())}}}),f(window,"keyup",v=>fn.delete(v.code)),f(window,"blur",()=>fn.clear());const pi=new L,io=new L,vn=new L;function bh(v){if(Je!=="overview"||fn.size===0||(x.getWorldDirection(pi),pi.y=0,pi.lengthSq()<1e-6)||(pi.normalize(),io.crossVectors(pi,x.up).normalize(),vn.set(0,0,0),fn.has("KeyW")&&vn.add(pi),fn.has("KeyS")&&vn.sub(pi),fn.has("KeyD")&&vn.add(io),fn.has("KeyA")&&vn.sub(io),fn.has("KeyE")&&(vn.y+=1),fn.has("KeyQ")&&(vn.y-=1),vn.lengthSq()===0))return;const P=fn.has("ShiftLeft")||fn.has("ShiftRight")?3:1,X=cn.clamp(x.position.distanceTo(W.target)*.9,8,120)*P;vn.normalize().multiplyScalar(X*v/1e3),x.position.add(vn),W.target.add(vn)}function Ll(){const v=innerWidth,P=innerHeight;A.setSize(v,P,!1),x.aspect=v/P,x.updateProjectionMatrix();const X=Je==="overview"&&x.position.distanceTo(D.pos)<.5;q(),X&&(x.position.copy(D.pos),W.target.copy(D.target),W.update())}f(window,"resize",Ll);let Dl=performance.now();const mi=s("#seatTip"),jn={x:0,y:0};function Il(){if(!ct||!y)return;if(ct=!1,Je==="overview"?re({clientX:jn.x,clientY:jn.y}):null){Re.visible=!1,mi.hidden=!0,p.style.cursor="pointer",Bi([]);return}const P=Et();if(P&&P!==he){const X=Ml(P);Re.position.set(P.x,P.y+.3,P.z),Re.visible=X.level==="seat",Je==="overview"&&Bi(X.members),p.style.cursor="pointer",mi.textContent=X.label,mi.hidden=!1;const Z=mi.offsetWidth,oe=jn.x+14+Z>innerWidth?jn.x-14-Z:jn.x+14;mi.style.transform=`translate(${oe}px, ${jn.y+16}px)`}else Re.visible=!1,Je==="overview"&&Bi([]),mi.hidden=!0,p.style.cursor="grab"}function Ul(v){const P=v-Dl;if(Dl=v,Ns.uTime.value=v/1e3,St){St.t=Math.min(1,St.t+P/St.dur);const X=K(St.t);if(x.position.lerpVectors(St.p0,St.p1,X),x.quaternion.slerpQuaternions(St.q0,St.q1,X),x.fov=St.f0+(St.f1-St.f0)*X,x.updateProjectionMatrix(),St.t>=1){const Z=St.onDone;St=null,Z?.()}}else Je==="seat"?(x.rotation.set(Kn+di,Ni+Fi,0,"YXZ"),Il()):Je==="overview"&&(bh(P),W.update(),Il());dn(),Qe.step(P/1e3),A.render(E,x),so=requestAnimationFrame(Ul)}let so=0,Nl=0;function Th(v){const P=s("#toast");P.textContent=v,P.hidden=!1,clearTimeout(Nl),Nl=setTimeout(()=>{P.hidden=!0},2400)}function wh(){cancelAnimationFrame(so),o.dispose(),g.dispose(),Qe.dispose(),j.dispose(),V?.disposeProduction?.();for(const v of d)v();d.length=0,V&&(E.remove(V.group),V.group.traverse(v=>{v.geometry?.dispose?.()}),V=null),y&&(E.remove(y),k(),y=null),fe&&(E.remove(fe.group),au(fe),fe=null),J&&(E.remove(J.group),ru(J),J=null);for(const v of[Re,de,Pe])v.geometry.dispose(),v.material.dispose();W.dispose(),A.dispose(),Se=[],i.replaceChildren()}return Ll(),{slots:r,setVenue:Mh,setMode:Al,setModel:Pl,getState:to,enterSeat:Ve,enterRef:no,enterCadSeat:v=>{if(_!=="kts"||!Number.isInteger(v))return!1;const P=Se.filter(X=>X.cadIndex===v);return P.length!==1?!1:(Ve(P[0],!1,"deep-link"),!0)},toast:Th,exitSeat:()=>ke(!1),dispose:wh,debug:{camera:x,controls:W,scene:E,zoom:()=>Bt,lighting:()=>Qe.state(),screenVideo:()=>j.state(),renderInfo:()=>({programs:A.info.programs.length,calls:A.info.render.calls}),markers:()=>le.filter(v=>v.el.dataset.sectionKey).map(v=>({key:v.el.dataset.sectionKey,pos:v.pos.toArray(),occluded:v.occluded})),production:()=>V?.setProductionOptions?{...Q,occluders:V.occluders.map(v=>v.name)}:null,sit:v=>{const P=Se.find(X=>X.label.startsWith(v));return P&&Ve(P),!!P},screenOf:v=>{const P=Se.find(oe=>oe.label.startsWith(v));if(!P)return null;const X=new L(P.x,P.y+.3,P.z).project(x),Z=p.getBoundingClientRect();return{x:Z.left+(X.x+1)/2*Z.width,y:Z.top+(1-X.y)/2*Z.height,level:yl(P),label:P.label}},sectionSelection:()=>({...It,labels:on.map(v=>v.label)}),drillSelection:()=>({level:_n?.level,labels:_n?.members?.map(v=>v.label)??[]}),drillDepth:()=>mt.length,camDistance:()=>x.position.distanceTo(W.target),framedDistance:()=>Es?.dist??null,minDistance:()=>W.minDistance,view:()=>Je,frameBox:()=>R(C),seatBox:()=>R(Se.map(v=>new L(v.x,v.y+1.2,v.z)))}}}const Zv=.05,Jv=12,fu=(i,e,t)=>Math.min(t,Math.max(e,i));function Qv(){new URLSearchParams(location.search).get("ref")==="1"&&(document.getElementById("refTool").hidden=!1);const i=document.getElementById("refLayer"),e=document.getElementById("refImg"),t=document.getElementById("refFile"),n=document.getElementById("refCtl"),s=document.getElementById("refPick"),r=document.getElementById("refAdjust"),o=document.getElementById("refClear"),a=document.getElementById("refReset"),c=document.getElementById("refOp"),l=document.getElementById("refOpVal"),u=document.getElementById("refBlend"),h=document.getElementById("refHint");let d=null,f=!1;const g={x:0,y:0,k:1},_=()=>{e.style.transform=`translate(-50%, -50%) translate(${g.x}px, ${g.y}px) scale(${g.k})`},m=C=>{f=C&&!!d,r.classList.toggle("on",f),i.style.pointerEvents=f?"auto":"none",h.textContent=f?"調整模式：拖曳移動、滾輪縮放（3D 鏡頭暫停回應）。":"撳「調整」拖曳／縮放張圖；關咗就照樣操作 3D。"},p=C=>{d&&URL.revokeObjectURL(d),d=URL.createObjectURL(C),e.src=d,e.hidden=!1,n.hidden=!1,g.x=0,g.y=0,g.k=1,_(),m(!0)},A=()=>{d&&URL.revokeObjectURL(d),d=null,e.removeAttribute("src"),e.hidden=!0,n.hidden=!0,m(!1)},E=C=>{C&&C.type.startsWith("image/")&&p(C)};s.addEventListener("click",()=>t.click()),t.addEventListener("change",()=>{E(t.files[0]),t.value=""}),r.addEventListener("click",()=>m(!f)),o.addEventListener("click",A),a.addEventListener("click",()=>{g.x=0,g.y=0,g.k=1,_()}),c.addEventListener("input",()=>{e.style.opacity=String(c.value/100),l.textContent=c.value}),u.addEventListener("click",C=>{const I=C.target.closest("button");if(I){for(const b of u.children)b.classList.toggle("on",b===I);e.style.mixBlendMode=I.dataset.blend}}),addEventListener("dragover",C=>C.preventDefault()),addEventListener("drop",C=>{C.preventDefault(),E(C.dataTransfer?.files?.[0])}),addEventListener("paste",C=>{for(const I of C.clipboardData?.items??[])if(I.type.startsWith("image/")){E(I.getAsFile());break}});let x=null;i.addEventListener("pointerdown",C=>{f&&(x={x:C.clientX,y:C.clientY},i.setPointerCapture(C.pointerId))}),i.addEventListener("pointermove",C=>{x&&(g.x+=C.clientX-x.x,g.y+=C.clientY-x.y,x={x:C.clientX,y:C.clientY},_())});const D=()=>{x=null};i.addEventListener("pointerup",D),i.addEventListener("pointercancel",D),i.addEventListener("wheel",C=>{if(!f)return;C.preventDefault();const I=fu(Math.exp(-C.deltaY*.0016),.5,2),b=fu(g.k*I,Zv,Jv),M=b/g.k,T=innerWidth/2,F=innerHeight/2;g.x=(1-M)*(C.clientX-T)+M*g.x,g.y=(1-M)*(C.clientY-F)+M*g.y,g.k=b,_()},{passive:!1}),m(!1);const R=new URLSearchParams(location.search).get("refPhoto");R&&/^kts-\d+-[A-Z]+-\d+-ugo\.jpeg$/.test(R)&&fetch(`/tools/kai-tak/stadium/photos/${R}`).then(C=>{if(!C.ok)throw Error("相片未能載入");return C.blob()}).then(C=>{p(C),m(!1)}).catch(C=>{h.textContent=C.message})}function ex(i){const e=new URLSearchParams;e.set("venue",i.venue),e.set("mode",i.mode),i.model&&e.set("model",i.model),i.ref&&e.set("s",Rv(i.ref)),i.screenVideoDemo&&e.set("screenVideo","flytix-demo"),i.lighting&&i.lighting!=="clear"&&(e.set("lighting",i.lighting),i.lightingMotion||e.set("lightMotion","0"),i.lightingLasers||e.set("lasers","0")),document.body.classList.contains("embed")&&e.set("embed","1"),new URLSearchParams(location.search).has("lang")&&e.set("lang",js),history.replaceState(null,"",`?${e}`)}function tx(i){document.title=Ft("site.titleFor",{venue:i.venueName}),document.getElementById("title").textContent=document.title,document.getElementById("provenanceTitle").textContent=Ft("provenance.title");const e={"end-v2":"provenance.aweNumbered","standing-v2":"provenance.aweNumbered"};document.getElementById("provenanceText").textContent=Ft(i.venue==="awe"&&e[i.mode]||`provenance.${i.venue}`);const t=document.getElementById("ktsPhotoReview");t.hidden=i.venue!=="kts"||!0,t.textContent=Ft("provenance.photoReview")}const Nt=new URLSearchParams(location.search),ri=Nt.get("venue"),nx=ri==="awe"&&(!Nt.get("mode")||["end","standing"].includes(Nt.get("mode")))&&Nt.has("s")&&!["A","B","C","D"].includes(String(fh(Nt.get("s"))?.section)),ix=ri==="awe"?["standing","standing-v2"].includes(Nt.get("mode"))?"standing-v2":"end-v2":Nt.get("mode"),js=Ch(location.search),$o=Nt.get("dev")==="1"||!1,Ft=pu(js);document.documentElement.lang=js;const gh=Nt.get("embed")==="1";gh&&document.body.classList.add("embed");Ph({venue_lang:js,venue_surface:gh?"app":"web"});const Ko=document.getElementById("loading");if(!ri)location.replace("./");else if(Object.hasOwn(qa,ri))document.getElementById("loadingText").textContent=Ft("loading.venue",{venue:Ft(`venues.${ri}.name`)}),requestAnimationFrame(async()=>{const i=jv(document.getElementById("app"),{venue:ri,model:Nt.get("model"),lighting:Nt.get("lighting"),lightingMotion:Nt.get("lightMotion")!=="0",lightingLasers:Nt.get("lasers")!=="0",screenVideoDemo:!1,t:Ft,dev:$o,onStateChange:n=>{ex(n),tx(n)}}),e=[["head","panelHead"],["bar","topbarHead"],["provenance","panelProvenance"],...$o?[["foot","panelFoot"]]:[]];for(const[n,s]of e)i.slots[n].replaceChildren(document.getElementById(s).content.cloneNode(!0));document.getElementById("home").textContent=`← ${Ft("panel.home")}`;const t=document.getElementById("brand");t.href=Lh(js),t.addEventListener("click",()=>ss("venue_outbound",{venue_link:"brand"})),document.getElementById("barHome").setAttribute("aria-label",Ft("panel.home")),document.getElementById("barHomeLabel").textContent=Ft("panel.backVenues"),document.getElementById("noModelFiles").textContent=Ft("site.noModelFiles"),$o&&Qv();try{await i.setVenue(ri,ix)}catch(n){console.error(n),Ko.classList.add("error"),document.getElementById("loadingText").textContent=Ft("loading.failed");const s=document.getElementById("loadingBack");s.textContent=Ft("loading.back"),s.hidden=!1;return}Ko.hidden=!0,ri==="kts"&&(Nt.get("model")??"plan")==="plan"&&/^\d+$/.test(Nt.get("cadSeat")??"")&&i.enterCadSeat(Number(Nt.get("cadSeat"))),nx?i.toast(Ft("drill.aweNumberingChanged")):Nt.get("s")&&!i.enterRef(fh(Nt.get("s")))&&i.toast(Ft("drill.notFound"))});else{Ko.classList.add("error"),document.getElementById("loadingText").textContent=Ft("loading.notFound");const i=document.getElementById("loadingBack");i.textContent=Ft("loading.back"),i.hidden=!1}export{Wt as B,Pi as C,wn as D,ox as E,bt as F,Wn as G,ll as I,_f as L,ju as M,Tt as O,qr as P,qn as Q,Xn as S,mn as T,L as V,$t as a,pt as b,Ot as c,Uu as d,ge as e,Nu as f,tt as g,nn as h,rx as i,Vu as j,pc as k,qu as l,Ai as m,$u as n,$e as o,cn as p,ui as q,Ku as r,$r as s};
