import { useEffect, useState } from 'react';
// import './index.css';

// Helper to import all images from assets/card_icons
const importAllImages = () => {
  const context = import.meta.glob('./assets/card_icons/*.{png,jpg,jpeg,svg}', { eager: true });
  return Object.values(context).map(mod => mod.default);
};
const images = importAllImages();

function shuffle(array) {
  let arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function Game({ rows, cols }) {
  const total = rows * cols;
  const numPairs = total / 2;

  // Prepare shuffled cards with pairs of images
  const [cards, setCards] = useState([]);
  const [showAll, setShowAll] = useState(true);
  const [countdown, setCountdown] = useState(5);
  const [selected, setSelected] = useState([]); // indices of selected cards
  const [matched, setMatched] = useState([]); // indices of matched cards
  const [lose, setLose] = useState(false);
  const [lives, setLives] = useState(3);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    // Pick images for pairs
    const selectedImages = shuffle(images).slice(0, numPairs);
    const cardImages = shuffle([...selectedImages, ...selectedImages]);
    setCards(cardImages);
    setShowAll(true);
    setCountdown(5);
    setSelected([]);
    setMatched([]);
    setLose(false);
    setLives(3);
    const timer = setTimeout(() => setShowAll(false), 5000);
    return () => {
      clearTimeout(timer);
    };
  }, [rows, cols]);

  useEffect(() => {
    let interval;
    if (showAll) {
      setCountdown(5);
      interval = setInterval(() => {
        setCountdown(prev => prev > 1 ? prev - 1 : 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showAll]);

  useEffect(() => {
    if (selected.length === 2) {
      const [first, second] = selected;
      if (cards[first] === cards[second]) {
        setMatched(prev => [...prev, first, second]);
        setTimeout(() => setSelected([]), 800);
      } else {
        if (lives > 1) {
          setTimeout(() => {
            setSelected([]);
            setLives(l => l - 1);
          }, 800);
        } else {
          setTimeout(() => setLose(true), 800);
        }
      }
    }
  }, [selected, cards, lives]);

  useEffect(() => {
    setTimer(0);
    setTimerActive(false);
  }, [rows, cols]);

  useEffect(() => {
    if (!showAll && !lose && matched.length < cards.length) {
      setTimerActive(true);
    } else {
      setTimerActive(false);
    }
  }, [showAll, lose, matched.length, cards.length]);

  useEffect(() => {
    let interval;
    if (timerActive) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive]);

  const handleCardClick = idx => {
    if (showAll || matched.includes(idx) || selected.includes(idx) || lose) return;
    if (selected.length < 2) {
      setSelected(prev => [...prev, idx]);
    }
  };

  const handleRestart = () => {
    // Reset by changing key on root div to force remount
    setShowAll(true); // triggers useEffect to reset everything
    setCountdown(5);
    setSelected([]);
    setMatched([]);
    setLose(false);
    setLives(3);
    setTimer(0); // Reset the timer
    setTimerActive(false); // Stop the timer
    // re-shuffle cards
    const selectedImages = shuffle(images).slice(0, numPairs);
    const cardImages = shuffle([...selectedImages, ...selectedImages]);
    setCards(cardImages);
    setTimeout(() => setShowAll(false), 5000);
  };

  const handleMainMenu = () => {
    window.location.reload(); // or navigate to main menu route if using router
  };

  const won = matched.length === cards.length && cards.length > 0 && !lose;

  return (
    <div className="game-container" style={{ minHeight: '100vh', position: 'relative' }}>
      {/* Timer at the very top, full width */}
      <header className="game-timer fixed-header">
        {!showAll && !lose && timer}
      </header>
      {/* Memorize message absolutely positioned, not affecting board layout */}
      {showAll && (
        <p className="memorize-message">
          Memorize the cards! {countdown}
        </p>
      )}
      <div className="game-board-wrapper">
        <div
          className="game-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, 120px)`,
            gridTemplateRows: `repeat(${rows}, 120px)`,
            gap: '10px',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '0',
          }}
        >
          {cards.map((img, idx) => {
            const isRevealed = showAll || matched.includes(idx) || selected.includes(idx);
            return (
              <button
                className={`game-btn${isRevealed ? ' revealed' : ''}`}
                key={idx}
                style={{ width: '120px', height: '120px' }}
                onClick={() => handleCardClick(idx)}
                disabled={isRevealed || lose}
              >
                {isRevealed ? (
                  <img src={img} alt="card" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
                ) : (
                  "?"
                )}
              </button>
            );
          })}
        </div>
      </div>
      {/* Footer at the very bottom, full width */}
      <footer className="game-footer fixed-footer">
        {!showAll && !lose && !won && (
          <>
            <span className="footer-lives">
              Lives: {Array.from({ length: lives }).map((_, i) => '💖').join(' ')}
            </span>
            <span className="footer-matches">
              Matches: {matched.length / 2} / {numPairs}
            </span>
          </>
        )}
      </footer>
      {(lose || won) && (
        <div className="popup-modal popup-window">
          <div className="popup-content">
            {lose && (
              <p className="lose-message" style={{ marginBottom: '1.5rem' }}>
                😢 You lost! Try again! 😢
              </p>
            )}
            {won && (
              <p className="win-message">
                🎉🦄 You won! Congratulations! 🦄🎉
              </p>
            )}
            <div>
              <button className="play-btn" onClick={handleRestart} style={{ marginRight: '1rem' }}>
                Restart
              </button>
              <button className="play-btn" onClick={handleMainMenu}>
                Main Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Game;
