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
  t.plan(23)

  function checkCreatedFileNames (names, check) {
    t.notEqual(names.indexOf('.a'), -1, '.a ' + check)
    t.notEqual(names.indexOf('c'), -1, 'c ' + check)
    t.notEqual(names.indexOf('1.txt'), -1, '1.txt ' + check)
    t.notEqual(names.indexOf('2.txt'), -1, '2.txt ' + check)
    t.notEqual(names.indexOf('3.txt'), -1, '3.txt ' + check)
    t.notEqual(names.indexOf('.txt'), -1, '.txt ' + check)
    t.notEqual(names.indexOf('foo' + path.sep + '.b'), -1, 'foo/.b ' + check)
    t.notEqual(names.indexOf('foo' + path.sep + 'd'), -1, 'foo/d ' + check)
    t.notEqual(names.indexOf('foo' + path.sep + '4.txt'), -1, 'foo/4.txt ' + check)
  }

  const inDir = path.join(__dirname, 'fixtures')
  const outDir = path.join(__dirname, '../tmp')
  copy(inDir, outDir, function (err, createdFiles) {
    t.error(err)
    t.ok(Array.isArray(createdFiles), 'createdFiles is an array')
    t.equal(createdFiles.length, 9)
    checkCreatedFileNames(createdFiles.map(function (filePath) {
      return path.relative(outDir, filePath)
    }), 'reported as created')

    readdirp({ root: outDir }).pipe(concat({ object: true }, function (arr) {
      t.ok(Array.isArray(arr), 'is array')

      const names = arr.map(function (file) { return file.path })
      checkCreatedFileNames(names, 'exists')

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

      const file = path.join(outDir, '1.txt')
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

test('should inject context variables strings into filenames', function (t) {
  t.plan(4)

  const inDir = path.join(__dirname, 'fixtures')
  const outDir = path.join(__dirname, '../tmp')
  copy(inDir, outDir, { foo: 'bar' }, function (err) {
    t.error(err)

    readdirp({ root: outDir }).pipe(concat({ object: true }, function (arr) {
      t.ok(Array.isArray(arr), 'is array')

      const file = path.join(outDir, 'bar.txt')
      fs.access(file, function (err, chunk) {
        t.error(err, 'bar.txt exists')

        rimraf(outDir, function (err) {
          t.error(err)
        })
      })
    }))
  })
})
