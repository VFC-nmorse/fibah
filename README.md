initail install with vite
back ported react18 vvv down to react17
installed supabase based on https://github.com/pablopunk/realtime-next but not using Next.js

created supabase database fibah
made a .env file that looks like this
```
VITE_FIBBY_PUBLIC_SUPABASE_URL=https://***********.supabase.co
VITE_FIBBY_PUBLIC_SUPABASE_ANON_KEY=**************
```
Deployed with Netlify (vite sites must have a _slash_ after the Publish_Directory)
```
------------------v---------------
Base directory    | Not set
Build command     | npm run build
Publish directory | dist/
Builds            | Active
------------------^---------------
```

set netlify Environment variables to the two above (`VITE_...`)

and publish (the rest is 'nothing but netlify')
