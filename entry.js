var getids = require('getids')
var on = require('dom-event')
var td = require('../touchdown')
var midi = require('web-midi')
var h = require('hyperscript')
var bus = require('page-bus')()
var teoria = require('teoria')
var store = require('store')
var master = new AudioContext
var jsynth = require('../jsynth')
var $ = require('../polysynth/cheatcode.js')
Time = 0
ez = []
tz = []
var controls = require('./controls.js')

var ui = getids()
var wf = require('window-function')
var wfn = Object.keys(wf)
  console.log(wfn)

var waves = ['sine', 'saw', 'tri', 'sq']
var winfunk = ['hann', 'hamming', 'tri', 'planckt', 'welch']
var zero = () => 0
var easex = (t, pts)=> {
  let u = pts[2][1]
  let p = pts[1][1]
  let l = pts[0][1]
  return (Math.pow(1-t, 1/(p*4)) * (u-l) + l)
}

var amod = (c, r, f) => {
  return function(t){
    return $.amod(c, r, t, f)/// Math.log(f)/Math.log(10))//state.sustain)
  }
}

var fmod = (fn, r, f) => {
  return function(t){
    return $.amod(fn(t), r, t, Math.log(f)/Math.log(10))//state.sustain)
  }
}
var ease = (pts, d)=> {
  let u = pts[2][1]
  let p = pts[1][1]
  let l = pts[0][1]
  let i = $.tnorm(0, d)
  return function (t){
    let tt = t
    t=t * (1/d)
    let e = ((Math.pow(t, 1/(p*4)) * (u-l)) + l)
    //console.log(tt, t, e, l, u, pts)
    return e
    //return e
  }
}
function scalar (s){
  return function(t){ return s}
}
function n(f1, f2, d1, d2){
  var alt = [f1, f2]  
  return function(t){
    var e = Math.floor(Math.min(t/d1, 1)) // zero if t < d1, else 1
    return alt[e](t - (d1 * e))
  }
}
console.log($)
let delay = require('../delay')
for(el in ui) td.start(ui[el])
var ons = new Array(175).fill(zero)
var off = new Array(175).fill(zero)
var hmr = new Array(175).fill(0) // hammer 
var lsm = new Array(175).fill(0) // last amplitudes
var nds = new Array(175).fill(0) // note durations after sustain
var phs = new Array(175).fill(0) // note durations after sustain
var phase_change= new Array(175).fill(false) // note durations after sustain
var note = new Array(175).fill(0).map(e => { return {on:false,time:0,ended:null}}) // note durations after sustain
let global = {}

midi.getPortNames(function(e,d){
  if(store.get('midi')){
    ui['midi'].appendChild(h('button', {value: 'start', innertext: 'start',  onclick: function(){
      init()
      play()
      input(store.get('midi'))
    }}, [h('p', 'start')]))
  }
  else{
    d.push('QWERTY KEYBOARD')

    ui['midi'].appendChild(h('div', d.map(e => h('div', [h('input', {type: 'checkbox', id: e, value: e, onclick: function(){
      store.set('midi', e)
      init()
      play()
      input(e)
    }}), h('label',  e, {htmlFor: e})]))))
  }
})

function init(){
  state = controls(ui.para, update).state
  function update (name, value, state) {
    console.log(name, value)
    if(name.slice(0,3) == 'iir'){
      global.iir = $.iir(state.iir1, state.iir2)
    }
  }
  global.iir = $.iir(state.iir1, state.iir2)
  fbs = new Array(175).fill(0).map((e,i) => delay(Math.floor(master.sampleRate / teoria.note.fromMIDI(i).fq()/2), state.feedback, 1))
}

function play (){
  var value = 0
  let last = 0
  master.resume()
  var synth = jsynth(master, (t, s, i) => {
  Time = t
  return (ons.reduce((a, e) => a + e(t)12, 0)
     + off.reduce((a, e) => a + e(t)/2, 0))
  }, 256 * 8)
  synth.connect(master.destination)
}

function input(e){
  if(e.slice(0, 6) == 'QWERTY'){
    window.open('http://' + window.location.host + '/keyboard.html')
    bus.on('keydown', fq => {
      
    })
    bus.emit('keydown', 440)
    
  }
  else {
    let stream = midi.openInput(e, {index: 0, normalizeNotes: false})
    stream.on('data', d => {
      let time = Time
      if(d[0] === 128){ 
        let fq = teoria.note.fromMIDI(d[1]).fq()
        release(time, fq, d)
      }
      if(d[0] === 144){ 
        let fq = teoria.note.fromMIDI(d[1]).fq()
        hammerTime(time, fq, d)
      }  
    })
  }
}

function hammerTime(time, fq, d){
   var ph = 0, dur = 0, wvl = 0, gain = 1
   if(note[d[1]].on) {
      dampen(time, fq, d)
      //off[d[1]] = zero
      dur = time - nds[d[1]] 
      wvl = master.sampleRate / fq
      ph = ((dur * master.sampleRate) % wvl) / wvl 
      let y = phs[d[1]]
      phs[d[1]] += ph
      phase_change[d[1]]=true
      ph += y
      gain = 1
      //return
  }
  else {
   //if(phase_change[d[1]]) ph += phs[d[1]]
    phs[d[1]] = 0
    note[d[1]].on = true
    note[d[1]].time = time
    nds[d[1]] = time
  }
  let lf = Math.log(fq)/Math.log(10)
  let lfsq = Math.sqrt(lf)
  var bz = n(n(ease(state.attack, state.adur), ease(state.decay, state.ddur), state.adur, state.ddur), scalar(state.decay[2][1]), state.adur+state.ddur, 999) // refresh env 
  hmr[d[1]]=Math.log(d[2])/Math.log(12)
  let iir = $.iir(state.iir1, state.iir2)
  var synth = (t, s, i) => {
    var e = bz(t-time)
    lsm[d[1]] = e
  //console.log(e)
  //  if(t % 1 === 0) console.log(e)
      let pht = t-time +(ph*wvl)/master.sampleRate
    let spl = ($.gtone(pht, fq, $.amod(0, state.mean, t-time+dur,  Math.pow(Math.sqrt(Math.max(lf, lf*((100/lf)*state.alfo))),lf)), Math.sqrt(state.dev), state.ratio, state.iter, $.oz[waves[state.wave % waves.length]], state.ph)) * hmr[d[1]] * e 
    //return fbs[d[1]](spl, state.feedback, 1) / 6//* e
    return spl * gain 
   }
   //off[d[1]] = zero
   ons[d[1]] = synth
   //gen.set(time, synth, {curves: [a, a, a], durations: [state.adur , state.ddur, state.rdur]})
  // let state = m(d)
 }
function release(time, fq, d){
// do same as below but with only release envelope
  //var bz = n(ease(state.attack), ease(state.decay), state.adur, state.ddur, time)
  // must match up the pphase....
  let dur = time - nds[d[1]] 
  ons[d[1]] = zero
  if(dur < state.adur + state.ddur) finish(time, fq, d)
  else{
    let lf = Math.log(fq)/Math.log(10)
    let lfsq = Math.sqrt(lf)
    let sdur = dur - state.adur - state.ddur
    let wvl = master.sampleRate / fq
    let ph = ((dur * master.sampleRate) % wvl) / wvl
    if(phase_change[d[1]]) ph += phs[d[1]]
    phs[d[1]] = ph
    phase_change[d[1]] = true 
    //console.log(dur, wvl, dur * master.sampleRate, wvl % (dur * master.sampleRate), ph)
    let drop = ((x)=>()=> {
      off[x]=zero
      nds[x]=false
      note[d[1]].on = false
      phase_change[d[1]] = false
      phs[d[1]] = 0
      setTimeout(_=> fbs[x]=delay(Math.floor(master.sampleRate / fq/2), state.feedback, 1),0)
      return 0
    }
    )(d[1])
    // don't forget both durations below
  nds[d[1]] = time
    let ls = state.release
    let release = [[ls[0][0], lsm[d[1]]], ls[1], ls[2]]
    var bz = n(ease(release, state.rdur), drop, state.rdur, 1/master.sampleRate)
    let iir = $.iir(state.iir1, state.iir2)
    var synth = (t, s, i) => {
      var e = bz(t-time)
    //console.log(e
      lsm[d[1]] = e
      let pht = t-time +(ph*wvl)/master.sampleRate
      //return iir($.oz.sine(t, fq) * e)
      let spl = ($.gtone(pht, fq, $.amod(0, state.mean, t-time+dur,  Math.pow(Math.sqrt(Math.max(lf, lf*((100/lf)*state.rlfo))),lf)), Math.sqrt(state.dev), state.ratio, state.iter, $.oz[waves[state.wave % waves.length]], ph)) * hmr[d[1]] * e 
      let fb = fbs[d[1]](spl, state.feedback, 1)/ 6// (Math.log(hmr[d[1]])/Math.log(10))/4) //* e
       //console.log(fb)
    return spl
      return fb//*e //* lsm[d[1]] //* hmr[d[1]]
     }
     off[d[1]] = synth
   }
} 

function finish(time, fq, d){
// do same as below but with only release envelope
  //var bz = n(ease(state.attack), ease(state.decay), state.adur, state.ddur, time)
  // must match up the pphase....
  //ons[d[1]] = zero
  let lf = Math.log(fq)/Math.log(10)
  let lfsq = Math.sqrt(lf)
  let dur = time - nds[d[1]] 
  let sdur = dur - state.adur - state.ddur
  let wvl = master.sampleRate / fq
  let ph = ((dur * master.sampleRate) % wvl) / wvl
  phase_change[d[1]] = true 
  phs[d[1]] = ph
  //console.log(dur, wvl, dur * master.sampleRate, wvl % (dur * master.sampleRate), ph)
  let drop = ((x)=>()=> {
    off[x]=zero
    phase_change[d[1]] = false
    note[d[1]].on = false
    nds[x]=false
    phs[d[1]] = 0 
    setTimeout(_=> fbs[x]=delay(Math.floor(master.sampleRate / fq/2), state.feedback, 1),0)
    return 0
  }
  )(d[1])
  // don't forget both durations below
  //let ls = state.release
  //let release = [[ls[0][0], lsm[d[1]]], ls[1], ls[2]]
  var bz = n(n(ease(state.attack, state.adur), ease(state.decay, state.ddur), state.adur, state.ddur), n(ease(state.release, state.rdur), drop, state.rdur, 1/master.sampleRate), state.adur+state.ddur, state.rdur+ 1/master.sampleRate) // refresh env 
  let iir = $.iir(state.iir1, state.iir2)
  var synth = (t, s, i) => {
    var e = bz(t-time+dur)
  //console.log(e)
    lsm[d[1]] = e
    let pht = t-time+(ph*wvl)/master.sampleRate
    //return iir($.oz.sine(t, fq) * e)
    let spl = ($.gtone(pht, fq, $.amod(0, state.mean, t-time+dur,  Math.pow(Math.sqrt(Math.max(lf, lf*((100/lf)*state.alfo))),lf)), Math.sqrt(state.dev), state.ratio, state.iter, $.oz[waves[state.wave % waves.length]], ph)) * hmr[d[1]] * e 
    let fb = fbs[d[1]](spl, state.feedback, 1)/ 6// (Math.log(hmr[d[1]])/Math.log(10))/4) //* e
     //console.log(fb)
    return spl
    return fb//*e //* lsm[d[1]] //* hmr[d[1]]
   }
   off[d[1]] = synth
} 
function dampen(time, fq, d){
  let lf = Math.log(fq)/Math.log(10)
  let lfsq = Math.sqrt(lf)
  let dur = time - nds[d[1]] 
  let sdur = dur - state.adur - state.ddur
  let wvl = master.sampleRate / fq
  let ph = ((dur * master.sampleRate) % wvl) / wvl
  //console.log(dur, wvl, dur * master.sampleRate, wvl % (dur * master.sampleRate), ph)
  let drop = ((x)=>()=> {
    off[x]=zero
    //nds[x]=false
    setTimeout(_=> fbs[x]=delay(Math.floor(master.sampleRate / fq/2), state.feedback, 1),0)
    return 0
  }
  )(d[1])
  // don't forget both durations below
  //let ls = state.release
  //let release = [[ls[0][0], lsm[d[1]]], ls[1], ls[2]]
  var bz = n(ease([[0,lsm[d[1]]],[1,.1],[0,0]], .05), drop, .05, 1/master.sampleRate)
  let iir = $.iir(state.iir1, state.iir2)
  var synth = (t, s, i) => {
    var e = bz(t-time)
  //console.log(e)
    let pht = t-time+(ph*wvl)/master.sampleRate
    //return iir($.oz.sine(t, fq) * e)
    let spl = ($.gtone(pht, fq, $.amod(0, state.mean, t-time+dur,  Math.pow(Math.sqrt(Math.max(lf, lf*((100/lf)*state.rlfo))),lf)), Math.sqrt(state.dev), state.ratio, state.iter, $.oz[waves[state.wave % waves.length]], ph)) * hmr[d[1]] * e 
    let fb = fbs[d[1]](spl, state.feedback, 1)/ 6// (Math.log(hmr[d[1]])/Math.log(10))/4) //* e
     //console.log(fb)
    return spl/2
    return fb
    return spl/6//*e //* lsm[d[1]] //* hmr[d[1]]
   }
   off[d[1]] = synth
} 
