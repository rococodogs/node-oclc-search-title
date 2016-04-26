// through stream to parse out <datafield tag="245"><subfield code="a" (or b)> fields
var through = require('through2')
var xml = require('node-xml')
var out = []

module.exports = parseMarcTitle

var parser = new xml.SaxParser(function (p) {
  var title = ''
  var in245 = false
  var inSubfield = false

  p.onStartElementNS(function (el, attr) {
    if (el !== 'datafield' && el !== 'subfield') return

    var i = 0
    var len = attr.length
    var key, val

    if (!in245 && el === 'datafield') {
      for (; i < len; i++) {
        key = attr[i][0]
        val = attr[i][1]

        if (key === 'tag' && val === '245') {
          in245 = true
          return
        }
      }
    }

    if (in245 && el === 'subfield') {
      for (; i < len; i++) {
        key = attr[i][0]
        val = attr[i][1]

        if (key === 'code' && (val === 'a' || val === 'b')) {
          inSubfield = true
          return
        }
      }
    }
  })

  p.onEndElementNS(function (el) {
    // </subfield>
    if (el === 'subfield' && inSubfield) {
      inSubfield = false
      if (title) {
        out.push(title)
        title = ''
      }
      return
    }

    if (in245 && el === 'datafield') {
      in245 = false
      return
    }
  })

  p.onCharacters(function (char) {
    if (!inSubfield) return

    title += char
  })
})

function parseMarcTitle () {
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
