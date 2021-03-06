import React, { Component } from 'react';
import './App.css';
import queryString from 'query-string';


let defaultTextColor = '#fff';

let defaultStyle = {
  color: defaultTextColor,
}

let fakeServerData = {
  user: {
    name: 'Michal',
    playlists: [
    {
      name: 'Playlist One',
      songs: [
        {name: 'Song Jedna',duration: 1244},
        {name: 'Song Dva',duration: 1344},
        {name: 'Song Tri',duration: 1664}
      ]
    },
    {
      name: 'Playlist Two',
      songs: [
        {name: 'Song Jedna',duration: 1244},
        {name: 'Song Dva',duration: 1344},
        {name: 'Song Tri',duration: 1664}
      ]
    },
    {
      name: 'Playlist Three',
      songs:[
        {name: 'Song Jedna',duration: 1244},
        {name: 'LOL',duration: 1344},
        {name: 'Song Tri',duration: 1664}
      ]
    },
    {
      name: 'Playlist Four',
      songs: [
        {name: 'Song Jedna',duration: 1244},
        {name: 'Song Dva',duration: 1344},
        {name: 'Song Tri',duration: 1664}
      ]
    }
    ]
  }
}


class PlaylistCounter extends Component {
  render() {
    return (
      <div style={{...defaultStyle, width: '40%', display: 'inline-block'}}>
        <h2>{this.props.playlists.length} playlists </h2>
        </div>
    )
  }
}

class HoursCounter extends Component {
  render() {
    let allSongs = this.props.playlists.reduce((songs, eachPlaylist) => {
            return songs.concat(eachPlaylist.songs)
          }, [])
    let totalDuration = allSongs.reduce((sum, eachSong) => {
            return sum + eachSong.duration
          }, 0)

    return (
      <div style={{...defaultStyle, width: '40%', display: 'inline-block'}}>
        <h2>{Math.round(totalDuration/60)} hours </h2>
        </div>
    )
  }
}


class Filter extends Component {
  render() {
    return (
      <div style={{color: defaultTextColor}}>
        <img/>
        <input type="text" onKeyUp={
          event => 
          this.props.onTextChange(event.target.value)
        }/>
        
     </div>

    )
  }
}

class Playlist extends Component {
  render() {
    let playlist = this.props.playlist;
    return (
      <div style={{...defaultStyle, display: 'inline-block', width: "25%"}}>
        <img src={playlist.imageUrl} style={{width: '140px'}}/>
        <h3>{playlist.name}</h3>
        <ul>
          {playlist.songs.map(song => 
            <li>{song.name}</li>
          )}
          </ul>
        </div>
    )
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      serverData: {},
      filterString: ''
    };
  }
  componentDidMount() {
    let parsed = queryString.parse(window.location.search);
    let accessToken = parsed.access_token;
    if(!accessToken)
      return;

    fetch('https://api.spotify.com/v1/me', {
      headers: {'Authorization': 'Bearer ' + accessToken}
    }).then((response) => response.json())
    .then(data => this.setState({
      user: {
        name: "Michal"
      }
    }))
  
    fetch('https://api.spotify.com/v1/me/playlists', {
      headers: {'Authorization': 'Bearer ' + accessToken}
    }).then((response) => response.json())
    .then(data => this.setState({
         playlists: data.items.map(item => {
           return {
            name: item.name,
            imageUrl: item.images[0].url,
            songs: []
                  }
         })
        }))
      }
  


  render() {
    let playlistToRender = 
      this.state.user && 
      this.state.playlists 
        ?  this.state.playlists
           .filter(playlist =>
             playlist.name.toLowerCase().includes(
              this.state.filterString.toLowerCase()))
        : []
    return (
      <div className="App">
        {this.state.user ?
          <div>
          <h1>
            {this.state.user.name}'s Playlists
          </h1>
          
            <PlaylistCounter playlists={playlistToRender}/>
            <HoursCounter playlists={playlistToRender}/>
          
          <Filter onTextChange={text => {
              this.setState({filterString: text})}
          }/>

          {
            playlistToRender.map(playlist =>
              <Playlist playlist={playlist} />
            )
          }

        
        
          </div> : <button 
          onClick={() => window.location='http://localhost:8888/login'}
          style={{padding: '20px', 'font-size': '50px', 'margin-top': '20px'}}>Sign in with Spotify</button>
          }
      </div>
    );
  }
}



export default App;
