# RSS PWA

A PWA RSS feed reader WIP / PWA exercise with an app shell, and offline content support.

## What Is It?

The application consists of a HTML file in public/index.html which contains HTML app shell, custom elements with HTML Templates and Shadow DOM implementation along with the code to parse XML RSS items into accordion components. Also the code to install the Service Worker in public/sw.js.

In addition to the static files there is also a very simple Express server in server.js and rss.js which runs a HTTP server to serve the HTML, and a proxy to perform the cross-origin request for RSS feed XML documents.

## Subscription Management

Subscriptions are managed via Local Storage. Subscriptions can be added by invoking the "+" affordance at the top right, and entering a URL for a RSS feed in the dialog box, and using the "Add" button. The specified feed will automatically be loaded.

## How To Run

Just use Node to run the server.js file, and it will run on 8080.

```$ npm run serve```

