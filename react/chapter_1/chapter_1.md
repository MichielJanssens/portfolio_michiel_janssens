# Chapter 1 -  The React Class & JSX

In this first chapter, we'll be writing our first React component, render this to the DOM and explore JSX - the html/xml-like syntax React uses to abstract function nesting.

## Setup
### Step 1 - Create an `index.html` file in an empty folder, and copy in the following html:

```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Hello World</title>
    <script src="https://unpkg.com/react@latest/dist/react.js"></script>
    <script src="https://unpkg.com/react-dom@latest/dist/react-dom.js"></script>
    <script src="https://unpkg.com/babel-standalone@6.15.0/babel.min.js"></script>
    <link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400" rel="stylesheet">
    <link href="./style.css" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script src="./index.js" type="text/babel"/>
  </body>
</html>
```

Here we set up an easy to use React playground app with at-compile JSX transpilation. This way, we don't need to setup a complicated development environment. Note that this is not something you would normally do in a production-ready application, but it's good enough for our purposes.

The packages we will be using are:

- [react](https://github.com/facebook/react): this package contains the core algorithms and API of the React library
- [react-dom](https://github.com/facebook/react/tree/master/packages/react-dom): contains helper functions for rendering React to the DOM.
- [babel](https://babeljs.io/): Babel transpiles ES2015 and JSX (among others) to ES5.


This will be the only html file we're using in our app. Everything else in the DOM will be generated by React, as we'll see soon.

### Step 2 - Create a `style.css` file and copy in the following CSS:

```
*, *:before, *:after {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}
body {
  color: #fff;
  background: #121212;
  font-family: Roboto, sans-serif;
  font-weight: 100;
}
h1 {
  font-weight: 100;
  margin-top: 0;
  margin-bottom: 24px;
}

h2 {
  font-weight: 100;
  margin-top: 0px;
  margin-bottom: 16px;
}

.app-container {
  margin: 56px auto;
  padding: 24px 56px;
  max-width: 600px;
  background: #181818;
  border-left: 5px solid #2ab759;
}

.music-item {
  margin: 12px 0;
  color: #fff;
  display: flex;
  background: #121212;
}

.music-item .cover {
  flex: 1;
  max-width: 100px;
  max-height: 100px;
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url('http://geniusmindsystem.org/music_portal/movies/album-placeholder.png');
}

.music-item .info {
  flex: 2;
  min-height: 96px;
  border: 1px solid #5d5d5d;
  border-left: none;
  padding: 16px;
}

input {
  border: 1px solid #ececec;
  color: #424242;
  border-radius: 25px;
  padding: 8px 16px;
  width: 100%;
  background: #fff;
}

.flex-one {
  flex: 1;
}

.flex {
  display: flex;
}

.music-form input {
  margin-top: 12px;
}

.music-form h1 {
  margin-top: 48px;
}

.margin-small-right {
  margin-right: 8px;
}

.margin-small-left {
  margin-left: 8px;
}

.margin-large-top {
  margin-top: 24px;
}

.margin-large-bottom {
  margin-bottom: 24px;
}

button {
  margin-top: 24px;
  border: 0;
  outline: 0;
  background-color: #2ab759;
  padding: 8px 16px;
  text-align: center;
  border-radius: 25px;
  font-size: 12px;
  color: #fff;
  font-weight: 100;
  text-transform: uppercase;
  cursor: pointer;
}

button.disabled {
  background-color: #5d5d5d;
  cursor: default;
}
```

Just so we have something nice to look at ;-).

### Step 3 - create `index.js`

We'll continue working in `index.js` for the remainder of this introduction.

### Step 4 - setup a simple server

We'll need a basic server to serve our app:

`npm install -g http-server`

Then run it in your app folder:

`http-server`

This should start a server on port 8080. You can visit it in the browser: http://localhost:8080

## Our first React component

### Step 1 - create and render the root <App /> component to the DOM
Before we'll start writing our music app, we should look at some of the ways we can write React components.

Right now, there are three kinds:

- legacy `React.createClass`
- extending a `Component` class
- a pure functional component.

Take a look at `course_assets/react-components.html` to review the three different ways of writing a React component. Today, we'll mostly use the legacy `createClass` method, so we don't need to cover too many ES2015 concepts.

In reviewing these components, also note the following bit of code:

```
  ReactDOM.render(
    <LegacyClass />,
    document.getElementById('legacy-root')
  );
```

This is how we tell React to render a component inside the root element in our one html file. This is usually the only time you need to actually interact with the DOM and directly render a React component in there.

So looking at our empty `index.js` this is also the first thing we need to add, if we want to get started with React: our root component.

Let's call it `App`, and render it to the DOM, in the element with id `root`:

```
var App = React.createClass({
  render() {
    return (
      <div className="app-container">
        <h1>The music app</h1>
      </div>
    )
  }
});

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

```

We've got two things happening here: we have created our first (root) component `App` by calling `createClass` and passing it an object as first argument.

In this object, we'll be defining our component.

Every component needs to define what should be rendered when this component is called. So we defined a `render` method, and returned something that looks like HTML from it.

Meet `JSX` -- it's an HTML-like syntax for use in javascript files (and I say "like" because there are a couple of differences you can check out in detail here: https://facebook.github.io/react/docs/jsx-in-depth.html. Most importantly, we use `className` instead of `class` - the rest is not important right now).

In JSX we can both call HTML elements such as `<h1>` - or other React components (as we'll see in just a minute).

What you should know right now, is that while it looks like HTML, JSX is actually just syntactic sugar over function calls.

This:
```
<div className="app-container">
  <h1>The music app</h1>
</div>
```

is equivalent (and gets transpiled) to this:

```
React.createElement("div",{ className: "app-container" },
  React.createElement("h1", null, "The music app"
  )
);
```

*Tip: you can play around with JSX to JS compilation here: https://babeljs.io/repl*

Once we've defined our `<App />` root component, we need to call `ReactDOM.render` to render it to the dom.

As a side note: you might be wondering why we're calling `ReactDOM` here, and not `React` -- the simple reason being that the React workgroup at FB has decided to separate functionality in two packages.

### Step 2 - a music summary item, and props

Until now, we've only used regular old HTML elements in our JSX code. But the power of React comes from the fact that you can actually nest other React components in your JSX much like you would nest HTML elements.

So let's create a new React component, we'll go with a functional one this time to change things up a little bit (and won't be needing state -- we'll talk about that in the next chapter). A functional component is just that -- a function. It receives a single `props` argument and returns output in the form of JSX.

```
var MusicSummaryItem = function(props) {
  var { imageUrl, title, artist } = props;
  return (
    <div  className="music-item">
      <div className="cover" style={imageUrl ? {backgroundImage: 'url("' + imageUrl + '")'} : null}/>
      <div className="info">
        <h2 className="title">{title}</h2>
        <div className="artist">{artist}</div>
      </div>
    </div>
  )
}
```

Let's look at a couple of things here:

- we've used ES2015 destructuring syntax to get imageUrl, title and artist out of the props object.
- we've written some HTML with a couple of CSS classes, much like in step 1.

... and then there's that style tag with some logic in it. Let's look at that a little more closely:

`style={imageUrl ? {backgroundImage: 'url("' + imageUrl + '")'} : null}`

Within these curly braces, we've used a ternary operator to decide if some style should apply, or not. More specifically, if the imageUrl prop has been provided, we'll add a backgroundImage style with the provided URL. Otherwise we're not adding a style at all.

*so to review this syntax: `condition ? this_if_true : this_if_false`*

While we've used the curly braces to add a conditional style to this new component, you can actually write any javascript you want, anywhere in your JSX (within curly braces). Again one of the features that makes React so powerful, because you can do just about anything -- much more than you can achieve with HTML + CSS, and much easier and cleaner compared to DOM manipulation (jQuery). We'll look at more examples later in the course.

Now that we created our `MusicSummaryItem`, we can call it in the render function of our root `App` component, and feed it some props:

```
var App = React.createClass({
  render() {
    return (
      <div className="app-container">
        <h1>The music app</h1>
        <MusicSummaryItem
          imageUrl={'http://static.djbooth.net/pics-features/tlop-worst-album-release.jpg'}
          title={'The Life Of Pablo'}
          artist={'Kanye West'}
        />
      </div>
    )
  }
});
```

Notice how we can pass props to our `MusicSummaryItem` in exactly the same way as we would add properties to an HTML element.

Visually, you can distinguish between an HTML element and a React component, by casing: a component is always Capitalized, an HTML element is not.

If you refresh the browser, you should see a title with our `MusicSummaryItem` all filled out as well.

Remember that we added a conditional style in our MusicSummaryItem component. You can try to leave out the imageUrl prop and see what happens if we don't provide the style.

*hint: I've added a fallback in the css*

One important thing to mention is that in React, once a prop changes, a component **will** update and re-render automatically. This is how we make things dynamic in React -- but more on that in the next chapter when we talk about state as well.

### Step 3 - PropTypes

There's one more thing we should look at before moving on to the next chapter, and that's prop validation.

React comes with a method of validating props - useful if you're designing components and want to protect the user from accidentally forgetting certain required props, or making sure they don't pass in an object when you're expecting a string - for example. Since JavaScript lacks a type system (compare to Java where you specify types), React uses propTypes to provide certain safety measures and document your code at the same time.

PropType validation goes a long way, and you can review all the different kinds of validation in the React docs here: https://facebook.github.io/react/docs/typechecking-with-proptypes.html

Let's add some basic validation for the props of our `MusicSummaryItem`:

```
MusicSummaryItem.propTypes = {
  imageUrl: React.PropTypes.string,
  title: React.PropTypes.string.isRequired,
  artist: React.PropTypes.string.isRequired,
}
```

You can declare propTypes as an object with keys being the props we want to validate - and the values being React PropTypes helpers. Here the props are all strings, but two of them are required (imageUrl is not, as we have a fallback).


Notice how we've actually added a property `propTypes` to our stateless functional component. For this kind of component, this is the only way we can do it. If we're using a legacy class, however, it can be added to the class as a static property. For example:

```
var MusicSummaryItem = React.createClass({
  propTypes: {
    imageUrl: React.PropTypes.string,
    title: React.PropTypes.string.isRequired,
    artist: React.PropTypes.string.isRequired,
  },
  render() {
    ....
  }
})
```

