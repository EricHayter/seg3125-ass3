import { useState } from 'react';
import Game from './Game';

function SelectDifficulty() {
  const [selected, setSelected] = useState(null);

  if (selected) {
    const config = {
      easy: { rows: 4, cols: 4 },
      medium: { rows: 4, cols: 6 },
      hard: { rows: 6, cols: 6 }
    };
    const { rows, cols } = config[selected];
    return <Game rows={rows} cols={cols} />;
  }

  return (
    <div className="app-container menu-box">
      <h1>Select Difficulty</h1>
      <div className="difficulty-buttons">
        <button className="play-btn" onClick={() => setSelected('easy')}>
          Easy (4x4)
        </button>
        <button className="play-btn" onClick={() => setSelected('medium')}>
          Medium (4x6)
        </button>
        <button className="play-btn" onClick={() => setSelected('hard')}>
          Hard (6x6)
        </button>
      </div>
    </div>
  );
}

export default SelectDifficulty;
