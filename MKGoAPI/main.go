package main

import (
	"flag"
	"log"
	"net/http"
)

// command line arguments (call "./MKGoAPI -h" for usage info)
var esURL = flag.String("es_url", "http://127.0.0.1:9200", "Elastic Search URL")

func main() {
	// parse command line arguments
	flag.Parse()

	// initialize ElasticSearch client
	es := initES(*esURL)
	log.Print(es)

	// register REST handlers
	srv := &http.Server{Addr: ":80"}
	registerRestHandlers(srv)

	// run Ctrl-C handler as goroutine
	go sigIntHandler(srv)

	// start server
	log.Print("starting webserver on port 80")
	log.Print(srv.ListenAndServe())
}
