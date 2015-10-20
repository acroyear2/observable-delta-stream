var test = require('tape')
var m = require('mobservable')
var read = require('./')
var diff = require('changeset')

test('patch', function (t) {
  var data = { bar: 555, baz: [], qux: { quux: 'beep' } }
  var x = m.observable(data)
  var s = read(x)

  var expected = [
    { bar: 555, baz: [], qux: { quux: 'beep' } },
    { bar: 666, baz: [], qux: { quux: 'beep' } },
    { bar: 666, baz: [3], qux: { quux: 'beep' } },
    { bar: 666, baz: [3, 5], qux: { quux: 'beep' } },
    { bar: 666, baz: [3, 5], qux: { quux: 'boop' } },
    { bar: 666, baz: [3], qux: { quux: 'boop' } },
    { bar: 666, baz: [3], qux: { quux: 333 } },
    { bar: null, baz: [3], qux: { quux: 333 } }
  ]

  t.plan(expected.length)

  var i = -1, cur = {}

  s.on('data', function (delta) {
    ++ i
    cur = diff.apply(delta, cur)
    t.deepEqual(expected[i], cur)
  })

  process.nextTick(function () {
    data.bar = 666
    data.baz.push(3)
    data.baz.push(5)
    data.qux.quux = 'boop'
    data.baz.pop()
    data.qux.quux = 333
    data.bar = null
  })
})
