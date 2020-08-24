var fs = require('fs')
var para = require('../parametrical')
var getids = require('getids')
var insert = require('insert-css')
var td = require('../touchdown')
var on = require('dom-event')
var ui = getids()
var css = fs.readFileSync('ui/module.css', 'utf8')
var dial = fs.readFileSync('ui/dial.html', 'utf8')
var graph = fs.readFileSync('ui/graph.html', 'utf8')
var store = require('store')
window._store = store
insert(css)
let config = require('./gparams')

let sgp  = store.get('gparams')
console.log('sgp', typeof sgp)
var dialUI = ghost(dial)
var graphUI = ghost(graph)

module.exports = function(el, update){
  //console.log(g, gui)
if(typeof sgp == 'string'){
  var gparams = JSON.parse(sgp) 
  console.log('yippe', gparams)
} else{  
  var gparams = config
}
  ui.io.style.display = 'none'
  for(gp in gparams){
    if(gparams[gp].type == 'dial') {
      var g = ghost(dial)
      var gui = g.getElementsByClassName('dial')[0]
      var display = g.getElementsByClassName('gdialvalue')[0]
      let name = display.getElementsByClassName('dialname')[0]
      let val = display.getElementsByClassName('dialval')[0]
      let nick = gparams[gp].name ? gparams[gp].name : gp
      console.log(nick)
      name.innerHTML = `<p>${nick}</p>`
      val.innerHTML = `<p>${Number(gparams[gp].value).toFixed(2)}</p>`
      gparams[gp].el = gui
      gparams[gp].nel = name
      gparams[gp].vel = val
    }
    else {
      var g = ghost(graph)
      var gui = g.getElementsByClassName('graph')[0]
      gui.classList.add(gparams[gp].type)
      gparams[gp].el = gui
    }
    el.appendChild(g)
  }
  console.log(gparams)
  let state = para(gparams, function(val, name){
    console.log(val, name, state.state[name], gparams[name])
    gparams[name].value = val
    if(gparams[name].type === 'dial'){
      //console.log(name, gparams[gp].type)
      if(name == 'wave')
        gparams[name].vel.firstChild.textContent = val.toFixed(2) % 4 
      else
        gparams[name].vel.firstChild.textContent = val.toFixed(2)
    }
    update(name, val, state)
    // do on window unload
    //store.set('gparams', JSON.stringify(gparams))
  })
  return state
}


function ghost(html){
  var div = document.createElement('div')
  div.innerHTML = html
  return div.firstChild
}

