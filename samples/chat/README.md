nCombo App
======

This is the nCombo app directory - All source files and assets for your app should be placed in this directory or in one of the following subdirectories:

- assets: To hold client-side static assets such as images, graphics an other media used within your application. You may alternatively prefer to place such files under the styles/ directory if they are being referenced within your app's CSS.
- files: Default directory where files uploaded using the default ncombo/fileuploader module are placed.
- libs: Should contain JavaScript libraries for use within your app. Unlike scripts, libs are loaded directly into the global namespace - They should be used sparingly and in a controlled manner to avoid name clashes.
- node_modules: For Node.js modules and other general purpose CommonJS modules - These can be used on both the client or server side.
- scripts: Holds client-side CommonJS scripts for use within your application. The index.js file is the entry point of the application and will be executed as soon as your app has finished loading its bundled scripts, styles, assets and modules.
- sims: This is where your Server Interface Modules (SIMs) should be defined (preferably with a .node.js extension).
- styles: For holding CSS files and associated assets.

Under each of these directories, you can setup any subdirectory structure you want.
For scripts, a .js extension implies that the script is public while a .node.js extension signifies that this file is private and should never be served to the client-side (only for server-side use).