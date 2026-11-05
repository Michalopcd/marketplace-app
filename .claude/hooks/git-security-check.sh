#!/bin/bash
# Git Security Check Hook
# Reads JSON from stdin with tool_input.command
# Blocks forbidden Git and GitHub operations per CLAUDE.md section 9
# Exit codes: 0 = allowed, 2 = blocked

# Read JSON from stdin
json_input=""
if [ -t 0 ]; then
  # No stdin, get from first argument (fallback)
  if [ -n "$1" ]; then
    command_to_check="$1"
  else
    exit 0
  fi
else
  # Read entire stdin
  json_input=$(cat)

  # Parse JSON to extract tool_input.command
  # Using basic grep/sed for maximum portability
  command_to_check=$(echo "$json_input" | grep -o '"command"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | cut -d'"' -f4)
fi

# If no command found, allow by default
if [ -z "$command_to_check" ]; then
  exit 0
fi

# Patterns for FORBIDDEN operations
forbidden_patterns=(
  "^git commit"
  "^git push"
  "^git merge"
  "^git rebase"
  "^gh pr"
)

# Patterns for ALLOWED operations
allowed_patterns=(
  "^git status"
  "^git diff"
  "^gh issue"
)

# Check if command is in allowed list
for pattern in "${allowed_patterns[@]}"; do
  if [[ "$command_to_check" =~ $pattern ]]; then
    exit 0
  fi
done

# Check if command is in forbidden list
for pattern in "${forbidden_patterns[@]}"; do
  if [[ "$command_to_check" =~ $pattern ]]; then
    echo "❌ Git operation blocked by security policy" >&2
    echo "   Command: $command_to_check" >&2
    echo "   Forbidden: git commit, git push, git merge, git rebase, gh pr" >&2
    echo "   Allowed: git status, git diff, gh issue" >&2
    echo "   See: CLAUDE.md section 9" >&2
    exit 2
  fi
done

# Allow by default (unknown command)
exit 0
