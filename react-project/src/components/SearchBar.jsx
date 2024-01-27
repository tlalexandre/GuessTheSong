import React, { useState, useContext } from 'react';
import axios from 'axios';
import { SpotifyContext } from './SpotifyContext';

function SearchBar({play, deviceId}) {
    const token = useContext(SpotifyContext);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]); 

    const searchTracks = () => {
        axios.get(`https://api.spotify.com/v1/search?type=track&q=${searchQuery}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            setSearchResults(response.data.tracks.items);
        })
        .catch(error => {
            console.error('Search error:', error);
        });
    };

    return (
        <div>
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            <button onClick={searchTracks}>Search</button>
            <ul>
                {searchResults.map(track => (
                    <li key={track.id}>
                        {track.name} by {track.artists[0].name}
                        <button onClick={() => play(track.uri)}>Play</button>
                    </li>
                ))}
            </ul>
            
        </div>
    );
}

export default SearchBar;