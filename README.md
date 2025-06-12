# Foodie Notebook

A web application for managing and sharing your favorite dishes and recipes.

## Features

- User authentication (sign up, sign in, sign out)
- Create, read, update, and delete dishes
- Image upload for dishes
- Responsive design
- Search functionality

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Supabase Client

### Backend
- FastAPI
- Python
- Supabase

## Project Structure

```
foodie-notebook/
├── frontend/           # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
└── backend/           # FastAPI backend
    ├── app/
    ├── requirements.txt
    └── render.yaml
```

## Setup

### Prerequisites
- Node.js
- Python 3.9+
- Supabase account

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create .env file with your Supabase credentials
4. Start development server:
   ```bash
   npm run dev
   ```

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd backend
   ```
2. Create virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create .env file with your Supabase credentials
5. Start development server:
   ```bash
   uvicorn app.main:app --reload
   ```

## Environment Variables

### Frontend (.env)
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:8000
```

### Backend (.env)
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_role_key
```

## Deployment

The application is deployed on:
- Frontend: Vercel
- Backend: Render
- Database: Supabase

## License

MIT
