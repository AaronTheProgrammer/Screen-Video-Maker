Follow the steps of this link to make an electron forge app:

https://www.freecodecamp.org/news/how-to-easily-build-desktop-apps-with-html-css-and-javascript-d3e3f03f95a5/

In case that link gets taken down, follow these steps:

npm install -g electron-forge (if you haven't already installed it)
electron-forge init <whatever your app name is>
cd to that directory
make your app

You may have to run npm install electron-compile
You may also have to run npm install electron-squirrel-startup
In your package.json, change "packageManager: yarn" to "packageManager: npm" (or to whatever package manager you're using)

npm run package (there are also options for packaging for another platform, default packages for platform you're working on)
npm run package -- --platform=<platform> arch=<architecture> 
(this is how you do it for another platform besides the one you're working on)

Example: npm run package -- --platform=linux --arch=x64 (this would package it for linux)

An application file is produced in a newly created 'out' folder in the root directory of your app.

These are the types of apps that need to be installed, so you can't run it with just the executable alone. 
You need the whole project folder.

In order to create a make file or an installer for the application, use the following command:

npm run make

The out/make folder will have a Windows installer for the desktop application.

When you run this command without any parameters, by default it creates the installer for the platform which you are using for development.
