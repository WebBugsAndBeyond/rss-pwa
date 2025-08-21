# RSS PWA

A PWA RSS feed reader WIP / PWA exercise with an app shell, and offline content support.

## What Is It?

The application consists of a HTML file in public/index.html which contains HTML app shell, custom elements with HTML Templates and Shadow DOM implementation along with the code to parse XML RSS items into accordion components. Also the code to install the Service Worker in public/sw.js.

In addition to the static files there is also a very simple Express server in server.js and rss.js which runs a HTTP server to serve the HTML, and a proxy to perform the cross-origin request for RSS feed XML documents.

At this time as this is being spiked out there is only support for a single hard-coded RSS feed for [Marijuana Moment&apos;s](https://www.marijuanamoment.net/) [RSS feed](https://www.marijuanamoment.net/feed/). 

More will come...

## How To Run

Just use Node to run the server.js file, and it will run on 8080.

```$ node server.js```

