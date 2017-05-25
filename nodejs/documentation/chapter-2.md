# Chapter 2: using a database

## About

In this chapter we learn how to use a database in our application.

## Commandline guides

If you want to follow along with the course and start working based on the chapter-2 tag then I suggest to create a new branch for it: `git checkout -b my-chapter-2 chapter-2`

If you just want to see the starting point for this chapter you can use `git checkout chapter-2`

If you just want to see the finished product of this chapter, just checkout the second chapter `git checkout chapter-3`

## Tasks

In this chapter we will do the following things

* Install and explore the [Mongoose ODM](http://mongoosejs.com/).
* Create our first new module in the app
* Create our first model
* Manipulate objects in the database

### Installing the modules needed

To let our application talk with the MongoDB database we need an ODM (Object Document Mapper). This will allow us to not write or compose the tedious mongodb queries by hand. If we would be useing a SQL database, like mySQL, or postgreSQL we would use an ORM or Object Relational Mapper.

Now, the best ODM to work with MongoDB in NodeJS is Mongoose. There are others but Mongoose has been around since the beginning of MongoDB and is so big (community and development wise), that it will be hard for any other project to top that.

So, lets install Mongoose and include it into our project.

```
npm install mongoose --save
```

Now that it is installed we need to tell our app that he needs to use it. Let's open our `app.js` and take mongoose in and tell it to connect to our mongodb server.

```
const express = require('express');
const app = express();

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/nodejs-introduction');

// other logic ...

app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
});
```

### Create our first module in the app

Technically our app itself is already a module, but let's take some time explaining modules in NodeJS.

Every file in NodeJS is a module. These modules can stand on their own, do stuff and make certain functions or logic available to other modules by exporting them.

Let's create a module to store our configuration data.

Create a new file, `config/config.js`

```
const config = {
  database: 'mongodb://localhost/nodejs-introduction',
  port: 3000
};

module.exports = config;
```

Now, we can change our `app.js` module to use this config module instead of hardcoding all values.

```
// other logic ...

const config = require('./config/config.js');

mongoose.connect(config.database);

// other logic ...

app.listen(config.port, () => {
  console.log(`Example app listening on port ${config.port}!`);
});
```

So, on the top of the file, we require the config module (just like we require modules that we installed via npm). However since these modules are not imported by name, we specify the path to the module instead.

Then, since the config exported the config object, we can now use those exported values.

Dividing our logic in separate modules makes it easy to test them (with unit tests) and to require that logic in other modules to be re-used there.

### Create our first model

Mongoose operates entirely via it's Object Models. You can create a new model, define what properties it should have (you can compare this slightly with SQL databases where you create a table, and define each column with it's datatype, and validation and so on...)

Let's take a look at an example. Let's create a model for a music Album.

First we need to create a module for our model. Go ahead and create a `models` directory and place an `album.js` inside of it.

```
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AlbumSchema = new Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  imageUrl: { type: String },
  releaseDate: { type: Date }
});

module.exports = mongoose.model('Album', AlbumSchema);
```

So, we first require the mongoose module, then we create a new Schema with a few properties. There are many more propertytypes and settings per property you can set. So take a look at the mongoose documentation website which explains those types in depth.

Finaly we must tell mongoose we want to create a new **Model** based on that **Schema** we created. The created model is at the same time exported out of the module. Like in the config module this means it can now be used by other modules that require this AlbumModel module.

### Manipulate data in our database

To start using our model and create items in our database, we must require the model in our app. We should never do all logic in the app module itself, so we store logic for an AlbumModel in a conveniently named AlbumController.

Go ahead and make a `controllers` directory and place an `album.js` file in it.

```
const Album = require('./../models/album.js');

function createAlbum(req, res, next) {

  const album = new Album({
    title: 'AM',
    artist: 'Arctic Monkeys',
    imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/71hEtk3aCpL._SL1500_.jpg'
  });

  album.save((err, result) => {
    if (err) {
      res.status(500);
      return res.send(err);
    }
    res.json(result);
  });
}

module.exports = {
  create: createAlbum
}
```

A controller is usually made up of a set of methods like our create method, which can be called from within our application. So the first thing we do is create a method, and register it on our exports.

Now, we also require our created Model, because we want to create a new Album right? So, in our createAlbum method we actually just create a new instance of the Album model, with a few hardcoded parameters (we'll make them dynamic soon enough).

After creating the `album` we have to save it to the database. When that is ready we test if it did not produce an error, else we send the newly created album to the client.

Last thing we need to do, is make sure some part of our application actually uses this create method we just added to our code. Open up the `app.js` so we can add it there for the time being.

```
// ... application logic ...
// ... application root url '/' logic ...

const albumController = require('controllers/album.js');
app.get('/create-album', albumController.create);

// ... application start logic ...
```

So, we import our controller so we can use the methods, and we create a new route `/create-album` where we tell it to call our create method.

**Note:** This is hardcoded, and because we bind this to the `/create` url, you must know that this will execute every time you visit that url. So when you are ready let's move on to the next chapter where we will focus some more on how we can structure this API better.

### List all the created albums

If we were to create a new method in our controller to find all the albums in the database and send them to the client we can leverage the mongoose ODM which is made available on the Model that is already present in our controller.

```
// ...

function listAlbums (req, res, next) {
  Album
    .find()
    .exec((err, albums) => {
      if (err) {
        res.status(500);
        return res.send(err);
      }
      res.json(albums);
    });
}

module.exports = {
  create: createAlbum,
  list: listAlbums
}
```

On the Album model you cannot only create new instances, you can also use other methods that were made available by mongoose. here we use the `find()` method. But since we want to find all of the albums we don't need to specify any filter parameters.

After we are ready building the find query, we execute it via `.exec()` which in his turn, produces a list of albums, or an error. We again test and handle the error first, and move forward to returning the list of albums to the client if no error was found.

Let's make our list available on a route... Open up `app.js` again and add another route to list the albums.


```
// ... application logic ...
// ... application root url '/' logic ...
// ... application create album url '/create-album' logic ...
app.get('/albums', albumController.list);

// ... application start logic ...
```

We don't need to import the controller anymore as we already did that above, we only create a new route that lists the albums and returns them to the user.

## Up Next

Check out Chapter 3: `git checkout chapter-3`

And look up the documentation for [Chapter 3](./chapter-3.md)
