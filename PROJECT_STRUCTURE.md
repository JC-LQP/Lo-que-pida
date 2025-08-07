# Project Structure - Lo que pida

## 📁 Clean & Optimized Structure

```
Lo-que-pida/
├── 📄 .env.example                    ✅ Template (safe to commit)
├── 📄 .gitignore                      ✅ Protects secrets
├── 📄 package.json                    ✅ Root workspace
├── 📄 pnpm-lock.yaml
├── 📄 SUPABASE_FIREBASE_SETUP.md      ✅ Setup guide
├── 📄 PROJECT_STRUCTURE.md            ✅ This file
│
├── 📁 .github/workflows/
│   └── 📄 ci.yml                      ✅ CI/CD pipeline
│
├── 📁 backend/
│   ├── 📄 .env                        🔒 SECRETS (git ignored)
│   ├── 📄 .gitignore                  ✅ Local protection
│   ├── 📄 firebase-service-account.json 🔒 SECRETS (git ignored)
│   ├── 📄 package.json                ✅ Backend deps
│   ├── 📄 nest-cli.json
│   ├── 📄 tsconfig.json
│   │
│   └── 📁 src/
│       ├── 📁 supabase/               ✅ NEW: Database service
│       │   ├── supabase.module.ts
│       │   └── supabase.service.ts
│       ├── 📁 firebase/               ✅ Auth service
│       │   └── firebase.module.ts
│       └── 📁 [other modules]/
│
└── 📁 frontend/
    ├── 📄 .env.local                  🔒 SECRETS (git ignored)
    ├── 📄 .gitignore                  ✅ Local protection
    ├── 📄 package.json                ✅ Frontend deps
    ├── 📄 next.config.js
    ├── 📄 tailwind.config.js
    │
    └── 📁 lib/                        ✅ NEW: Client configs
        ├── supabase.ts                ✅ Supabase client
        └── firebase.ts                ✅ Firebase client
```

## 🔐 Environment Files (OPTIMIZED!)

### ✅ Only 3 Files Needed:
1. **`.env.example`** - Template for all environments
2. **`backend/.env`** - Backend secrets (git ignored)
3. **`frontend/.env.local`** - Frontend secrets (git ignored)

### 🚫 Removed Redundant Files:
- ❌ `frontend/.env.local.example` (redundant)
- ❌ `backend/firebase/` (old/unused)
- ❌ `backend/supabase/` (old/unused)

## 🛡️ Security Configuration

### .gitignore Protection:
- ✅ All `.env*` files ignored
- ✅ `firebase-service-account.json` ignored
- ✅ `node_modules/` ignored
- ✅ Build outputs ignored

### Environment Variables:
- 🔒 **Backend**: Supabase + Firebase Admin credentials
- 🔒 **Frontend**: Supabase + Firebase Web credentials
- 📄 **Template**: Safe examples for setup

## 🏗️ Architecture

```
Frontend (Next.js)     Backend (NestJS)        Database (Supabase)
     │                       │                        │
├── Firebase Auth ◄─────────► Firebase Admin ────────┤
├── Supabase Client         │                        │
├── Apollo Client ◄─────────► GraphQL API ◄─────────► PostgreSQL
└── Tailwind CSS            └── TypeORM              └── Row Level Security
```

## 🎯 Key Benefits:
- ✅ **Minimal env files** (3 instead of 4+)
- ✅ **All secrets protected** by .gitignore
- ✅ **Clean structure** with proper separation
- ✅ **Hybrid auth** (Firebase) + database (Supabase)
- ✅ **Type safety** with TypeScript throughout
