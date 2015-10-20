var m = require('mobservable')
var diff = require('changeset')
var Readable = require('readable-stream').Readable
var through = require('through2')

module.exports = function (observable) {
  if (!m.isObservable(observable)) return

  var waiting = false
  var state = {}

  var ro = new Readable({ objectMode: true })
  ro.destroyed = false

  var buf = through.obj()
  buf.on('readable', function () {
    if (waiting) {
      waiting = false
      ro._read()
    }
  })

  var dispose = m.autorun(function () {
    var cur = m.toJSON(observable)
    var delta = diff(state, cur)
    state = cur
    buf.write(delta)
  })

  ro._read = function () {
    var row, reads = 0
    while ((row = buf.read()) !== null) {
      ro.push(row)
      ++ reads
    }
    if (0 === reads) waiting = true
  }

  buf.on('error', function (err) { destroy(err) })
  ro.on('close', function () { destroy() })
  ro.on('error', function () { destroy() })

  ro.destroy = destroy

  return ro

  function destroy (err) {
    if (ro.destroyed) return
    ro.destroyed = true

    dispose()
    state = null

    buf.destroy()

    if (err) ro.emit('error', err)
    ro.emit('close')
  }
}
