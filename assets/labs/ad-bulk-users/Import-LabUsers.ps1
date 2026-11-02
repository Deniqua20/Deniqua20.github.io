<#
  Import-LabUsers.ps1  (Dee's Cyber Corner)
  Bulk-creates lab users in Active Directory from a CSV file.
  For lab use only. Use fictional data, never real employee records.

  Usage (in an elevated PowerShell window on your domain controller):
    cd C:\IAMLab
    Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
    .\Import-LabUsers.ps1

  Change -CsvPath or -OU if your file name or domain is different.
#>
param(
  [string]$CsvPath = "C:\IAMLab\AD_BulkUpload_50Users.csv",
  [string]$OU = "OU=LabUsers,DC=ad,DC=lab,DC=example,DC=com"
)

Import-Module ActiveDirectory

# One temporary password for every new user. Users must change it at first sign-in.
# It has to meet your domain's password rules (length and complexity).
$password = Read-Host -AsSecureString "Enter a temporary password for the new users"

$users   = Import-Csv -Path $CsvPath
$created = 0
$skipped = 0

foreach ($u in $users) {
  # Skip anyone who already exists, so the script is safe to run more than once
  if (Get-ADUser -Filter "SamAccountName -eq '$($u.SamAccountName)'" -ErrorAction SilentlyContinue) {
    Write-Host "Skipped (already exists): $($u.SamAccountName)" -ForegroundColor Yellow
    $skipped++
    continue
  }
  try {
    New-ADUser -Name $u.DisplayName `
      -GivenName $u.FirstName -Surname $u.LastName `
      -SamAccountName $u.SamAccountName -UserPrincipalName $u.UserPrincipalName `
      -DisplayName $u.DisplayName -EmailAddress $u.EmailAddress `
      -Department $u.Department -Title $u.Title `
      -Path $OU -AccountPassword $password `
      -ChangePasswordAtLogon $true -Enabled $true
    Write-Host "Created: $($u.SamAccountName)" -ForegroundColor Green
    $created++
  } catch {
    Write-Host "Failed: $($u.SamAccountName) - $($_.Exception.Message)" -ForegroundColor Red
    $skipped++
  }
}

Write-Host ""
Write-Host "Import complete"
Write-Host "Created: $created"
Write-Host "Skipped: $skipped"
