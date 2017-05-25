'use strict';

const addVirtualId = (Schema => {
  Schema.virtual('id').get(function onGet() {
    return this._id.toHexString();
  });

  return Schema;
});

const addToJsonOrObject = (Schema => {
  Schema.set('toJSON', {
    virtuals: true
  });

  Schema.set('toObject', {
    virtuals: true
  });

  return Schema;
});

const addTransforms = (Schema => {
  Schema.options.toObject.transform = function onTransformToObject(doc, ret) {
    delete ret.__v;
    delete ret._id;
  };

  Schema.options.toJSON.transform = function onTransformToJson(doc, ret) {
    delete ret._id;
    delete ret.__v;
  };

  return Schema;
});


module.exports = {
  addVirtualId,
  addToJsonOrObject,
  addTransforms
}