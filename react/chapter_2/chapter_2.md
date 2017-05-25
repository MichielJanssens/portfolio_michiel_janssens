# Chapter 2 - state, react lifecycles, maps.

In the previous chapter we've covered some basic React concepts and created a basic layout for our music app, with one album already in place.

In chapter 2, we'll initialize some state, use that to render a complete list, and take a sidestep to talk about React lifecycles.

Follow along with the code you've created in chapter 1, or copy the example code and continue from there.

## Using arrays

We've left off our app with one MusicSummaryItem rendered in our list, by passing in props directly.

While it demonstrates a couple of core React principles, it's not really practical if we're working with a bunch of data. Say, for example, an array of albums - instead of one album.

Something that looks like this:

```
[
  {imageUrl: 'http://static.djbooth.net/pics-features/tlop-worst-album-release.jpg', title: 'The Life Of Pablo', artist: 'Kanye West'},
  {imageUrl: 'https://heathenharvest.files.wordpress.com/2016/02/david-bowie-blackstar.jpg', title: 'Blackstar', artist: 'David Bowie'},
  {imageUrl: 'http://images.rapgenius.com/beb23feb3d0be493ef446e5a7abf61a2.600x600x1.jpg', title: 'Manon', artist: 'De Jeugd Van Tegenwoordig'},
  {imageUrl: 'http://cdn3.pitchfork.com/albums/22814/homepage_large.4984cf76.jpg', title: 'This Unruly Mess I\'ve made', artist: 'Macklemore & Ryan Lewis'},
]
```


We'll rewrite some parts of our application to resemble more closely a real life app that can handle and display arrays of data.

## Mapping

### The map method

Let's start off with writing a react component that receives an array `musicList` as a prop, loops over it, and creates a `MusicSummaryItem` for every item in that array.

```
var MusicSummary = React.createClass({
  propTypes: {
    musicList: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        imageUrl: React.PropTypes.string,
        title: React.PropTypes.string,
        artist: React.PropTypes.string,
      })
    )
  },
  _getMusicSummary() {
    // loop over every music list item & map all information to a MusicSummaryItem component
    return this.props.musicList.map(function(item, i) {
      return (
        <MusicSummaryItem key={i} imageUrl={item.imageUrl} title={item.title} artist={item.artist} />
      )
    })
  },
  render() {
    return <div>{this._getMusicSummary()}</div>
  }
})
```

We've used some more advanced PropType validation in here as well - feel free to review the part on proptypes in the previous chapter if you're confused.


What's more important in this component is that we're not just rendering a div, we're calling a private method of this component right in the render, by calling:

`this._getMusicSummary()`

This method will eventually return an array of React Components, by mapping over the musicList prop.

Let's take a little step back and look at `map` first, and what it is - you'll be using it a lot if you're working in React, but it's a very useful tool in your JS toolbelt regardless.

React -- by nature -- follows a declarative paradigm. In contrast to (for example) jQuery, which follows an imperative paradigm. This means we have to adjust the way we think about building applications. We no longer tell the computer *how* to do things, we tell the computer *what* to do. The `map` function constructs an array based on the function we pass it. We don't tell the computer *how* to construct this array. We just tell it *what* we want in this array. 

If you've got an array, you can call a map method on it. Basically what it does is it loops over every item in the array, and applies some sort of function to it. This function, describing what should happen with each item, is provided as the first argument of the `map` method:

```
  _getMusicSummary() {
    // loop over every music list item & map all information to a MusicSummaryItem component
    return this.props.musicList.map(function(item, i) {
      return (
        <MusicSummaryItem key={i} imageUrl={item.imageUrl} title={item.title} artist={item.artist} />
      )
    })
  },
```

What we're doing in this case, is telling the map a couple of things:

- give each item in the array you're mapping over a name. Here we're simply calling it `item`.
- give the second parameter (the index of the current item we're looking at) a name. We called it `i`
- then return a `<MusicSummaryItem>` component, with some props based on the current item we're looking at. For example: use the title of the current item.


### Keys

Notice there's some prop we haven't defined or used before here in the `<MusicSummaryItem>`: `key`.

Key is a prop you can always add to any React component or HTML element in React. It is the way React can keep track of which elements have been updated, to keep the DOM diffing algorithm efficient and fast.

For now, it's enough to know that if you're creating components in a loop (such as with this `map` method we used here), you always need to give each item a unique key. Usually (and ideally), you'd go with some sort of an ID - but for our purposes, the index works well.


## Initial state

Now, we've created this `MusicSummary` component, but haven't actually added it to our application. Let's do that now, and we'll add in some code to provide state to our App as well, and talk a little bit about that.

```
var App = React.createClass({
  getInitialState() {
    return {
      music: [
        {imageUrl: 'http://static.djbooth.net/pics-features/tlop-worst-album-release.jpg', title: 'The Life Of Pablo', artist: 'Kanye West'},
        {imageUrl: 'https://heathenharvest.files.wordpress.com/2016/02/david-bowie-blackstar.jpg', title: 'Blackstar', artist: 'David Bowie'},
        {imageUrl: 'http://images.rapgenius.com/beb23feb3d0be493ef446e5a7abf61a2.600x600x1.jpg', title: 'Manon', artist: 'De Jeugd Van Tegenwoordig'},
        {imageUrl: 'http://cdn3.pitchfork.com/albums/22814/homepage_large.4984cf76.jpg', title: 'This Unruly Mess I\'ve made', artist: 'Macklemore & Ryan Lewis'},
      ],
    }
  },

  render() {
    return (
      <div className="app-container">
        <h1>The music app</h1>
        <MusicSummary musicList={this.state.music} />
      </div>
    )
  }
});
```

We:

- replaced the `MusicSummaryItem` with `MusicSummary`, and passed in this.state.music as the musicList prop
- added a method `getInitialState`

Let's talk a little bit about that second step. The first one should be familiar by now, we just added a component with a prop.
What's more interesting is that we're passing some property on an object called this.state as a prop to that component.

Here's where the difference between React `state` and `props` comes into play. While both are ways to re-render a component (and thus change what we see in the DOM), there is a crucial difference:

In one sentence... state is something that lives inside a component, while props are passed down from parent to child. State can therefore be used to update things inside a component -- but not for communicating between components (unless passed via a prop).

In order to use state in a component, it's crucial your component is defined as a class (either via `createClass` as we've done, or via extending `Component`). A functional component cannot have state.

By initializing the state via the `getInitialState` lifecycle hook, the music array is available in all methods of the React class on `this.state`. If you're extending a `Component` class, you would define this.state in the constructor -- but the same principles apply.

## React lifecycle methods

`getInitialState` and `render` are two examples of React "lifecycle methods". So let's look a little bit closer at what these are and what we can use them for.

There are three stages in the life of a React component:

- Mounting
  - These methods are called when an instance of a component is being created and inserted into the DOM:
    - getInitialState() (or constructor() when extending Component)
    - componentWillMount()
    - render()
    - componentDidMount()


- Updating
  - An update can be caused by changes to props or state. These methods are called when a component is being re-rendered:
    - componentWillReceiveProps()
    - shouldComponentUpdate()
    - componentWillUpdate()
    - render()
    - componentDidUpdate()


- Unmounting
  - This method is called when a component is being removed from the DOM:
    - componentWillUnmount()


For detailed information about these components, you can refer to the official documentation - they are all detailed here: https://facebook.github.io/react/docs/react-component.html


Next to these component lifecycles, there are some extra methods available to you.
For example, how would you update `this.state`?

It's a (very) bad idea to directly modify it. If we would like to add an album (as we'll do later on), we would be tempted to actually do something like:

`this.state.music.push(album)`

However, this will **not** cause your component to update. The proper way to mutate `this.state` is via the `this.setState()` method, which we'll use later on in this course - and go into detail about it as well.

