# Chapter 1: a basic node app

## About

In this chapter we will set up our basic NodeJS application and explore the basic components needed to build an API.

## Commandline guides

If you want to follow along with the course and start working based on chapter 1 then I suggest to create a new branch for it: `git checkout -b my-chapter-1 chapter-1`

If you just want to see the starting point for this chapter you can use `git checkout chapter-1`

If you just want to see the finished product of this chapter, just checkout the second chapter `git checkout chapter-2`

## Tasks

In this chapter we will do the following things

* create our project
* Install and explore the [ExpressJS](https://expressjs.com/) framework.
* Create our first app with ExpressJS
* Create our first Route
* learn a few tricks to speed up our development

### Create our project

To start our project we have to just create a new file `package.json` which tells NPM about our project. This does not need to be done manually, we can ask NPM for help by typing `npm init` inside our application folder.

It will ask a bunch of usefull questions, often related to your module. If you want to know more about this package.json and all it's properties you can read up on it here: [http://browsenpm.org/package.json](http://browsenpm.org/package.json)

For now you can just skip through all answers and use the defaults, It will chose the name of your directory as default for the project so feel free to change that if you named your directory something meaningless.

**Note:** *Anything in this package.json can be changed manually later on!*

### Installing modules

#### Introduction to NPM and packages

When exploring the internet for modules to install, you usually will find a few commands to do so. For example, The ExpressJS website lists `npm install express --save` as a way to install the framework. Now, let's take a look at the command and what it does.

First of all, if you did not install any other module yet, it will create a `node_modules` folder in your app root folder. This is where all npm modules will be placed.

Secondly, it will add express in there along with all dependencies of the express framework. Remember that npm thrives on the idea that a module should do only one thing and do that in the best way it can. So most frameworks or apps will be a combination of many modules (called dependencies).

To keep track of these dependencies, the modules or even our own app always have a `package.json` file. All dependencies will be listed in that file. This is where the `--save` parameter comes in. the above command to install ExpressJS tells Npm to not only install the package but also add it to the `package.json` of the project it's being installed in. It will add the module under `dependencies`.

It is important to note that dependencies are key modules needed to run your project. If it is more of a usefull module during development but not needed when the project goes live, then it fits the development dependencies description. You can install a dev dependency by adding `--save-dev` when installing the npm module.

**Keep in mind, at all times you can just manually edit the `package.json` file to edit the dependencies**.

If you ever jump around within your GIT repository between branches or just pulled new code from the server for the first time, it is a good thing to run `npm install` without a package name behind it. This will check your `package.json` and install all dependencies and dev-dependencies. (If you ever run into trouble with versions on packages, you can just remove your `node_modules` folder and run this `npm install` command again).

#### Back to our project

* install ExpressJS: `npm install express --save`

### Create our first web-app: `hello world!`

Start off by creating an application file `app.js`

to start a new app, we need just the following lines:

```
const express = require('express');
const app = express();

app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
});
```

First, we tell our app we want to use the module we just installed. In NodeJS we do this by requiring the module and storing it in a variable to be used.

**Note:** *This has been up to now the way to do this. Soon with the changes to ECMAScript 2015 and up, JavaScript now defines a new way to import modules, but because not everyone is using the latest bleeding edge version of NodeJS we will not use this new system in this app.*

After requiring the framework, let's use it to create an app.

This app is our starting point. Anythign we want to build will need to be added to this `app` object. This could be extra modules, or config, or the routes that we need to access it from the browser.

After that, we start the app by telling it to listen on a certain port (you can run multiple projects on the same domain name by giving them a different port number). Usually when you start doing this you will use another layer (f.e.: Apache, Nginx, ...) on top of it so you don't need to manage all of that magic in the app itself.

Now, let's run our project with `node app.js`

### Let's Create our first route

Without any routes our app bascially does nothing much, But if we add a new route on the route url `/` we can send data to the response object. This data is then sent to the client that requested that route.

```
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
});
```

Restart the app to see the changes, and try surfing to [http://localhost:3000/](http://localhost:3000/)

### Development tricks to speed up the process

You saw that once you run the project, it is listening on port 3000 and handling all requests indefinitely (or untill the app crashes!). When you make changes to the app, you  have to stop it, and restart it to make it run the new code.

Don't worry, there's a module for that! => [Nodemon](https://www.npmjs.com/package/nodemon) ( pronounced *node-mon(itor)*).

So, let's install it, but this time as a development dependency. We don't need development tools in production right!.

`npm install nodemon --save-dev`

This little module looks at your files, and when they are changed it will restart the server for us. So test it out by issueing the following command

Now, since we installed nodemon in our application, (instead of in the global namespace) we would need to run it via

`./node_modules/.bin/nodemon app.js`

Which is quite a mouthful. So we can optimize that a little bit by leveraging NPM scripts. Open your `package.json` and find the 'scripts' section.

Add a 'start' script like this:

```
"scripts": {
  ... other scripts
  "start": "./node_modules/.bin/nodemon app.js"
}
```

now we can just start our app with

`npm start`

## Up Next

Check out Chapter 2: `git checkout chapter-2`

And look up the documentation for [Chapter 2](./chapter-2.md)
