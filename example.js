var deltas = require('./')
var m = require('mobservable')

var foo = m.observable({ bar: 555, qux: [] })

deltas(foo).on('data', function (delta) {
  console.log('change:', delta)
})

foo.bar = 666
foo.qux.push(42)
