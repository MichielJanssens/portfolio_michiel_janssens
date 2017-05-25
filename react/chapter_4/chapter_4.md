# Chapter 4 - form validation, submitting, callback props

In chapter 3 we started off with the basics of adding a form in React.

In this chapter, we'll continue adding features: some validation, a submit button, callback props,...

## submit button

Up until now, if you've been following along, you've got a working form below the music album list in your application.

However, it doesn't really do much. Let's do something about that.

First, we need a way to actually submit our form. So let's add a button to do just that

```
*in MusicForm*
...
  render() {
    return (
      <div className="music-form">
        <h1>Add your own music</h1>
        <form>
          <div className="flex">
            <input name={'title'} className="margin-small-right" type="text" placeholder="title" onChange={this._handleChange} value={this.state.title}/>
            <input name={'artist'} className="margin-small-left" type="text" placeholder="artist" onChange={this._handleChange} value={this.state.artist}/>
          </div>
          <input name={'imageUrl'} type="text" placeholder="album cover url" onChange={this._handleChange} value={this.state.imageUrl}/>
          <button onClick={this._handleSubmit}>add to music</button>
        </form >
      </div>
    )
  }
...
```

We also need to add a _handleSubmit handler in our class:

```
...
  _handleSubmit() {
    // call our callback function on the parent, with a new music item
    this.props.onAddMusic(this.state);
    // then clear state again so the form is cleared
    this.setState(emptyState);
  },
...
```

Let's disect what is happening here.

When a user clicks on our `<button`, it triggers `this._handleSubmit`. In our method we're doing two things:

- we're calling a prop on our component called onAddMusic, as a function, and we're passing in the current `state` as a parameter.
- we're resetting the state to the default `emptyState` variable we've created before in chapter 3.

## onAddMusic callback prop

Now, calling this `onAddMusic` prop as a function won't actually do anything right now, as we didn't assign any function to this prop in our parent `App` component. So let's add that in now:

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

  _handleAddMusic(item) {
    // this function will be called when clicking on the add button in the form (see below)
    // Simply add the incoming item to the music array on our App state.
    var music = this.state.music;
    music.push(item);
    this.setState({
      music: music
    })
  },

  render() {
    return (
      <div className="app-container">
        <h1>The music app</h1>
        <MusicSummary musicList={this.state.music} />
        <MusicForm onAddMusic={this._handleAddMusic}/>
      </div>
    )
  }
});
```

As you can see, we've assigned a new method called `this._handleAddMusic` to the `onAddMusic` prop of `MusicForm`.
In `this._handleAddMusic` we're simply pushing a new item in the current music array (living on this.state), and calling this.setState with the updated music array.

Remember, when you call this.setState in a React component, it will update the current state, and trigger a re-render of the App component (Actually, it triggers an entire reconciliation cycle, going through a couple of different lifecycles, as we saw in chapter 2).

The DOM will now be updated to include your newly added album. Try it out!


## form validation

Right now, we can hit the submit button at any time, even when we didn't fill out the artist field, for example. This can lead to some unexpected behaviors, and even errors returning from a server if we're persisting data.

So: time to add some form validation. As we'll see in just a second, because we opted to use controlled components instead of uncontrolled components (see chapter 3), validation is really straightforward to implement, and works while the user is typing.

Let's start by adding a key 'pristine' to our `emptyState` and initializing it as false:

```
var emptyState = {
    imageUrl: '',
    title: '',
    artist: '',
    pristine: false,
}
```

We also want to add some conditional className to our button to indicate to the user if they can submit the form yet or not, as well as a `disabled` property:

```
...
    <button className={!this.state.pristine ? 'disabled' : null} onClick={this._handleSubmit} disabled={!this.state.pristine}>add to music</button>
...
```

Now let's add a new method to our class to actually handle the form validation, which we'll then call in our `_handleChange` method:

```
  _validateForm() {
    // if we have filled out each value, it's valid.
    // imageurl is not required, and will fall back to a default
    var { title, artist } = this.state;
    this.setState({
      pristine: title && artist
    })
  },

  _handleChange(e) {
    // set the appropriate values to the appropriate keys
    // on our music object which resides in local state.
    var value = e.target.value;
    var name = e.target.name;

    this.setState({
      [name]: value
    }, this._validateForm);
  },
```

Notice how we're adding `this._validateForm` as a second parameter to `this.setState`.
The reason for doing it like this, is that `this.setState` is actually handled asynchronously. The second parameter in `this.setState` is a callback function, that gets executed every time the state has updated.

If we were to add `this._validateForm` in our code after this.setState -- we'd never be sure that we're actually validating with the latest state.

While we're at it, we might want to add an `onSubmit` handler to our `<form>` element as well. That way we can submit our form by hitting enter as well:

```
<form onSubmit={this._handleSubmit}>
```

Almost ready! We just need to update `this._handleSubmit` to only do something if `this.state.pristine` is true:

```
...
  _handleSubmit() {
    // check if the form is valid (i.e. all necessary fields are completed)
    if (this.state.pristine) {
      // call our callback function on the parent, with a new music item
      this.props.onAddMusic(this.state);
      // then clear state again so the form is cleared
      this.setState(emptyState);
    }
  },
...
```

And we're done!

If you run your app right now, you should be able to add new albums to your library.