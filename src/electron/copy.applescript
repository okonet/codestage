tell application "System Events"
  set applicationName to name of (process 1 where frontmost is true)
end tell

tell application applicationName
  set wins to id of every window whose visible is true
  activate window (item 1 of wins)
end tell

tell application "System Events" to tell (process 1 where frontmost is true)
  click menu item "Select All" of menu 1 of menu bar item "Edit" of menu bar 1
  click menu item "Copy" of menu 1 of menu bar item "Edit" of menu bar 1
end tell

