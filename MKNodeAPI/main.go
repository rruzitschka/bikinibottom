package main

import (
	"flag"
	"log"
	"net/http"

	"github.com/olivere/elastic"
)

// command line arguments
var esURL = flag.String("es_url", "http://127.0.0.1:9200", "Elastic Search URL")

func main() {
	flag.Parse()

	// init Elastic Search client
	log.Printf("connecting to ElasticSearch on '%s'", *esURL)
	es, err := elastic.NewClient(elastic.SetURL(*esURL))
	dieOnError(err)

	version, err := es.ElasticsearchVersion(*esURL)
	dieOnError(err)
	log.Printf("connection successful, ElasticSearch version %s", version)

	// register page handlers
	srv := &http.Server{Addr: ":80"}
	registerHandlers(srv)

	// register Ctrl-C handler
	go shutdownHandler(srv)

	// start server
	log.Print("starting webserver on port 80")
	log.Print(srv.ListenAndServe())
}
