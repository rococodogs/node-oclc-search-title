# node-oclc-search-title

Uses OCLC's [Search API][search-api] to retrieve an item's title based on its
OCLC number. This saves you the headache of parsing through XML to retrieve a
title.

## usage

```
npm install oclc-search-title
```

```javascript
var key = 'abc1234...' // your public WSKey
var TitleSearch = require('oclc-search-title')
var ts = new TitleSearch(key)

ts.search(656296916, function (err, title) {
  if (err) throw err
  console.log(title)
  //=> [ 'Flashdance', 'Flashdance (Motion picture)' ]
})
```

### var ts = new TitleSearch(key)

Provide your public WSKey as a string or as an [oclc-wskey] instance

### ts.search(oclcNumber[, opts], callback)

Search for `oclcNumber` using the Search API. `opts` can be an object with a
`schema` key with a value of either `'marcxml'` or `'dc'`. OCLC provides results
for both MARC records and Dublin Core. For MARC results, we're parsing the
`245` datafield, subfields `a` and `b` (as per [this OCLC page][marc-245]). For
Dublin Core results, we're parsing the `<dc:title>` fields. `dc` is used by
default when `opts` is omitted.

`callback` recieves the traditional node signature `function (err, title) {}`,
with `err` consisting of any HTTP error that's returned. `title` is an array
of results that match the above criteria (note the two titles returned.

**Note** the Search service will process any OCLC number as long as it's an
unsigned integer, so one that is beyond the current range (`826718710000000000000`
or even `0`) will return an empty array.

## license

MIT

[search-api]: http://www.oclc.org/developer/develop/web-services/worldcat-search-api/bibliographic-resource.en.html
[oclc-wskey]: https://github.com/malantonio/node-oclc-wskey
[marc-245]: http://www.oclc.org/bibformats/en/2xx/245.html
