// Shared presentation tokens. Venue adapters may not replace the approved theme.
export const venuePalette=Object.freeze({
  background:'#0b1118',floor:'#16212b',deck:'#505970',tread:'#41495e',
  riser:'#2c3446',apron:'#252d3c',stairs:'#737b90',roof:'#8b82a9',
  seat:'#7961aa',selected:'#c9ff51',label:'#eee6ff',labelOutline:'#111a22',
  stage:'#b78745',stageTop:'#b78745',reference:'#edbc65',seatGlyph:'#c2ace8',
  selectedGlyph:'#3f5224',equipment:'#65767f',standing:'#527f9e',eventFloor:'#638fa8',zoneOutline:'#a7b8cc'
});

// Geometry engines use a white base material for instanced chair tinting.
export function venueScenePalette(){return {...venuePalette,clear:venuePalette.background,field:venuePalette.floor,infield:venuePalette.floor,seat:'#ffffff',seatBack:'#ffffff',sample:venuePalette.reference,marker:venuePalette.selected,ring:venuePalette.reference,top:venuePalette.stageTop,frame:venuePalette.labelOutline,screen:venuePalette.equipment,skin:'#d9b18b',clothes:'#d7e1d5'};}
