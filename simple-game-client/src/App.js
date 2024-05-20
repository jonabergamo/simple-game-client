import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [socket, setSocket] = useState()
  const [squares, setSquares] = useState({});
  const [name, setName] = useState('');

  useEffect(() => {
    const ws = new WebSocket(`ws://${window.location.hostname}:8080`);
    setSocket(ws);
    ws.onmessage = (message) => {
      const state = JSON.parse(message.data);
      setSquares(state);
    };

    const handleKeyDown = (event) => {
      const dx = event.key === 'ArrowLeft' ? -10 : event.key === 'ArrowRight' ? 10 : 0;
      const dy = event.key === 'ArrowUp' ? -10 : event.key === 'ArrowDown' ? 10 : 0;
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

  const handleNameChange = () => {
    if (!socket) return
    socket.send(JSON.stringify({ type: 'name', name: name }));
  };

  return (
    <div className="game">
      <input
        type="text"
        value={name}
        onChange={(e) => { setName(e.target.value) }}
        placeholder="Enter your name"
        className="name-input"
      />
      <button className='button-input' onClick={handleNameChange}>Mudar</button>
      {Object.keys(squares).map((id) => (
        <div
          key={id}
          className="square"
          style={{
            left: `${squares[id].x}px`,
            top: `${squares[id].y}px`,
            backgroundColor: squares[id].color,
          }}
        >
          <div className='square-name'>{squares[id].name}</div>
        </div>
      ))}
    </div>
  );
}

export default App;
