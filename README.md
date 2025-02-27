# Zurich Billing Portal Frontend

A modern web application for managing billing records with Google OAuth authentication.

## Prerequisites

- Docker and Docker Compose installed
- Google Cloud Console account
- Backend server running on port 3337

## Getting Started

### 1. Setup Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Search for "OAuth consent screen" and configure it:

   - Select "External" user type
   - Fill in the required application information

4. Search for "Credentials" and create OAuth client:
   - Click "Create Credentials" → "OAuth client ID"
   - Select "Web application" as application type
   - Enter a name for your OAuth client
   - Add authorized JavaScript origins:
     ```
     http://localhost:3000
     ```
   - Add authorized redirect URIs:
     ```
     http://localhost:3000
     ```
   - Click "Create"
   - Copy the generated **Client ID** and **Client Secret**

### 2. Configure Environment Variables

Open the `docker-compose.yml` file and replace the OAuth credentials:

```yaml
environment:
  - NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id_here
  - NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=your_client_secret_here
```

### 3. Run the Application

```bash
# Build and start the containers
docker-compose up

# The application will be available at http://localhost:3000
```

## Authentication Flow

1. User clicks "Sign in with Google"
2. Google OAuth returns user credentials
3. Frontend extracts email from credentials
4. Frontend calls backend API `POST /sign-in` with the email
5. Backend checks if email matches `ADMIN_EMAIL`:
   - If match: Returns token with `role=admin`
   - If no match: Returns token with `role=not_admin`
6. Frontend stores token in localStorage
7. All subsequent API calls include this token in Authorization header

## Architecture

### Server Actions and API Structure

The application follows a clean architecture pattern that separates concerns between client components, server actions, and API endpoints:

#### Server Actions (`/src/app/actions`)

Server actions are Next.js 13+ features that allow server-side code execution directly from client components. In this application:

- Server actions are defined in the `actions` folder with the `"use server"` directive
- They act as an intermediary layer between frontend components and the actual API endpoints
- All server actions handle authentication token management and error handling
- Components interact exclusively with these server actions rather than making direct API calls

Example server action flow:

1. Component calls a server action (e.g., `createBillingRecord`)
2. Server action prepares the request with proper authentication headers
3. Server action makes the internal request to the Next.js API route
4. Server action processes the response and returns data to the component

#### API Routes (`/src/app/api`)

The API routes in the `api` folder handle the actual communication with the backend server:

- They receive requests from server actions
- They use the `ApiClient` service to communicate with the external backend
- They handle additional server-side logic like data transformation and validation
- They provide a consistent interface for all backend interactions

This two-layer approach provides several benefits:

- Enhanced security by keeping sensitive operations server-side
- Simplified client components that don't need to handle API complexities
- Consistent error handling and response formatting
- Clear separation of concerns in the codebase

## Features

- Google OAuth Authentication with role-based access
- Billing Records Management (CRUD operations)
- Secure API Integration with JWT
- Modern React UI with TypeScript
- Docker Containerization

## Tech Stack

- Next.js 13
- TypeScript
- React
- Redux Toolkit
- Docker
- Google OAuth 2.0

## Development

The application uses:

- `host.docker.internal` to communicate with the backend from Docker
- Port 3000 for frontend access
- Port 3337 for backend API

## Security Notes

- JWT tokens are stored in localStorage
- All API requests require valid JWT token
- Admin privileges are determined by email match
- CORS is configured for localhost development
