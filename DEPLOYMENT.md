# Deployment Guide

## Prerequisites

Before deploying, ensure you have:
- API keys for Deepgram, Groq, OpenAI (optional), Google AI (optional)
- Supabase project set up
- Vercel account (for frontend)
- Railway/Render account (for backend)

## Database Setup (Supabase)

1. **Create a Supabase Project**
   - Go to https://supabase.com
   - Create a new project
   - Note down the project URL and anon key

2. **Run Database Migrations**
   - In Supabase Dashboard, go to SQL Editor
   - Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
   - Execute the SQL

3. **Configure Environment Variables**
   - Add to your `.env` file:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

## Frontend Deployment (Vercel)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy from Frontend Directory**
   ```bash
   cd frontend
   vercel
   ```

3. **Configure Environment Variables in Vercel**
   - Go to your project settings
   - Add environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `NEXT_PUBLIC_WS_URL` (your backend WebSocket URL)

4. **Deploy**
   ```bash
   vercel --prod
   ```

## Backend Deployment (Railway)

### Option 1: Railway

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and Initialize**
   ```bash
   railway login
   cd backend
   railway init
   ```

3. **Add Environment Variables**
   ```bash
   railway variables set DEEPGRAM_API_KEY=your-key
   railway variables set GROQ_API_KEY=your-key
   railway variables set OPENAI_API_KEY=your-key
   railway variables set GOOGLE_AI_API_KEY=your-key
   railway variables set SUPABASE_SERVICE_ROLE_KEY=your-key
   railway variables set NODE_ENV=production
   railway variables set PORT=3001
   ```

4. **Deploy**
   ```bash
   railway up
   ```

5. **Get Deployment URL**
   ```bash
   railway status
   ```
   - Note the URL and update `NEXT_PUBLIC_WS_URL` in Vercel

### Option 2: Render

1. **Create New Web Service**
   - Go to https://render.com
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `backend` directory

2. **Configure Build Settings**
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment**: Node

3. **Add Environment Variables**
   - Add all required environment variables in Render dashboard

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete

## Docker Deployment

### Build and Run with Docker Compose

1. **Update `.env` file**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

2. **Build and Start**
   ```bash
   docker-compose up --build
   ```

3. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001

### Production Docker Setup

1. **Create Dockerfiles**

   **Frontend Dockerfile** (`frontend/Dockerfile`):
   ```dockerfile
   FROM node:18-alpine AS base
   
   FROM base AS deps
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   
   FROM base AS builder
   WORKDIR /app
   COPY --from=deps /app/node_modules ./node_modules
   COPY . .
   RUN npm run build
   
   FROM base AS runner
   WORKDIR /app
   ENV NODE_ENV production
   
   COPY --from=builder /app/.next/standalone ./
   COPY --from=builder /app/.next/static ./.next/static
   COPY --from=builder /app/public ./public
   
   EXPOSE 3000
   CMD ["node", "server.js"]
   ```

   **Backend Dockerfile** (`backend/Dockerfile`):
   ```dockerfile
   FROM node:18-alpine
   
   WORKDIR /app
   
   COPY package*.json ./
   RUN npm ci --only=production
   
   COPY . .
   RUN npm run build
   
   EXPOSE 3001
   CMD ["npm", "start"]
   ```

2. **Build Images**
   ```bash
   # Frontend
   cd frontend
   docker build -t vartalaap-frontend .
   
   # Backend
   cd ../backend
   docker build -t vartalaap-backend .
   ```

3. **Run Containers**
   ```bash
   docker run -d -p 3000:3000 --env-file .env vartalaap-frontend
   docker run -d -p 3001:3001 --env-file .env vartalaap-backend
   ```

## Environment Variables Checklist

### Required
- ✅ `DEEPGRAM_API_KEY` - For STT/TTS
- ✅ `GROQ_API_KEY` - For LLM error detection
- ✅ `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase public key
- ✅ `NEXT_PUBLIC_WS_URL` - Backend WebSocket URL

### Optional
- `OPENAI_API_KEY` - GPT fallback
- `GOOGLE_AI_API_KEY` - Gemini fallback
- `SUPABASE_SERVICE_ROLE_KEY` - For admin operations
- `UPSTASH_REDIS_REST_URL` - For caching (future)
- `UPSTASH_REDIS_REST_TOKEN` - For caching (future)
- `RAZORPAY_KEY_ID` - For payments (future)
- `RAZORPAY_KEY_SECRET` - For payments (future)

## Post-Deployment Steps

1. **Test WebSocket Connection**
   ```bash
   # Test with wscat
   npm install -g wscat
   wscat -c wss://your-backend-url
   ```

2. **Test Voice Recording**
   - Open frontend URL
   - Go to /practice
   - Click "Start Practice"
   - Allow microphone permissions
   - Speak and verify corrections appear

3. **Monitor Logs**
   - Railway: `railway logs`
   - Render: Check logs in dashboard
   - Vercel: Check function logs in dashboard

4. **Setup Monitoring**
   - Enable error tracking (Sentry, LogRocket)
   - Setup uptime monitoring (UptimeRobot)
   - Monitor API usage (Deepgram, Groq dashboards)

## Scaling Considerations

### Frontend
- Vercel automatically scales
- Enable Edge caching
- Use CDN for static assets

### Backend
- Use horizontal scaling on Railway/Render
- Consider Redis for session management
- Implement rate limiting
- Use connection pooling for Supabase

### Database
- Enable Supabase connection pooling
- Add database indexes (already in migration)
- Monitor query performance
- Setup regular backups

## Troubleshooting

### WebSocket Connection Issues
- Check CORS settings
- Verify WS_URL is using `wss://` for HTTPS
- Check firewall rules

### Audio Issues
- Ensure HTTPS for microphone access
- Verify Deepgram API key
- Check audio format compatibility

### Performance Issues
- Monitor LLM API latency
- Enable caching for common corrections
- Optimize rule-based detection
- Use worker threads for heavy processing

## Security Best Practices

1. **API Keys**
   - Never commit API keys to git
   - Use environment variables
   - Rotate keys periodically

2. **Authentication**
   - Enable Supabase RLS (Row Level Security)
   - Implement rate limiting
   - Use HTTPS only

3. **Data Privacy**
   - Don't log sensitive user data
   - Implement data retention policies
   - Comply with GDPR/privacy laws

## Cost Optimization

1. **Free Tier Usage**
   - Vercel: 100GB bandwidth/month
   - Railway: $5 credit/month
   - Supabase: 500MB database, 2GB bandwidth

2. **Paid Tier Recommendations**
   - Start with basic plans
   - Monitor usage closely
   - Scale as needed

3. **API Cost Management**
   - Cache common corrections
   - Optimize LLM calls
   - Use rule-based detection first
   - Monitor Deepgram usage
