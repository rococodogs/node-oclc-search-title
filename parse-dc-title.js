// through stream to parse out <dc:title> fields
var through = require('through2')
var xml = require('node-xml')
var out = []

// exports through stream
module.exports = parseDCTitle

var parser = new xml.SaxParser(function (p) {
  var inTitle = false
  var title = ''

  p.onStartElementNS(function (el, attr) {
    if (el.toLowerCase() === 'title') inTitle = true
  })

  p.onEndElementNS(function (el) {
    if (inTitle && el.toLowerCase() === 'title') {
      out.push(title.trim())

      // reset
      title = ''
      inTitle = false
    }
  })

  p.onCharacters(function (char) {
    if (!inTitle) return

    title += char
  })
})

function parseDCTitle () {
  return through.obj(transform, flush)
}

function transform (chunk, enc, next) {
  parser.parseString(chunk)
  return next()
}

function flush (next) {
  this.push(out)
  return next(null, out)
}
