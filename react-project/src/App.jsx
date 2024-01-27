import React from 'react';
import Player from './components/Player';
import { SpotifyProvider } from './components/SpotifyProvider';
function App() {
  // Your App component code here
  return (
    <div>
    <SpotifyProvider>
     <Player />
    </SpotifyProvider>
    </div>
  );
}

export default App;