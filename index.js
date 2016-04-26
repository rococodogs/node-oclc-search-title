var http = require('http')
var parsers = {
  marcxml: require('./parse-marc-title'),
  dc: require('./parse-dc-title')
}

module.exports = OCLCSearchTitle

function OCLCSearchTitle (key) {
  if (!(this instanceof OCLCSearchTitle)) return new OCLCSearchTitle(key)

  if (!key && (!key.public && !key.key)) {
    throw new Error('OCLCSearchTitle requires a WSKey (object or string)')
  }

  if (typeof key === 'string') {
    this.key = key
  } else {
    this.key = key.public || key.key
  }
}

OCLCSearchTitle.prototype.search = function search (oclcNum, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts
    opts = {}
  }

  if (!opts) opts = {}

  var schema = (opts.schema || 'dc').toLowerCase()

  // standardize
  if (schema === 'marc') schema = 'marcxml'
  if (schema !== 'dc' && schema !== 'marcxml') {
    var err = new Error('Unknown schema: ' + schema)
    return callback(err)
  }

  var parser = parsers[schema]
  var url = [
    'http://www.worldcat.org/webservices/catalog/content/',
    oclcNum,
    '?recordSchema=info%3Asrw%2Fschema%2F1%2F' + schema,
    '&wskey=' + this.key
  ].join('')

  var req = http.get(url, function (res) {
    if (res.statusCode !== 200) {
      req.abort()
      var err = new Error(res.statusMessage)
      err.statusCode = res.statusCode
      return callback(err, null)
    }

    res.pipe(parser())
      .on('data', function (titles) {
        return callback(null, titles)
      })
      .on('error', function (err) {
        return callback(err, null)
      })
  })
}
