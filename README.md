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
