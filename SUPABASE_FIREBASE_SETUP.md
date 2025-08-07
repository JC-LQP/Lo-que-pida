# Supabase + Firebase Integration Setup

This project uses **Supabase** for database operations and **Firebase** for authentication.

## Configuration Files Created

### Backend Configuration
- `backend/.env` - Environment variables with your actual credentials
- `backend/firebase-service-account.json` - Firebase service account for admin operations
- `backend/src/supabase/` - Supabase service module

### Frontend Configuration
- `frontend/.env.local` - Frontend environment variables
- `frontend/lib/supabase.ts` - Supabase client configuration
- `frontend/lib/firebase.ts` - Firebase client configuration

## Environment Variables

### Backend (.env)
✅ **Already configured with your credentials:**
- Supabase URL, keys, and database connection
- Firebase service account credentials
- Application settings

### Frontend (.env.local)
✅ **All configured with your Firebase web app keys!**
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCsgeWc6Bpxd6gmm-hpVWmbYWAwlNaQS-8
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=334662358612
NEXT_PUBLIC_FIREBASE_APP_ID=1:334662358612:web:ba79a665c3d8515fc73fc1
```

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│    Frontend     │    │     Backend     │    │    Supabase     │
│   (Next.js)     │    │   (NestJS)      │    │   (Database)    │
│                 │    │                 │    │                 │
│ Firebase Auth   │◄──►│ Firebase Admin  │    │  PostgreSQL     │
│ Supabase Client │    │ Supabase Client │◄──►│  + Auth (RLS)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## How It Works

1. **Authentication Flow:**
   - Users authenticate with Firebase Auth (frontend)
   - Firebase tokens are validated by Firebase Admin (backend)
   - User data is stored in Supabase PostgreSQL database

2. **Database Operations:**
   - Backend uses TypeORM with Supabase PostgreSQL
   - Frontend can also directly query Supabase for real-time features
   - Row Level Security (RLS) can be configured in Supabase

3. **Security:**
   - Firebase handles user authentication and token validation
   - Supabase manages database access with RLS policies
   - Backend validates Firebase tokens before database operations

## Next Steps

1. **Get Firebase Web Config:**
   - Go to Firebase Console → Project Settings → Web App
   - Copy the config values to `frontend/.env.local`

2. **Test the Integration:**
   ```bash
   # Install dependencies
   cd backend && pnpm install
   cd ../frontend && pnpm install
   
   # Start backend
   cd backend && pnpm start:dev
   
   # Start frontend
   cd frontend && pnpm dev
   ```

3. **Database Schema:**
   - Your existing entities will work with Supabase PostgreSQL
   - Consider enabling RLS policies in Supabase dashboard
   - You can migrate existing data using the DATABASE_URL

4. **Optional Supabase Features:**
   - Real-time subscriptions
   - File storage
   - Edge functions
   - Built-in auth (as alternative to Firebase)

## Troubleshooting

- **Database Connection:** Ensure Supabase allows connections from your IP
- **Firebase Admin:** Check service account permissions in Firebase Console
- **CORS Issues:** Configure allowed origins in both Firebase and Supabase
- **SSL:** Supabase requires SSL in production (already configured)

## Security Notes

🔒 **Important Security Reminders:**
- Never commit `.env` files to git
- Rotate keys periodically
- Use environment-specific configurations
- Enable RLS policies in Supabase for production
- Configure Firebase security rules appropriately
