# Chapter 3 - mutating state, creating forms

In chapter 2 we've initialized our app with some hard coded state. But what we really want to do is add our own albums to this list.

In this chapter, we'll start working on a small form to be able to do this.

## Setup a form

Let's start off with creating a new component:

```
var MusicForm = React.createClass({
  render() {
    return (
      <div className="music-form">
        <h1>Add your own music</h1>
        <form >
          <div className="flex">
            <input name={'title'} className="margin-small-right" type="text" placeholder="title" />
            <input name={'artist'} className="margin-small-left" type="text" placeholder="artist" />
          </div>
          <input name={'imageUrl'} type="text" placeholder="album cover url" />
        </form >
      </div>
    )
  }
})
```

Nothing special, this is just a React class as we've seen before.
The only difference is here, we're rendering some interactive html elements - inputs.

If you run this code in a browser right now, you'll see that you can type in the inputs as expected. Nothing's wrong and it all just works.

That is because by not explicitely defining the `value` and `onChange` property on the inputs, we've created something called `uncontrolled inputs`. Basically, we're telling React: hey... let the browser handle this one, yeah?

All fine and dandy, but we there are a couple of reasons why we don't really want the browser to handle the user input without our interfering.

Most importantly, we would like to intercept user input, so we can do some form and field validation while they are typing (and we will, in the next chapter).

So... we need to transform our inputs to be `controlled` inputs instead.

The only thing we need to do is add in a value & onChange handler to these inputs:

```
var MusicForm = React.createClass({
  render() {
    return (
      <div className="music-form">
        <h1>Add your own music</h1>
        <form >
          <div className="flex">
            <input name={'title'} className="margin-small-right" type="text" placeholder="title" onChange={this._handleChange} value={this.state.title}/>
            <input name={'artist'} className="margin-small-left" type="text" placeholder="artist" onChange={this._handleChange} value={this.state.artist}/>
          </div>
          <input name={'imageUrl'} type="text" placeholder="album cover url" onChange={this._handleChange} value={this.state.imageUrl}/>
        </form >
      </div>
    )
  }
})
```
## render the form
Let's quickly revisit our `App` component, and add this new `MusicForm` to our app:

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
        <MusicForm />
      </div>
    )
  }
});
```


If you were to run the code above, you'd obviously get all sorts of warnings. We didn't define any state in the `MusicForm`yet, and `_handleChange` doesn't exist. Let's do that now.

First, let's create a little object outside of our component called `emptyState`. This will come in handy to reset our form later on:

```
var emptyState = {
    imageUrl: '',
    title: '',
    artist: '',
    pristine: false,
}
```

Then, we need to initialize the state of our component to be this empty state:

```
var MusicForm = React.createClass({
  getInitialState() {
    // initialize the item form with an empty music item
    return emptyState;
  },

.....
```

If you refresh the app in the browser right now, you won't see anything changed. But try changing the title in the `emptyState` object for example. You should see that title is now filled out in the input.

But... if we type in the inputs ourselves, nothing is happening!

That's because we haven't actually defined what should happen `onChange`. Let's fix that:

```
  _handleChange(e) {
    // set the appropriate values to the appropriate keys
    // on our music object which resides in local state.
    var value = e.target.value;
    var name = e.target.name;

    this.setState({
      [name]: value
    });
  },
```

`_handleChange` receives an event `e` as the first argument. We can use this to capture the different input values, and save them on the component state.

Remember, to mutate state, you need to use the `this.setState()` method and pass in a new state object as the first parameter.

What we're doing here is using some ES2015 trickery to actually capture and set the name of the changed input as the key, and the target.value as value. This way, we don't need to write a different change handler for every input, and our code can stay nice and DRY.

If you run the code now, you should be able to type in the inputs again, as the values are being saved on the state.
