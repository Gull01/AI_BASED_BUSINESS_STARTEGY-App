# GIS Business Strategy API

A FastAPI backend for location-based business intelligence using Google Gemini AI.

## Live on Glitch

This API provides business recommendations and location insights.

## Endpoints

- `GET /` - API status
- `POST /recommend` - Get business location recommendations
- `POST /map-insight` - Get insights for a specific location

## Setup

Add your Google API key in `.env`:
```
GOOGLE_API_KEY=your_key_here
```
