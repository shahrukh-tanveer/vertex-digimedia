# Vertex DG Media Website

Black / white (dark) themed marketing site with red accent hover color. Services: Web Development, Meta & Google Ads, Graphic / Creative Design, Analytics & Tracking, Funnel Optimization, Automation & Integrations.

## Stack
Pure static build (HTML + CSS + vanilla JS). Fast to host anywhere (Netlify, Vercel static, GitHub Pages, S3, traditional cPanel).

## Structure
```
index.html            # Landing page + all sections
assets/css/style.css  # Styles (dark theme + animations)
assets/js/main.js     # Interactions (nav, reveal, form mock)
assets/img/           # Placeholder for images/logos
```

## Features
- Responsive, mobile nav drawer
- Scroll reveal animations (IntersectionObserver)
- Accessible semantic sections and headings
- Contact form with front-end validation & mock async submit (replace with backend / Formspree / API)
- Smooth scrolling navigation
- Performance oriented (no frameworks) & modern typography (Inter)

## Customization
1. Replace skeleton work images inside `.work-grid` with real images (drop into `assets/img/` and set as background-image or <img>). 
2. Hook form submission to a real endpoint:
   - Formspree: change `form.addEventListener` to POST to Formspree endpoint.
   - Netlify Forms: add `name` attribute to form and `data-netlify="true"` plus hidden input.
   - Backend: create serverless function (e.g. `api/contact.js`) and fetch.
3. Swap metrics and stats copy to real figures.
4. Add favicon & social preview `<meta>` tags.

## Deploy (examples)
### Netlify
Drag & drop folder into Netlify dashboard or use CLI.
### Vercel
Import as project (framework: Other) – build output is repository root.
### GitHub Pages
Commit & push; set Pages to serve root.

## Adding SEO / Meta
Add Open Graph and Twitter card tags in `<head>` once you have logo/cover image.

## License
Proprietary – all rights reserved (adjust if needed).
