# Chapter 3: create and structure our API

## About

In this chapter we structure our code even further, extract more out of our application file, and make our API dynamic instead of hardcoded.

## Commandline guides

If you want to follow along with the course and start working based on the chapter-3 tag then I suggest to create a new branch for it: `git checkout -b my-chapter-3 chapter-3`

If you just want to see the starting point for this chapter you can use `git checkout chapter-3`

If you just want to see the finished product of this chapter, just checkout the second chapter `git checkout chapter-4`

## Tasks

In this chapter we will do the following things

* Install a few needed dependencies
  * body-parser
  * glob
* Move all route action into route modules
* Make our create album route dynamic
* Add other routes, for actions on a specific album
  * view
  * update
  * delete

### Installing the extra dependencies again

By now you know how this goes, we install a new npm module that we will need in production code, so it can be a regular dependency

```
npm install body-parser glob --save
```

As you can see, we specified both required modules in 1 statement. You can add many more, and each of them will be installed using the `--save` flag to add them to the production dependency list.

**glob**

The glob module let's us find files on the server's filesystem and process them in our JavaScript. I will explain how it works when we get to the structuring of our routes.

**body-parser**

The body-parser is middleware for express to parse the incomming requests and form it to a proper JavaScript object on the request `req` object in every route callback.

I'll explain it further along the way when it is used, but first, let's initialize it in our `app.js`.

```
const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

// ... application routes logic...
// ... application start logic ...
```

The body-parser module exports a few methods, we want it to parse to json so we use that one.

### Move all route action into route modules

Our app.js would grow to quite big when we have to add lines in there for every route that we create in our API. We need a way to structure these routes. Like our models and controllers we could move route logic into a route file per entity in our application.

Let's create an `/routes/album.js` file and wire it into our application

```
const express = require('express');
const albums = require('../controllers/album');

module.exports = function getRouter(app) {
  const router = new express.Router();

  router.route('/')
        .get(albums.list);

  router.route('/create')
        .get(albums.create);

  // Register our routes
  app.use('/api/v1/albums', router);
};
```

The album router file exports a single function. When it will be called from app.js it will get the express application, we could add each route manually on the `app` object like we were doing in our `app.js` before, however we want to make use of more features from the router so let's create a new `express.Router()` instance and add our routes there instead. After that we need to tell the app how he needs to use our router object. This url could be just the root url `/` but common practice is to at least bind each router to it's own url, why not use the name of our entity `album` in there, so later we could even create a whole set of routes that revolve around an `Artist` on `/api/v1/artists` for example.

**let's clean up app.js and use our new router**

In our App.js we can remove the lines requireing the albumss controller, we can also remove the 2 lines that create a route for the album list and album create method.

But we need to wire in a way to start this new album Router module. Instead of hardcoding the album router in app.js, and adding new hardcoded lines for every router we could ever add later on (artist, user, ...), we should rather find a more dynamic way of adding these routes.

The `glob` module let's us take an unknown amount of files, and process them as a javascript array. Let's see how that goes. Where we removed the Album Controller import, and the 2 manual routes, we can now place these few lines:

```
const glob = require('glob');
// ...
const routes = glob.sync('./routes/*.js');
routes.forEach(function onEach(file) {
  require(file)(app);
});
```

We ask glob to fetch the JS files in the /routes/ folder and store their path in the `routes` variable. It will be an array of the paths to these files.

This is very usefull since now we don't need to manually wire the routes in our app, but every router file we add in the `/routes/` folder will automatically be picked up and initialized by the above forEach loop over that file.

As we saw above the `/routes/album.js`-file exports a single function called `getRouter` and it requires the `app` itself. So when the array of routerfiles is looped through, the file is required, and the exported function is immediately called with the app as argument.

### Make our create album dynamic

#### Using proper HTTP verbs

Before we make the data dynamic, let's start by putting the route on the proper url, and HTTP verb. It is very bad practice to add new things in your database, or write new things on a filesystem, when using a 'GET" url.

We can quickly fix this, by putting our existing create functionality on the proper 'POST' verb and immediately change it to the root of our entity route.

To do this, we must change our router from this:

```
  router.route('/')
        .get(albums.list);

  router.route('/create')
        .get(albums.create)
```

To this:

```
  router.route('/')
        .get(albums.list)
        .post(albums.create);
```

So, we removed the `/create` route, and instead put the creation of a new album on the exact same route `/api/v1/albums` just like when we ask for the entire list of albums.

The big difference is however, that we ask to 'GET' the list of albums, but we 'POST' the new album to the server.

#### Using body parameters to create our album.

Now you might have seen that we get a request object (`req`) in our controller methods. Till now we only used the response (`res`) object to return data to the user. The request object holds all information from the request that the user made. We can use this to send information to the server about which album we want to create.

Let's change our controller `createAlbum` method to use the body of the request rather than a hardcoded album.

```
  const album = new Album(req.body);
  album.save((err, result) => {
    if (err) {
      res.status(500);
      return res.send(err);
    }
    return res.json(result);
  });
```

Remember we installed the body-parser at the beginning of this chapter? Well this is where it is being used. When the server receives a POST request, it parses the incomming http POST body and creates a json object on the request object. Thanks to that middleware funnction we can now use that data in our query to create a new album.

Sadly though, we cannot just call this `/api/v1/albums` in google chrome or firefox anymore. Because the browser issues a 'GET' request to the server it will return a list of all the albums in our database instead.

To work with other http verbs, like POST, PUT, DELETE, ... from our client browser, we would need to use client side JavaScript like jQuery, AngularJS or React. This is what you normally would do if you are working on an application, we make the API in NodeJS and then create a React app that uses the API.

Another way to test these calls would be to use tools, like curl or [postman](https://www.getpostman.com/). Since curl is a commandline tool and we rather have a nice interface so we don't make too much typo's let's test our calls with postman.

Make sure to set the following headers in your call to the server:

* `Content-Type`: `application/json`
* `Accept`: `application/json`

And to pass in the body data as `Raw` data, of the `JSON` format. Depending on what interface of postman you use it can be tricky to find the correct fields to fill in.

**Test to Crash!**

When testing your API, try to find the limits. For example, when you specify that a title is a required property of an album, don't hesitate to test if you can submit a request without a title. Try to break your own app, then you know where you still need to fix things.

### Add other routes, for item specific actions

We made a list of all items, we made a way to submit a new item, now it is time to add a few actions to a specific item.

These other actions have one thing in common, they all handle a specific http verb on a specific single entity.

* delete album X
* update album X
* view album X

#### View

Let's get started with adding a method in our controller to view 1 item.

```
function readAlbum(req, res) {
  const id = req.params.albumId;

  Album
    .findById(id)
    .exec((err, album) => {
      if (err) {
        res.status(500);
        res.send(err);
      }
      res.json(album);
    })
}

module.exports = {
  create: createAlbum,
  read: readAlbum,
  list: listAlbums
};
```

Unlike the list albums, where we launch a query to find items based on filters, the findById is more performant than a broad query like find. It does not need to loop over all items in the database to see if it fits the filters.

Now, let's add it to a route, open up the `routes/album.js` and add the following:

```
  router.route('/:albumId')
        .get(lists.read);
```

We want to get a specific item, so we give the item in the route. Where `/` fetches all albums, `/1` would only fetch the album with the `_id` of `1`. Now in MongoDB these id's are not just numeric values, but a MongoDB ObjectId. You can already see these ID's comming out of the list route so you can use those to get a single specific item.

Just like the list route we are 'GET'ting data from the server, so you can just test this in the browser or use postman if you really want to.

#### Update

You already get the broad idea here, we again create a new action in our controller to update a specific item, and we add it on it's own HTTP verb (`PUT`) route.

**the update action**

```
function updateAlbum(req, res, next) {
  const body = req.body;
  const id = req.params.albumId;

  Album
    .findById(id)
    .exec((err, album) => {
      if (err) {
        return res.status(500).send(err);
      }

      // Object.assign is ES6 notation to merge 2 objects)
      const updatedAlbum = Object.assign(album, body);

      // save the changed album
      updatedAlbum.save((err, result) => {
        if (err) {
          return res.status(500).send(err);
        }

        return res.json(result);
      });
    });
}

module.exports = {
  create: createAlbum,
  read: readAlbum,
  update: updateAlbum,
  list: listAlbums
};
```

**the update route**

```
  router.route('/:albumId')
        .get(lists.read)
        .put(lists.update);
```

On the same route, we add a new verb `PUT` and let our newly created update action handle it.

#### Delete

By now it is no wonder to you how delete should work, so let's create an action for it, wire it into our router.

**the delete action**

```
function removeAlbum(req, res, next) {
  const id = req.params.albumId;

  Album
    .findById(id)
    .exec((err, albumToRemove) => {
      if (err) {
        return res.status(500).send(err);
      }

      albumToRemove.remove((err) => {
        if (err) {
          return res.status(500).send(err);
        }
        return res.status(204).send();
      });
    });
}

module.exports = {
  create: createAlbum,
  read: readAlbum,
  update: updateAlbum,
  remove: removeAlbum,
  list: listAlbums
};
```

**the delete route**

```
  router.route('/:albumId')
        .get(lists.read)
        .put(lists.update)
        .delete(lists.remove);
```

On the same route, we add a new verb `DELETE` and let our newly created update action handle it.

## Up Next

Check out Chapter 4: `git checkout chapter-4`

And look up the documentation for [Chapter 4](./chapter-4.md)
