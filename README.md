# Garuda Holdings, Inc. — website

Static site (HTML, CSS, JavaScript). No build step, no framework, no dependencies.

```
index.html
css/styles.css
js/main.js            <- enquiry form configuration lives here
assets/               <- logo (PNG + WebP), icons, social image
favicon.ico
robots.txt, sitemap.xml
vercel.json
```

## Deploy to Vercel

**Option A: Git**
1. Put this folder in a Git repository and push it to GitHub.
2. In Vercel choose *Add New → Project*, import the repository.
3. Framework Preset: **Other**. Leave Build Command and Output Directory empty. Deploy.

**Option B: CLI**
```
npm i -g vercel
cd garuda-holdings
vercel --prod
```

**Connect garudaholdings.ca**
1. Vercel project → *Settings → Domains* → add `garudaholdings.ca` (and `www.garudaholdings.ca`, redirecting to the apex).
2. Add the DNS records Vercel shows at your domain registrar, or switch to Vercel nameservers.
3. The canonical URL in `index.html` is `https://garudaholdings.ca/`, so the apex domain should be the primary one.

## Enabling the enquiry form

The form is **not** public by default. Until an endpoint is configured the contact section shows
"Contact details will be available here soon." and no form exists on the page.

1. Create a form endpoint that accepts a JSON `POST` and returns a 2xx status once it has received the message
   (a form service such as Formspree, or a serverless function of your own).
2. Open `js/main.js` and set `CONFIG.contactEndpoint` to that HTTPS URL.
3. Redeploy and submit a real test enquiry to confirm it arrives.

The success message is shown only when the endpoint returns a 2xx response; any other result shows the failure message.
Do not put API keys or secrets in front-end code; use an endpoint that does not require them in the browser.

## Remaining launch requirements

- **Contact details:** confirm a business email address (and any phone or address) before publishing any of them.
- **Form delivery:** choose and configure an endpoint (above), then test it.
- **Privacy notice:** if the form goes live, publish an accurate privacy notice that matches how enquiries are stored and handled, and then link it. None is linked now because none exists.
- **Company details:** confirm the legal name, any registrations and any regulatory status before adding them. None are claimed on the site.
- **Review the copy:** have a lawyer or compliance adviser review the informational notice and the investment wording, particularly before soliciting outside investment.
- **Fonts (optional):** Cormorant Garamond and Jost load from Google Fonts. Self-host them if you prefer not to call a third party.
- **Checks after deploy:** confirm the social preview (paste the URL into a link-preview tool) and run Lighthouse on the live URL.
