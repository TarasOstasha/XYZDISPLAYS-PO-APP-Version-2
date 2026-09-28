param (
    [Parameter(Mandatory = $true)]
    [string]$payloadFile
)

if (-not (Test-Path -LiteralPath $payloadFile)) {
    throw "Payload file not found: $payloadFile"
}

$payload = Get-Content -LiteralPath $payloadFile -Raw -Encoding UTF8 | ConvertFrom-Json
$to = [string]$payload.to
$subject = [string]$payload.subject
$htmlContent = [string]$payload.html

if ([string]::IsNullOrWhiteSpace($to) -or [string]::IsNullOrWhiteSpace($subject) -or [string]::IsNullOrWhiteSpace($htmlContent)) {
    throw "Payload must include to, subject, and html"
}

$outlook = New-Object -ComObject Outlook.Application
$mail = $outlook.CreateItem(0)

$fromAccount = "sales@xyzdisplays.com"
try {
    $mail.SendUsingAccount = $outlook.Session.Accounts.Item($fromAccount)
} catch {
    Write-Warning "Could not set SendUsingAccount to $fromAccount. Using default Outlook account."
}

$mail.To = $to
$mail.Subject = $subject
$mail.HTMLBody = $htmlContent
$mail.Display()

[System.Runtime.Interopservices.Marshal]::ReleaseComObject($mail) | Out-Null
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($outlook) | Out-Null
Remove-Variable mail, outlook -ErrorAction SilentlyContinue
