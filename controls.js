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

insert(css)

var gparams = require('./gparams')

var dialUI = ghost(dial)
var graphUI = ghost(graph)
  console.log(gparams)

module.exports = function(el){
  //console.log(g, gui)
  ui.io.style.display = 'none'
  for(gp in gparams){
    if(gparams[gp].type == 'dial') {
      var g = ghost(dial)
      var gui = g.getElementsByClassName('dial')[0]
      gparams[gp].el = gui
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
    console.log(val, name, state.state[name])
  })
  return state
}


function ghost(html){
  var div = document.createElement('div')
  div.innerHTML = html
  return div.firstChild
}

