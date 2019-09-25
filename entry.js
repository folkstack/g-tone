var getids = require('getids')
var on = require('dom-event')
var td = require('../touchdown')
var midi = require('web-midi')
var h = require('hyperscript')
var bus = require('page-bus')()

var master = new AudioContext
var jsynth = require('../jsynth')
var $ = require('../polysynth/cheatcode.js')


var controls = require('./controls.js')

var ui = getids()

var waves = ['sine', 'saw', 'tri', 'sq']
var winfunk = ['hann', 'hamming', 'tri', 'planckt', 'welch']
var zero = () => 0
var easy = (t, pts)=> {
  let u = pts[2][1]
  let l = pts[0][1]
  return (Math.pow(t / 1, 1/Math.exp(((pts[1][1] -.5)*2) * 
            Math.log($.amod(1, .5, t / 1, 32 * pts[1][0])))) * (u-l) + l)
}

var as = function(a, s, ad, sd, b){
  //var ae = $.beezxy(a)
  //var se = $.beezxy(s)
  //a = a.reduce((a,e) => { a[0].push(e[0]); a[1].push(e[1]); return a }, [[],[]])
  //s = s.reduce((a,e) => { a[0].push(e[0]); a[1].push(e[1]); return a }, [[],[]])
  var aalt = [easy,zero]
  var salt = [easy, zero]
  var alt = [0,1] // don't get confused 
  //var ez = [ae, se]
  return function(t){
    t -= b
    var tt = (t % (ad + sd)) / ad
    var e = Math.floor(Math.min(tt, 1)) // should be zero if t < attack duration, else 1
    var z = alt.map(i => i ^ e)
    //if(t % 1 == .6) console.log(z)
    //if(t % 1 ==  .1) console.log(t % ad, z, aalt[z[0]](t % ad, a))
    var A = aalt[z[0]]((t % (ad + sd)) * 1/ad, a) + salt[z[1]](((t-ad) % (ad +sd)) * 1/sd, s)
    if(t % .5 === 0) console.log(t, tt, e, z, A)
    return A
  }
}

console.log($)
for(el in ui) td.start(ui[el])

midi.getPortNames(function(e,d){
  ui['midi'].appendChild(h('div', d.map(e => h('div', [h('input', {type: 'checkbox', id: e, value: e, onclick: function(){
       var value = 0
       let last = 0
       let stream = midi.openInput(e, {index: 0, normalizeNotes: false})
       stream.on('data', d => {
         let state = m(d)
       })
     }}), h('label', e, {htmlFor: e})])
  )))
})


var time = 0
on(ui.sine, 'touchdown', e => {
  window.open('http://' + window.location.host + window.location.pathname + 'keyboard.html')
  let state = controls(ui.para).state
  master.resume()
  var gen = $.chrono()
  var a = [[0,1],[1,1]]
  var d = 1
  bus.on('keydown', fq => {
    var bz = as(state.attack, state.decay, state.adur, state.ddur, time) // refresh env 
    console.log(fq)
    let iir = $.iir(state.iir1, state.iir2)
    var synth = (t, s, i) => {
      var e = bz(t)
    //  if(t % 1 === 0) console.log(e)
      return iir($.gtone(t, fq, state.mean, Math.sqrt(state.dev), state.ratio, state.iter, $.ph[waves[state.wave % waves.length]], state.phase)) * e   
     }
     gen.set(time, synth, {curves: [a, a], durations: [state.adur , state.ddur]})
  })
  bus.emit('keydown', 440)
//  console.log(state)
  var iir = $.iir(2,4)
  var synth = jsynth(master, (t, s, i) => {
    t*=72/60
    time = t
    return gen.tick(t, s, i)
  })
  synth.connect(master.destination)
})
