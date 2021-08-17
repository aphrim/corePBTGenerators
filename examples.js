import {pbtGenerator} from './pbtGenerator';

let pbt = new pbtGenerator({templateName: 'EpicJavascriptTemplate', })
pbt.addMesh('myMesh', 'sm_cube_002', {})
pbt.addMesh('SecondMesh', 'sm_cube_002', {position: {X: 100, Y: 40, Z: 200}})
pbt.addMesh('anotherMeshForShowcase', 'sm_cube_002', {rotation: {Pitch: 100, Yaw: 100, Roll: 50}})
console.log(pbt.generatePBT())