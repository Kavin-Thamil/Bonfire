# Bonfire

A little place to keep track of games I want to play and figure out what to play next when I can't decide.

Bonfire is a full-stack gaming backlog manager with a random game picker, built with React, Node.js and PostgreSQL.

---

### Features

- **Game Backlog:** Keep track of games you want to play.
- **Random Picker:** Can't decide what to play? Let Bonfire pick one for you.
- **Game Management:** Manage your personal collection of games.
- **Persistent Storage:** Store your game collection in PostgreSQL.
- **Containerised Setup:** Run the frontend, backend and database together using Docker Compose.

---

### Tech Stack

**Frontend:** React, JavaScript, Vite

**Backend:** Node.js, Express.js

**Database:** PostgreSQL

**Tools:** Docker, Docker Compose, Git

---

### Project Structure

```text
Bonfire/
│
├── backend/             # Express API and backend logic
├── frontend/            # React application
├── docker-compose.yml   # Multi-container application setup
├── .env                 # Local environment configuration
└── .gitignore
```

---

### Getting Started

#### Prerequisites

- Docker
- Docker Compose

#### Installation

**1. Clone the repository**

```bash
git clone https://github.com/Kavin-Thamil/bonfire.git
cd bonfire
```

**2. Configure environment variables**

Create a `.env` file in the project root:

```env
POSTGRES_USER=bonfire_user
POSTGRES_PASSWORD=your_new_unique_password
POSTGRES_DB=bonfire
```

**3. Build and start the application**

```bash
docker compose up --build -d
```

**4. Access the application**

| Service | Address |
|---|---|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:3000 |
| PostgreSQL | localhost:5433 |

**5. Stop the application**

```bash
docker compose down
```

The PostgreSQL data is stored in a named Docker volume, so stopping the containers does not remove your database.

---

### What I Learned

- Building a full-stack application using React and Node.js.
- Connecting an Express backend to a PostgreSQL database.
- Managing communication between application services.
- Containerising multiple services using Docker.
- Using Docker Compose to manage application configuration and dependencies.
- Managing database credentials through environment variables.

---

### Author

**Kavin Thamil A**

[GitHub](https://github.com/Kavin-Thamil) · [LinkedIn](https://linkedin.com/in/kavinthamil) · [Email](mailto:kavinthamil01@gmail.com)
