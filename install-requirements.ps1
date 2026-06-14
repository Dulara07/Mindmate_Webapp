param(
    [string]$RequirementsFile = ".\requirements.txt",
    [switch]$DryRun
)

if (-not (Test-Path $RequirementsFile)) {
    Write-Error "Requirements file not found: $RequirementsFile"
    exit 1
}

$requirementsPath = Resolve-Path $RequirementsFile
$projectRoot = Split-Path -Parent $requirementsPath

Push-Location $projectRoot
try {
    $lines = Get-Content $requirementsPath
    $inInstallSection = $false
    $commands = @()

    foreach ($rawLine in $lines) {
        $line = $rawLine.Trim()

        if ($line -eq "" -or $line.StartsWith("#")) {
            continue
        }

        if ($line.StartsWith("[") -and $line.EndsWith("]")) {
            $inInstallSection = ($line -eq "[install.commands]")
            continue
        }

        if ($inInstallSection) {
            $commands += $line
        }
    }

    if ($commands.Count -eq 0) {
        Write-Error "No commands found in [install.commands] section."
        exit 1
    }

    Write-Host "Running install commands from $requirementsPath"
    foreach ($command in $commands) {
        Write-Host "> $command"
        if ($DryRun) {
            continue
        }

        Invoke-Expression $command
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Command failed: $command"
            exit $LASTEXITCODE
        }
    }

    if ($DryRun) {
        Write-Host "Dry run complete. No commands were executed."
    } else {
        Write-Host "All install commands completed successfully."
    }
}
finally {
    Pop-Location
}