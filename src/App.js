import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [squares, setSquares] = useState({});

  useEffect(() => {
    const ws = new WebSocket(`ws://${window.location.hostname}:8080`);

    ws.onmessage = (message) => {
      const state = JSON.parse(message.data);
      setSquares(state);
    };

    const handleKeyDown = (event) => {
      const dx = event.key === 'ArrowLeft' ? -5 : event.key === 'ArrowRight' ? 5 : 0;
      const dy = event.key === 'ArrowUp' ? -5 : event.key === 'ArrowDown' ? 5 : 0;
      if (dx !== 0 || dy !== 0) {
        ws.send(JSON.stringify({ type: 'move', dx, dy }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      ws.close();
    };
  }, []);

  return (
    <div className="game">
      {Object.keys(squares).map((id) => (
        <div
          key={id}
          className="square"
          style={{
            left: `${squares[id].x}px`,
            top: `${squares[id].y}px`,
          }}
        />
      ))}
    </div>
  );
}

export default App;
