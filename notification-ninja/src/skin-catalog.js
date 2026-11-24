import {WEEKLY_SKINS} from './adventure.js';

/** Stable cosmetic identities shared by gameplay and collection presentation. */
export const SKINS = [
  {id:'default',name:'Ninja Mint',cost:0,color:'#75f6cd'},
  {id:'solar',name:'Solar Slice',cost:80,color:'#ffd171'},
  {id:'mint',name:'Arctic Focus',cost:180,color:'#83deff'},
  {id:'neon',name:'Violet Flow',cost:320,color:'#d8a3ff'},
  {id:'dawn',name:'Morgenwind',cost:0,color:'#f6b85c',unlock:'rank',rank:'dawn'},
  {id:'shadow',name:'Schatten-Ninja',cost:0,color:'#6570ab',unlock:'rank',rank:'shadow'},
  {id:'grandmaster',name:'Großmeister',cost:0,color:'#e9d29a',unlock:'rank',rank:'grandmaster'},
  {id:'focus-fox',name:'Fokus-Fuchs',cost:0,color:'#ffc77d',unlock:'mastery',requiredCorrect:60,description:'Goldener Fuchs-Ninja für 60 richtige Entscheidungen.'},
  {id:'night-guardian',name:'Nachtwächter',cost:0,color:'#96a9ff',unlock:'mastery',requiredCorrect:180,description:'Leuchtender Mond-Ninja für 180 richtige Entscheidungen.'},
  ...WEEKLY_SKINS
];
