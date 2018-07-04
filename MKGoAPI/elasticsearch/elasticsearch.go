package elasticsearch

import (
	"log"

	"github.com/olivere/elastic"
)

// ElasticSearch client reference
var esClient *elastic.Client

// InitES initializes the ElasticSearch client
func InitES(esURL string) (version string, err error) {
	log.Printf("connecting to ElasticSearch at '%s'", esURL)
	esClient, err = elastic.NewClient( // alternative: NewSimpleClient (lightweight, single shot)
		elastic.SetURL(esURL),
		elastic.SetSniff(false), // autodetection of new ES nodes doesn't work in AWS
	)
	if err != nil {
		return "", err
	}

	// log ES version
	return esClient.ElasticsearchVersion(esURL)
}

// GetClient returns a pointer to the ES client instance
func GetClient() *elastic.Client {
	return esClient
}
