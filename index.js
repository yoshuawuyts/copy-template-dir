const minstache = require('minstache-stream')
const parallel = require('run-parallel')
const eos = require('end-of-stream')
const readdirp = require('readdirp')
const assert = require('assert')
const mkdirp = require('mkdirp')
const noop = require('noop2')
const path = require('path')
const pump = require('pump')
const fs = require('fs')

module.exports = copyTemplateDir

// High throughput template dir writes
// (str, str, obj, fn) -> null
function copyTemplateDir (srcDir, outDir, vars, cb) {
  if (!cb) {
    if (!vars) vars = noop
    cb = vars
    vars = {}
  }

  assert.equal(typeof srcDir, 'string')
  assert.equal(typeof outDir, 'string')
  assert.equal(typeof vars, 'object')
  assert.equal(typeof cb, 'function')

  // create directory
  mkdirp(outDir, function (err) {
    if (err) return cb(err)

    const rs = readdirp({ root: srcDir })
    const streams = []

    // create a new stream for every file emitted
    rs.on('data', function (file) {
      streams.push(writeFile(outDir, vars, file))
    })

    // delegate errors & close streams
    eos(rs, function (err) {
      if (err) return cb(err)
      parallel(streams, cb)
    })
  })
}

// write a file to a directory
// str -> stream
function writeFile (outDir, vars, file) {
  return function (done) {
    const fileName = file.path
    const inFile = file.fullPath
    const parentDir = file.parentDir
    const outFile = path.join(outDir, reDot(fileName))

    mkdirp(path.join(outDir, parentDir), function (err) {
      if (err) return done(err)
      console.log('outfile', outFile)

      const rs = fs.createReadStream(inFile)
      const ts = minstache(vars)
      const ws = fs.createWriteStream(outFile)

      pump(rs, ts, ws, done)
    })
  }
}

// replace leading underscores with dots
// str -> str
function reDot (filename) {
  return filename.replace(/^\_./, '.')
}
