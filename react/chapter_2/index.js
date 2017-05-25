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


ReactDOM.render(
  <App />,
  document.getElementById('root')
);