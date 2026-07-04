<#
deploy_to_github.ps1
Simple helper script for beginners to initialize Git, commit, and publish the current folder to GitHub.

Usage examples:
# 1) Create repo via gh CLI (recommended if you have gh installed and authenticated):
#    .\deploy_to_github.ps1 -RepoName SIMORA -Username your-github-username -UseGH
# 2) Create remote manually (if repository already exists on GitHub):
#    .\deploy_to_github.ps1 -RepoName SIMORA -Username your-github-username
# 3) If you want a private repo with gh:
#    .\deploy_to_github.ps1 -RepoName SIMORA -Username your-github-username -UseGH -Private

Parameters:
-RepoName: repository name on GitHub (default: SIMORA)
-Username: your GitHub username (optional; required for non-gh automated remote add)
-Private: switch to create a private repo when using gh
-UseGH: switch to use GitHub CLI to create the remote repo automatically
#>

param(
    [string]$RepoName = "SIMORA",
    [string]$Username = "",
    [switch]$Private,
    [switch]$UseGH
)

function ExitWith($msg) {
    Write-Host "ERROR: $msg" -ForegroundColor Red
    exit 1
}

Write-Host "== Deploy to GitHub helper =="
Write-Host "Working folder: $(Get-Location)"

# 1. Check git
try {
    git --version > $null 2>&1
} catch {
    ExitWith "git is not installed or not in PATH. Install Git: https://git-scm.com/downloads"
}

# 2. Init repo if needed
if (-not (Test-Path ".git")) {
    Write-Host "Initializing a new git repository..."
    git init
} else {
    Write-Host "Git repository already initialized."
}

# 3. Add files and commit if no commits yet
$hasCommit = $true
try {
    git rev-parse --verify HEAD > $null 2>&1
} catch {
    $hasCommit = $false
}

if (-not $hasCommit) {
    Write-Host "Creating initial commit..."
    git add .
    git commit -m "Initial commit: SIMORA DPRD MANGGARAI"
} else {
    Write-Host "Repository already has commits. Skipping initial commit."
}

# 4. Create remote & push
if ($UseGH) {
    # Use GitHub CLI if available
    try {
        gh --version > $null 2>&1
        $scope = if ($Private) { '--private' } else { '--public' }
        if (-not $Username) {
            Write-Host "No username provided. gh will create the repo under your authenticated account."
            $target = $RepoName
        } else {
            $target = "$Username/$RepoName"
        }
        Write-Host "Creating GitHub repository using gh: $target ($scope)"
        gh repo create $target $scope --source=. --remote=origin --push --confirm
        Write-Host "Pushed to GitHub via gh. Open: https://github.com/$target"
    } catch {
        Write-Host "gh CLI not found or failed: $_" -ForegroundColor Yellow
        Write-Host "Falling back to manual remote setup."
        goto :ManualRemote
    }
} else {
    :ManualRemote
    if (-not $Username) {
        $inputUrl = Read-Host "Enter remote URL (e.g. https://github.com/USERNAME/REPO.git) or press Enter to cancel"
        if (-not $inputUrl) { ExitWith "No remote provided. Aborting." }
        $remoteUrl = $inputUrl
    } else {
        $remoteUrl = "https://github.com/$Username/$RepoName.git"
    }

    Write-Host "Setting remote origin to: $remoteUrl"
    # Set branch to main and add remote
    git branch -M main 2>$null
    # If remote exists, remove and re-add
    try {
        git remote remove origin 2>$null
    } catch {}
    git remote add origin $remoteUrl

    Write-Host "Pushing to remote... (you may be asked to authenticate)"
    try {
        git push -u origin main
        Write-Host "Push successful. Repository URL: $remoteUrl"
    } catch {
        Write-Host "Push failed. If using HTTPS, create a Personal Access Token (PAT) and use it as password. See: https://github.com/settings/tokens" -ForegroundColor Yellow
        ExitWith "Push failed. See message above for guidance."
    }
}

Write-Host "Done. Your project should now be on GitHub." -ForegroundColor Green
Write-Host "If you used manual remote, open: $remoteUrl"
