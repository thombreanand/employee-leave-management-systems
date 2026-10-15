# LeaveWise — Employee Leave Management

Angular 18 + TypeScript + HTML/CSS frontend with separate Employee and Manager login/signup flows and dashboards.

## Features

**Employee dashboard:** create/sign in to an employee account, submit leave requests, see request status and manager comments, edit/delete pending requests.

**Manager dashboard:** see all leave requests in the shared browser demo, search/filter by status, approve pending requests, or reject them with a required comment. The employee sees the updated status when they sign into the same browser profile.

## Run

Install Node.js LTS, open a terminal in this project folder, then run:

```bash
npm install
npm start
```

Open `http://localhost:4200`.

## Demo logins

| Role | Email | Password |
|---|---|---|
| Employee | `employee@leavewise.demo` | `Employee123!` |
| Manager | `manager@leavewise.demo` | `Manager123!` |

Use the demo account buttons on the sign-in screen to fill credentials automatically. You can also create new accounts.

## Oracle notes

The supplied SQL script is for setting up the Oracle table. The Angular app currently runs in local browser demo mode using `localStorage`, so it shares data only in the same browser profile. For separate computers/users, configure Oracle REST Data Services (ORDS), replace local storage operations with calls to a protected REST API, and enforce employee ownership and manager authorization on the server. Angular in the browser must not connect directly to Oracle SQL or contain database credentials.

**Security:** this is a learning demo, not production authentication. Signup allows selecting Manager so the workflow can be tested; in a real deployment, only an administrator/server should grant manager privileges. Passwords are stored in browser storage in this demo and must never be used for real employee data.
