@echo off
echo Starting Lo-que-pida Development Environment...
echo.

echo 🚀 Starting Backend (NestJS + GraphQL)...
start "Backend" cmd /k "cd backend && pnpm start:dev"

timeout /t 5 /nobreak

echo 🎨 Starting Frontend (Next.js)...
start "Frontend" cmd /k "cd frontend && pnpm dev"

echo.
echo ✅ Both services are starting!
echo ✅ Backend will be available at: http://localhost:3000
echo ✅ Frontend will be available at: http://localhost:3001 (or the next available port)
echo ✅ GraphQL Playground: http://localhost:3000/graphql
echo.
echo Press any key to close this window...
pause
