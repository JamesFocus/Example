# Knuckles Showcase Shop

A responsive Node.js + Express showcase with an artist introduction, product cards (name, price, weight, artist/design description), cart, buyer details, and owner contact/payment hand-off.

## Run locally
1. Install Node.js 18 or newer.
2. In this folder run `npm install`.
3. Run `npm start`.
4. Open `http://localhost:3000`.

## Customize before publishing
Open `public/app.js` and replace the demo owner contact details (`LINE_ID`, phone, email, and social URLs), and edit the sample products and artist biography. Product names, prices, weights, and artist text are placeholders because final catalogue details were not supplied.

## Ordering and payment notes
This starter saves order enquiries to `orders.json` on the server. It does not collect or store card details, verify payments, or automatically message the owner. Customers choose a preferred contact/payment route and then contact the owner to confirm. For real payments, integrate a supported payment provider on the server and verify provider webhooks before marking orders paid. For production deployment, use a database and protect order/customer information; local JSON storage is for a simple starter only.
