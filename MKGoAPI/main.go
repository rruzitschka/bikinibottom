package main

import (
	"flag"
	"log"
	"net/http"

	"github.com/olivere/elastic"
)

// command line arguments (call "./MKGoAPI -h" for usage info)
var esURL = flag.String("es_url", "http://127.0.0.1:9200", "Elastic Search URL")

func main() {
	// parse command line arguments
	flag.Parse()

	// init Elastic Search client
	log.Printf("connecting to ElasticSearch on '%s'", *esURL)
	es, err := elastic.NewClient( // alternative: NewSimpleClient (light weight, single shot)
		elastic.SetURL(*esURL),
		elastic.SetSniff(false), // autodetection of new ES nodes doesn't work in AWS
	)
	dieOnError(err)

	version, err := es.ElasticsearchVersion(*esURL)
	dieOnError(err)
	log.Printf("connection successful, ElasticSearch version %s", version)

	// register page handlers
	srv := &http.Server{Addr: ":80"}
	registerHandlers(srv)

	// run Ctrl-C handler as goroutine
	go sigIntHandler(srv)

	// start server
	log.Print("starting webserver on port 80")
	log.Print(srv.ListenAndServe())
}
