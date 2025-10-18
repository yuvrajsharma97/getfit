# GetFit - Fitness Tracker SaaS Application

A comprehensive fitness tracking SaaS application built with modern web technologies.

## Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and development server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Component library for Tailwind CSS
- **React Icons** - Icon library

### Backend & Services
- **Firebase** - Backend as a Service (BaaS)
  - Authentication - User authentication and authorization
  - Firestore - NoSQL database for storing user data, workouts, and progress
  - Storage - File storage for user profile images and media
- **ExerciseDB API** - Exercise database via RapidAPI
- **Axios** - HTTP client for API requests

## Features (Planned)

- User authentication (sign up, login, password reset)
- Personalized dashboard
- Exercise library with detailed information
- Workout tracking and logging
- Progress visualization
- Custom workout creation
- Exercise filtering by body part, equipment, and target muscle

## Project Structure

```
src/
├── assets/           # Static assets (images, fonts, etc.)
├── components/       # Reusable React components
│   ├── auth/        # Authentication components
│   ├── common/      # Common/shared components
│   ├── dashboard/   # Dashboard-specific components
│   ├── workout/     # Workout-related components
│   └── exercises/   # Exercise-related components
├── pages/           # Page components for routing
├── services/        # External service integrations
│   ├── firebase.js  # Firebase configuration
│   └── api.js       # API service (ExerciseDB)
├── context/         # React Context providers
├── utils/           # Utility functions
├── styles/          # Additional styles
├── App.jsx          # Main application component
└── main.jsx         # Application entry point
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn
- Firebase account
- RapidAPI account (for ExerciseDB)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd getfit
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your Firebase configuration values
   - Add your ExerciseDB API key from RapidAPI

```bash
cp .env.example .env
```

4. Configure Firebase:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or use an existing one
   - Enable Authentication, Firestore, and Storage
   - Copy your Firebase config to `.env`

5. Get ExerciseDB API Key:
   - Sign up at [RapidAPI](https://rapidapi.com/)
   - Subscribe to [ExerciseDB API](https://rapidapi.com/justin-WFnsXH_t6/api/exercisedb)
   - Copy your API key to `.env`

### Development

Run the development server:
```bash
npm run dev
```

The application will open at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

See `.env.example` for required environment variables.

## License

This project is private and proprietary.

## Contributors

Your Name

---

Built with React + Vite
