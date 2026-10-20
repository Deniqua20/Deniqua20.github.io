"""Render the step-by-step lab walkthroughs in projects/*-walkthrough.html.

Each lab is described in LABS below. Edit the text there, then run:
    python3 scripts/build_walkthroughs.py && python3 scripts/build_shared.py

Content comes from Dee's lab write-ups on GitHub (linked on each page).
"""
from html import escape
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
e = escape

# Original practice scenario for the risk assessment lab. The company and every detail are fictional.
SCENARIO_BAYOU = '''
<section class="lab-scenario" aria-labelledby="scenario-title">
  <p class="lab-why-kicker">Practice scenario · fictional company</p>
  <h2 id="scenario-title">Bayou Bites Café</h2>
  <p>Bayou Bites Café is a family-owned restaurant with <strong>3 locations</strong> and <strong>22 employees</strong>. The owner hired you to assess their security before they renew their card processing contract.</p>
  <div class="scenario-grid">
    <div><h3>Their systems</h3><ul>
      <li>A cloud <strong>point-of-sale (POS)</strong> system with card terminals at every location. It processes credit card payments.</li>
      <li>One <strong>back-office Windows PC</strong> per location for scheduling, payroll, and inventory.</li>
      <li>An <strong>online ordering website</strong> run by a vendor, with an admin login for the café.</li>
      <li>One <strong>Wi-Fi network</strong> per location, shared by guests, staff, and the POS terminals.</li>
      <li>The owner’s <strong>laptop</strong>, used for email and banking.</li>
    </ul></div>
    <div><h3>Your assessment notes</h3><ol class="scenario-notes">
      <li>Everyone logs in to the POS with one shared manager account, <code>manager1</code>. Former employees still know the password.</li>
      <li>The POS terminals and the Wi-Fi routers still use the vendor’s default passwords.</li>
      <li>Last year an IT consultant found 8 issues. The list lives in an old email. Only 2 were fixed, and nobody owns the rest.</li>
      <li>Nobody reviews POS, router, or antivirus logs. Alerts go to an inbox no one checks.</li>
      <li>The café has never done a formal risk assessment. The owner says, “We’re too small to be a target.”</li>
      <li>When a phishing email compromised a cashier’s email account, the only response was changing that one password. There is no plan for what to do when something goes wrong.</li>
      <li>Guest Wi-Fi and the POS terminals are on the same network.</li>
      <li>Antivirus on two back-office PCs expired six months ago.</li>
      <li>A shift lead who left three months ago still has active accounts in the scheduling system and the online ordering admin.</li>
    </ol></div>
  </div>
  <div class="scenario-downloads">
    <a class="lab-download" href="../assets/labs/bayou-bites-risk-register.csv" download>⬇ Risk register worksheet (.csv)</a>
    <a class="lab-download" href="../assets/labs/bayou-bites-poam.csv" download>⬇ POA&amp;M worksheet (.csv)</a>
    <p>Opens in Excel or Google Sheets (File → Import). The first row of each is filled in as an example.</p>
  </div>
  <details class="scenario-key">
    <summary>Answer key: try it yourself first, then tap to compare</summary>
    <div class="scenario-key-body">
      <p><strong>FIPS 199:</strong> SC Bayou Bites POS = {(confidentiality, MODERATE), (integrity, MODERATE), (availability, MODERATE)}, so the overall category is <strong>Moderate</strong>. Card data leaking would hurt customers and the business, altered orders or prices cause real loss, and a POS outage stops sales. Rating confidentiality High is reasonable too, if you can explain why.</p>
      <table><thead><tr><th>Note</th><th>Main control</th><th>Why</th></tr></thead><tbody>
        <tr><td>1</td><td>AC-6 Least Privilege</td><td>A shared admin login gives everyone more access than they need and no accountability.</td></tr>
        <tr><td>2</td><td>PCI DSS: secure configurations</td><td>Vendor default passwords are public knowledge and must be changed.</td></tr>
        <tr><td>3</td><td>CA-5 Plan of Action and Milestones</td><td>Known findings have no owners, dates, or tracking.</td></tr>
        <tr><td>4</td><td>CA-7 Continuous Monitoring</td><td>No one watches logs or alerts, so problems go unnoticed.</td></tr>
        <tr><td>5</td><td>RA-3 Risk Assessment</td><td>Risks have never been identified or rated.</td></tr>
        <tr><td>6</td><td>RA-7 Risk Response</td><td>There is no defined way to respond to findings or incidents.</td></tr>
        <tr><td>7</td><td>PCI DSS: network security controls</td><td>The POS should be separated from guest Wi-Fi.</td></tr>
        <tr><td>8</td><td>PCI DSS: malware protection</td><td>Expired antivirus leaves the PCs unprotected.</td></tr>
        <tr><td>9</td><td>AC-6, plus access reviews</td><td>A former employee still has access. Periodic access reviews would have caught it.</td></tr>
      </tbody></table>
      <p><strong>Highest risks to fix first:</strong> notes 1, 2, 7, and 9. They directly expose card data or give access to people who shouldn’t have it.</p>
    </div>
  </details>
</section>'''

# Each step is (heading, [blocks]); a block is a paragraph string, ("ul", [...]), ("code", lang, text) or ("tip", text).
LABS = [
    {
        "slug": "identity-lifecycle-walkthrough",
        "why": "Orphaned accounts, where people keep access after they leave, are one of the most common identity risks. I wanted to go beyond creating users and show offboarding that is automatic, auditable, and has no manual steps, the way enterprise IAM teams handle terminations at scale.",
        "overview": "identity-lifecycle.html",
        "title": "Automated Identity Lifecycle Walkthrough",
        "desc": "Step-by-step walkthrough to build Dee’s automated Joiner/Mover/Leaver offboarding pipeline with Microsoft Entra ID, Logic Apps, Azure Automation, and Microsoft Graph.",
        "eyebrow": "Identity and access / Lab walkthrough",
        "h1": ("Build my automated", "identity lifecycle lab."),
        "lead": "Practice joiner, mover, and leaver changes by hand, then build an event-driven pipeline that offboards a user automatically when an HR termination event arrives.",
        "tags": ["Microsoft Entra ID", "Logic Apps", "Azure Automation", "Microsoft Graph", "PowerShell"],
        "repo": "https://github.com/Deniqua20/Automated-JML-Identity-Lifecycle-Microsoft-Entra-ID",
        "need": [
            "An Azure subscription and a Microsoft Entra ID tenant you can test in. My lab used Entra ID P2.",
            "Permission to create users, groups, an Automation account, and a Logic App.",
            "Test accounts only. Never point this pipeline at real users.",
        ],
        "learn": ["Joiner/Mover/Leaver (JML) lifecycle management", "Managed identity authentication with no stored credentials", "Calling Microsoft Graph from a PowerShell runbook", "Event-driven automation with Logic Apps", "Verifying changes in Entra ID audit logs"],
        "flow": [("HTTP POST", "A simulated HR termination event."), ("Azure Logic App", "Receives the event and starts the runbook."), ("Automation runbook", "Runs PowerShell with a managed identity."), ("Microsoft Graph", "Disables, revokes, removes groups and licenses."), ("Audit logs + email", "Proof of every action and a completion notice.")],
        "steps": [
            ("Practice the manual lifecycle first", [
                "Doing it by hand first teaches you what the automation needs to do.",
                ("ul", ["<strong>Joiner:</strong> create a test user, add the right attributes, assign groups and apps for their role, and require MFA registration at first sign-in.",
                        "<strong>Mover:</strong> change the user’s department and manager, add the new role’s groups and apps, and remove access from the old role.",
                        "<strong>Leaver:</strong> disable the account, revoke sessions, remove app assignments, and confirm no access is left behind."]),
            ]),
            ("Create a test user for offboarding", [
                "Create one more test user and add them to a few groups and apps (and a license, if you have one) so the pipeline has something to remove.",
            ]),
            ("Create the Azure Automation account", [
                "In the Azure portal, create an <strong>Automation account</strong>. Under <strong>Account settings → Identity</strong>, turn the <strong>System assigned</strong> managed identity <strong>On</strong>.",
                ("tip", "The managed identity is what lets the runbook call Microsoft Graph without storing a password or secret anywhere."),
            ]),
            ("Grant the managed identity Graph permissions", [
                "My lab granted <code>User.ReadWrite.All</code>, <code>GroupMember.ReadWrite.All</code>, and <code>Directory.ReadWrite.All</code>, configured with PowerShell in Cloud Shell. Here is one way to do it with the Microsoft Graph PowerShell module:",
                ("code", "powershell", '''Connect-MgGraph -Scopes "Application.Read.All","AppRoleAssignment.ReadWrite.All"

# Your Automation account's managed identity and the Microsoft Graph service principal
$mi    = Get-MgServicePrincipal -Filter "displayName eq '<your-automation-account-name>'"
$graph = Get-MgServicePrincipal -Filter "appId eq '00000003-0000-0000-c000-000000000000'"

foreach ($perm in "User.ReadWrite.All","GroupMember.ReadWrite.All","Directory.ReadWrite.All") {
  $role = $graph.AppRoles | Where-Object { $_.Value -eq $perm -and $_.AllowedMemberTypes -contains "Application" }
  New-MgServicePrincipalAppRoleAssignment -ServicePrincipalId $mi.Id `
    -PrincipalId $mi.Id -ResourceId $graph.Id -AppRoleId $role.Id
}'''),
                "Check the result in <strong>Entra ID → Enterprise applications</strong> (filter by managed identities) <strong>→ Permissions</strong>.",
            ]),
            ("Create the PowerShell runbook", [
                "In the Automation account, create a <strong>PowerShell</strong> runbook named <code>Invoke-JMLOffboard</code>, paste the script, save, and <strong>Publish</strong>. It accepts a user’s UPN and logs each step.",
                ("code", "powershell", '''param(
  [Parameter(Mandatory=$true)]
  [string]$UserPrincipalName
)

# Authenticate using managed identity
Connect-AzAccount -Identity | Out-Null
$token = (Get-AzAccessToken -ResourceUrl "https://graph.microsoft.com").Token
$headers = @{ Authorization = "Bearer $token"; "Content-Type" = "application/json" }
$graphBase = "https://graph.microsoft.com/v1.0"

# Get user ID from UPN
Write-Output "Looking up user: $UserPrincipalName"
$user = Invoke-RestMethod -Uri "$graphBase/users/$UserPrincipalName" -Headers $headers
$userId = $user.id
Write-Output "Found user ID: $userId"

# Step 1: Disable account
Write-Output "Disabling account..."
Invoke-RestMethod -Method PATCH -Uri "$graphBase/users/$userId" `
  -Headers $headers -Body '{"accountEnabled": false}'

# Step 2: Revoke all active sessions
Write-Output "Revoking sessions..."
Invoke-RestMethod -Method POST `
  -Uri "$graphBase/users/$userId/revokeSignInSessions" -Headers $headers

# Step 3: Remove all group memberships
Write-Output "Removing group memberships..."
$groups = Invoke-RestMethod -Uri "$graphBase/users/$userId/memberOf" -Headers $headers
foreach ($group in $groups.value) {
  try {
    Invoke-RestMethod -Method DELETE `
      -Uri "$graphBase/groups/$($group.id)/members/$userId/`$ref" -Headers $headers
    Write-Output "Removed from group: $($group.displayName)"
  } catch {
    Write-Output "Could not remove from $($group.displayName): $_"
  }
}

# Step 4: Remove license assignments
Write-Output "Removing licenses..."
$licenses = Invoke-RestMethod -Uri "$graphBase/users/$userId/licenseDetails" -Headers $headers
$skuIds = $licenses.value | ForEach-Object { $_.skuId }
if ($skuIds.Count -gt 0) {
  $body = @{ addLicenses = @(); removeLicenses = $skuIds } | ConvertTo-Json
  Invoke-RestMethod -Method POST `
    -Uri "$graphBase/users/$userId/assignLicense" -Headers $headers -Body $body
  Write-Output "Licenses removed"
} else {
  Write-Output "No licenses to remove"
}

Write-Output "Offboarding complete for $UserPrincipalName"'''),
                ("tip", "Newer versions of the Az module can return the access token as a secure string. If Graph calls fail with an authorization error, convert it first: <code>$token = [System.Net.NetworkCredential]::new('', $token).Password</code>"),
                "Use the runbook’s <strong>Test pane</strong> with your test user’s UPN before wiring up the trigger.",
            ]),
            ("Build the Logic App trigger", [
                ("ul", ["Create a <strong>Consumption</strong> Logic App. Mine is named <code>jml-trigger</code>.",
                        "Trigger: <strong>When an HTTP request is received</strong>, with a JSON body like the one below.",
                        "Action: the Azure Automation <strong>Create job</strong> action. Pick your Automation account and <code>Invoke-JMLOffboard</code>, and pass <code>userPrincipalName</code> from the request body.",
                        "Action: send an email notification when the job finishes.",
                        "Save, then copy the trigger’s <strong>HTTP POST URL</strong>."]),
                ("code", "json", '{ "userPrincipalName": "testuser@yourtenant.onmicrosoft.com", "action": "terminate" }'),
                ("tip", "Treat the HTTP POST URL like a password. It contains a key that lets anyone start the workflow."),
            ]),
            ("Fire a test termination event", [
                "Send the event from PowerShell (or any HTTP client):",
                ("code", "powershell", '''$body = '{ "userPrincipalName": "testuser@yourtenant.onmicrosoft.com", "action": "terminate" }'
Invoke-RestMethod -Method Post -Uri "<your-logic-app-http-post-url>" `
  -Body $body -ContentType "application/json"'''),
            ]),
        ],
        "check": ["The Logic App run history shows green checkmarks.", "The runbook output lists each step as completed.", "The test user is disabled in Entra ID.", "Their group memberships and licenses are gone.", "Entra ID audit logs captured every action.", "You received the completion email."],
        "cleanup": "Delete the test users, then delete the resource group that holds the Automation account and Logic App. Remove the managed identity’s Graph permissions if you keep the account.",
        "interview": ["Why orphaned accounts are a risk, and how automated offboarding removes that gap.", "Why a managed identity is safer than storing credentials in a script.", "What each Graph call does: disable, revoke sessions, remove groups, remove licenses.", "How the HTTP trigger could be swapped for an HR system webhook in production.", "How you proved it worked: run history, runbook output, and audit logs."],
    },
    {
        "slug": "cloud-security-monitoring-walkthrough",
        "why": "You can’t protect what you can’t see. I built this to understand the foundation every cloud security program starts with: getting logs into one place so activity can be monitored, investigated, and audited.",
        "overview": "cloud-security-monitoring.html",
        "title": "Azure Cloud Security Monitoring Walkthrough",
        "desc": "Step-by-step walkthrough to deploy Microsoft Sentinel with a Log Analytics workspace, based on Dee’s Azure cloud security monitoring lab.",
        "eyebrow": "Cloud security / Lab walkthrough",
        "h1": ("Deploy my cloud", "security monitoring lab."),
        "lead": "Set up the foundation of cloud security visibility: a Log Analytics workspace for centralized logs and Microsoft Sentinel on top of it.",
        "tags": ["Microsoft Azure", "Microsoft Sentinel", "Log Analytics", "KQL"],
        "repo": "https://github.com/Deniqua20/azure-sentinel-security-monitoring",
        "need": [
            "An Azure subscription you can create resources in. I practiced with the TryHackMe SentinelDeploy lab.",
            "Permission to create a resource group, a Log Analytics workspace, and Microsoft Sentinel.",
        ],
        "learn": ["How a Log Analytics workspace centralizes security logs", "Deploying Microsoft Sentinel on a workspace", "Exploring data connectors and monitoring capabilities", "Why centralized logging matters for audit readiness and governance"],
        "flow": [("Resource group", "One container for everything in the lab."), ("Log Analytics workspace", "Where logs are collected and stored."), ("Microsoft Sentinel", "SIEM features added to the workspace."), ("Data connectors", "Sources that send logs in."), ("Logs + KQL", "Confirm data and start investigating.")],
        "steps": [
            ("Create a resource group", ["In the Azure portal, create a resource group for the lab, in the region you plan to use for everything else."]),
            ("Create the Log Analytics workspace", ["Search for <strong>Log Analytics workspaces</strong> and create one in your resource group and region. This is the centralized logging foundation that Sentinel sits on."]),
            ("Add Microsoft Sentinel", ["Search for <strong>Microsoft Sentinel</strong>, select <strong>Create</strong>, choose your workspace, and add Sentinel to it. When it finishes, open Sentinel from the portal to confirm the deployment."]),
            ("Review data connectors", [
                "Open <strong>Data connectors</strong> (and the <strong>Content hub</strong>, where connector solutions are installed). Review what each connector collects and how it supports monitoring.",
                "For a simple first source, install and connect <strong>Azure Activity</strong>, which records actions taken on your subscription.",
            ]),
            ("Confirm logs are arriving", [
                "Open <strong>Logs</strong> in the workspace and run a quick query. New data can take a little while to appear.",
                ("code", "kql", "AzureActivity\n| take 10"),
            ]),
            ("Document it", ["Write down your deployment steps, settings, and screenshots. Note how centralized logging supports accountability, audit readiness, and future incident investigation."]),
        ],
        "check": ["Microsoft Sentinel opens and shows your workspace.", "At least one data connector shows as connected.", "A KQL query in Logs returns results."],
        "cleanup": "Sentinel and Log Analytics bill based on the data you ingest, so delete the lab’s resource group when you finish.",
        "interview": ["What a Log Analytics workspace is, and why Sentinel needs one.", "Why centralized logging is a foundational control for audit readiness.", "How the data connectors you enabled support future detection and investigation.", "How this foundation leads into detections, like my Azure honeypot lab."],
    },
    {
        "slug": "security-risk-assessment-walkthrough",
        "why": "Security isn’t only tools. I wanted to practice the governance side: finding control gaps, mapping them to a real framework, and turning findings into a tracked plan, the same workflow GRC and risk teams use.",
        "overview": "security-risk-assessment.html",
        "title": "Security Risk Assessment Walkthrough",
        "desc": "Step-by-step walkthrough to run a security gap and risk assessment against NIST SP 800-53 Rev. 5 and build a POA&M, based on Dee’s GRC lab.",
        "eyebrow": "Governance, risk, and compliance / Lab walkthrough",
        "h1": ("Run my security", "risk assessment lab."),
        "lead": "Practice the full GRC cycle: find control gaps, map them to NIST SP 800-53, rate the risk, and turn findings into a tracked remediation plan.",
        "tags": ["NIST SP 800-53 Rev. 5", "FIPS 199", "PCI DSS", "RBAC", "POA&M"],
        "repo": "https://github.com/Deniqua20/Security-Risk-Assessment-Compliance-Lab",
        "need": [
            "A copy of NIST SP 800-53 Rev. 5 (free from csrc.nist.gov).",
            "A spreadsheet for your risk register and POA&M, and a document for your policy.",
            "The <strong>Bayou Bites Café</strong> practice scenario and worksheets below.",
        ],
        "scenario": SCENARIO_BAYOU,
        "learn": ["Security control assessment and gap analysis", "Rating impact on confidentiality, integrity, and availability", "Risk-based remediation planning", "POA&M tracking", "RBAC and least-privilege design", "Writing a policy aligned to PCI DSS"],
        "flow": [("Scope the system", "Pick an organization and what you’re assessing."), ("Categorize with FIPS 199", "Rate impact on C, I, and A."), ("Find control gaps", "Map deficiencies to NIST 800-53."), ("Plan remediation", "Risk-based fixes, RBAC, access reviews."), ("Track with a POA&M", "Owners, deadlines, status, evidence.")],
        "steps": [
            ("Scope your system", ["Read the Bayou Bites Café scenario above. In a few sentences, describe what you’re assessing: the business, its systems, the data it handles (especially card payments), and who uses each system."]),
            ("Categorize it with FIPS 199", [
                "Rate the potential impact of a loss of <strong>confidentiality</strong>, <strong>integrity</strong>, and <strong>availability</strong> as low, moderate, or high. The highest of the three sets the overall category. Write it in the FIPS 199 format:",
                ("code", "text", "SC Bayou Bites POS = {(confidentiality, ?), (integrity, ?), (availability, ?)}"),
                "Ask yourself: what happens if card data leaks (C)? If prices or orders are changed (I)? If the registers go down on a Friday night (A)?",
            ]),
            ("Identify control gaps", [
                "Go through the nine assessment notes in the scenario. For each one, write the finding in your risk register and map it to a NIST SP 800-53 Rev. 5 control (or a PCI DSS requirement). My lab focused on these controls:",
                ("ul", ["<strong>AC-6 Least Privilege:</strong> users have more access than their job needs.", "<strong>CA-5 Plan of Action and Milestones:</strong> findings are not tracked to completion.", "<strong>CA-7 Continuous Monitoring:</strong> security status is not watched over time.", "<strong>RA-3 Risk Assessment:</strong> risks are not formally identified and rated.", "<strong>RA-7 Risk Response:</strong> there is no defined way to respond to findings."]),
            ]),
            ("Rate the risk", [
                "For each gap, rate its impact and how likely it is to happen, then combine them with this simple matrix. Fix the Highs first.",
                ("code", "text", "                 Impact: Low    Moderate   High\nLikelihood High:         Moderate  High       High\nLikelihood Moderate:     Low       Moderate   High\nLikelihood Low:          Low       Low        Moderate"),
                "The first row of the risk register worksheet is filled in as an example.",
            ]),
            ("Write remediation strategies", ["For each control, write a risk-based remediation strategy that explains what changes, why it reduces risk, and who owns it."]),
            ("Recommend RBAC and access reviews", ["Design role-based access so people only get what their role needs, and add periodic access reviews to catch excessive access to sensitive information."]),
            ("Build a POA&M tracker", [
                "Create a Plan of Action and Milestones to track remediation to completion. My tracker covered risk severity, ownership, deadlines, status, and evidence. Use the POA&M worksheet above. Its first row shows a finished example:",
                ("code", "text", "ID | Weakness | NIST control | Risk severity | Owner | Milestones | Due date | Status | Evidence of completion"),
            ]),
            ("Write a PCI DSS-aligned policy", [
                "Write a short security policy for Bayou Bites’ point-of-sale environment. Name a technical owner for each requirement. A simple outline:",
                ("ol", ["<strong>Purpose and scope:</strong> which systems and locations it covers.", "<strong>Network security controls:</strong> keep the POS on its own network, separate from guest Wi-Fi.", "<strong>Secure configuration:</strong> change every vendor default password before a device goes live.", "<strong>Malware protection:</strong> keep antivirus current on every back-office computer.", "<strong>Roles and ownership:</strong> who is responsible for each requirement.", "<strong>Review:</strong> how often the policy is reviewed and updated."]),
            ]),
            ("Compare with the answer key", ["When you’re done, open the answer key at the top of the page and compare. It’s fine if your mappings differ, as long as you can explain why."]),
        ],
        "check": ["Every gap is mapped to a specific NIST SP 800-53 control.", "Each finding has a CIA impact rating and a priority.", "Every POA&M item has an owner, a due date, a status, and evidence.", "Your policy names an owner for each requirement."],
        "cleanup": "",
        "interview": ["How you used FIPS 199 to decide how critical the system is.", "Why you chose AC-6, CA-5, CA-7, RA-3, and RA-7, and how they connect.", "How a POA&M turns findings into accountable, trackable work.", "How RBAC and access reviews reduce excessive access.", "How continuous monitoring (CA-7) ties to detection work like my Sentinel lab."],
    },
    {
        "slug": "okta-identity-walkthrough",
        "why": "Single sign-on and lifecycle management are core IAM skills. I wanted hands-on proof that I understand how companies centralize sign-in and make sure access is granted, changed, and removed through groups instead of one person at a time.",
        "overview": "okta-identity.html",
        "title": "Okta SSO and Lifecycle Walkthrough",
        "desc": "Step-by-step walkthrough to configure Okta SAML single sign-on, group-based access, SCIM provisioning, and Joiner/Mover/Leaver workflows, based on Dee’s Okta labs.",
        "eyebrow": "Identity and access / Lab walkthrough",
        "h1": ("Set up my Okta", "SSO and lifecycle lab."),
        "lead": "Use a free Okta developer account to centralize sign-in with SAML 2.0, control access with groups, and automate joiner, mover, and leaver changes.",
        "tags": ["Okta", "SAML 2.0", "SCIM 2.0", "Google Workspace", "Okta System Log"],
        "repo": "https://github.com/Deniqua20/okta-iam-lifecycle-lab",
        "repo2": "https://github.com/Deniqua20/okta-sso-app-integration",
        "need": [
            "A free Okta developer account.",
            "A test application that supports SAML 2.0 and, for provisioning, SCIM 2.0.",
            "Optional: a Google Workspace test environment to practice SSO into a real service.",
        ],
        "learn": ["Identity Provider (IdP) vs. Service Provider (SP) roles", "SAML 2.0 federation and SSO configuration", "Group-based access and least privilege", "SCIM provisioning and Joiner/Mover/Leaver workflows", "Monitoring identity events in the Okta System Log"],
        "flow": [("Okta tenant", "Users and groups by job function."), ("SAML app integration", "Okta signs users in to the app."), ("Group-based access", "Apps assigned to groups, not people."), ("SCIM provisioning", "Accounts created, updated, removed automatically."), ("System Log", "Audit sign-ins and lifecycle events.")],
        "steps": [
            ("Set up your Okta tenant", ["Create a free Okta developer tenant and configure the organization settings, branding, and domain."]),
            ("Create users and groups", ["Add test users and create groups mapped to job functions. You’ll assign apps to these groups instead of to individual people."]),
            ("Create a SAML 2.0 app integration", [
                ("ul", ["Go to <strong>Applications → Create App Integration → SAML 2.0</strong>.",
                        "Enter the service provider settings: <strong>Single sign-on URL</strong> (ACS URL), <strong>Audience URI</strong> (Entity ID), and <strong>Name ID format</strong>.",
                        "Add attribute statements to map the user attributes the app needs.",
                        "Finish, then use Okta’s IdP metadata (or SSO URL and certificate) to configure the app’s side.",
                        "Sign in through Okta and confirm it works. A browser SAML tracer extension lets you see the assertion and verify the claims."]),
            ]),
            ("Optional: SSO into Google Workspace", ["Configure Google Workspace as a service provider with Okta as the IdP: set the sign-in URL and Entity ID, and upload the Okta certificate. Enable SSO for test users and confirm sign-in redirects through Okta. Then disable a user in Okta and confirm they can no longer get into Google Workspace."]),
            ("Assign access by group", ["Assign each application to the groups that need it. Sign in as an unassigned user and confirm access is denied. That’s least privilege at the group level."]),
            ("Turn on SCIM provisioning", ["On an app that supports SCIM 2.0, enable provisioning and map attributes between Okta and the app so accounts are created, updated, and deactivated automatically."]),
            ("Test Joiner, Mover, and Leaver", [
                ("ul", ["<strong>Joiner:</strong> create a user and add them to a group. Confirm they’re provisioned to the group’s apps.",
                        "<strong>Mover:</strong> move the user to another group. Confirm their app access changes.",
                        "<strong>Leaver:</strong> deactivate the user in Okta. Confirm app access is revoked and the account is deprovisioned."]),
            ]),
            ("Review the Okta System Log", [
                "Open <strong>Reports → System Log</strong> to review provisioning events and sign-ins. Filters help you find what matters, for example failed attempts:",
                ("code", "text", 'outcome.result eq "FAILURE"'),
                "Export the logs to practice getting identity events into a SIEM.",
            ]),
        ],
        "check": ["Signing in through Okta gets you into the app.", "Unassigned users are denied access.", "Joiner, mover, and leaver changes show up in the app automatically.", "The System Log shows the sign-in and provisioning events."],
        "cleanup": "Deactivate and delete your test users and remove test app integrations when you’re done.",
        "interview": ["The difference between the IdP and the SP, and what’s inside a SAML assertion.", "Why group-based assignment scales least privilege.", "How SCIM prevents orphaned accounts when someone leaves.", "How you tested each Joiner, Mover, and Leaver scenario.", "Why the Okta System Log matters for identity threat detection."],
    },
]


def block(b):
    if isinstance(b, str):
        return f"<p>{b}</p>"
    kind = b[0]
    if kind == "ul":
        return "<ul>" + "".join(f"<li>{x}</li>" for x in b[1]) + "</ul>"
    if kind == "ol":
        return "<ol>" + "".join(f"<li>{x}</li>" for x in b[1]) + "</ol>"
    if kind == "code":
        return (f'<div class="lab-code"><div class="lab-code-bar"><span>{e(b[1])}</span><button type="button" class="lab-copy">Copy</button></div>'
                f'<pre><code>{e(b[2])}</code></pre></div>')
    if kind == "tip":
        return f'<p class="lab-tip"><strong>Tip</strong> {b[1]}</p>'
    raise ValueError(kind)


def page(lab):
    flow = "".join(f"<li><strong>{e(t)}</strong><span>{e(d)}</span></li>" for t, d in lab["flow"])
    steps = "".join(f'<li class="lab-step"><h3>{e(h)}</h3>{"".join(block(b) for b in bs)}</li>' for h, bs in lab["steps"])
    repos = f'<a href="{lab["repo"]}">See my original write-up on GitHub</a>'
    if lab.get("repo2"):
        repos += f' · <a href="{lab["repo2"]}">SSO app integration write-up</a>'
    cleanup = f'<h2>Clean up</h2><p class="lab-cleanup">{lab["cleanup"]}</p>' if lab["cleanup"] else ""
    return f'''<main id="main" class="lab-walkthrough">
      <section class="interior-hero shell">
        <a class="text-link" href="{lab["overview"]}">Back to the project overview</a>
        <p class="eyebrow">{e(lab["eyebrow"])}</p>
        <h1>{e(lab["h1"][0])}<br /><em>{e(lab["h1"][1])}</em></h1>
        <p class="lead">{e(lab["lead"])}</p>
        <div class="tags">{"".join(f"<span>{e(t)}</span>" for t in lab["tags"])}</div>
      </section>
      <section class="shell prose">
        <div class="lab-why"><p class="lab-why-kicker">Why I built this lab</p><p>{e(lab["why"])}</p></div>
        <p class="lab-adjust"><strong>Make it your own.</strong> This is how I did it, not the only way. Feel free to adjust the lab to your liking: change the names, tools, or scope, or take it further. What matters is that you understand what you built and why.</p>
        <div class="lab-start">
          <div><h2>Before you start</h2><ul>{"".join(f"<li>{x}</li>" for x in lab["need"])}</ul></div>
          <div><h2>What you’ll learn</h2><ul>{"".join(f"<li>{e(x)}</li>" for x in lab["learn"])}</ul></div>
        </div>
        {lab.get("scenario", "")}
        <h2>How it fits together</h2>
        <ol class="architecture-flow">{flow}</ol>
        <h2>Step by step</h2>
        <ol class="lab-steps">{steps}</ol>
        <h2>Check your work</h2>
        <ul class="lab-checks">{"".join(f"<li>{e(x)}</li>" for x in lab["check"])}</ul>
        {cleanup}
        <div class="lab-interview"><p class="lab-interview-kicker">Interview ready</p><h2>Be ready to explain</h2><ul>{"".join(f"<li>{e(x)}</li>" for x in lab["interview"])}</ul>
        <p>Know your work front to back and you’ll be ready when someone says “walk me through it.”</p></div>
        <p class="lab-source">This walkthrough follows my lab. Portals and menus change over time, so names may look slightly different when you try it. {repos}</p>
        <a class="button" href="{lab["overview"]}">Back to the project overview</a>
      </section>
    </main>'''


def write(lab):
    template = (ROOT / "projects/identity-lifecycle-walkthrough.html").read_text()
    target = ROOT / "projects" / f'{lab["slug"]}.html'
    src = target.read_text() if target.exists() else template
    head, rest = src.split("<main", 1)
    tail = rest.split("</main>", 1)[1]
    head = re.sub(r"<title>.*?</title>", f"<title>{e(lab['title'])} | Dee’s Cyber Corner</title>", head, count=1, flags=re.S)
    head = re.sub(r'(<meta\s+name="description"\s+content=")[^"]*"', lambda m: m.group(1) + e(lab["desc"]) + '"', head, count=1)
    head = re.sub(r'<meta property="og:[^>]*>\n|<meta name="twitter:[^>]*>\n', "", head)
    head = re.sub(r'<body class="[^"]*"', '<body class="interior balanced-page lab-page cyber-world room-page"', head, count=1)
    if "walkthrough.js" not in head:
        head = head.replace("</head>", '<script src="../assets/js/walkthrough.js?v=1" defer></script>\n</head>', 1)
    target.write_text(head + page(lab) + tail)


for lab in LABS:
    write(lab)
print("wrote", ", ".join(l["slug"] for l in LABS))
