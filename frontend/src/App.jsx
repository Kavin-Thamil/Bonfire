import { useEffect, useState } from "react";
import "./App.css";

const API = "/api";

function App() {
  const [games, setGames] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pickedGame, setPickedGame] = useState(null);
  const [filter, setFilter] = useState("All");

  // Fetch games from backend
  async function fetchGames() {
    try {
      setError("");

      const response = await fetch(`${API}/games`);

      if (!response.ok) {
        throw new Error("Failed to load games");
      }

      const data = await response.json();
      setGames(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchGames();
  }, []);

  // Add game
  async function addGame(e) {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      const response = await fetch(`${API}/games`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        throw new Error("Could not add game");
      }

      const newGame = await response.json();

      setGames((previous) => [newGame, ...previous]);
      setTitle("");
      setPickedGame(null);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  // Update game status
  async function updateStatus(id, status) {
    try {
      const response = await fetch(`${API}/games/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Could not update status");
      }

      const updatedGame = await response.json();

      setGames((previous) =>
        previous.map((game) =>
          game.id === id ? updatedGame : game
        )
      );
    } catch (err) {
      setError(err.message);
    }
  }

  // Delete game
  async function deleteGame(id) {
    try {
      const response = await fetch(`${API}/games/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Could not delete game");
      }

      setGames((previous) =>
        previous.filter((game) => game.id !== id)
      );

      setPickedGame(null);
    } catch (err) {
      setError(err.message);
    }
  }

  // Random backlog picker
  function pickRandomGame() {
    const backlog = games.filter(
      (game) => game.status === "Backlog"
    );

    if (backlog.length === 0) {
      setPickedGame(null);
      setError("Your backlog is empty. Add some games first!");
      return;
    }

    const randomIndex = Math.floor(
      Math.random() * backlog.length
    );

    setPickedGame(backlog[randomIndex]);
    setError("");
  }

  // Dashboard statistics
  const backlogCount = games.filter(
    (game) => game.status === "Backlog"
  ).length;

  const playingCount = games.filter(
    (game) => game.status === "Playing"
  ).length;

  const completedCount = games.filter(
    (game) => game.status === "Completed"
  ).length;

  const filteredGames =
    filter === "All"
      ? games
      : games.filter((game) => game.status === filter);

  return (
    <div className="app">

      <header className="topbar">
        <div className="logo">
          <span className="logo-icon">🔥</span>
          <span>BONFIRE</span>
        </div>

        <div className="system-status">
          <span className="online-dot"></span>
          SYSTEM ONLINE
        </div>
      </header>

      <main className="container">

        <section className="welcome">
          <div>
            <p className="eyebrow">YOUR PERSONAL GAMING HUB</p>
            <h1>Welcome back, <span>Gamer.</span></h1>
            <p className="subtitle">
              Your backlog awaits. Choose your next adventure.
            </p>
          </div>
        </section>

        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError("")}>✕</button>
          </div>
        )}

        <section className="stats">

          <div className="stat-card">
            <p>TOTAL GAMES</p>
            <h2>{games.length}</h2>
          </div>

          <div className="stat-card">
            <p>BACKLOG</p>
            <h2>{backlogCount}</h2>
          </div>

          <div className="stat-card">
            <p>PLAYING</p>
            <h2>{playingCount}</h2>
          </div>

          <div className="stat-card">
            <p>COMPLETED</p>
            <h2>{completedCount}</h2>
          </div>

        </section>

        <section className="picker-section">

          <div className="picker-content">
            <p className="eyebrow">CAN'T DECIDE?</p>

            <h2>
              Let fate <span>decide.</span>
            </h2>

            <p>
              Let BONFIRE choose your next adventure.
            </p>

            <button
              className="pick-button"
              onClick={pickRandomGame}
              disabled={backlogCount === 0}
            >
              🎲 PICK MY NEXT GAME
            </button>
          </div>

          <div className="picked-result">
            {pickedGame ? (
              <>
                <p>YOUR NEXT ADVENTURE</p>
                <h2>{pickedGame.title}</h2>
                <span>🔥 Good luck, gamer.</span>
              </>
            ) : (
              <div className="mystery-icon">?</div>
            )}
          </div>

        </section>

        <section className="library-section">

          <div className="section-heading">
            <div>
              <p className="eyebrow">YOUR COLLECTION</p>
              <h2>Game Library</h2>
            </div>

            <span className="game-count">
              {games.length} GAMES
            </span>
          </div>

          <form className="add-form" onSubmit={addGame}>
            <input
              type="text"
              placeholder="Enter a game title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
            />

            <button type="submit">
              + ADD GAME
            </button>
          </form>

          <div className="filters">
            {["All", "Backlog", "Playing", "Completed"].map(
              (status) => (
                <button
                  key={status}
                  className={filter === status ? "active" : ""}
                  onClick={() => setFilter(status)}
                >
                  {status}
                </button>
              )
            )}
          </div>

          <div className="game-list">

            {loading ? (
              <p className="empty-state">Loading library...</p>
            ) : filteredGames.length === 0 ? (
              <p className="empty-state">
                No games found. Your next adventure starts here.
              </p>
            ) : (
              filteredGames.map((game) => (
                <div className="game-card" key={game.id}>

                  <div className="game-info">
                    <div className="game-icon">🎮</div>

                    <div>
                      <h3>{game.title}</h3>
                      <p>Game #{game.id}</p>
                    </div>
                  </div>

                  <div className="game-actions">

                    <select
                      value={game.status}
                      onChange={(e) =>
                        updateStatus(game.id, e.target.value)
                      }
                      className={`status-select ${game.status.toLowerCase()}`}
                    >
                      <option value="Backlog">Backlog</option>
                      <option value="Playing">Playing</option>
                      <option value="Completed">Completed</option>
                    </select>

                    <button
                      className="delete-button"
                      onClick={() => deleteGame(game.id)}
                      title="Delete game"
                    >
                      ✕
                    </button>

                  </div>

                </div>
              ))
            )}

          </div>

        </section>

      </main>

      <footer>
        BONFIRE <span>•</span> YOUR GAMES. YOUR ADVENTURE.
      </footer>

    </div>
  );
}

export default App;