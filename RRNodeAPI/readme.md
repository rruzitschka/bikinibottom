This is a Proof of Concept NodeJS application using express. It access the sample asset metadata hosted in our Elastic Search instance.

Starting app.js will start the web server listening on port 3000.

So point your browser to http://localhost:3000/

It implements a sample RESTful API supporting the following requests:

GET /v1/assets?q=searchtext

Response is a JSON document, response is limited to 10 hits currently (default ElasticSearch setting)

GET /v1/assets/id

where id is a asset GUID

Response is the metadata document for the asset with the specific GUID

GET /v1/assets/synopsis?lan=en&length=(short, medium, long)

Response is the synopsis of the specified length (either short, medium or long) in the language specified in the parameter lan.

Parameters are optional, if not specified the server uses te default values lan=en and length=short.

