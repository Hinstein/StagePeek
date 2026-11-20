const positionVarying='varying vec3 shellPosition;\n';

export function styleShellSurfaces(node,concrete,light){
  let hasRibbon=false;
  const replaced=[];
  const style=material=>{
    if(!material.isMeshStandardMaterial)return material;
    const name=node.name;
    const bowl=/^shell_bowl_mass(?:_|$)/.test(name);
    const ribbon=/^shell_ribbon_led(?:_|$)/.test(name)&&!/(?:_|^)(amber|housing|static)(?:_|$)/.test(name)&&material.emissive.getHex()!==0;
    const suite=bowl&&/(?:suite_windows|suite_glass)(?:_|$)/.test(name);
    const facade=bowl&&/(?:cladding|enclosure|inverted_pyramid|facade_panels)(?:_|$)/.test(name);
    const grain=bowl&&concrete&&!material.map&&!material.roughnessMap&&
      (/concrete|cement|precast|basalt/i.test(material.name)||/(?:_lower|_upper|_enclosure|_terrace_supports|_plinth)$/.test(name));
    if(!ribbon&&!suite&&!facade&&!grain)return material;

    const surface=material.clone();
    replaced.push(material);
    hasRibbon||=ribbon;
    if(suite){
      surface.opacity=.68;
      surface.transparent=true;
      surface.depthWrite=false;
      surface.roughness=.24;
      surface.metalness=.19;
      surface.envMapIntensity=1.25;
    }
    if(facade)surface.envMapIntensity=1.12;
    surface.customProgramCacheKey=()=>JSON.stringify([Boolean(grain),facade,suite,ribbon]);
    surface.onBeforeCompile=shader=>{
      shader.vertexShader=positionVarying+shader.vertexShader.replace('#include <begin_vertex>',`
        #include <begin_vertex>
        shellPosition=(modelMatrix*vec4(transformed,1.0)).xyz;
      `);
      shader.fragmentShader=positionVarying+shader.fragmentShader;
      if(grain){
        shader.uniforms.shellConcrete={value:concrete};
        shader.fragmentShader='uniform sampler2D shellConcrete;\n'+shader.fragmentShader.replace('#include <roughnessmap_fragment>',`
          #include <roughnessmap_fragment>
          vec3 weights=abs(cross(dFdx(shellPosition),dFdy(shellPosition)));
          weights/=max(dot(weights,vec3(1.0)),0.00001);
          vec3 grainUV=shellPosition*0.73;
          float concreteGrain=dot(weights,vec3(
            texture2D(shellConcrete,grainUV.yz).r,
            texture2D(shellConcrete,grainUV.xz).r,
            texture2D(shellConcrete,grainUV.xy).r
          ));
          diffuseColor.rgb*=0.87+concreteGrain*0.19;
          roughnessFactor=clamp(roughnessFactor+(0.67-concreteGrain)*0.33,0.2,1.0);
        `);
      }
      if(ribbon){
        shader.uniforms.shellRibbonPhase=light.phase;
        shader.uniforms.shellRibbonTint=light.tint;
        shader.uniforms.shellRibbonThemed=light.themed;
        shader.fragmentShader=`
          uniform float shellRibbonPhase;
          uniform vec3 shellRibbonTint;
          uniform float shellRibbonThemed;
        `+shader.fragmentShader.replace('#include <emissivemap_fragment>',`
          #include <emissivemap_fragment>
          float around=atan(shellPosition.x,shellPosition.z)/6.2831853;
          float wave=sin(around*43.982297-shellRibbonPhase)*0.5+0.5;
          float chase=pow(wave,5.0);
          vec2 ledUV=vec2(around*768.0,shellPosition.y*27.0);
          vec2 pixel=abs(fract(ledUV)-0.5);
          float screenDoor=mix(0.71,1.0,1.0-max(pixel.x,pixel.y)*2.0);
          screenDoor=mix(screenDoor,0.9,smoothstep(0.1,0.8,max(fwidth(ledUV.x),fwidth(ledUV.y))));
          vec3 tint=mix(totalEmissiveRadiance,shellRibbonTint,shellRibbonThemed);
          totalEmissiveRadiance=tint*(0.60+chase*1.55)*screenDoor;
        `);
      }
      if(facade||suite){
        shader.uniforms.shellBaseY=light.baseY;
        shader.fragmentShader='uniform float shellBaseY;\n'+shader.fragmentShader.replace('#include <opaque_fragment>',`
          ${facade?`
            float sweep=atan(shellPosition.x,shellPosition.z);
            float wash=pow(0.5+0.5*cos(sweep*12.0),4.0)*exp(-max(0.0,shellPosition.y-shellBaseY)*0.155);
            outgoingLight+=vec3(0.085,0.063,0.041)*wash;
          `:''}
          ${suite?`
            float facing=clamp(dot(normal,normalize(vViewPosition)),0.0,1.0);
            float reflection=pow(1.0-facing,3.0);
            outgoingLight+=mix(vec3(0.038,0.026,0.015),vec3(0.13,0.19,0.26),reflection);
            diffuseColor.a=mix(0.50,0.82,reflection);
          `:''}
          #include <opaque_fragment>
        `);
      }
    };
    return surface;
  };
  node.material=Array.isArray(node.material)?node.material.map(style):style(node.material);
  return {hasRibbon,replaced};
}
