const Album = require('./../models/album.js');

function createAlbum(req, res, next) {
console.log(req.body);
  const album = new Album(req.body);

  album.save((err, result) => {
    if (err) {
      return next(err);
    }
    res.json(result);
  });
}

function listAlbums (req, res, next) {
  Album
    .find()
    .exec((err, albums) => {
      if (err) {
        return next(err);
      }
      res.json(albums);
    });
}

function readAlbum(req, res) {
  res.json(req.album);
}

function updateAlbum(req, res, next) {
  const body = req.body;

  // Object.assign is ES6 notation to merge 2 objects)
  const updatedAlbum = Object.assign(req.album, body);

  // save the changed album
  updatedAlbum.save((err, result) => {
    if (err) {
      return next(err);
    }

    return res.json(result);
  });
}

function removeAlbum(req, res, next) {
  const id = req.params.albumId;
  req.album.remove((err) => {
    if (err) {
      return next(err);
    }
    return res.status(204).send();
  });
}

function findById(req, res, next, id) {
  Album
    .findById(id)
    .exec((err, album) => {
      if (err) {
        return next(err);
      }

      if (!album) {
        return next({
          name: 'UnknownEntityError',
          message: `Unknown Album ${id}`
        });
      }

      req.album = album;
      return next();
    });
}

module.exports = {
  create: createAlbum,
  list: listAlbums,
  read: readAlbum,
  update: updateAlbum,
  remove: removeAlbum,
  findById: findById
}