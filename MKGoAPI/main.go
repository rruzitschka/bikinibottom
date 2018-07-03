package main

// Note regarding relative import paths (e.g. "./rest"):
// Go advises to use full qualified paths (e.g. "github.com/rruzitschka/bikinibottom/MKGoAPI/rest"),
// but this doesn't work with the current multi-project git repository
import (
	"flag"
	"log"
	"net/http"

	"./rest"
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
	rest.RegisterRestHandlers(srv)

	// run Ctrl-C handler as goroutine
	go sigIntHandler(srv)

	// start server
	log.Print("starting webserver on port 80")
	log.Print(srv.ListenAndServe())
}
