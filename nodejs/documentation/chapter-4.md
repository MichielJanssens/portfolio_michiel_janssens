# Chapter 4: Extras

## Commandline guides

If you want to follow along with the course and start working based on the chapter-3 tag then I suggest to create a new branch for it: `git checkout -b my-chapter-4 chapter-4`

If you just want to see the starting point for this chapter you can use `git checkout chapter-4`

If you just want to see the finished product of this chapter, just checkout the second chapter `git checkout final`

## Tasks

In this chapter we will do the following things

* Cleanup our models that are returned
* Remove duplicate code in the detail actions
* Handle errors properly
* We could add the same routes and logic for Artists
* Add cors middleware

### Cleanup our models

You might have noticed, we have a bit of technology code smell over our output. Anyone looking at the results of a service call would be able to guess we are using mongoDB, since he see's these `_id` and `__v` properties being sent.

We can clean this up and make it 'cleaner'. To do this, we need to update our models. But first, since this will need to be added in every model we possibly add to our API, let's immediately put it in it's own module. Start by creating a `helpers/schemaHelper.js`

```
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
```

and add it to our album model like this:

```
const SchemaHelper = require('./../helpers/schema');

// const AlbumSchema = ...

SchemaHelper.addVirtualId(AlbumSchema);
SchemaHelper.addToJsonOrObject(AlbumSchema);
SchemaHelper.addTransforms(AlbumSchema);

// module.exports ...
```

Basically, we added 3 schema helper methods in a schema helper module. We don't need to initialize them on every model but we can add them separately whenever we want to.

**addVirtualId**

the `addVirtualId` method, will add an 'id' property on every item which is calculated from the original `_id` property that mongodb gives it.

**addToJsonOrObject**

the `addToJsonOrObject` method, tells the schema to add virtual properties too when it executes a `toJson` or `toObject` transform on the model. (This happens automatically when dumping the album in the response object like `res.json(album)` for example).

**addTransforms**

And finaly the `addTransforms` method adds a `toJson` and `toObject` map function to the Schema. Whenever the schema is cast from a mongo document into just JSON this map function will be used.

Our map function specifies that it has to remove these mongo smell like `_id` and `__v` properties, the server can deal with those but the client application should never have to ...

### Remove duplicate code in the detail action

We've been manually writing the detail actions delete, update and read while the first part of that logic is identical. Before we can do the detail action on a specific album we need to find the item by ID first.

We can refactor that part of the code out into a more reusable method. First, let's create a `findById` method in our controller.

```
function findById(req, res, next, id) {
  Album
    .findById(id)
    .exec((err, album) => {
      if (err) {
        return res.status(500).send(err);
      }

      req.album = album;
      return next();
    });
}

module.exports = {
  // ...,
  findById: findById
}
```

We just created a method that does the findById logic for an Id that was passed in via the arguments. And when ready fetching the item, we store it on the request (we know the `req` property is passed in to each function of this Request).

Now, we need to make it execute before the actual updateAlbum, deleteAlbum and readAlbum are executed so let's modify our `routes/album.js` file a bit.

```
  // `/` route logic
  // `/:albumId` route logic

  router.param('albumId', albums.findById);

  // app.use...
```

We basically tell the router, that whenever it finds a route with `:albumId` as a paramter, that it should execute our `findById` method. It will call that method like any other middleware with the 3 main arguments `req`, `res` and `next` but it will add the given content of the parameter in the current request as a fourth and final argument which we take in as `id` in our controller.

Due to this logic, the findById will be executed first, then when it calls `next()` it will continue with all middleware for the requested route, for example readAlbum.

This means that in the readAlbum (and updateAlbum and deleteAlbum) we can now cleanup all duplicate logic, and just pick the album that is prefetched for us from the request object instead.

for the readAlbum this means that we can remove almost the entire function and replace it with:

```
function readAlbum(req, res) {
  res.json(album);
}
```

continue and remove the duplicate logic from the other 2 actions too.

### Handle errors properly

Currently we don't handle many errors, and if we do we have a very basic solution for it. when an error occures we just dump the MongoDB error on the user's screen. This is not very user friendly is it?

We also don't check for errors ourself, For example, in our newly created findById we check if mongo gave us an error, (that would happen when our query is faulty, or when the connection was broken). But MongoDB would not error if the ID just does not exist. If it can't find the item it will return a valid result but the `album` would just be `undefined`. We have to check for those things ourselve and return proper statuscode which is to be expected from a professional API.

To handle this example above, we should test if album is not undefined. We can do this the long way `if (album != undefined) {...}` or we can just use the short notation:

```
function findById(req, res, next, id) {
  Album
    .findById(id)
    .exec((err, album) => {
      if (err) {
        return res.status(500).send(err);
      }

      if (!album) {
        return res.status(404).json({
          message: `Unknown Album ${id}`
        });
      }

      req.album = album;
      next();
    })
}
```

This outputs a proper error, and most clientside frameworks when receiving this 404 error will automatically detect this as an 'error' from the API and provide you with beter tools to handle these errors in your clientside application.

**add error handling as fallback**

Another way of handling errors, could be via the use of error modules, and fallback error middleware.

Like we removed the duplicate code in the 3 detail actions, we could remove a lot of the duplicate lines like `return res.status(500).send(err)`... those lines, are not handling the error itself, they just dump it to the client.

If we would like to handle all those errors by checking which error occured and handle each item accordingly, we need to create some error handlers first (we could even put them in errorHandling module.

Create an `middleware/errorHandling.js` module and add the following methods:

```
function logErrors (err, req, res, next) {
  // console.error(err.stack)
  next(err)
}

function handleMongoErrors (err, req, res, next) {
  const errors = {};

  if (err.name === 'ValidationError') {

    for (field in err.errors) {
      errors[field] = err.errors[field].message;
    }

    return res.status(400).json({
      name: err.name,
      message: err.message,
      errors: errors
    });
  }

  // if the error was not in the above handled errors,
  // we pass it through to the almighty eror fallback
  next(err)
}

function finalErrorHandler (err, req, res, next) {
  res.status(500)
  res.json({ message: "something failed" });
}

module.exports = {
  logErrors: logErrors,
  handleMongoErrors: handleMongoErrors,
  finalErrorHandler: finalErrorHandler
}
```

At the very end of app.js, just before the app.listen logic, we make our app use these handlers in the above order

```
const errorHandler = require('./middleware/errorHandling');
app.use(errorHandler.logErrors);
app.use(errorHandler.handleMongoErrors);
app.use(errorHandler.finalErrorHandler);
```

Now that we catch errors at the end of the chain, we can start removing all this manual work and just continue the chain if an error occures.

so, where we used to have:

```
      if (err) {
        return res.status(500).send(err);
      }
```

we can now write

```
      if (err) {
        return next(err);
      }
```

While this looks not much different, the actual handling of an error is so much more flexible now.

Now try for yourself to move the error 404 which we added to the findById method, to move that one into our error handling flow as well. This should only be done to add more flexibility. Say if your error output to the client needs to change, you can do this in your errorHandling middleware instead of having to revisit every single method in controllers to change the output.

### We could add the same routes and logic for Artists

Feel free to update the API with a way to store artists as well. Start off with the model, then add some routes, create the controller logic leveraging the modules we created thusfar.

read up on [references](https://alexanderzeitler.com/articles/mongoose-referencing-schema-in-properties-and-arrays/) if you wish to make the artist property on an album a reference to the actual artist model.

### Add cors middleware

This is not really needed for every application. But in case your application does not run on the same URL as your client side application you might (and will) run into CORS issues.

Browsers and servers don't like it when site X is performing queries to Server Y.  Cross Origin Request Sharing or short CORS, need to be specifically allouwed by the server being called.

But in node this is not really an issue because - you guessed it right - there is a module for that. You know the drill:

```
npm install cors --save
```

and in our app.js

```
const cors = require('cors');
app.use(cors());
```


## Up Next

Check out the end result: `git checkout final`