// start a http-server to be able to serve static content over localhost
// npm install http-server -g
// http-server *folder*

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


// the music summary item
// a stateless, purely representational component
// it uses passed props to display image, title, artist.
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


MusicSummaryItem.propTypes = {
  imageUrl: React.PropTypes.string,
  title: React.PropTypes.string.isRequired,
  artist: React.PropTypes.string.isRequired,
}

// the form to add more music
// will save data on it's own state first
// submitting the form (either onClick button or onSubmit form), will call callback function and pass a new music item object
// callback is handled in the parent App component (onAddMusic={_handleAddMusic}) to add item to the global state.

// because we need to reset state, assign default state to a variable
var emptyState = {
    imageUrl: '',
    title: '',
    artist: '',
}

var MusicForm = React.createClass({
  getInitialState() {
    // initialize the item form with an empty music item
    return emptyState;
  },

  _handleChange(e) {
    // set the appropriate values to the appropriate keys
    // on our music object which resides in local state.
    var value = e.target.value;
    var name = e.target.name;

    this.setState({
      [name]: value
    });
  },


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


ReactDOM.render(
  <App />,
  document.getElementById('root')
);