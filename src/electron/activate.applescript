tell application "System Events"
  set applicationName to name of (process 1 where frontmost is true)
end tell

tell application applicationName
  set wins to id of every window whose visible is true
  activate window (item 1 of wins)
end tell
