# PowerShell script to fix all error.message and error.status references
# This script will systematically replace all unsafe error property access patterns

$apiRoot = "c:\Users\carle\Documents\TECHKLEIN\GitHub\kobklein\backend\api\src"

# Function to fix error references in a file
function Fix-ErrorReferences {
    param (
        [string]$FilePath
    )

    Write-Host "Processing: $FilePath" -ForegroundColor Cyan

    $content = Get-Content -Path $FilePath -Raw
    $modified = $false

    # Pattern 1: error.message in logger calls
    if ($content -match 'error\.message') {
        $content = $content -replace '(\}\s*catch\s*\(\s*error\s*\)\s*\{)(\s*)(.*?error\.message)', {
            param($match)
            $catchBlock = $match.Groups[1].Value
            $indent = $match.Groups[2].Value
            $rest = $match.Groups[3].Value

            # Add extractError call
            "$catchBlock$indent  const err = extractError(error);$indent" + ($rest -replace 'error\.message', 'err.message')
        }
        $modified = $true
    }

    # Pattern 2: error.status
    if ($content -match 'error\.status') {
        $content = $content -replace 'error\.status', 'err.status'
        $modified = $true
    }

    # Pattern 3: Ensure extractError import exists if modifications were made
    if ($modified -and $content -notmatch "import.*extractError.*from.*utils/error\.utils") {
        # Find the last import statement
        $lastImportMatch = [regex]::Matches($content, "import\s+.*?from\s+['\"].*?['\"];?\s*\n") | Select-Object -Last 1

        if ($lastImportMatch) {
            $insertPosition = $lastImportMatch.Index + $lastImportMatch.Length
            $relPath = Get-RelativePath -From $FilePath -To "$apiRoot\utils\error.utils.ts"
            $importStatement = "import { extractError } from '$relPath';`n"
            $content = $content.Insert($insertPosition, $importStatement)
        }
    }

    if ($modified) {
        Set-Content -Path $FilePath -Value $content -NoNewline
        Write-Host "  ✓ Fixed" -ForegroundColor Green
        return $true
    }
    else {
        Write-Host "  - No changes needed" -ForegroundColor Gray
        return $false
    }
}

# Function to calculate relative path
function Get-RelativePath {
    param (
        [string]$From,
        [string]$To
    )

    $fromDir = Split-Path -Parent $From
    $toFile = $To -replace '\.ts$', ''

    # Calculate relative path
    $fromParts = $fromDir -split '\\'
    $toParts = (Split-Path -Parent $toFile) -split '\\'

    # Find common base
    $commonCount = 0
    for ($i = 0; $i -lt [Math]::Min($fromParts.Length, $toParts.Length); $i++) {
        if ($fromParts[$i] -eq $toParts[$i]) {
            $commonCount++
        } else {
            break
        }
    }

    # Build relative path
    $upLevels = $fromParts.Length - $commonCount
    $downPath = $toParts[$commonCount..($toParts.Length - 1)] -join '/'
    $fileName = Split-Path -Leaf $toFile

    if ($upLevels -eq 0) {
        return "./$downPath/$fileName"
    } else {
        $upPath = "../" * $upLevels
        return "$upPath$downPath/$fileName"
    }
}

# Get all TypeScript files
$tsFiles = Get-ChildItem -Path $apiRoot -Filter "*.ts" -Recurse | Where-Object {
    $_.FullName -notmatch 'node_modules' -and
    $_.FullName -notmatch 'dist' -and
    $_.FullName -notmatch 'error\.utils\.ts'
}

Write-Host "`nFound $($tsFiles.Count) TypeScript files to process" -ForegroundColor Yellow
Write-Host "="*60

$fixedCount = 0

foreach ($file in $tsFiles) {
    if (Fix-ErrorReferences -FilePath $file.FullName) {
        $fixedCount++
    }
}

Write-Host "`n"
Write-Host "="*60
Write-Host "Summary: Fixed $fixedCount files" -ForegroundColor Green
Write-Host "="*60
