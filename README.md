nCombo
======

nCombo is an Open Source Node.js framework that allows you to easily build powerful, data-driven Rich Internet Applications (RIAs).
nCombo is distributed under the MIT license. Please see license_mit.txt for details. Please visit http://ncombo.com for more information.

To install, run:
npm install -g ncombo

nCombo offers several ground-breaking features:

- It's fast
- It lets you program in a single language (JavaScript)
- Full duplex client-server communication (thanks to socket.io)
- Server interfaces are simple Node.js modules which can be called from your client-side JavaScript - Unlike traditional functions, functions defined in server interfaces can return multiple times from a single call (thus they can act as a stream of data).
- nCombo offers a simple webservice module which allows you to interact with other nCombo applications' server interfaces (including securely over the WSS protocol) - Effectively various nCombo applications can be hooked into one another to easily exchange data without having to consider the underlying protocols.
- nCombo allows your client-side scripts to listen to server-side events. (Using the webservice module, you can also listen to events which occur on remote nCombo apps - If they allow you).
- Makes efficient use of caching (in release mode) to improve the user experience when accessing an application multiple times.
- A Session object which uniquely identifies each client is appended to all requests. The session object can be manipulated to store data unique to each client.
- A Global object can be used to store data that can be shared between all clients - It also gives you access to all connected clients and lets you selectively exchange data between them.
- While in release mode, an error in your server-interface code will not bring down the whole server.
- nCombo comes with all the standard middleware for session management, routing and the like. nCombo lets you add custom middleware to do tasks such as user authorization (such as controlling who has access to a file or server interface or who can listen to specific server events). Middleware comes in several varieties; 'localCall', 'remoteCall', 'localEvent' and 'remoteEvent' each one allows you to filter requests relating to specific types of actions.
- nCombo makes use of all available CPU cores for maximum efficiency and concurrency.
- nCombo comes with default upload middleware and offers Valumn's uploader client-side. Creating an upload feature only takes a few lines of code.