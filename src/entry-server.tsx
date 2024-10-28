import { createHandler, StartServer } from "@solidjs/start/server";

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta
            name="description"
            content="Join our international coding community for programming help and discussions. Features support for multiple languages including JavaScript, Python, Java, C++, and more. Active community with experienced developers."
          />
          <meta
            name="keywords"
            content="programming, coding, software development, JavaScript, Python, Java, C++, coding community, programming help"
          />

          {/* Open Graph tags for social media sharing */}
          <meta
            property="og:title"
            content="Coding Community - Programming & Software Development"
          />
          <meta
            property="og:description"
            content="Join our thriving coding community with 6,500+ members. Get help from experienced developers, share projects, and participate in coding events."
          />
          <meta property="og:type" content="website" />

          {/* Twitter Card tags */}
          <meta name="twitter:card" content="summary" />
          <meta
            name="twitter:title"
            content="Coding Community - Programming & Software Development"
          />
          <meta
            name="twitter:description"
            content="International coding community offering programming help, project collaboration, and tech discussions. Perfect for beginners and professionals."
          />

          <link rel="icon" href="/favicon.ico" />
          {assets}
        </head>
        <body>
          <div id="app">{children}</div>
          {scripts}
        </body>
      </html>
    )}
  />
));
