This is a Proof of Concept NodeJS application using express. It access the sample asset metadata hosted in our Elastic Search instance.

Starting app.js will start the web server listening on port 3000.

So point your browser to http://localhost:3000/

It implements a sample RESTful API supporting the following requests:

GET /v1/assets?q=searchtext&format=alexa

Response is a JSON document, response is limited to 10 hits currently (default ElasticSearch setting)
the q Parameter is optional, the value is trasnferred to ElasticSearch
If the optional paramter format is used and the value is 'alexa' then the response will contain only the movie titles and the guids.

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

For usage by our Alexa Skill we introduce new API calls:

GET /v1/alexa/assets?q=xy&synopsis=true

The query string sent with the parameter most likely is the result of the voice recognition process of Alexa.
The response will contain one or more assets that match the query string. 

The parameter synopsis is optional, if it is available and set to the value true, the response will contain the synopsis for the queried asset.

GET /v1/alexa/cinemas?q=xy
