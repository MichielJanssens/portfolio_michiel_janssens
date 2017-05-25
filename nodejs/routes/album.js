const express = require('express');
const albums = require('../controllers/album');

module.exports = function getRouter(app) {
  const router = new express.Router();

  router.route('/')
        .get(albums.list)
        .post(albums.create);

  router.route('/:albumId')
        .get(albums.read)
        .put(albums.update)
        .delete(albums.remove);

  router.param('albumId', albums.findById);

  // Register our routes
  app.use('/api/v1/albums', router);
};