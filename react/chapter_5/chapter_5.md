# Chapter 5 - filtering values

In chapter 4 we finished up our form, and we are now able to add music albums to our app.

In this chapter, we'll be adding a basic filtering functionality, so we can search for any album.


## adding a filter

If we want to search for an album... we'll need a search field! So let's start by adding that.
Since this is the only input in our `App` component, we can get away with just an inline `onChange` handler. This uses an ES2015 arrow function - but you could write it just the same way with traditional `function` notation.

```
*in `App`*
  render() {
    return (
      <div className="app-container">
        <h1>The music app</h1>
        <input className="margin-large-bottom" type="text" placeholder="search" onChange={(e) => this.setState({searchQuery: e.target.value})} />
        <MusicSummary musicList={this.state.music} />
        <MusicForm onAddMusic={this._handleAddMusic}/>
      </div>
    )
  }
```

In this onChange, we're actually setting a `searchQuery` property on the state. So let's initialize it as well, as an empty string:

```
  getInitialState() {
    return {
      music: [
        {imageUrl: 'http://static.djbooth.net/pics-features/tlop-worst-album-release.jpg', title: 'The Life Of Pablo', artist: 'Kanye West'},
        {imageUrl: 'https://heathenharvest.files.wordpress.com/2016/02/david-bowie-blackstar.jpg', title: 'Blackstar', artist: 'David Bowie'},
        {imageUrl: 'http://images.rapgenius.com/beb23feb3d0be493ef446e5a7abf61a2.600x600x1.jpg', title: 'Manon', artist: 'De Jeugd Van Tegenwoordig'},
        {imageUrl: 'http://cdn3.pitchfork.com/albums/22814/homepage_large.4984cf76.jpg', title: 'This Unruly Mess I\'ve made', artist: 'Macklemore & Ryan Lewis'},
      ],
      searchQuery: '',
    }
  },
```

Now let's write the fun part. React doesn't come with a standard filter functionality - so we'll have to write our own filter implementation. While this sounds annoying, it actually allows us to write custom filters in a very explicit and clear way. We'll keep to a simple filter for this example though.

Let's first look at the code, and dissect it afterwards:

```
...

  _getFilteredMusic() {
    // A standard filter to search and filter in our music array
    if (this.state.searchQuery) {
      var query = this.state.searchQuery.toLowerCase();
      return this.state.music.filter((item) => {
        // .. which we use to search on artist and title, and return true when we find a match.
        return item.title.toLowerCase().indexOf(query) > -1 || item.artist.toLowerCase().indexOf(query) > -1;
      })
    }
    return this.state.music;
  },
...
```

The code is commented to explain the different steps, but let's step through it together as well.

First off, we only need to return a filtered state, if there's actually a searchQuery. Otherwise, return `this.state.music`.

But if there is a query, we'll need to do something with it. We are using Array's built in `filter` function.

We apply `Array.filter` to the music array pass it a function as the argument. In this case, if the function applied to an item evaluates to `false`, the item is filtered out of the returned array. If it's `true`, we keep it.

We use a bare-bones check using `toLowerCase` and `indexOf` here to look in either the title or the artist field of every album, and return true if our `searchQuery` was found in either one. (A case-insensitive regex would probably be a safer and faster alternative.)

The only thing left to do is actually calling `this._getFilteredMusic` in our render function, so we can pass this array to our `MusicSummary`  component:

```
...
  render() {
    return (
      <div className="app-container">
        <h1>The music app</h1>
        <input className="margin-large-bottom" type="text" placeholder="search" onChange={(e) => this.setState({searchQuery: e.target.value})} />
        <MusicSummary musicList={this._getFilteredMusic()} />
        <MusicForm onAddMusic={this._handleAddMusic}/>
      </div>
    )
  }
...
```

If you restart your app right now, you'll see that you're able to search through all of your music albums.
