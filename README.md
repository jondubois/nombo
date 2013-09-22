Nombo
======

Nombo is an Open Source Node.js framework that allows you to easily build powerful, rich cloud applications.
Nombo is distributed under the MIT license. Please see license_mit.txt for details. Visit http://nombo.io for more information.

To install, run:

```bash
npm install -g nombo
```

Once installation is complete, to create a new app in the current directory run (replace myapp with your app's name):

```bash
nombo create myapp
```

To create a 'nombo-samples/' directory containing sample apps use:

```bash
nombo samples
```

Nombo offers several ground-breaking features:

- It's efficient with server resources
- It dramatically reduces development time
- It lets you program in a single language (JavaScript)
- Full duplex client-server communication (thanks to socket.io)
- Allows you to call server-side functions from your client-side scripts
- Offers a simple webservice module which allows you to seamlessly interact with other Nombo applications
- Allows your client-side scripts to listen to server-side events. (You can also listen to events which occur on remote Nombo servers - If they allow you of course)
- Makes efficient use of caching (in release mode) - Restarting an Nombo server causes browsers to refresh their cache - So clients stay up to date
- A Session object which uniquely identifies each client is appended to all requests - The session object can be manipulated to store data unique to each client
- Session state is maintained accross all open tabs within a browser
- A Global object can be used to store data that can be shared between all clients - It also gives you access to all connected clients and lets you selectively exchange data between them
- Comes with all the standard middleware for session management, routing and the like - Nombo lets you add custom middleware to do tasks such as user authorization (such as controlling who has access to a file or server interface or who can listen to specific server events)
- Makes use of all available CPU cores for maximum efficiency and concurrency (or you can optionally specify the number of workers to use)
- Comes with default upload middleware and offers Valumn's uploader client-side - Creating an upload feature only takes a few lines of code