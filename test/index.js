const concat = require('concat-stream')
const readdirp = require('readdirp')
const rimraf = require('rimraf')
const test = require('tape')
const path = require('path')
const fs = require('fs')

const copy = require('..')

test('should assert input values', function (t) {
  t.plan(4)
  t.throws(copy.bind(null), /string/)
  t.throws(copy.bind(null, 'foo'), /string/)
  t.throws(copy.bind(null, 'foo', 'bar', 'err'), /function/)
  t.throws(copy.bind(null, 'foo', 'bar', 'err', 'err'), /object/)
})

test('should write a bunch of files', function (t) {
  t.plan(7)

  const inDir = path.join(__dirname, 'fixtures')
  const outDir = path.join(__dirname, '../tmp')
  copy(inDir, outDir, function (err) {
    t.error(err)

    readdirp({ root: outDir }).pipe(concat({ object: true }, function (arr) {
      t.ok(Array.isArray(arr), 'is array')

      const names = arr.map(function (file) { return file.path })
      console.log(names)
      t.notEqual(names.indexOf('1.txt'), -1, '1.txt exists')
      t.notEqual(names.indexOf('2.txt'), -1, '2.txt exists')
      t.notEqual(names.indexOf('3.txt'), -1, '3.txt exists')
      t.notEqual(names.indexOf('foo/4.txt'), -1, 'foo/4.txt exists')

      rimraf(outDir, function (err) {
        t.error(err)
      })
    }))
  })
})

test('should inject context variables strings', function (t) {
  t.plan(5)

  const inDir = path.join(__dirname, 'fixtures')
  const outDir = path.join(__dirname, '../tmp')
  copy(inDir, outDir, { foo: 'bar' }, function (err) {
    t.error(err)

    readdirp({ root: outDir }).pipe(concat({ object: true }, function (arr) {
      t.ok(Array.isArray(arr), 'is array')

      const file = arr[0].fullPath
      fs.readFile(file, function (err, chunk) {
        t.error(err)

        const file = String(chunk).trim()
        t.equal(file, 'hello bar sama')

        rimraf(outDir, function (err) {
          t.error(err)
        })
      })
    }))
  })
})
