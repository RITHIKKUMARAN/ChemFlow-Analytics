# Deploying Django + SQLite (Persistent) for FREE

Since you want to use **SQLite** (a file-based database) and **avoid adding a credit card**, your **ONLY** good option for persistent data is **PythonAnywhere**.

Render/Heroku/Vercel will **DELETE** your SQLite file every time the app updates or sleeps (every ~20 minutes) if you don't pay.

**PythonAnywhere** gives you a persistent disk for free.

## Step 1: Prepare the Repo (Done)
I have configured your project to work perfectly.
1.  Push your latest code to GitHub.
    ```bash
    git add .
    git commit -m "Configure for PythonAnywhere Deployment"
    git push
    ```

## Step 2: Deploy Backend to PythonAnywhere (Free)
1.  Sign up at [www.pythonanywhere.com](https://www.pythonanywhere.com/) (Beginner account).
2.  Go to **Consoles** -> **Bash**.
3.  Clone your repo:
    ```bash
    git clone https://github.com/RITHIKKUMARAN/ChemFlow-Analytics.git
    cd ChemFlow-Analytics/backend
    ```
4.  Create Virtual Environment:
    ```bash
    mkvirtualenv --python=/usr/bin/python3.10 myenv
    pip install -r requirements.txt
    ```
5.  Set up Environment Variables (Secrets):
    *   Go to the **Web** tab.
    *   Scroll to **Virtualenv** and enter: `myenv`.
    *   Scroll to **WSGI configuration file** and edit it.
    *   Add your env vars directly in the `wsgi.py` file provided by PythonAnywhere like this:
        ```python
        import os
        os.environ['SECRET_KEY'] = 'YOUR_GENERATED_KEY'
        os.environ['DEBUG'] = 'False'
        os.environ['ALLOWED_HOSTS'] = 'yourusername.pythonanywhere.com'
        # No need to set DB_PATH, it defaults to local file which works here!
        ```
6.  Run Migrations & Static Files:
    In the Bash console:
    ```bash
    python manage.py migrate
    python manage.py collectstatic
    ```
7.  **Reload** your web app in the Web tab. Your backend is live!

## Step 3: Deploy Frontend to Vercel (Free)
1.  Go to [Vercel](https://vercel.com).
2.  Import Repo `ChemFlow-Analytics`.
3.  Root Directory: `web-frontend`.
4.  **Environment Variables**:
    *   `VITE_API_URL` = `https://yourusername.pythonanywhere.com`
5.  Deploy.

## Step 4: Final Link
1.  Go back to PythonAnywhere `wsgi.py` (or settings).
2.  Add `CORS_ALLOWED_ORIGINS` = `https://your-frontend.vercel.app`.
3.  Reload Web App.

Your site is now fully deployed with **Persistent SQLite** for **$0**.
