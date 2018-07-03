package main

import (
	"log"

	"github.com/olivere/elastic"
)

func initES(esURL string) *elastic.Client {
	// init Elastic Search client
	log.Printf("connecting to ElasticSearch on '%s'", esURL)
	es, err := elastic.NewClient( // alternative: NewSimpleClient (light weight, single shot)
		elastic.SetURL(esURL),
		elastic.SetSniff(false), // autodetection of new ES nodes doesn't work in AWS
	)
	dieOnError(err)

	version, err := es.ElasticsearchVersion(esURL)
	dieOnError(err)
	log.Printf("connection successful, ElasticSearch version %s", version)

	return es
}
