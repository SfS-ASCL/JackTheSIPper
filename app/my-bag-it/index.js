var assert = require('assert')
var fs = require('fs')
var path = require('path')
var crypto = require('crypto')
var mkdirp = require('mkdirp')
var count = require('count-files')
var pretty = require('prettier-bytes')
var through = require('through2')
var collect = require('stream-collector')
var constants = require('./lib/const')
var stream = require('stream');

// to create a reader stream from a file blob (stemming from HTML5 dnd)
var fileReaderStream = require('filereader-stream')

module.exports = BagIt

function BagIt (dir, algo, opts) {
  if (!(this instanceof BagIt)) return new BagIt(dir, algo, opts)
  assert.equal(typeof dir, 'string', 'bagit-fs: directory required')
  if (typeof algo !== 'string') {
    opts = algo
    algo = null
  }
  if (!opts) opts = {}

  this.dir = dir
  this.algo = algo || 'sha256'
  this.manifest = path.join(dir, 'manifest-' + this.algo + '.txt')
  this.dataDir = path.join(dir, 'data')
  this.bagInfo = opts

  mkdirp.sync(this.dataDir)
}

BagIt.prototype.finalize = function (cb) {
  var self = this
  self._writeDeclaration(function (err) {
    if (err) return cb(err)
    var info = self.bagInfo
    count(self.dataDir, function (err, stats) {
      if (err) return cb(err)
      info['Bagging-Date'] = new Date().toISOString().split('T')[0]
      info['Bag-Size'] = pretty(stats.bytes)
      self._writeBagInfo(info, cb)
    })
  })
}

BagIt.prototype._writeDeclaration = function (opts, cb) {
  if (typeof opts === 'function') return this._writeDeclaration({}, opts)
  if (!opts) opts = {}

  var self = this
  var version = opts.version || constants.DECLARATION.version
  var encoding = opts.encoding || constants.DECLARATION.encoding
  var data = [
    `BagIt-Version: ${version}`,
    `Tag-File-Character-Encoding: ${encoding}`
  ].join('\n')

  fs.writeFile(path.join(self.dir, constants.DECLARATION.name), data, cb)
}

BagIt.prototype._writeBagInfo = function (opts, cb) {
  if (typeof opts === 'function') return this._writeBagInfo(null, opts)

  var info = opts || this.bagInfo
  if (!info) return cb(new Error('Bag Info required'))

  var self = this
  var data = Object.keys(info).map(function (key) {
    return `${key}: ${info[key]}`
  }).join('\n')
  fs.writeFile(path.join(self.dir, 'bag-info.txt'), data, cb)
}

BagIt.prototype.readFileNoCheck = function (name, opts, cb) {
    console.log('readFileNoCheck', name, opts, cb);

    var encoding = 'binary';
    if ( name.includes('rtf') || name.includes('txt') ) {
	encoding = 'utf-8';
    }
    
    fs.readFile(name, encoding, function (err, data) {
	console.log('!!! readFileNoCheck', data.length);
	if (err) return cb(err)
	cb(null, data)
    })
}

BagIt.prototype.readFile = function (name, opts, cb) {

  console.log('bag-it/readFile at start', name, opts, cb);
  if (typeof opts === 'function') return this.readFile(name, null, opts)
  if (typeof opts === 'string') opts = {encoding: opts}
  if (!opts) opts = {}

  var self = this
  var hash
  var digest
//    var rs = this.createReadStream(name, opts)
  var rs = this.createReadStreamFromBlob(name)    
  var verify = !(opts.verify === false)

  if (verify) {
    var digest = crypto.createHash(this.algo)
    rs.on('data', function (data) {
      digest.update(data)
    })
  }

    console.log('bag-it/readFile: rs, verify', rs, verify);
    
    collect(rs, function (err, bufs) {
	console.log('bag-it/readFile collect at start', err, bufs);	
      if (err) return cb(err)
      console.log('bag-it/readFile collect I', err);
      var buf = bufs.length === 1 ? bufs[0] : Buffer.concat(bufs)
      console.log('bag-it/readFile collect II', buf);      
      var result = opts.encoding ? buf.toString(opts.encoding) : buf
      console.log('bag-it/readFile collect III', result);
      if (!verify) return cb(null, result)

    self.getManifestEntry(name, function (err, entry) {
      if (err) return cb(err)
      if (!entry) return cb(new Error('File not found in manifest.'))
      hash = digest.digest('hex')
	if (hash !== entry.checksum) {
	    console.log('hash', hash);
	    console.log('entry.checksum', entry.checksum);
	    return cb(new Error('File does not match manifest checksum value.'))
	}
      cb(null, result)
    })
  })
}

BagIt.prototype.getManifestEntry = function (name, cb) {
  console.log('bag-it/getManifestEntry', name, cb);
  this.readManifest(function (err, entries) {
    if (err) return cb(err)
    var entry = entries.filter(function (entry) {
      return entry.name === 'data/' + name
    })
    if (entry.length > 1) return cb(new Error('multiple files found'))
    if (!entry.length) return cb()
    cb(null, entry[0])
  })
}

BagIt.prototype.readManifest = function (cb) {
  fs.readFile(this.manifest, 'utf-8', function (err, data) {
    if (err) return cb(err)
    var entries = data.split('\n').map(function (line) {
      line = line.split(' ')
      return { checksum: line[0], name: line[1] }
    })
    cb(null, entries)
  })
}

BagIt.prototype.createReadStream = function (name, opts) {
  name = path.join(this.dataDir, name)
    // TODO: opts.verify - check checksum while reading

    // not implemented by BrowserFS...    
    // return fs.createReadStream(name, opts)

    var rs = new stream.Readable(name, opts);
    rs._read = function (n) { }
    return rs;
}

BagIt.prototype.createReadStreamFromBlob = function (blob, opts) {
    console.log('createReadStreamFromBlob', blob, blob.name);
    name = path.join(this.dataDir, blob.name)
    // TODO: opts.verify - check checksum while reading
    var rtn = fileReaderStream(blob);
    return rtn;
}

BagIt.prototype._createWriteStreamHelper = function (name, opts) {
    var ws = new stream.Writable();
    ws.writable = true;
    ws.bytes = 0;    
    
    ws._write = function (chunk, encoding, done) {
	ws.bytes += chunk.length;	
	fs.writeFile(name, chunk, encoding);	
	done();
    };

    ws.end = function(buf) {
	console.log('bytes total: ' + ws.bytes + ' for ' + name );
    }

    return ws;
}

BagIt.prototype.createWriteStream = function (name, opts, cb) {

    console.log('BagIt/createWriteStream', name, opts, cb);
  // TODO: support writing to fetch.txt + manifest but not data/
  var self = this

    name = path.join(self.dataDir, name)
  var hash = null
  var digest = crypto.createHash(self.algo)

    // not implemented by BrowserFS...
    // var ws = fs.createWriteStream(name, opts)
    
    var ws = this._createWriteStreamHelper(name, opts);
    
    var stream = through(
	function (chunk, enc, cb) {
	    console.log('through', chunk, enc);
	    digest.update(chunk)
	    cb(null, chunk)
	},
	function (cb) {
	    hash = digest.digest('hex')
	    // TODO: check if old file hash is in manifest
	    var data = `${hash} ${path.relative(self.dir, name).split(path.sep).join('/')}\n`
	    console.log('through/cb', data);
	    fs.appendFile(self.manifest, data, cb)
	}
    )
    stream.pipe(ws)
    stream.on('finish', function () {
	cb();
	console.log('my-bag-it/index.js: --> finished writing', name);
    });
    return stream
}

BagIt.prototype.stat = function (name, cb) {
  name = path.join(this.dataDir, name)
  return fs.stat(name, cb)
}

BagIt.prototype.lstat = function (name, cb) {
  name = path.join(this.dataDir, name)
  return fs.lstat(name, cb)
}

BagIt.prototype.readdir = function (name, cb) {
    name = path.join(this.dataDir, name)
    console.log('my-bag-it/readdir', name);
    return fs.readdir(name, cb)  // fixed, was: fs.lstat(name, cb)  
}

BagIt.prototype.mkdir = function (name, opts, cb) {
  name = path.join(this.dataDir, name)
  return fs.mkdir(name, opts, cb)
}

BagIt.prototype.unlink = function (name, cb) {
  name = path.join(this.dataDir, name)
  return fs.unlink(name, cb)
}

BagIt.prototype.rmdir = function (name, cb) {
  name = path.join(this.dataDir, name)
  return fs.rmdir(name, cb)
}
