var express = require('express');
var bodyParser = require('body-parser');
var routes = require("./routes/routes.js");
const checkAPIkey = require('./middlewares/checkapikey.js')
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(checkAPIkey);

routes(app);

console.log('New App');

var server = app.listen(3000, function () {
    console.log("app running on port.", server.address().port);
});