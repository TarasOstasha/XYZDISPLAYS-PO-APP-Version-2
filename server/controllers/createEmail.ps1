param (
    [string]$htmlFilePath,
    [string]$to,
    [string]$subject
)

# LEGACY: used when the Node server ran on the same Windows PC as Outlook.
# For Vercel / cloud hosting, use /outlook-helper instead (browser -> localhost helper -> Outlook).

$htmlContent = Get-Content -Path $htmlFilePath -Raw

$outlook = New-Object -ComObject Outlook.Application
$mail = $outlook.CreateItem(0)

$mail.Sender = "sales@xyzdisplays.com"
$mail.SendUsingAccount = $outlook.Session.Accounts.Item("sales@xyzdisplays.com")

$mail.To = $to
$mail.Subject = $subject
$mail.HTMLBody = $htmlContent

$mail.Display()

[System.Runtime.Interopservices.Marshal]::ReleaseComObject($outlook) | Out-Null
Remove-Variable outlook
