var Time =require('../since-when')
var state=require('./gparams')
var $=require('../polysynth/cheatcode')
var amod =(c, r, f) => {
  return function(t){
    return $.amod(c, r, t, f/state.sustain.value)
  }
}

var ease =(pts, d)=> {
  let u = pts[2][1]
  let p = pts[1][1]
  let l = pts[0][1]
  let i = $.tnorm(0, d)
  return function (t){
    console.log(t)
    let tt = t
    t=t * (1/d)
    let e = ((Math.pow(t, 1/(p*4)) * (u-l)) + l)
    //console.log(tt, t, e, l, u, pts)
    return e
    //return e
  }
}

var zero=()=>0
var n= function(f1, f2, d1, d2){
  var alt = [f1, f2]
  //console.log(f2)
  return function(t){
    var e = Math.floor(Math.min(t/d1, 1)) // should be zero if t < attack duration, else 1
    return alt[e](t - (d1 * e))
  }

}
var test=function(){
  var fq=440
  var sr=8000
  var bz = n(n(ease(state.attack.value, state.adur.value), ease(state.decay.value, state.ddur.value), state.adur.value, state.ddur.value), ease(state.decay.value, state.ddur.value), state.adur.value+state.ddur.value, 1)
  var t = new Array(sr*1).fill(0).map((e,i)=> i/sr)
  var time=new Time 
  t = t.map(e=>bz(e))
  var i = time.sinceBeginNS()
//  t.forEach(e => console.log(e)) 
  console.log(i)
}

setTimeout(test,1000)
