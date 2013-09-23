Nombo
======

Nombo is an Open Source Node.js framework that allows you to easily build highly scalable, rich cloud applications.
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

The key focus of Nombo is scalability. 
A Nombo server is made up of multiple processes which run in parallel to efficiently deliver your app to users.
You can specify the number of load balancers, workers and stores you want to use and Nombo will automatically spawn and manage everything.
Processes are highly parallel so they share very few resources - The more CPU cores you have have, the faster Nombo will run.

Some other key features include:

- Allows you to call server-side JavaScript functions from your client-side scripts.
- Allows your client-side scripts to listen to server-side events. (You can also listen to events which occur on remote Nombo servers - If they authorize you).
- Allows you to seamlessly interface with remote Nombo servers using the nombo/webservice module (a single function call is needed).
- Makes efficient use of caching (in release mode) - Allows you to set a cache version so that clients will be forced to update the next time they refresh.
- Session state is synchronized across all open tabs within a browser.
- Comes with all the standard middleware for session management, routing and the like - Nombo lets you add custom middleware to do tasks such as user authorization.