$files = @(
    "src\advanced-payments\nfc-payments\nfc-payments.controller.ts",
    "src\advanced-payments\payment-requests\payment-requests.controller.ts",
    "src\advanced-payments\payment-requests\payment-requests.service.ts",
    "src\advanced-payments\payment-security\payment-security.controller.ts",
    "src\advanced-payments\qr-payments\qr-payments.controller.ts",
    "src\advanced-payments\qr-payments\qr-payments.service.ts",
    "src\payments\payments.controller.ts",
    "src\auth\auth.test.ts",
    "src\auth\strategies\jwt.strategy.ts"
)

foreach ($file in $files) {
    $fullPath = Join-Path $PSScriptRoot $file

    if (!(Test-Path $fullPath)) {
        Write-Host "⚠️  File not found: $file" -ForegroundColor Yellow
        continue
    }

    $content = Get-Content $fullPath -Raw

    # Skip if already has import
    if ($content -match "import.*extractError.*from.*utils/error.utils") {
        Write-Host "⏭️  Already has import: $file" -ForegroundColor Gray
        continue
    }

    # Calculate import path based on depth
    $depth = ($file.Split('\') | Where-Object { $_ -ne 'src' }).Count - 1
    $importPath = ('../' * $depth) + 'utils/error.utils'

    # Find the last import line
    $lastImportMatch = [regex]::Matches($content, "import\s+.*from\s+['`"].*['`"];?\r?\n") | Select-Object -Last 1

    if ($lastImportMatch) {
        $insertPos = $lastImportMatch.Index + $lastImportMatch.Length
        $importStatement = "import { extractError } from '$importPath';`n"
        $content = $content.Substring(0, $insertPos) + $importStatement + $content.Substring($insertPos)

        Set-Content -Path $fullPath -Value $content -NoNewline
        Write-Host "✅ Added import to: $file" -ForegroundColor Green
    }
    else {
        Write-Host "❌ Could not find import section in: $file" -ForegroundColor Red
    }
}

Write-Host "`n🎉 Done!" -ForegroundColor Cyan
