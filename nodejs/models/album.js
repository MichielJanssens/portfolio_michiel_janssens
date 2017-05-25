const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schemaHelper = require('./../helpers/schema');

const AlbumSchema = new Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  imageUrl: { type: String },
  releaseDate: { type: Date }
});

schemaHelper.addVirtualId(AlbumSchema);
schemaHelper.addToJsonOrObject(AlbumSchema);
schemaHelper.addTransforms(AlbumSchema);

module.exports = mongoose.model('Album', AlbumSchema);