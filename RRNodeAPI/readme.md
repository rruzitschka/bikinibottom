This is a Proof of Concept NodeJS application using express. It access the sample asset metadata hosted in our Elastic Search instance.

Starting app.js will start the web server listening on port 3000.

So point your browser to http://localhost:3000/

It implements a sample RESTful API supporting the following requests:

GET /v1/assets?q=searchtext

Response is a JSON document, response is limited to 10 hits currently (default ElasticSearch setting)

GET /v1/assets/id

where id is a asset GUID

Response is the metadata document for the asset with the specific GUID

GET /v1/assets/id/synopsis?lang=en

Response is the synopsis JSON array that holds three different types of synopsis, distinguished by length (short, medium, long). The required language is specified in the parameter lang.

Parameters are optional, if not specified the server uses te default values lang=en.

GET /v1/assets/id/actors?lang=en

Response is the actors JSON arrray that holds the list of actors for the specified asset. The required language is specified in the parameter lang.

Parameters are optional, if not specified the server uses te default values lang=en.

GET /v1/assets/id/crew?lang=en

Response is the actors JSON arrray that holds the crew list for the specified asset. The required language is specified in the parameter lang.

Parameters are optional, if not specified the server uses te default values lang=en.