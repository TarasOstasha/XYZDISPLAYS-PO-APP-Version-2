# XYZ Displays Outlook Helper
# Listens on http://127.0.0.1:17890 so the browser app can open Outlook drafts locally.

$ErrorActionPreference = "Stop"
$Port = 17890
$Prefix = "http://127.0.0.1:$Port/"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$CreateEmailScript = Join-Path $ScriptDir "createEmail.ps1"

if (-not (Test-Path $CreateEmailScript)) {
    Write-Error "Missing createEmail.ps1 next to OutlookEmailHelper.ps1"
    exit 1
}

# Allow binding without admin for localhost
netsh http add urlacl url=$Prefix user=$env:USERNAME > $null 2>&1

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($Prefix)

try {
    $listener.Start()
} catch {
    Write-Host "Failed to start listener on $Prefix"
    Write-Host $_.Exception.Message
    Write-Host "Is another copy of the helper already running?"
    exit 1
}

Write-Host "============================================"
Write-Host " XYZ Outlook Helper is running"
Write-Host " Listening: $Prefix"
Write-Host " Keep this window open while using the PO app"
Write-Host " Press Ctrl+C to stop"
Write-Host "============================================"

function Write-JsonResponse {
    param (
        [System.Net.HttpListenerResponse]$Response,
        [int]$StatusCode,
        [hashtable]$Body
    )

    $json = ($Body | ConvertTo-Json -Compress)
    $buffer = [System.Text.Encoding]::UTF8.GetBytes($json)
    $Response.StatusCode = $StatusCode
    $Response.ContentType = "application/json; charset=utf-8"
    $Response.ContentLength64 = $buffer.Length
    $Response.OutputStream.Write($buffer, 0, $buffer.Length)
    $Response.OutputStream.Close()
}

function Set-CorsHeaders {
    param ([System.Net.HttpListenerResponse]$Response)
    $Response.Headers.Add("Access-Control-Allow-Origin", "*")
    $Response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    $Response.Headers.Add("Access-Control-Allow-Headers", "Content-Type")
    # Required for HTTPS web apps (e.g. Vercel) calling http://127.0.0.1 in Chromium
    $Response.Headers.Add("Access-Control-Allow-Private-Network", "true")
}

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        Set-CorsHeaders -Response $response

        $path = $request.Url.AbsolutePath.TrimEnd("/").ToLowerInvariant()
        if ([string]::IsNullOrWhiteSpace($path)) { $path = "/" }

        try {
            if ($request.HttpMethod -eq "OPTIONS") {
                $response.StatusCode = 204
                $response.Close()
                continue
            }

            if ($request.HttpMethod -eq "GET" -and $path -eq "/health") {
                Write-JsonResponse -Response $response -StatusCode 200 -Body @{
                    ok      = $true
                    service = "xyz-outlook-helper"
                    port    = $Port
                }
                continue
            }

            if ($request.HttpMethod -eq "POST" -and $path -eq "/create-email") {
                $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
                $rawBody = $reader.ReadToEnd()
                $reader.Close()

                if ([string]::IsNullOrWhiteSpace($rawBody)) {
                    Write-JsonResponse -Response $response -StatusCode 400 -Body @{ ok = $false; error = "Empty request body" }
                    continue
                }

                $data = $rawBody | ConvertFrom-Json
                $to = [string]$data.to
                $subject = [string]$data.subject
                $html = [string]$data.html

                if ([string]::IsNullOrWhiteSpace($to) -or [string]::IsNullOrWhiteSpace($subject) -or [string]::IsNullOrWhiteSpace($html)) {
                    Write-JsonResponse -Response $response -StatusCode 400 -Body @{
                        ok    = $false
                        error = "Required fields: to, subject, html"
                    }
                    continue
                }

                $tmpPayload = Join-Path $env:TEMP ("xyz-po-email-" + [guid]::NewGuid().ToString() + ".json")
                $payloadObject = [ordered]@{
                    to      = $to
                    subject = $subject
                    html    = $html
                }
                ($payloadObject | ConvertTo-Json -Depth 5 -Compress) | Set-Content -Path $tmpPayload -Encoding UTF8

                $argString = "-NoProfile -STA -ExecutionPolicy Bypass -File `"$CreateEmailScript`" -payloadFile `"$tmpPayload`""
                $proc = Start-Process -FilePath "powershell.exe" -ArgumentList $argString -Wait -PassThru -WindowStyle Hidden

                Start-Sleep -Milliseconds 500
                Remove-Item -Path $tmpPayload -ErrorAction SilentlyContinue

                if ($proc.ExitCode -ne 0) {
                    Write-JsonResponse -Response $response -StatusCode 500 -Body @{
                        ok    = $false
                        error = "Outlook script failed with exit code $($proc.ExitCode). Is Outlook installed and signed in as sales@xyzdisplays.com?"
                    }
                    continue
                }

                Write-Host "$(Get-Date -Format 'HH:mm:ss') Opened Outlook draft -> $to | $subject"
                Write-JsonResponse -Response $response -StatusCode 200 -Body @{
                    ok      = $true
                    message = "Outlook draft opened"
                }
                continue
            }

            Write-JsonResponse -Response $response -StatusCode 404 -Body @{
                ok    = $false
                error = "Not found. Use GET /health or POST /create-email"
            }
        } catch {
            Write-Host "Request error: $($_.Exception.Message)"
            try {
                Write-JsonResponse -Response $response -StatusCode 500 -Body @{
                    ok    = $false
                    error = $_.Exception.Message
                }
            } catch {
                $response.Abort()
            }
        }
    }
} finally {
    if ($listener.IsListening) {
        $listener.Stop()
    }
    $listener.Close()
}
