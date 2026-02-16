# Visualize Spotify Wrapped Data

This project visualizes Spotify data from a Neon Database using a React dashboard.

## Setup

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Configure Database:**
    - Create a `.env` file based on `.env.example`.
    - Set `DATABASE_URL` to your Neon DB connection string.
    - Run the SQL commands in `schema.sql` to set up your database tables if needed.

3.  **Run Locally:**
    Using Vercel CLI (Recommended for API support):
    ```bash
    npx vercel dev
    ```
    Or standard Vite dev server (API routes won't work without proxy):
    ```bash
    npm run dev
    ```

4.  **Build for Production:**
    ```bash
    npm run build
    ```

## Vercel Deployment

This project is configured for Vercel deployment.
1.  Push to GitHub/GitLab/Bitbucket.
2.  Import project in Vercel.
3.  Set the `DATABASE_URL` environment variable in Vercel settings.
4.  Deploy!