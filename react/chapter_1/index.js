// start a http-server to be able to serve static content over localhost
// npm install http-server -g
// http-server *folder*

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