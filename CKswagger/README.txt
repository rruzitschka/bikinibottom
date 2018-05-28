REMARK:
This node app uses swagger to describe RESTful API in YAML.

Modify the Interface:
---------------------
install swagger if not done yet:
$ npm install -g swagger 
run node from commandline: 
$ swagger project edit
open browser for URL: http://127.0.0.1:59010/#/edit

Run the App:
------------
change directory to the app folder:
$ cd /...yourfolder...

Start the node app in one of the following ways from the commandline:
1) Use Swagger
  install swagger if not done yet: 
  $ npm install -g swagger 
  run app via swagger
  $ swagger project start

2) Via node command
  $ npm install
  $ node app.js
