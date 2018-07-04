package rest

import (
	"context"
	"log"
	"net/http"

	"../elasticsearch"
	"github.com/olivere/elastic"
)

/*
The assets handler returns up to size documents matching the full text search query, q.
For format=alexa the response will contain only the movie titles and the guids.
All parameters are optional.

Examples:
	GET /v1/assets?q=searchtext&format=alexa
	GET /v1/assets?q=searchtext&from=15&size=5
*/
func assets(res http.ResponseWriter, req *http.Request) {
	// query parameters
	p := req.URL.Query()
	q := paramStr(p.Get("q"), "*")
	alexa := p.Get("format") == "alexa"
	from := paramUint(p.Get("from"), 0)
	size := paramUint(p.Get("size"), 10)
	if size < 1 {
		sendInterfaceError(&res, "size parameter must be >0")
		return
	}

	// debug logging
	log.Printf("[assets] called with [q='%s',alexa=%v,from=%v,size=%v] from %s", q, alexa, from, size, ip(req))
	result, err := elasticsearch.GetClient().Search().
		Index("mediaasset").Query(elastic.NewQueryStringQuery(q)).
		From(from).Size(size).
		Do(context.Background())
	if err != nil {
		log.Printf("[assets] ERROR: %v", err)
		sendServerError(&res, err.Error())
		return
	}
	log.Printf("[assets] received %d of %d hits in %dms", len(result.Hits.Hits), result.TotalHits(), result.TookInMillis)
	sendResponse(&res, &jsonType{"result": result})
}
