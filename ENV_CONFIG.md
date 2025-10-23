# Environment Configuration Guide

This project uses environment variables to control all API endpoints, authentication, and external service configurations. This makes it easy to deploy to different environments (development, staging, production) without code changes.

## Quick Setup

1. **Copy the environment template:**
   ```bash
   cp .env.example .env.local
   ```

2. **Edit `.env.local`** with your actual values:
   ```bash
   # Required: Your backend API URLs
   NEXT_PUBLIC_API_URL=http://localhost:3001
   BACKEND_API_URL=http://localhost:3002
   
   # Required: Authentication token for development
   DEV_AUTH_TOKEN=your_actual_jwt_token_here
   
   # Optional: AI/Gemini configuration (for AI features)
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

## Environment Variables Reference

### Required Variables

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `NEXT_PUBLIC_API_URL` | Main API base URL | `http://localhost:3001` | `https://api.yourapp.com` |
| `BACKEND_API_URL` | Backend URL for Next.js proxy | `http://localhost:3002` | `https://backend.yourapp.com` |
| `DEV_AUTH_TOKEN` | JWT token for development | - | `eyJhbGciOiJIUzI1NiIs...` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_TIMEOUT` | API request timeout (ms) | `10000` |
| `GEMINI_API_KEY` | Google Gemini AI API key | - |
| `NEXT_PUBLIC_GEMINI_API_URL` | Gemini API endpoint | Google's default |
| `NEXT_PUBLIC_DEBUG_MODE` | Enable debug logging | `false` |
| `NEXT_PUBLIC_ENABLE_API_LOGGING` | Log API requests | `false` |

### API Endpoint Overrides

You can override individual API endpoints if needed:

```bash
# Auth endpoints
NEXT_PUBLIC_AUTH_LOGIN_ENDPOINT=/auth/login
NEXT_PUBLIC_AUTH_REGISTER_ENDPOINT=/auth/register
NEXT_PUBLIC_AUTH_LOGOUT_ENDPOINT=/auth/logout
NEXT_PUBLIC_AUTH_PROFILE_ENDPOINT=/auth/profile

# Category endpoints
NEXT_PUBLIC_CATEGORIES_ENDPOINT=/categories
NEXT_PUBLIC_CATEGORIES_BY_ID_ENDPOINT=/categories
NEXT_PUBLIC_CATEGORIES_COMPANIES_ENDPOINT=/categories

# Company endpoints
NEXT_PUBLIC_COMPANIES_ENDPOINT=/companies
NEXT_PUBLIC_COMPANIES_BY_ID_ENDPOINT=/companies
NEXT_PUBLIC_COMPANIES_BY_CATEGORY_ENDPOINT=/companies

# Booking endpoints
NEXT_PUBLIC_BOOKINGS_ENDPOINT=/booking
NEXT_PUBLIC_BOOKINGS_CREATE_ENDPOINT=/booking
NEXT_PUBLIC_BOOKINGS_USER_ENDPOINT=/booking/me

# User endpoints
NEXT_PUBLIC_USERS_PROFILE_ENDPOINT=/users/profile
```

## Environment Validation

The app automatically validates environment variables on startup:

- **Required variables** must be set or the app won't start
- **Missing recommended variables** show warnings in the console
- **Invalid values** (like non-HTTP URLs) trigger warnings

### Development Status Indicator

In development mode, you'll see a colored dot in the bottom-right corner:

- 🟢 **Green**: All environment variables valid
- 🔴 **Red**: Missing required variables
- 🟡 **Yellow**: Missing recommended variables

Click the dot to see detailed environment status.

## Different Environments

### Development
```bash
# .env.local
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3001
BACKEND_API_URL=http://localhost:3002
NEXT_PUBLIC_DEBUG_MODE=true
```

### Staging
```bash
# .env.staging or deployment config
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://staging-api.yourapp.com
BACKEND_API_URL=https://staging-backend.yourapp.com
NEXT_PUBLIC_DEBUG_MODE=false
```

### Production
```bash
# .env.production or deployment config
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.yourapp.com
BACKEND_API_URL=https://backend.yourapp.com
NEXT_PUBLIC_DEBUG_MODE=false
GEMINI_API_KEY=prod_gemini_key_here
```

## API Features Controlled by Environment

### Authentication
- Token storage key: `NEXT_PUBLIC_AUTH_TOKEN_KEY`
- Development fallback token: `DEV_AUTH_TOKEN`
- All auth endpoints: `NEXT_PUBLIC_AUTH_*_ENDPOINT`

### Backend Proxy
- Next.js automatically proxies `/api/*` to `BACKEND_API_URL`
- Avoids CORS issues in development
- Configurable destination URL

### AI Integration
- Gemini API URL and key from environment
- Fallback to development mode if no key provided
- AI availability checking uses environment-controlled endpoints

### API Client
- Base URL, timeout, headers all configurable
- Debug logging controlled by environment
- Error handling and retry logic

## Troubleshooting

### Missing Environment Variables
```
❌ Environment Validation Failed
Missing required environment variables: NEXT_PUBLIC_API_URL, DEV_AUTH_TOKEN
```
**Solution**: Copy `.env.example` to `.env.local` and fill in the missing values.

### API Connection Issues
```
Network error. Please check your connection.
```
**Solution**: Verify `NEXT_PUBLIC_API_URL` and `BACKEND_API_URL` are correct and reachable.

### AI Features Not Working
```
⚠️ Recommended environment variable GEMINI_API_KEY is not set
```
**Solution**: Add your Gemini API key to `.env.local` or the AI will use development mode.

## Security Notes

- **Never commit `.env.local`** to version control
- Use different API keys for different environments
- Rotate development tokens regularly
- In production, use your deployment platform's environment variable system
- The `DEV_AUTH_TOKEN` is only for development and should not be used in production

## Deployment

### Vercel
Add environment variables in the Vercel dashboard or use `vercel env`:
```bash
vercel env add NEXT_PUBLIC_API_URL
vercel env add BACKEND_API_URL
vercel env add GEMINI_API_KEY
```

### Docker
Use environment files or `-e` flags:
```bash
docker run -e NEXT_PUBLIC_API_URL=https://api.example.com myapp
```

### Other Platforms
Check your platform's documentation for setting environment variables. Most support `.env` files or dashboard configuration.