# NOVA — Modern E-Commerce Frontend

A responsive storefront demo built with HTML, CSS, and vanilla JavaScript.

## Run it
1. Extract the ZIP.
2. Open `index.html` in a browser, or serve the folder with VS Code Live Server.
3. An internet connection is used for Google Fonts, Lucide icons, and Unsplash product photography.

## Included
- Responsive home page, navigation, categories, product grid, search, filters, and sorting
- Interactive cart drawer with quantity controls and subtotal
- Wishlist toggle (temporary browser-session state)
- Demo account creation and login with a saved browser profile
- Checkout form and demo order confirmation/tracking timeline
- Newsletter form interaction
- Mobile navigation and back-to-top button

## Important limitations
This is a frontend prototype. Account creation and login are a **local demo**: profiles and password-derived hashes are saved in the current browser and are not sent to a server. They can be cleared with the browser's site-data controls and are not secure authentication. Use only a made-up password; do not enter real customer or payment details. The demo does **not** persist orders to a database, send emails, process payments, or provide live courier tracking.

For a real store, replace the local demo with a backend that securely hashes passwords, validates inputs, rate-limits authentication attempts, and manages server-side sessions over HTTPS. Connect an email service, payment provider, and shipping/tracking API as needed.

## Project structure
- `index.html` — page structure
- `css/style.css` — visual design and responsive styling
- `js/script.js` — demo product data and interactions
