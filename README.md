# Questro - AI-Powered Learning Assistant

Questro is a comprehensive AI-powered educational platform that helps students learn more effectively by transforming traditional study materials into interactive content.

## 🚀 Features

- **PDF to MCQ Generation**: Upload textbook PDFs and automatically generate multiple-choice questions
- **Image Question Solver**: Take photos of question papers and get detailed solutions in any language
- **Multilingual AI Chat**: Ask questions and get answers in any language with conversation memory
- **Chat History**: All your conversations are saved and accessible
- **API Key Management**: Securely store and manage your Gemini API keys
- **Cross-Platform**: Works seamlessly on mobile and desktop devices
- **Premium Design**: Clean, modern interface with purple theme

## 🛠️ Setup Instructions

### 1. Connect to Supabase

This app requires Supabase for authentication and database functionality. You'll need to:

1. Create a new project in [Supabase](https://supabase.com)
2. Get your project URL and anon key from the API settings
3. Create a `.env.local` file in your project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 2. Set up Database Tables

Run the SQL commands from `src/lib/supabase-config.ts` in your Supabase SQL editor to create the required tables and policies.

### 3. Get Gemini API Key

Users will need a Gemini API key to use the AI features:

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key and paste it in the app's API Key Manager

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── chat/           # Chat interface
│   ├── history/        # Chat history
│   ├── layout/         # Layout components (sidebar, etc.)
│   ├── mcq/           # PDF to MCQ generation
│   ├── settings/       # User settings and API key management
│   ├── solver/         # Image question solver
│   └── ui/            # Reusable UI components
├── lib/               # Utility functions and configurations
├── pages/             # Main page components
└── hooks/             # Custom React hooks
```

## 🎨 Design System

The app uses a comprehensive design system with:
- Custom CSS variables for colors and themes
- Tailwind CSS for styling
- Responsive design for all screen sizes
- Purple-themed gradient system
- Premium animations and effects

## 🔒 Security

- Row Level Security (RLS) policies in Supabase
- Secure API key storage encrypted in the database
- Authentication required for all features
- User data isolation and privacy

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up Supabase and environment variables
4. Run the development server: `npm run dev`
5. Open the app and sign up for an account
6. Add your Gemini API key in the settings
7. Start using the AI-powered features!

## 📱 Mobile Support

Questro is fully responsive and works great on:
- iOS Safari
- Android Chrome
- Desktop browsers
- Tablet devices

## 🤖 AI Features

All AI functionality is powered by Google's Gemini API:
- Natural language processing for question generation
- Optical Character Recognition (OCR) for image processing
- Multilingual support for global users
- Context-aware responses with memory

---

Made with ❤️ for learners worldwide
