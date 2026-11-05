# Git Security Check Hook (PowerShell)
# Reads JSON from stdin with tool_input.command
# Blocks forbidden Git and GitHub operations per CLAUDE.md section 9
# Exit codes: 0 = allowed, 2 = blocked

param(
    [string]$Command = ""
)

# Read JSON from stdin if available
$json_input = ""
if (-not [System.Console]::IsInputRedirected) {
  # No piped stdin, use parameter fallback
  if ([string]::IsNullOrEmpty($Command)) {
    exit 0
  }
  $command_to_check = $Command
} else {
  # Read from stdin (piped JSON)
  try {
    $json_input = [System.Console]::In.ReadToEnd()

    # Parse JSON to extract tool_input.command
    # Using regex for maximum portability (avoid ConvertFrom-Json dependency)
    if ($json_input -match '"command"\s*:\s*"([^"]*)"') {
      $command_to_check = $Matches[1]
    } else {
      exit 0
    }
  } catch {
    exit 0
  }
}

# If no command found, allow by default
if ([string]::IsNullOrEmpty($command_to_check)) {
  exit 0
}

# Patterns for FORBIDDEN operations
$forbidden_patterns = @(
  "^git commit",
  "^git push",
  "^git merge",
  "^git rebase",
  "^gh pr"
)

# Patterns for ALLOWED operations
$allowed_patterns = @(
  "^git status",
  "^git diff",
  "^gh issue"
)

# Check if command is in allowed list
foreach ($pattern in $allowed_patterns) {
  if ($command_to_check -match $pattern) {
    exit 0
  }
}

# Check if command is in forbidden list
foreach ($pattern in $forbidden_patterns) {
  if ($command_to_check -match $pattern) {
    Write-Error "❌ Git operation blocked by security policy" -ErrorAction Continue
    Write-Error "   Command: $command_to_check" -ErrorAction Continue
    Write-Error "   Forbidden: git commit, git push, git merge, git rebase, gh pr" -ErrorAction Continue
    Write-Error "   Allowed: git status, git diff, gh issue" -ErrorAction Continue
    Write-Error "   See: CLAUDE.md section 9" -ErrorAction Continue
    exit 2
  }
}

# Allow by default (unknown command)
exit 0
