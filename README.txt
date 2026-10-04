# GradeTrack — Grading Management System

## Run
Open `index.html` in a browser.

Demo login:
- Username: `admin`
- Password: `admin123`

## Features
- Login/logout
- Dashboard statistics
- Student CRUD
- Search and grade-level filtering
- Quarterly grades
- Automatic final grade calculation
- Pass/fail status using 75 as the passing grade
- Individual printable report card
- Full gradebook Excel export (`.xlsx`)
- CSV export
- Browser localStorage persistence
- Responsive interface

## Notes
This is a frontend-only version. Data is stored in the browser's localStorage. Excel export loads SheetJS from its CDN when the export button is used, so an internet connection is needed for `.xlsx` export.

For a production multi-user system, use a backend such as PHP + MySQL and server-side authentication.
