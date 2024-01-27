import React, { useEffect, useContext,useState, useRef } from 'react';
import { SpotifyContext } from './SpotifyContext';
import SearchBar from './SearchBar';
import { Buffer } from 'buffer';
import axios from 'axios';
import qs from 'querystring';



function Player() {
    const token = useContext(SpotifyContext);
    const [playlists, setPlaylists] = useState([]);
    const playerRef=useRef(null);
    const [deviceId, setDeviceId] = useState(null);


    useEffect(() => {
        if (token) {
            // Fetch the user's playlists
            axios.get('https://api.spotify.com/v1/me/playlists', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                setPlaylists(response.data.items);
            })
            .catch(error => {
                console.error(error);
            });

            // Load the Spotify Web Playback SDK
            const script = document.createElement('script');
            script.src = 'https://sdk.scdn.co/spotify-player.js';
            script.async = true;
            document.body.appendChild(script);

            window.onSpotifyWebPlaybackSDKReady = () => {
                const player = new window.Spotify.Player({
                    name: 'Web Playback SDK Template',
                    getOAuthToken: cb => { cb(token); }
                });

                playerRef.current=player;

                // Error handling
                player.addListener('initialization_error', ({ message }) => { console.error(message); });
                player.addListener('authentication_error', ({ message }) => { console.error(message); });
                player.addListener('account_error', ({ message }) => { console.error(message); });
                player.addListener('playback_error', ({ message }) => { console.error(message); });

                // Playback status updates
                player.addListener('player_state_changed', state => { console.log(state); });

                // Ready
                player.addListener('ready', ({ device_id }) => {
                    console.log('Ready with Device ID', device_id);
                    setDeviceId(device_id);
                });

                // Not Ready
                player.addListener('not_ready', ({ device_id }) => {
                    console.log('Device ID has gone offline', device_id);
                });

                // Connect to the player!
                player.connect();
            };
        }
    }, [token]);

    const play = (uri, isPlaylist = false) => {
        axios.put(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
            [isPlaylist ? 'context_uri' : 'uris']: isPlaylist ? uri : [uri]
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(() => {
            console.log('Playing');
        })
        .catch((error) => {
            console.error('Playback error:', error);
        });
    };
    const pause = () => {
        axios.put(`https://api.spotify.com/v1/me/player/pause?device_id=${deviceId}`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(() => {
            console.log('Paused');
        })
        .catch((error) => {
            console.error('Pause error:', error);
        });
    };

    return (
        <div>
            <h1>Spotify Player</h1>
            {token && <p>Player is ready</p>}
            <SearchBar play={play} deviceId={deviceId} />
            <button onClick={pause} disabled={!deviceId}>Pause</button>
            <h2>Your Playlists</h2>
            <ul>
                {playlists.map(playlist => (
                    <li key={playlist.id}>
                        {playlist.name}
                        <button onClick={() => play(playlist.uri, true)} disabled={!deviceId}>Play</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Player;