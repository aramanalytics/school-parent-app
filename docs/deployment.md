# Deployment & Production Configuration Guide

## Admin Web Dashboard Deployment

The web dashboard is a React/Vite/TypeScript single-page application and can be deployed to Vercel, Netlify, Cloudflare Pages, or AWS S3 + CloudFront.

### 1. Build Production Bundle
```bash
cd admin-dashboard
npm run build
```
The optimized production bundle is generated in the `admin-dashboard/dist/` directory.

### 2. Environment Variables in Production Host
Add the following in your deployment dashboard:
- `VITE_SUPABASE_URL=https://your-production-instance.supabase.co`
- `VITE_SUPABASE_ANON_KEY=your-production-anon-key`

### 3. Vercel / Netlify Rewrite Configuration
Ensure single page application client-side routing is configured. A `vercel.json` or `_redirects` file should route all traffic to `/index.html`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## Parent Mobile Application Deployment

The mobile application is built using Expo SDK 52 and Expo Router.

### 1. Build Android APK / App Bundle (AAB)
```bash
cd parent-app
npx eas build -p android --profile production
```

### 2. Build iOS Archive (IPA)
```bash
cd parent-app
npx eas build -p ios --profile production
```

### 3. EAS Configuration (`eas.json`)
```json
{
  "cli": {
    "version": ">= 12.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "env": {
        "EXPO_PUBLIC_SUPABASE_URL": "https://your-project.supabase.co",
        "EXPO_PUBLIC_SUPABASE_ANON_KEY": "your-anon-key"
      }
    }
  }
}
```

