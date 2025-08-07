Write-Host "Starting Lo-que-pida Development Environment..." -ForegroundColor Green
Write-Host ""

Write-Host "🚀 Starting Backend (NestJS + GraphQL)..." -ForegroundColor Yellow
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd backend; pnpm start:dev"

Start-Sleep -Seconds 5

Write-Host "🎨 Starting Frontend (Next.js)..." -ForegroundColor Yellow
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd frontend; pnpm dev"

Write-Host ""
Write-Host "✅ Both services are starting!" -ForegroundColor Green
Write-Host "✅ Backend will be available at: http://localhost:3000" -ForegroundColor Green
Write-Host "✅ Frontend will be available at: http://localhost:3001 (or the next available port)" -ForegroundColor Green
Write-Host "✅ GraphQL Playground: http://localhost:3000/graphql" -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
