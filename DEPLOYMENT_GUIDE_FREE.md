# Zero-Cost Secure Deployment Guide (PostgreSQL + Vercel)

This guide switches the database strategy to **PostgreSQL** so you don't need to add a credit card to Render for persistent disks.

## 1. Get a Free PostgreSQL Database
Since Render requires a card for disks, we will use a **Free Tier PostgreSQL** provider like **Neon.tech**.
1.  Go to [Neon.tech](https://neon.tech/) and Sign Up (No Card required usually).
2.  Create a Project called `chemflow`.
3.  Copy the **Connection String** (it looks like `postgres://user:password@endpoint.neon.tech/neondb...`).

## 2. Deploy Backend to Render (Free Tier)
1.  Go to [Render Dashboard](https://dashboard.render.com/) -> `New +` -> `Web Service`.
2.  **Repo**: `ChemFlow-Analytics`.
3.  **Settings**:
    *   **Name**: `chemflow-backend`
    *   **Root Directory**: `backend`
    *   **Runtime**: `Python 3`
    *   **Build Command**: `pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate`
    *   **Start Command**: `gunicorn backend.wsgi --log-file -`
    *   **Instance Type**: Free.

4.  **Environment Variables (Secrets)**:
    Add these keys in the "Environment" tab:

| Key | Value | Reason |
| :--- | :--- | :--- |
| `PYTHON_VERSION` | `3.11.0` | Matches runtime.txt |
| `SECRET_KEY` | `EsMNhhwj5C_-w2uP6oF6jO_OvwaI_Y44MnFLP7spE14szhKRyJB_tqL4-zY` | Generated Logic |
| `DEBUG` | `False` | Production Mode |
| `ALLOWED_HOSTS` | `*` | Traffic Allow |
| `DATABASE_URL` | *(Paste your Neon.tech Connection String here)* | **Crucial Step** |
| `CORS_ALLOWED_ORIGINS` | `https://your-frontend.vercel.app` | Update this after Step 3 |

*Note: You do NOT need to add a Disk anymore.*

## 3. Deploy Frontend to Vercel (Free)
1.  Go to [Vercel](https://vercel.com/new).
2.  Import `ChemFlow-Analytics`.
3.  **Root Directory**: `web-frontend`.
4.  **Environment Variables**:
    *   `VITE_API_URL` = `https://chemflow-backend.onrender.com` (Your Render URL)
5.  Deploy.

## 4. Final Connection
1.  Take your Vercel URL (e.g. `https://chemflow.vercel.app`).
2.  Go back to Render -> Settings -> Environment Variables.
3.  Update `CORS_ALLOWED_ORIGINS` with that URL.

Your app is now deployed for **$0** with persistent data storage!
