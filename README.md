# Geo Market Match - AI-Powered Business Location Intelligence

A professional full-stack web application that uses **Google's Gemini AI** to provide hyper-local business intelligence and location recommendations based on natural language queries.

**Key Features:**
- 🌍 **Universal Location Support**: Analyze ANY city, neighborhood, or specific location worldwide
- 🤖 **Natural Language Queries**: Ask in plain English about any business opportunity
- 📍 **Interactive Map**: Click anywhere to get instant AI-powered hyper-local insights
- 📊 **Smart Rankings**: Cities and neighborhoods ranked by business viability
- 🎯 **Neighborhood-Level Analysis**: Get street-by-street, area-specific recommendations
- 💰 **Financial Estimates**: Revenue projections and startup costs for each location
- 🎨 **Professional UI**: Clean, modern design with animated markers and auto-zoom

## Demo

Ask questions like:
- "Best areas for cafe in Islamabad"
- "Where to open a bakery in Lahore"
- "Tech startup opportunities in Dubai"
- "Restaurant locations in New York"

The AI provides detailed insights including:
- Specific neighborhoods and districts
- Foot traffic patterns
- Competition analysis
- Target customer demographics
- Revenue estimates
- Startup costs

## Project Structure

```
├── backend/              # Python FastAPI server
│   ├── main.py          # API endpoints
│   ├── ai_client.py     # Google Gemini AI integration
│   ├── schemas.py       # Data models
│   ├── requirements.txt # Python dependencies
│   └── .env.example     # Environment variables template
├── frontend/            # React + Vite application
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── App.jsx      # Main application
│   │   └── api.js       # API client
│   ├── package.json
│   └── vite.config.js
└── README.md

```

## Prerequisites

- **Node.js** 16+ (for frontend)
- **Python** 3.8+ (for backend)
- **Google Gemini API Key** (free tier available)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/geo-market-match.git
cd geo-market-match
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env and add your Google Gemini API key
# Get free API key from: https://makersuite.google.com/app/apikey
```

**backend/.env:**
```
GOOGLE_API_KEY=your_actual_api_key_here
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Run the Application

**Terminal 1 (Backend):**
```bash
cd backend
python main.py
# Server runs on http://localhost:8000
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
# App runs on http://localhost:5173
```

Open http://localhost:5173 in your browser!

## Getting Your Google Gemini API Key

1. Visit https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and paste it in `backend/.env`
5. **FREE TIER**: 60 requests per minute, perfect for development and small projects

## Deployment (Free Options)

### Option 1: Vercel (Frontend) + Render (Backend)

**Frontend (Vercel):**
1. Push code to GitHub
2. Visit https://vercel.com
3. Import your GitHub repository
4. Set build settings:
   - Framework: Vite
   - Root directory: `frontend`
   - Build command: `npm run build`
   - Output directory: `dist`
5. Deploy!

**Backend (Render):**
1. Visit https://render.com
2. Create new "Web Service"
3. Connect your GitHub repository
4. Settings:
   - Root directory: `backend`
   - Build command: `pip install -r requirements.txt`
   - Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variable:
   - Key: `GOOGLE_API_KEY`
   - Value: Your API key
6. Deploy!

### Option 2: Railway (Full Stack)

1. Visit https://railway.app
2. Create new project from GitHub
3. Add two services:
   - **Backend**: Python service with env var `GOOGLE_API_KEY`
   - **Frontend**: Node.js service
4. Deploy both services
5. Update frontend API URL to point to backend service

### Environment Variables for Production

**IMPORTANT**: Never commit your `.env` file!

For hosting platforms:
1. Set `GOOGLE_API_KEY` in the platform's environment variables settings
2. For frontend, update API URL in `src/api.js` to your backend URL
3. Use platform-specific environment variable management (not `.env` files)

## Security Best Practices

✅ **DO:**
- Store API keys in environment variables
- Use `.gitignore` to exclude `.env` files
- Set environment variables in hosting platform settings
- Use `.env.example` to document required variables
- Rotate API keys if they're accidentally exposed

❌ **DON'T:**
- Commit `.env` files to GitHub
- Hardcode API keys in source code
- Share API keys in public repositories
- Use production keys for development

## Technologies Used

**Backend:**
- FastAPI (Python web framework)
- Google Gemini AI (gemini-2.5-flash model)
- Uvicorn (ASGI server)
- Pydantic (data validation)

**Frontend:**
- React 18
- Vite (build tool)
- Leaflet (interactive maps)
- TailwindCSS (styling)
- Axios (HTTP client)

## API Endpoints

### POST /api/recommendations
Get city and neighborhood recommendations based on natural language query.

**Request:**
```json
{
  "query": "Best areas for cafe in Islamabad"
}
```

**Response:**
```json
{
  "recommendations": [
    {
      "city": "Islamabad",
      "country": "Pakistan",
      "latitude": 33.6844,
      "longitude": 73.0479,
      "score": 0.92,
      "reason": "Market analysis...",
      "areas": [
        {
          "area_name": "F-7 Markaz",
          "latitude": 33.7177,
          "longitude": 73.0566,
          "score": 0.95,
          "characteristics": "High-income area, office workers..."
        }
      ]
    }
  ]
}
```

### POST /api/location-insight
Get hyper-local insights for a specific map coordinate.

**Request:**
```json
{
  "latitude": 33.7177,
  "longitude": 73.0566,
  "business_type": "cafe"
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions:
- Open an issue on GitHub
- Check Google Gemini API documentation: https://ai.google.dev/docs

## Acknowledgments

- Google Gemini AI for powerful natural language processing
- OpenStreetMap for map data
- Leaflet for map visualization library

---

**Made with ❤️ for entrepreneurs and business analysts worldwide**

## Setup & Running

### 1. Backend Setup

Open a terminal and navigate to the `backend` folder:

```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate
pip install -r requirements.txt
python main.py
```

The server will start at `http://localhost:8000`.

### 2. Frontend Setup

Open a new terminal and navigate to the `frontend` folder:

```bash
cd frontend
npm install
npm run dev
```

The application will start at `http://localhost:5173` (or similar).

## How to Use

### Option 1: Natural Language Query
Type any business idea in natural language:
- "Best cities in Africa for tech startups"
- "Where should I open a bakery in South America?"
- "Small beach towns in Australia for surf shops"
- "Growing cities in Southeast Asia for restaurants"

The AI will analyze your query and recommend the best cities worldwide with specific neighborhoods.

### Option 2: Interactive Map
Click anywhere on the map to get instant AI insights about that exact location for your business type.

## Features

- **Universal AI Analysis**: Works with ANY location and business type mentioned
- **Natural Language Processing**: Understands complex queries in plain English
- **Real Coordinates**: Click-to-analyze any location on the map
- **Interactive Map**: Visualize recommendations with color-coded markers
- **Ranking Panel**: Compare cities with detailed scoring and explanations
- **Neighborhood Insights**: Get specific areas within each recommended city

## API Key

The backend uses a Google Gemini API key. This is pre-configured in `backend/.env`.
If the key quota is exceeded or invalid, the system will seamlessly fall back to demo data.
