param (
    [string]$htmlFilePath,
    [string]$to,
    [string]$subject
)

# Read HTML content from the file
$htmlContent = Get-Content -Path $htmlFilePath -Raw

# Create a new Outlook application object
$outlook = New-Object -ComObject Outlook.Application

# Create a new mail item
$mail = $outlook.CreateItem(0)

# Set the sender (FROM field)
$mail.Sender = "sales@xyzdisplays.com"
$mail.SendUsingAccount = $outlook.Session.Accounts.Item("sales@xyzdisplays.com")

# Set the recipient
$mail.To = $to

# Set the subject
$mail.Subject = $subject

# Set the HTML body
$mail.HTMLBody = $htmlContent

# Set the FROM field to sales@xyzdisplays.com
# $mail.SentOnBehalfOfName = "sales@xyzdisplays.com"

# Display the mail item
$mail.Display()

# Clean up
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($outlook) | Out-Null
Remove-Variable outlook