# Deployment Guide for FootChat

This guide will help you deploy your Next.js application to production.

## Step 1: Create a GitHub Repository

Before deploying, you need to push your code to GitHub:

1. **Go to GitHub and create a new repository**:
   - Visit [github.com](https://github.com) and sign in
   - Click the "+" icon in the top right → "New repository"
   - Name it `footchat` (or any name you prefer)
   - Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (you already have these)
   - Click "Create repository"

2. **Connect your local repository to GitHub**:
   ```bash
   # Make sure you're in the footchat directory
   cd /Users/ojonyeagwu/Desktop/footchat
   
   # Add all your changes
   git add .
   
   # Commit your changes
   git commit -m "Ready for deployment"
   
   # Add the GitHub repository as remote (replace YOUR_USERNAME with your GitHub username)
   git remote add origin https://github.com/YOUR_USERNAME/footchat.git
   
   # Push your code to GitHub
   git push -u origin Final-Event-Flow
   ```

   **Note**: Replace `YOUR_USERNAME` with your actual GitHub username. If you named your repo something other than `footchat`, use that name instead.

---

## Step 2: Deploy to Vercel (Recommended - Easiest for Next.js)

Vercel is made by the creators of Next.js and offers the simplest deployment experience.

### Steps:

1. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account
   - Click "Add New Project"
   - Import your `footchat` repository
   - Vercel will auto-detect Next.js settings
   - Click "Deploy"
   - Your site will be live in 1-2 minutes!

3. **Your site will be available at**: `https://footchat.vercel.app` (or a custom domain if you set one up)

### Benefits:
- ✅ Zero configuration needed
- ✅ Automatic HTTPS
- ✅ Free tier available
- ✅ Automatic deployments on every git push
- ✅ Preview deployments for pull requests

---

## Option 2: Netlify

Another popular option with similar ease of use.

### Steps:

1. **Make sure you've completed Step 1** (created GitHub repo and pushed code)

2. **Deploy to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Sign in with GitHub
   - Click "Add new site" → "Import an existing project"
   - Select your repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`
   - Click "Deploy site"

---

## Option 3: Manual Build & Deploy

If you want to deploy to your own server:

1. **Build the production version**:
   ```bash
   npm run build
   ```

2. **Start the production server**:
   ```bash
   npm start
   ```

3. **Or export as static site** (if your app doesn't need server-side features):
   - Add to `next.config.ts`:
     ```typescript
     output: 'export'
     ```
   - Then run: `npm run build`
   - Deploy the `out` folder to any static hosting

---

## Before Deploying - Quick Checklist

- [ ] Test your build locally: `npm run build && npm start`
- [ ] Make sure all dependencies are in `package.json`
- [ ] Check that there are no hardcoded localhost URLs
- [ ] Verify environment variables (if any) are set up in your hosting platform

---

## Environment Variables

If you need to add environment variables later:
- **Vercel**: Project Settings → Environment Variables
- **Netlify**: Site Settings → Environment Variables

---

## Custom Domain

Both Vercel and Netlify allow you to add a custom domain:
- **Vercel**: Project Settings → Domains
- **Netlify**: Domain Settings → Add custom domain

---

## Need Help?

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Netlify Documentation](https://docs.netlify.com)

