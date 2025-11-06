# NoteSage - Smart Note Taking Application

NoteSage is an intelligent note-taking application that helps you organize your thoughts, ideas, and tasks in one place. With AI-powered features, it makes note-taking smarter and more efficient.

## ✨ Features

### 📝 Smart Notes
- Create and organize notes with rich text formatting
- Categorize notes with custom tags
- Search through your notes instantly

### 🤖 AI-Powered
- Smart suggestions for note titles and tags
- Automatic summarization of long notes
- Content enhancement with AI suggestions

### 🔒 Secure & Private
- User authentication and authorization
- Secure data encryption
- Cloud sync across devices

### 🎨 Clean Interface
- Modern, responsive design
- Dark/Light mode support
- Keyboard shortcuts for power users

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (for local development)
- OpenAI API key (for AI features)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Vijaykalyan23/NoteSage.git
   cd NoteSage
   ```

2. Set up the backend:
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Update .env with your configuration
   ```

3. Set up the frontend:
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```bash
   cd backend
   npm start
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📚 Tech Stack

- **Frontend**: React.js, Redux, TailwindCSS
- **Backend**: Node.js, Express.js, MongoDB
- **AI**: OpenAI API
- **Authentication**: JWT
