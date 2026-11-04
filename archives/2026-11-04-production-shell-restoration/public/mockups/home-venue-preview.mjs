import {mountVenuePreview} from '../venue-preview.mjs';
export function mountBirdsNestPreview(root){return mountVenuePreview(root,{url:'/api/demo/birds-nest',overviewLabel:'鸟巢 · 看台总览'});}
