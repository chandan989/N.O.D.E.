# Quick fix for Hedera gRPC port blocking
# Run as Administrator

Write-Host "Opening Windows Firewall for Hedera gRPC (port 50211)..." -ForegroundColor Yellow

# Allow outbound connection on port 50211
netsh advfirewall firewall add rule name="Hedera-gRPC-Outbound" dir=out action=allow protocol=TCP localport=50211 enable=yes

Write-Host "✅ Firewall rule added!" -ForegroundColor Green
Write-Host "Now try: npm run deploy:testnet" -ForegroundColor Cyan

