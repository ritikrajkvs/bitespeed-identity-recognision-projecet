# Identity Reconciliation

A full-stack web application designed to consolidate fragmented user touchpoints into unified customer profiles. Built as a solution to the Bitespeed backend task.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express.js
- **Database**: MySQL (using `mysql2`)

## Features
- Handles multiple identities across email and phone number inputs.
- Automatically creates, links, and merges primary and secondary contacts.
- Beautiful, interactive node-graph visualization of the unified identity tree.
- Fully production-ready architecture with separate frontend and backend environments connecting to Cloud MySQL.

## Getting Started

### Prerequisites
- Node.js installed
- A MySQL database (local or cloud like TiDB/Aiven)

### Backend Setup
1. Navigate to the `backend` directory: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file in the `backend` directory based on your database configuration:
   \`\`\`env
   DATABASE_URL="mysql://username:password@your-database-host:3306/bitespeed"
   PORT=3000
   \`\`\`
4. Run the initialization script to generate the database schema: `node init-db.js`
5. Start the backend server: `npm start` (Runs on port 3000)

### Frontend Setup
1. Open a new terminal and navigate to the `frontend` directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the Vite development server: `npm run dev` (Runs on port 5173)

## Architecture Details
The application implements three key scenarios for Identity Reconciliation:
1. **New Customer**: Creates a new `Primary` contact.
2. **Existing Customer, New Info**: Creates a `Secondary` contact linked to the root primary profile.
3. **Merging Primaries**: When a request contains an email and phone belonging to two *different* primary contacts, it merges the newer primary tree under the absolute oldest primary contact.
