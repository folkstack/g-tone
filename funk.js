var Z = function Y(fn) {
  return function (maker) {
    return function (arg) {
      return fn(maker(function(f){fn = f; return Z(f) }))(arg);
    };
  }(function (revert) {
    return function (f){
      return revert(f)
    };
  });
};

var play 

var fn = m => n => 0
play = Z(fn)
console.log(play(0))

fn = function(fn){return function(m){ return function(n){; if(n > 2) return m(fn)(n); else return fn()(n) + n**n}}}((fn))

play = Z(fn)

console.log(play(2))
console.log(play(8))
fn = function(fn){return function(m){ return function(n){; if(n > 2) return m(fn)(n); else return fn()(n) + n*2}}}((fn))
play = Z(fn)
console.log(play(2))
console.log(play(4))
fn = function(fn){return function(m){ return function(n){; if(n > 22) return m(fn)(n); else return fn()(n) + n*4}}}((fn))
play = Z(fn)
//console.log(play(4))
//console.log(play(2))
//var h = Z(function(m){ return function(n){ return m()(n) + n**n}})
//console.log(h(2))

var makefun = function (fn){
  return function (maker) {
    return function (arg) {
      return fn(maker(maker))(arg);
    };
  }
}

var makeget = function(getfn){
  return makefun(a=> getfn(a))
}

var zero = makefun(m => n => 0)
var base = makefun(m => n => m(n) + 0)
var top = makefun(m => n => n * 2)

var gf = m => a => (a > 2) ? top(a) : 0

var gff = base(makefun(makeget(gf)(makefun(zero))))

fn = base(top)

console.log(gff(3))
//fn = base(top)
//console.log(fn(3))


var a = makefun(m => n => (n > 2) ? m(n) : n*2)
var b = makefun(m => n => (n > 4) ? m(n) : n*4)
var z = makefun(m => n => 0)


//console.log(m(7))

var Y = function Y(fn) {
  return function (maker) {
    return function (arg) {
      return fn(maker(maker))(arg);
    };
  }(function (maker) {
    return function (arg) {
      return fn(maker(maker))(arg);
    };
  });
};


//f = Y(function (m){return g})
//h = Y(function (m){return function(arg){ console.log('arg'); f() }})


function g(){return 0}

//console.log(f.toString())
//console.log(f(12))


/*

var zero = () => 0


var qes = (fn)=>{
  return fn
}

var zeq = qes(zero)

var nxt = qes(()=>{
  let q = zeq
  // do something
  console.log('derp')
  nxt = zeq
  nxt()
})

//console.log(nxt())

var seq = (fnz, add) => {
  var fn = fnz.shift()
  fn(fnz)
}

var next = (fnz) => {
  console.log('done')
  seq(fnz)
}

var fnz = [next, next, next, zero]

seq(fnz)

var play = () => console.log(zero())

var set = (fn) => {
  let p = play
  play = () => {
    fn()
    p()
  }
  
  return () => play = p
}

var uset = (fn) => {
  let p = play
}

var unset = set((p) => console.log('derp'))
var unset2 = set((p) => console.log('derp2'))
play()
unset()
play()
unset2()
play()

*/
