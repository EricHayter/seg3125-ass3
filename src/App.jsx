import { useState } from 'react';
import './index.css';
import SelectDifficulty from './SelectDifficulty';
import banner from './assets/banner.png';

function App() {
  const [showSelect, setShowSelect] = useState(false);

  const handlePlay = () => {
    setShowSelect(true);
  };

  if (showSelect) {
    return <SelectDifficulty />;
  }

  return (
    <div className="app-container">
      <img src={banner} alt="My Little Pony Memory Game Banner" className="banner-img" />
      <h1 className="main-title">My Little Pony Memory Game</h1>
      <p className="subtitle">Test your memory with your favorite ponies!<br />Choose a difficulty and try to match all the cards before you run out of lives.</p>
      <div className="pony-icons">
        <span role="img" aria-label="Twilight Sparkle" className="pony-icon">🦄</span>
        <span role="img" aria-label="Rainbow Dash" className="pony-icon">🌈</span>
        <span role="img" aria-label="Pinkie Pie" className="pony-icon">🎈</span>
        <span role="img" aria-label="Fluttershy" className="pony-icon">🦋</span>
        <span role="img" aria-label="Applejack" className="pony-icon">🍎</span>
        <span role="img" aria-label="Rarity" className="pony-icon">💎</span>
      </div>
      <button className="play-btn rainbow-btn" onClick={handlePlay}>
        <span role="img" aria-label="sparkle">✨</span> Play <span role="img" aria-label="sparkle">✨</span>
      </button>
    </div>
  );
}

export default App;
