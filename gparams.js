module.exports = {
  wave:{type:'dial', step: 1, mag: 24, min: 0, value:0},
  phase:{type:'dial', value:0},
  ratio:{type:'dial', value:2},
  mean:{type:'dial', value: 0},
  dev:{type:'dial', value:2},
  iter:{type: 'dial', value: 0, step: 1, mag: 6, min: 1},
  iir1:{type:'dial', value: 4, min: 2, step: 1, mag: 12},
  iir2:{type:'dial', value: 8, min: 2, step: 1, mag: 12},
  winf:{type: 'dial', value: 0, step: 1, mag: 4, min: 0},
  attack:{type: 'env', value: [[0,0], [1/2,8/10], [1,1/2]]},
  adur:{type:'dial', value: .05},
  decay:{type: 'env', value: [[0,1/2], [1/4, 0], [1,0]]},
  ddur:{type:'dial', value: 1.67},
  sustain:{type: 'amod', value: [[0, .5], [0, 1], [1,.5]]},
  release:{type: 'env', value:[[0,0], [0,0], [1,0]]},
  rdur:{type:'dial', value: .1},
  feedback:{type: 'dial', value: 0}
}
