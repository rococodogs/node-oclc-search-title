var fs = require('fs')
var path = require('path')
var dcStream = require('../parse-dc-title')
var marcStream = require('../parse-marc-title')
var tape = require('tape')

tape('can read Dublin Core', function (t) {
  t.plan(2)
  fs.createReadStream(path.resolve(__dirname, 'bib-read-dublincore.xml'))
    .pipe(dcStream())
    .on('data', function (title) {
      var expect = ['Battle cry of freedom : the Civil War era']

      t.equal(title.length, expect.length, 'Dublin Core example has one title')
      t.deepEqual(title, expect)
    })
})

tape('can read MARCXML', function (t) {
  t.plan(2)
  fs.createReadStream(path.resolve(__dirname, 'bib-read-marcxml.xml'))
    .pipe(marcStream())
    .on('data', function (title) {
      var expect = ['RESTful web services /']

      t.equal(title.length, expect.length, 'MARCXML example has one title')
      t.deepEqual(title, expect)
    })
})
