import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Buffer } from 'buffer';
import { SpotifyContext } from './SpotifyContext';

const client_id = 'e00232bd2c424564a541b18dc0bfa826';
const client_secret = 'd64253b6526e48d098f5fd4b9d0b3941';
const redirect_uri = 'http://localhost:5173/';

export const SpotifyProvider = ({ children }) => {
    console.log('Rendering SpotifyProvider');
    const [token, setToken] = useState(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        console.log('code', code);

        if (code) {
            axios({
                method: 'post',
                url: 'https://accounts.spotify.com/api/token',
                data: new URLSearchParams({
                    grant_type: 'authorization_code',
                    code: code,
                    redirect_uri: redirect_uri
                }).toString(),
                headers: {
                    'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64')),
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            .then(response => {
                console.log('Token',response.data.access_token);
                setToken(response.data.access_token);
            })
            .catch(error => {
                console.error(error);
            });
        } else {
            const authParams = new URLSearchParams();
            authParams.append('response_type', 'code');
            authParams.append('client_id', client_id);
            authParams.append('scope', 'user-read-private user-read-email streaming');
            authParams.append('redirect_uri', redirect_uri);

            const authUrl = 'https://accounts.spotify.com/authorize?' + authParams.toString();

            // Redirect the user to the authorization URL
            window.location = authUrl;
        }
    }, []);

    return (
        <SpotifyContext.Provider value={token}>
            {children}
        </SpotifyContext.Provider>
    );
};