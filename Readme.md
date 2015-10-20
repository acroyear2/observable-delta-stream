# observable-delta-stream

given an [mobservable](https://github.com/mweststrate/mobservable) will emit diff changesets.

# example

```js
var deltas = require('observable-delta-stream')
var m = require('mobservable')

var foo = m.observable({ bar: 555, qux: [] })

deltas(foo).on('data', function (delta) {
  console.log('change:', delta)
})

foo.bar = 666
foo.qux.push(42)
```

outputs:

```
change: [ { type: 'put', key: [ 'bar' ], value: 555 },
  { type: 'put', key: [ 'qux' ], value: [] } ]
change: [ { type: 'put', key: [ 'bar' ], value: 666 } ]
change: [ { type: 'put', key: [ 'qux', '0' ], value: 42 } ]
```

# api

```js
var deltas = require('observable-delta-stream')
```

## var stream = deltas(observable)

Returns a readable stream that will produce rows of delta arrays using [changeset](https://github.com/eugeneware/changeset) when [`observable`](https://github.com/mweststrate/mobservable/blob/4d9aad74198edb1beea1d6b54f915dd2bb6ee196/docs/refguide/observable.md) is changed. 

## stream.destroy(err)

Destroys the stream and disposes the underlying [reactive view](https://github.com/mweststrate/mobservable/blob/4d9aad74198edb1beea1d6b54f915dd2bb6ee196/docs/refguide/autorun.md) associated with this stream.

# license

mit