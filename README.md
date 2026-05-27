# Dynamic Workflow Engine

This project is a config-driven approval workflow engine built with React, Vite, Tailwind CSS, and Zustand.

## Build

```bash
npm install
npm run build
npm run dev
```

The production build outputs to the `dist/` folder (Vite default).

## Deploy to Vercel (recommended)

You can deploy this app using the Vercel dashboard (Git integration) or the Vercel CLI.

### Option A — Vercel Dashboard (Git integration)
1. Push your repository to GitHub/GitLab/Bitbucket.
2. Sign in to https://vercel.com and click **New Project** → **Import Git Repository**.
3. Select the repository and set the following build settings if prompted:
   - Framework Preset: `Other`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Deploy — Vercel will build and publish the site.

### Option B — Vercel CLI
Install the Vercel CLI and deploy from your local machine:

```bash
npm i -g vercel
vercel login
# from repo root
vercel --prod
```

When using the CLI, Vercel will prompt for the build command and output directory. Use `npm run build` and `dist`.

## Notes
- `vercel.json` is included and configures a static build using `@vercel/static-build` targeting the `dist` directory.
- If your workflow requires environment variables, set them in the Vercel dashboard under the project settings.
- For custom domains, add them via the Vercel project settings.

If you'd like, I can:
- Initialize a Git repository and push to GitHub (I will need your confirmation and access/token), or
- Generate a GitHub Actions workflow to auto-deploy on push.

Tell me which option you prefer and I'll prepare the next steps.
