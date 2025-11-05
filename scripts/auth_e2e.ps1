param(
    [string]$BaseUrl = "http://localhost:3002/api/v1"
)

function Invoke-JsonPost($url, $body) {
    $json = $body | ConvertTo-Json -Depth 6
    return Invoke-RestMethod -Method Post -Uri $url -Body $json -ContentType 'application/json' -TimeoutSec 30
}

$ts = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
$email = "e2e-$ts@kobklein.test"
$password = "Password123!"

$registerBody = @{
    email = $email
    password = $password
    firstName = "E2E"
    lastName = "Test"
    phone = "+50937101234"
    country = "HT"
    preferredCurrency = "HTG"
}

Write-Host "Registering $email ..."
try {
  $reg = Invoke-JsonPost "$BaseUrl/auth/register" $registerBody
  $reg | ConvertTo-Json -Depth 10
} catch {
  Write-Host "Register failed:" -ForegroundColor Red
  $_ | Format-List -Force | Out-String | Write-Host
  exit 2
}

if (-not $reg.data -or -not $reg.data.token) {
  Write-Host "No token in register response." -ForegroundColor Yellow
} else {
  Write-Host "Register token length: $($reg.data.token.Length)"
}

$loginBody = @{
    email = $email
    password = $password
}

Write-Host "Logging in ..."
try {
  $login = Invoke-JsonPost "$BaseUrl/auth/login" $loginBody
  $login | ConvertTo-Json -Depth 10
} catch {
  Write-Host "Login failed:" -ForegroundColor Red
  $_ | Format-List -Force | Out-String | Write-Host
  exit 3
}

if (-not $login.data -or -not $login.data.token) {
  Write-Host "No token in login response." -ForegroundColor Yellow
} else {
  Write-Host "Login token length: $($login.data.token.Length)"
}

$token = $login.data.token
if ($token) {
  Write-Host "Fetching profile ..."
  try {
    $userProfile = Invoke-RestMethod -Method Get -Uri "$BaseUrl/auth/profile" -Headers @{ Authorization = "Bearer $token" } -TimeoutSec 30
    $userProfile | ConvertTo-Json -Depth 10
  } catch {
    Write-Host "Profile failed:" -ForegroundColor Yellow
    $_ | Format-List -Force | Out-String | Write-Host
  }
}

exit 0