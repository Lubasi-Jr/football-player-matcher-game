# Tekk Match - 2 Clubs 1 Player

<div align="center">
  
  
  **A real-time multiplayer football trivia game**
  
  [![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen)](https://spring.io/projects/spring-boot)
  [![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
  [![WebSocket](https://img.shields.io/badge/WebSocket-STOMP-orange)](https://stomp.github.io/)
</div>

---

## 📖 About The Game

**Tekk Match** is an exciting head-to-head football trivia game inspired by the viral "2 Clubs 1 Player" challenge popularized on social media platforms like TikTok and YouTube.

### How It Works

1. **Create or Join a Game**: Player 1 creates a game and shares a unique link with Player 2
2. **Secret Team Selection**: Both players secretly select a football club from a pool of Premier League teams
3. **The Reveal**: Once both players have selected, the chosen clubs are revealed to both players
4. **Race to Find the Link**: Players compete to be the first to name a footballer who has played for BOTH selected teams
5. **Winner Takes the Round**: The first player to submit a valid footballer wins the round
6. **Replay or Leave**: Players can choose to play another round or end the game

### Key Features

- Real-time multiplayer gameplay using WebSocket connections
- Instant game state synchronization between players
- Comprehensive footballer database with search functionality
- Responsive design for desktop and mobile devices
- Clean and intuitive user interface

---

## 🏗️ Tech Stack

### Backend

- **Java 17** with **Spring Boot 3.x**
- **Spring WebSocket** with STOMP protocol
- **PostgreSQL** database (hosted on Supabase)
- **Lombok** for boilerplate reduction
- **Maven** for dependency management

### Frontend

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **TailwindCSS** for styling
- **TanStack Query** for server state management
- **STOMP.js** and **SockJS** for WebSocket client

### Deployment

- **AWS EC2** for hosting both services
- **NGINX** as reverse proxy
- **PM2** for Node.js process management

---

## 📁 Project Structure

```
tekk-match/
├── backend/                    # Spring Boot application
│   ├── src/
│   │   └── main/
│   │       ├── java/com/lubasi/tekk_match/
│   │       │   ├── config/           # WebSocket & CORS config
│   │       │   ├── footballer/       # Footballer entity & services
│   │       │   ├── game/             # Game logic & controllers
│   │       │   ├── payloads/         # WebSocket message payloads
│   │       │   └── team/             # Football team entity
│   │       └── resources/
│   │           └── application.properties
│   └── pom.xml
│
├── frontend/                   # Next.js application
│   ├── src/
│   │   ├── app/                # Next.js pages
│   │   ├── features/           # Feature-based modules
│   │   │   ├── home/
│   │   │   ├── lobby/
│   │   │   ├── game-room/
│   │   │   └── player-search/
│   │   ├── context/            # React context providers
│   │   ├── hooks/              # Custom React hooks
│   │   ├── services/           # API & WebSocket services
│   │   ├── types/              # TypeScript type definitions
│   │   └── constants/          # App constants
│   ├── public/                 # Static assets
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Java 17** or higher
- **Maven 3.8+**
- **Node.js 18+** and **npm 9+**
- **PostgreSQL** database (or use Supabase)

### Clone the Repository

```bash
git clone https://github.com/yourusername/tekk-match.git
cd tekk-match
```

---

### Backend Setup

1. **Navigate to the backend directory**

```bash
cd backend
```

2. **Configure the database**

Create an `application.properties` file in `src/main/resources/` or update the existing one:

```properties
# Database Configuration
spring.datasource.url=jdbc:postgresql://your-host:5432/your-database
spring.datasource.username=your-username
spring.datasource.password=your-password
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# Server Configuration
server.port=8080
```

3. **Build and run the application**

```bash
# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The backend server will start on `http://localhost:8080`

---

### Frontend Setup

1. **Navigate to the frontend directory**

```bash
cd frontend
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_WS_URL=http://localhost:8080/tekk
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Add team logo images**

Place your team logo images in `public/teams/`:

- `liverpool.png`
- `arsenal.png`
- `chelsea.png`
- `man-united.png`
- `man-city.png`
- `tottenham.png`

5. **Run the development server**

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

---

## 🎮 How to Play

### Starting a Game (Player 1)

1. Visit `http://localhost:3000`
2. Enter your gamertag in the input field
3. Click **"Create Game"**
4. You'll be redirected to the lobby
5. Copy the game link and share it with your friend

### Joining a Game (Player 2)

1. Click the link shared by Player 1
2. Enter your gamertag if prompted
3. You'll automatically join the game

### Gameplay

1. **Team Selection**: Select one of the six football clubs displayed
2. **Wait for Opponent**: Your selection is hidden until both players have chosen
3. **Find the Player**: Once teams are revealed, search for a footballer who played for both
4. **Submit**: Click on a player to submit your answer
5. **Results**: The first player with a valid answer wins the round
6. **Replay**: Both players must click "Play Again" to start a new round

---

## 🌐 API Endpoints

### REST Endpoints

| Method | Endpoint                  | Description            |
| ------ | ------------------------- | ---------------------- |
| POST   | `/api/game/create`        | Create a new game      |
| POST   | `/api/game/join/{gameId}` | Join an existing game  |
| POST   | `/api/game/join-random`   | Join matchmaking queue |
| GET    | `/api/players/search`     | Search for footballers |

### WebSocket Endpoints

| Destination               | Description                 |
| ------------------------- | --------------------------- |
| `/app/game/select-team`   | Submit team selection       |
| `/app/game/select-player` | Submit footballer selection |
| `/app/game/replay`        | Request a replay            |
| `/app/game/leave`         | Leave the game              |
| `/gameroom/{gameId}`      | Subscribe to game updates   |

---

## 🚢 Deployment

### Production Environment Variables

**Frontend (.env.production)**

```env
NEXT_PUBLIC_API_BASE_URL=https://your-domain.com
NEXT_PUBLIC_WS_URL=https://your-domain.com/tekk
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Building for Production

**Backend**

```bash
cd backend
mvn clean package -DskipTests
java -jar target/tekk-match-0.0.1-SNAPSHOT.jar
```

**Frontend**

```bash
cd frontend
npm run build
npm start
```

### NGINX Configuration (Example)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # WebSocket
    location /tekk {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_read_timeout 86400;
    }
}
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👨‍💻 Author

**Lubasi Milupi**

- GitHub: [@Lubasi-Jr](https://github.com/Lubasi-Jr)
- LinkedIn: [Lubasi Milupi Jr](https://www.linkedin.com/in/lubasi-milupi-jr-b13021302/)

---

## 🙏 Acknowledgments

- Inspired by GOAL's Front Three "2 Clubs 1 Player" challenge
- Football data sourced from various public APIs
- Icons and assets from respective sources
