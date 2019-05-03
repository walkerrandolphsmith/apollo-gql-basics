# Table of Contents

- [Getting Started](#getting-started)
- [Dev Setup](#dev-setup)
  - [Environment variables](#environment-variables)
- [Services Overview](#services-overview)
- [Testing](#testing)
- [Know How](#know-how)
  - [Docker](#docker)
  - [Infastructure](#infastructure)
  - [Web Security](#web-security)
  - [NGNIX](#ngnix)
  - [HTTP/2](#http/2)
  - [Server Side Rendering (SSR)](#server-side-rendering)
  - [Progressive Web App (PWA)](#progressive-web-app)
  - [Search Engine Optimization](#search-engine-optimization)
  - [i18n](#i18n)
  - [GraphQL](#graphql)
  - [Node Package Manager](#node-package-manager)
  - [Testing](#testing)
  - [Webpack](#webpack)

# Getting Started

This repo contains several services that may be built on various runtimes, connect to many types of databases, and have complex networking configurations. In order to minize variance in local development we will use Docker. So first, please install the [Docker for Mac][], [Docker for Windows][], or [Docker Toolbox][].

```
chmod +x ./scripts/ctl.sh

./scripts/services/ctl.sh bootstrap

./scripts/services/ctl.sh up dev
```

Now the following urls are available

| URL                     |        Purpose |
| ----------------------- | -------------: |
| `https://localhost`     |             UI |
| `https://db.localhost`  | MONGO ADMIN UI |
| `https://api.localhost` |       GRAPHIQL |

[docker for mac]: https://docs.docker.com/docker-for-mac/
[docker for windows]: https://docs.docker.com/docker-for-windows/
[docker toolbox]: https://docs.docker.com/toolbox/overview/

# Dev Setup

If you plan to use Chrome then enable to chrome flag `--allow-insecure-localhost` at the following uri which can't be opened as a link on this page.

```
chrome://flags/#allow-insecure-localhost
```

---

The `./scripts/ctl.sh` script is the developers entry point to working with the various services.

`./scripts/ctl.sh <command> <environment> <...services>`

Commands:

- install
- uninstall
- up
- down

Enviornments:

- dev
- prod
- unit

Services:

- app
- api
- server
- db

```
./scripts/ctl.sh up dev
./scripts/ctl.sh up prod

./scripts/ctl.sh down dev

./scripts/ctl.sh install dev app
./scripts/ctl.sh install prod app api db

./scripts/ctl.sh uninstall dev
```

## Environment variables

In order for the services to run you must provide `.env` files for a specific environment that contains configrations and secrets the application requires. We will not include the `.env` files in the repository beacuse they contain secrets we don't want compromised via git history. Therefore the files will be ignored from git using the `.gitignore` file.

Each environment will have its own `.env` file with the shorthand name appended at the end of the file. For example development, also known as dev will require a `.env.dev` file with development environment specific configration and secrets. Each envrionment may require different values. As an example we don't want to connect to a production instance of a hosted service in testing and potentially add "bad data" to production.

```yaml
# Example of .env.dev
NODE_ENV=development

# Build and Monitoring
VERSION=1.0.0
STAGE=local

# Api server

JWT_SECRET=XXXXXXXXXXXXXXXXXX
API_PORT=8080
API_HOST=api

# Web server

PUBLIC_URL=localhost
APP_PORT=3000
APP_HOST=app

# Database

# Secrets
APOLLO_ENGINE_APIKEY=service:friends:XXXX
MAILGUN_APIKEY=XXXXXXXXXXXXXXXXXX
MAILGUN_DOMAIN=XXXXXXXXXXXXXXXXXX
S3_APIKEY=XXXXXXXXXXXXXXXXXX
S3_SECRET=XXXXXXXXXXXXXXXXXX
```

# Services Overview

## Server

Service is a ngnix proxy that routes traffic to the api server and web server.

```
server
|── ngnix.dev.conf
|── ngnix.prod.conf
```

Alpine linux distro does not ship with openssl which is required for generating our self signed certs on localhost. [openssl on alpine](https://github.com/gliderlabs/docker-alpine/issues/274). For production ssl certs can obtained by using [lets encrypt](https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-16-04)

## API

Service is GraphQL server to serve data for several clients.

```
api
|── src/                # source code
    |── loaders/        # data retrieval optomizations
    |── localizations/  # error message localizations
    |── mailer/         # email service
    |── models/         # database models
    |── resolvers/      # graphql resolvers
    |── roles/          # user roles
    |── schema/         # graphql schema
    |── subscription/   # graphql subscription
    |── validators/     # predicates isEmpty, isEmail, etc
|── test/               # test setup
|── package.json        # manifest
```

The api leverages node-canvas in order to render certain graphics via canvas. This requires the operating system to have certain libraries installed in order for node.js to properly build the node-canvas. [node-canvas deps](https://github.com/substack/browser-badge/issues/7) lists the dependencies and [node-canvas alpine](https://github.com/Automattic/node-canvas/issues/866) covers that list on the alpine linux distro

### Getting started with the API

```
mutation signUp {
  signUp(username:"username", password:"password", email: "email.com") {
    token
  }
}

mutation signIn {
  signIn(login:"username", password:"password") {
    token
  }
}

mutation reply {
  createMessage(text:"walker") {
    text
    author {
      username
    }
  }
}

{
  "x-token": "login response"
}
```

## WEB

Service is a web server that handles the "front end" of the stack.

```
app
|── config/                             # webpack
|── scripts/                            # build, test scripts
|── src/                                # source code
    |── assets/                         # static resources
    |── client                          # code run in browswer
        |── index.js                    # entrypoint in browser
        |── registerServiceWorker.js    # service-worker
    |── server                          # code run on server
        |── index.js                    # entrypoint
        |── devMiddleware.js            # webpack dev middleware + hmr
        |── render.js                   # sever side render
    |── shared                          # code shared across client and server
        |── components/                 # React components
        |── constants/                  #
        |── utils/                      # utilities
|── test/                               # test setup
|── babel.config.json                   # babel config
|── package.json                        # manifest
```

```
src/shared/components/MyComponent
|── index.js                     # public members
|── MyComponent.component.js     ⚛️ component to render with data
|── MyComponent.spec.js          🔬 optional unit tests
|── MyComponent.connector.js     🖇️ optional contianer that injects data
|── MyComponent.loading.js       ⏳ optional component to render whilst loading
|── MyComponent.error.js         ⚠️ optional component to render on error
|── MyComponent.query.js         📭 optional gql query
|── MyComponent.mutation.js      ✏️ optional gql mutation
|── MyComponent.subscription.js  📦 optional gql subscription
|── MyComponent.tracking.js      🔖 optional analytics tracking
|── MyComponent.loc.js           🌐 optional localizations
|── MyComponent.styles.css       💅🏽 optional styles
```

## Testing

Test files should use the `*.spec.js` file pattern. In order to maintain confidence in releasing

Run unit tests

```
./scripts/ctl.sh up unit <service>
```

# Know How

## Docker

Docker is a technology used to recreate an environment in a reliable and resource cheap way. We use docker to encapsulate the requirements each service demands such as operating system, system libraries, runtimes like Node or Go, script privileges, environment variables, etc. In addition to encapsulating single environments we will use docker compose (for now) to describe how each service interacts and depends on other services such as networking, health checks, and environment variable injection. Read these [guides](https://runnable.com/docker/) to get a lay of the land.

#### Dockerfile

```yaml
# extend an image called node
# tagged with 10-alpine
FROM node:10-alpine

# install deps using
# apk package manager
RUN apk update && apk add --no-cache \
    make gcc g++ python \
    git \
    build-base \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    freetype-dev \
    giflib-dev

# create a directory
WORKDIR /usr/src/api

# from host machine
COPY ./services/api/package-lock.json ./services/api/package.json ./

# install deps
# using npm (not on host)
RUN npm install --no-progress --ignore-optional --silent

# Remove deps only needed for building
RUN apk del make gcc g++ python

# Define a script to be run
# when container is started from image
CMD ["npm", "run", "start"]
```

The previous example is a declaration of how to configure an image. Ever line excluding the last will be run at build time and happens in "layers" that can be cached. Caching layers enables faster rebuilds when parts of the dockerfile changes and previous layers don't. The last line defines a command to be run when a container is "started". The `CMD` command can be used in concert with and `ENTRYPOINT` as described here [entrypoint vs cmd](https://www.ctl.io/developers/blog/post/dockerfile-entrypoint-vs-cmd/).

#### ENTRYPOINT and CMD

```
FROM node:10-alpine
ENTRYPOINT ["/bin/ping", "-c", "3"]
CMD ["localhost"]
```

`ENTRYPOINT` tells what script to run when a container is started and `CMD` can be used to define a default paramter to the entrypoint script which can be overriden in the run command
`docker run image-name ping domain.com`

[Basic commands](https://www.digitalocean.com/community/tutorials/how-to-remove-docker-images-containers-and-volumes#purging-all-unused-or-dangling-images,-containers,-volumes,-and-networks) for managing of images, containers, and volumes. `./scripts/images` and `./scripts/containers` may overlap a bit. Listing running and dead containers, removing them, and "remoting into" a running container are coverd. To clean up all resources that are not dangling, i.e. associated with a running container, you can run a single command

```
docker system prune
```

#### Docker Compose

Compose can help orchastate many containers and define relationships between them such as networking, volumes, exposed ports, environemet variables, and startup commands. The following docker-compose file demostartes a single ngnix server that proxies request to a web server and api server backed by a database server.

```yaml
version: '3.3'

networks:
  ? webnet
  ? internalnet

volumes:
  ? data-db

services:
  server:
    build:
      context: ../.
      dockerfile: services/server/config/docker/Dockerfile.dev
    image: server-image-dev
    volumes:
      - ./../services/server/config/nginx.dev.conf:/etc/nginx/nginx.conf
    ports:
      - '80:80'
      - '443:443'
    networks:
      - webnet

  app:
    build:
      context: ../.
      dockerfile: services/app/config/docker/Dockerfile.dev
    image: app-image-dev
    env_file: ./../env/.env.dev
    volumes:
      - ./../services/app/src:/usr/src/app/src
    ports:
      - '3000'
    networks:
      - webnet
    command: [npm, run, start]

  api:
    build:
      context: ../.
      dockerfile: services/api/config/docker/Dockerfile.dev
    image: api-image-dev
    env_file: ./../env/.env.dev
    volumes:
      - ./../services/api/src:/usr/src/api/src
    ports:
      - '8080'
    networks:
      - internalnet
      - webnet
    command: [npm, run, start]

   db:
    image: mongo:3.6-jessie
    container_name: db-container-dev
    env_file: ./../config/env/.env.dev
    networks:
      - internalnet
    volumes:
      - ./db-notes-mongo:/data/db
      - ./mongod.conf:/etc/mongod.conf
    command: mongod --config /etc/mongod.conf
```

By putting the ngnix proxy, web server and api server on the same network, `webnet`, they are able to commnicate with one another. Docker will update the `/etc/host` file of each container to point the service name to the corresponding ip address the container is assigned. The ngnix server exposes ports `80` and `443` to the host machine, while the api server only internally opens port `8080`.

The `data-db` volume is used to persist data stored in the db container to the host machine, while the volumes key in the server service defines a mapping from the host machine to the container.

Environement variables in `.env.dev` are injected into various services to multiplex their behavior on enironemnt specfic configuration.

When building the container from a dockerfile using the `build` key you can provide a `context` that is the working directory when running the dockerfile. The `dockerfile` key specifies the location on disk of the dockerfile.

#### Exit Codes

When running the unit tests for a service within a docker container we want a failure of the tests to result in a failure in the container. When CI runs a container that internally runs unit tests, failing tests will not cause the container to "fail" and therefore it will not be recongnized by CI as an faiure... However we can inherit exit code of test script with [--exit-code-from](https://docs.docker.com/compose/reference/up/). We leverage this to run e2e tests as well as unit tests.
In the case of unit tests we run docker-compose to run unit tests in all services at once and [aggregate exit codes](https://stackoverflow.com/questions/29568352/using-docker-compose-with-ci-how-to-deal-with-exit-codes-and-daemonized-linked/33291554) across all services. By `AND`ing the exit we can check for the failure of any service and fail a build.

#### Security

Don't run containers as a [root user](https://medium.com/@mccode/processes-in-containers-should-not-run-as-root-2feae3f0df3b) and instead create a low-priveldged user in the docker image to run the process in order to limit and protect resources on the container. We'll try to cover our bases end to end in our technology stack from evil doers.

## Infrastructure

#### Continous Integration

To ensure quality and mitigate risk we have a checklist for building images.
It is unclear what CI tool we will use long term, however jenkins is popular and here are [10 best practices](https://www.cloudbees.com/blog/top-10-best-practices-jenkins-pipeline-plugin)

#### Emphemarl Envs

[Ephemeral environments](http://enterprisedevops.org/article/ephemeral-environment-why-what-how-and-where) can help spin up and tear down entire environments for deploying instances only for testing purposes or short term reasons. This elimintates the need to wait for an environemnt to be "open" and "clobbering" someone else's environment in addition to only using resources when needed as ooposed to a long term dedicated environment.

#### Secrets Management

Managing secrets required by services or the infastructure that builds and deploys services is a suprisingly hard problem with [many](https://gist.github.com/maxvt/bb49a6c7243163b8120625fc8ae3f3cd) options. Regardless of which tool is used to securely store our secrets we need to keep some things in mind to reduce injury. [Don't store secrets in docker images](https://medium.com/@mccode?source=post_header_lockup). Inject secrets at runtime of the container to ensure the image or cached layers of the image don't leak the secrets to evil doers. Even more simple - Don't store secrets in plain text on your development machine, the git repository, or on physical mediums.

## Web Security

#### Content Secutiry Policy [CSP](https://scotthelme.co.uk/content-security-policy-an-introduction/)

defines approved sources of content that the browser may load.

#### HTTP Public Key Pinning [HPKP](https://scotthelme.co.uk/hpkp-http-public-key-pinning/)

It allows a host to provide information to a user agent about which cryptographic identities it should accept from the host in the future.

#### HTTP Strict Transport Security [HSTS](https://scotthelme.co.uk/hsts-the-missing-link-in-tls/)

A policy mechanism that allows a web server to enforce the use of TLS in a compliant User Agent (UA), such as a web browser

#### Cross Site Request Forgery [XSRF](https://scotthelme.co.uk/csrf-protection-in-framework/)

A broswer can be tricked into acting as if the user if authorized to act on domain A from a request made from domain B if a cookie exists for domain A from a previous authentication to domain A. Since cookies historically have been domain independent a malious actor could forge a request to a different domain and take advantage of cookies used for other domains.

#### Cross site scripting [XSS](<https://www.owasp.org/index.php/Cross-site_Scripting_(XSS)>)

Script injection that happens typically when user input is not sanitized. When a web application dynamically includes content from an untrusted source then the script can execute as if it is trusted.

#### Cookies

- HttpOnly: instructs the browser to prevent client side script from accessing the cookie
- Secure: instructs the browser that the cookie must only ever be sent over a secure connection
- [SameSite](https://tools.ietf.org/html/draft-west-first-party-cookies-07) in draft

#### JSON Web Tokens JWT

Stateless user authentication mechanism used to sign data about a user on the server with a private key and present a public token to the client. Subsequent requests made with the public token from a client can be unsigned on the server using the private key to authenticate the request. Expiration is baked into the JWT allowing the tokens to naturally expire after a certain period of time. Storing the jwt token on the client presents options. LocalStorage/Session Storage or Cookies?

Local storage is developer friendly way to store the jwt isolated per-domain which can prevent csurf attacks, however given scripts have access to local storage we become open to XSS attacks which an only be prevented by closing all secruity holes, known and unknown. Ouch seems risky...

Cookie storage can be made inaccessible to read from and write to by client scripts using the `HttpOnly` flag preventing most or all XSS attacks, however Cookies are not isolated per domain which exposes use to classic csurf attacks. Smh... Handling csurf token passing via a `X-XSRF-TOKEN` HTTP Header to prevent the csurf attacks can make your web server stateful, somewhat negating the properties of jwt being stateless. We can't rely on the `Same-Site` Cookies just yet since it requires support by broswers.

Also note that when distributing the public jwt it authenticates the request as long as the private key remains constant and therefore the public token is not revocable without also revoking every other token in existence. Unlike a stateful access token stored in the database for each user which can be marked as expired or revoked for a specific user. Therefore we may want to let the jwt act soley as a authentication mechanism and defer authorization a token we store in the jwt. Tokens in tokens and turtles all the way down.

TLDR; JWTs can be used as powerful storage of arbitrirary user data that naturally expires and can inlcude an access token in order to defer authorization, enable revocation, while losing its stateless nature.

## NGNIX

Location blocks in the server config has a specific matching syntax that is overviewed here: [matching location blocks][]

#### Security

Here is a [gist](https://gist.github.com/plentz/6737338) with helpful security tips.

Although in the security section we saw how HSTS can help the broswer force the usage of https, until that is implemented in our stack we can use ngnix to [redirect http -> https][]

In local development we will use [self signed cert for localhost][] and in production we will leverage [lets encrypt][]

#### Performance

[gzip](http://nginx.org/en/docs/http/ngx_http_gzip_module.html) module for text compression of various mime types. This improves performance by reducing data transfer over the network to serve scripts, styles, images, and more. We can compare this to the [brotli](https://scotthelme.co.uk/brotli-compression/) compression algorithm, but for now :shrug:

[redirect http -> https]: https://serversforhackers.com/c/redirect-http-to-https-nginx
[matching location blocks]: https://www.digitalocean.com/community/tutorials/understanding-nginx-server-and-location-block-selection-algorithms#matching-location-blocks
[self signed cert for localhost]: https://www.digitalocean.com/community/tutorials/how-to-create-an-ssl-certificate-on-nginx-for-ubuntu-14-04
[lets encrypt]: https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-16-04

## HTTP2

HTTP/2 is the successor of HTTP/1.1 and provides several benefits to web application performance.

- All HTTP requests are made in parallel using the same TCP connection.
- HTTP Headers are compressed
- Servers can "push" without a client request

Please note that most major browsers only accept HTTP/2 over HTTPS!

## Server Side Rendering (SSR)

Server Side Rendering is a technique that allows using the same code run on the client to render static HTML on the server. This can provide advantages for search engine optomization since web crawlers will load the site wihtout having to enable javascript.

When using webpack to handle css imports we must ensure they are [ignored][] when run on the server since the Node.js runtime does natively understand css.

[react router][] is a client side routing library we can use to manage routes in a React application. However it can also be used with SSR and load only the data needed for a specifc route when building static HTML.

[helmet][] is a React library that can help manage the `<head>` element of the server rendered HTML page. Declaritevly manage a page's title, description, and various other tags.

[react loadable][], [code splitting][], and ssr, oh boy...
Code splitting is a technique to lazy load parts of your application so you don't serve a giant bundle of javscript to the client. This becomes tricky to accomplish in concert with ssr and heres why:
React can render synchronously on the server, however do the same on the client all chunks of required code must have been loaded. Which chunks need to be loaded is less clear when you consider different routes need different components to render in addition to authed vs unauthed requests. there are two outcomes. A) Sychronous render followed by client loading only a sub set of chucks and asynchronously loading more chunks as the application requires them -- however the checksums of the server rendered markup and client rendered markup will not match, forcing a unnessecary, additional render on the client.
B) Scynchronously render on the server, and send all the chunks down to the client for the initial render, which is suboptimal because loading all the javascript for every situation up front is a huge performance hit.

We need a way for the client to **only** recieve the chunks needed for the initial render. [react loadable][] allows for the server to skip the "loading" phase and syncrhonously render on the server while keeping track of the required module ids. [webpack flush chunks][] lets you use those module ids in combination with webpack stats to determine which chunks are needed for the module ids. This includes javascript, styles, and source maps!

When running the web server [in development within a docker](https://blog.bam.tech/developper-news/dockerize-your-app-and-keep-hot-reloading) container we need to not only expose our web server, but the present connection made to the webpack dev middleware that hot reloads the application on changes.

#### Possible Issues

[react content loader][] has some issues with computing the correct svg styles when using ssr described in [this issue](https://github.com/danilowoz/react-content-loader/issues/78)

Libraries that use inline styles that attempt to generate vendor prefixes may not know the user agent on the server and include several unneeded vendor prefix causes the server and client check sums to not match.

[react content loader]: https://github.com/danilowoz/react-content-loader
[react router]: https://github.com/ReactTraining/react-router/tree/master/packages/react-router
[react loadable]: https://github.com/jamiebuilds/react-loadable
[webpack flush chunks]: https://medium.com/faceyspacey/code-cracked-for-code-splitting-ssr-in-reactlandia-react-loadable-webpack-flush-chunks-and-1a6b0112a8b8
[helmet]: https://github.com/nfl/react-helmet
[ignored]: https://github.com/bkonkle/ignore-styles
[code splitting]: https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#code-splitting

## Progressive Web App (PWA)

Progressive web apps adhere to a few guidelines to ensure your application performs in a reliable, fast, and engaging way. Reliable applications are secure and work in any network condition whether its a slow 3G connection or no internet connection at all. Fast sites load in under 3 seconds and do not block the user interaction when navigating routes.
Engaging apps can be installed on a homescreen, have immersive full screen expereinces, and enable push notifications.

Here is a short checklist to "be" a PWA

1. Served over HTTPS
1. Responsive design and mobile first
1. Offline first and network resilience for all urls
1. Site informs when offline using [network info api][]
1. Near Native UX with home screen icon and splash screen
1. Fast loads even on 3G
1. Works cross browser
1. Network doesn't block user expereience when navigating routes
1. Each page has a url and is indexed by a web crawler
1. Schema.org data is provided
1. [Social metadata][] is provided
1. Uses appropriate canonical urls
1. Uses [history api][]
1. Content doesn't "jump" when loading

- Loads the optimal size of image for each device size and screen resolution
- Holds the image position while loading so your page doesn’t jump around as images load
- Uses the “blur-up” effect i.e. it loads a tiny version of the image to show while the full image is loading
- Alternatively provides a “traced placeholder” SVG of the image
- Lazy loads images, which reduces bandwidth and speeds the initial load time
- Uses WebP images, if browser supports the format

1. When focused inputs aren't covered by keyboards
1. Pages can be shared using [web share api][]
1. Push notifications

- Inform user how notifs will be used
- Non agreesive encouragemnet to enable push notifs
- Settings exist to manage notifs (turn them on/off)

1. Payments taken via [payments api][]

<div class="notice">
  <div class="content">
    Manifest.json and service-worker.js must be served from the root of the web server!
  </div>
</div>

#### Manifest.json

The manifest

A simple json file with metadata that tells the browser about your app. Describes how to act when installed on mobile device or desktop such as generating a splash screen, chaning the look and feel of the browser, colors to apply to the mobile device's toolbar and more.

```html
<link rel="manifest" href="/manifest.json">
```

```json
{
  "short_name": "Name",
  "name": "Long Name",
  "icons": [
    {
      "src": "/static/icons/favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    },
    {
      "src": "/static/icons/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/static/icons/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  // url of first page loaded
  "start_url": "/",
  // set of urls "in app"
  // used to determine if app has been left
  // absecene of scope defaults to dir where manifest served from
  "scope": "/maps/",
  // customize browser UI
  "display": "fullscreen | standalone | minimal-ui | browser",
  // toolbar color
  "theme_color": "#000000",
  // splash screen
  "background_color": "#ffffff",
  "orientation": "landscape"
}
```

#### Service Workers

Service workers have a lifecycle of **registration**, **installation** and **activation**.

- Push API
  Enables push services to send messages to a webapp, therefore your web server can send messages even when the webapp and/or browser is not running.

- Background Sync
  Deferring actions until the client has a stable internet connection.

[history api]: https://developer.mozilla.org/en-US/docs/Web/API/History_API
[web share api]: https://developers.google.com/web/updates/2016/09/navigator-share
[network info api]: https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API
[payments api]: https://developers.google.com/web/fundamentals/payments/
[skeleton page]: http://hannahatkin.com/skeleton-screens/
[social metadata]: https://developer.twitter.com/en/docs/tweets/optimize-with-cards/guides/getting-started

## Search Engine Optomization (SEO)

#### Robot.txt

Every domain should serve a robots.txt file at the root of the webserver.

```
http://www.domain.com/robots.txt
```

This allows web crawlers to index certain paths of your site.

**User agents** are a way internet browsers and search engines bots identify themselves to webservers

**Disallow** indicates to the web crawler to not crawl certain parts of the site

**Allow** indicates to the web craweler to crawl certain parts of the site.

**Sitemap** can point the web crawler to the sitemap.xml for your site.

```yaml
User-agent: *
Disallow: /hiddenRoute
Allow: /

User-agent: googlebot
Allow: /

# Last statements
Sitemap: http://www.domain.com/sitemap-index.xml
Sitemap: http://www.domain.com/sitemap-feature1.xml
Sitemap: http://www.domain.com/sitemap-feature2.xml
```

## i18n

Internationalization (sometimes shortened to "I18N, meaning "I - eighteen letters - N") is the process of planning and implementing products and services so that they can easily be adapted to specific local languages and cultures, a process called localization (sometimes shortened to "l10n", meaning "l - ten letters - n"); this last is the process of adapting a product or service to a particular language, culture, and desired local "look-and-feel".

#### Accept-Language

Our api should handle localizing repsonses and errors by accepting a language code provided by the requestor. In order to avoid impacting query caching we should not embed the language code in query parameters and post bodies. Instead we can use the [HTTP Accept-Language][] Header. [Language Tags][] is the mechanism a user can use to specify what language they perfer to receive response in and is applied to content intended to be read by a human as opposed to a computer. Our web servers written in Express can access this header using [acceptLanguages][] api. An example language tag:

```
en, en-US, en-cockney, i-cherokee, x-pig-latin
```

#### Best Practices

- Don't embed sentence strucutre into localization string
- Don't include text in images

```html
<!-- Include the language in the HTML document -->
<html lang="en">
  ...
</html>
```

Use the [directionality attribute][] to indicate the direction text is rendered.

```html
<!-- Include the direction HTML document -->
<html dir="rtl">
  ...
</html>
```

[react localization]: https://github.com/yahoo/react-intl
[http accept-language]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language
[language tags]: https://www.w3.org/Protocols/rfc2616/rfc2616-sec3.html#sec3.10
[acceptlanguages]: http://expressjs.com/en/api.html#req.acceptsLanguages
[directionality attribute]: https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/dir

## GraphQL

GraphQL is a specification used to declare data requirements over a network. We use a GraphQL client implemetation called Apollo. [GQL concepts][] is a glossary of terms related to Apollo and Graphql that is a great starting point. Schemas, Queries, Mutations, Subscriptions, Resolvers and more are covered.

We use GraphQL to enable querying for complex graphs of data from our backend while taking advantage of caching techniques. For example imagine a tradional REST api that retrives a list of users and a subsequent request made for a specific user you are chatting with. When the list and specifc user requests return differnt data how do we update the specific user in the list? How can we leverage cache and not make a full network request for the specif user if their information is availbe in the first request for the list of users? Apollo enables use to solve this issue in elegant ways.

In addition to cachibility graphql can enable complex graphs of data that may have required several HTTP reqeusts otherwise. Consider the following query for all users and the posts they have authored:

```gql
{
  users {
    name
    phone
    posts {
      timestamp
      text
      author {
        name
        phone
      }
    }
  }
}
```

[Batch queires][] can enable a client to merge several graphql queries into a single HTTP request. Since bandwith and network traffic is previous this can be advantageous.

[Persisted queries][] is a technique to statically determine all possbile queries that can be made at build time and associate them to unique keys. This allows a POST request with a complex query to be converted to a GET request by id saving tons of upload bits! Unfortunately it can not be used in concert with batched queries at the moment.

[Schema Stitching][] is the technique of creating a single GraphQL schema from multiple separate GraphQL apis. This allows us to break our services into smaller units and compose their apis together!

[Apollo link state][] can enable client side state to be managed within the Apollo store and accessed via GQL queries and changed with GQL mutations. This can allow the client application to address data needs in a single way regardless if its persisted to the backend or client only.

[schema stitching]: https://www.apollographql.com/docs/graphql-tools/schema-stitching.html
[batch queires]: https://blog.apollographql.com/batching-client-graphql-queries-a685f5bcd41b
[persisted queries]: https://www.apollographql.com/docs/engine/proxy/guides.html#automatic-persisted-queries
[gql concepts]: https://www.apollographql.com/docs/resources/graphql-glossary.html
[apollo link state]: https://www.apollographql.com/docs/link/links/state.html

## Node Package Manager (NPM)

For the services built with Node.js there will be a manifest called `package.json` in the main directory of the project that contains metadata for the Node Package Manager (NPM). Inside, it contains various metadata relevant to the project. An example `package.json` looks like this:

```json
{
  "name": "service name",
  "version": "1.0.0",
  "main": "src/main.js",
  "homepage": "./",
  "repository": {
    "type": "git",
    "url": "https://github.com/walkerrandolphsmith/friends.git"
  },
  "license": "ISC",
  "scripts": {
    "start": "./scripts/start.sh"
  },
  "dependencies": {
    "name": "version"
  },
  "devDependencies": {
    "name": "version"
  }
}
```

[This article](https://nodesource.com/blog/the-basics-of-package-json-in-node-js-and-npm/) is a great resource for learning more about these available fields in depth.

#### dependencies

The `dependencies` property is where external packages that are essential for your code to run in production are defined (e.g React and React-dom).

#### devDependencies

In contrast, `devDependencies` are generally packages needed for development, but not used in your main codebase.

Packages needed for building, testing, and making local development better are dev dependencies and not needed in production. Take nodemon or webpack dev compiler for example, both make local development faster however neither are required for a production build of a service.

For further reading, please see the [npm docs](https://docs.npmjs.com/files/package.json#dependencies).

#### Semantic Versioning

Semantic Versioning (or `SemVer`) is a set of rules that dictate how version numbers are incremented, in the form of `X.Y.Z` (or `Major.Minor.Patch`).

- MAJOR for incompatible changes
- MINOR for backwards-compatible functionality
- PATCH for backwards-compatible bug fixes

For example, if the current version of a package is 1.1.5 and the next version contains a simple bug fix that doesn't alter the core API, it would be considered a patch and thus bumped to version 1.1.6.

When it comes time to update your dependencies, this is very useful information, because at a glance you should then be able to tell if the updated version will break anything or if it can be integrated seamlessly.

When installing dependencies with `npm install react`, you'll notice that the dependency in package.json has a caret prefix: `^16.4.0`. The caret means that it will pull the latest _minor version_. This means that if you reinstall dependencies a year from now, and the newest version is 16.7.5, it'll grab that version. But if there's been a major version bump to 17.0.0, it'll stick with the latest 16.x.x release.

There are other symbols available corresponding to different ranges. The tilde will match the most recent minor version. For example, `~1.2.3` will match all 1.2.x versions but will not select 1.3.0 or higher. `>=` means any version more than or equal will satisfy. There are many more ranges available. For further reading, please visit the [NPM docs](https://docs.npmjs.com/misc/semver#advanced-range-syntax).

The `package-lock.json` file will be generated for you by default every time a dependency is initially installed (`npm install <dependency>`) or `npm install` is run. The file describes the exact dependency tree that was generated, and ensures that any following installs will generate identical trees, regardless of any range symbols.

## Testing

We use [mocha][] to write unit tests for services written in javascript. Consider the module mailer that sends emails. When testing the mailer service we will refer to it as the subect under test (sut). We may want to treat the sut as a black box and compare its output to expected results given various inputs. If the module interacts with other modules that are not subjects under test we may want to verify it collaborates with the other modules correctly by asserting it invokes the module's member with specified arguments or that perhaps it invokes the module's member the correct number of times.

```js
import { expect } from 'chai';

describe('Given an empty subject', done => {
  const subject = ''; // Empty

  describe('When sending an email', () => {
    const promise = sendEmail({
      from: 'sender',
      to: 'to',
      subject: subject,
      html: 'message',
    });
    it('then it should have an error', done => {
      promise
        .then(() => {
          done(new Error('message should not have been sent'));
        })
        .catch(err => {
          expect(err).to.exist;
          done();
        });
    });
  });
});
```

In the above `sendEmail` is the subject under test. We treat it as a black box and verify its ouput given an input of an empty subject line. A nuance of Mocha is tests that must run asynchronously must be proved a `done` callback and invoked when the verificaion has been made. If the `done` callback is never invoked the test will timeout and fail. Notice we use the format `given, when, then` to setup the inputs, invoke the subject under test, and then make an assertion with [chai][] about its output. We don't have to follow this structure religiously, however it can be helpful.

Notice in the previous code we never imported the subject under test. This is because `sendEmail` interacts with another module to actually send the email. We want to avoid sending a real email when running tests so we will mock out the functionality that the subject under test interacts with to send the email. We will use [babel-plugin-rewire][] to mock out dependencies that are known statically at build time with `import` statements. For other mocks, stubs, and spys we will use [sinon][].

```js
import { expect } from 'chai';
import { spy } from 'sinon';
import { buildMailer, __RewireAPI__ } from '.';

describe('./libs/mailer/index', () => {
    // mock the unit that acutally sends the email with sinon
    const sendSpy = spy((data, fn) => fn());

    function mailgun() {
      return {
        messages: () => ({
          send: sendSpy,
        }),
      };
    }

    // Mailgun is a module imported in the subject under test
    // Mocking it with sinon at run time is too late
    __RewireAPI__.__Rewire__('Mailgun', mailgun);

    // Now we have a module we can test without
    // actually depending on Mailgun library or
    // sending actual emails when called
    const { sendEmail } = buildMailer({});
```

Mocha is also used at a higher level of testing to ensure the api responds with the correct results. In these end to end tests we don't mock out network interface or latency which makes these tests a bit slower to run. Don't forget the `done` callback when end to end testing with Mocha.

## Module Bundling Webpack

Webpack is a module bundling tool. We can avoid managing the implicit order of `<script>` tags in an applicaiton by letting webpack determine how modules depend on one another and which ones need to be included.

#### Code Splitting

The technique of [splitting](https://hackernoon.com/the-100-correct-way-to-split-your-chunks-with-webpack-f8a9df5b7758) will enable the output of module bundling to be separated to for either enhanced caching or performance. For example if your vendor packages rarely change, but your core application code changes often we can "split" the vendor scripts into its own bundle of code so it can be cached by clients longer.
[split chunks plugin](https://wanago.io/2018/06/04/code-splitting-with-splitchunksplugin-in-webpack-4/) and [flush chunks plugin](https://medium.com/faceyspacey/code-cracked-for-code-splitting-ssr-in-reactlandia-react-loadable-webpack-flush-chunks-and-1a6b0112a8b8) can help implement code splitting. Leverage performance enhancements of the [preload and prefetch](https://wanago.io/2018/08/20/webpack-4-course-part-eight-dynamic-imports-with-prefetch-and-preload/) of dynamic imports to indicate a chunk will likely be needed in the future and should be idely downloaded in the background by the browser, or the later, indicating it will immediately be required and should be loaded in parallel to the parent chunck.

#### Hot Module Replacement HMR

Hot module replacement and webpack dev middleware are development tools that enable a persistent connection between the server and client so that changes made to the application code can be "pushed" to the client and replaced without the need of a reload of the browser. This is similar to live-reload but with even more advantages!

This article can help jumpstart your understand of webpack with a [vesrion 4 setup](https://hackernoon.com/a-tale-of-webpack-4-and-how-to-finally-configure-it-in-the-right-way-4e94c8e7e5c1).

#### Bundle Optimozations

Summon the Webpack sprits to get the perfect [bundle optomization](https://wanago.io/2018/07/30/webpack-4-course-part-five-built-in-optimization-for-production/) in combination with all the other configurations. Ever changing, ever difficult to get right...
