const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.send("BONFIRE Backend is running!");
});

// Health check
app.get("/api/health", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");

        res.json({
            status: "online",
            database: "connected",
            time: result.rows[0].now
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database connection failed" });
    }
});

// GET: Retrieve all games
app.get("/api/games", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM games ORDER BY created_at DESC"
        );

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to retrieve games" });
    }
});

// POST: Add a game
app.post("/api/games", async (req, res) => {
    try {
        const title = req.body.title?.trim();

        if (!title) {
            return res.status(400).json({
                error: "Game title is required"
            });
        }

        const result = await pool.query(
            "INSERT INTO games (title) VALUES ($1) RETURNING *",
            [title]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to add game" });
    }
});

// PATCH: Update game status
app.patch("/api/games/:id/status", async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ["Backlog", "Playing", "Completed"];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                error: "Invalid game status"
            });
        }

        const result = await pool.query(
            "UPDATE games SET status = $1 WHERE id = $2 RETURNING *",
            [status, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Game not found" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update game" });
    }
});

// DELETE: Remove a game
app.delete("/api/games/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM games WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Game not found" });
        }

        res.json({
            message: "Game deleted successfully",
            game: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete game" });
    }
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`BONFIRE server running on port ${PORT}`);
});