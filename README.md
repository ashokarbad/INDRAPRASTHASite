# Indraprastha by Pankti — website

Static one-page site (HTML/CSS/JS, no build step). Open `index.html` to preview, or publish with GitHub Pages from the repo root.

## Before going live
1. **`assets/js/config.js`**: add the phone and WhatsApp number. Optionally add an email and Instagram link. Call buttons, WhatsApp reservations and the phone number in the SEO data all switch on once these are filled in.
2. **`assets/js/menu-data.js`**: the dishes and prices are a DRAFT. Replace them with the real menu.
3. **`mapQuery`** in `config.js`: check that the embedded map lands on the right Google Maps pin.

## Structure
- `index.html`: all sections (Home, About, Menu, Gallery, Reservations, Contact)
- `assets/css/style.css`: styles
- `assets/js/main.js`: nav, animations, menu tabs, lightbox, reservation form → WhatsApp
- `assets/img/`: optimized photos and logo
