package rest

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"../elasticsearch"
	"github.com/olivere/elastic"
)

/*
The assets handler returns up to size documents matching the full text search query, q.
All parameters are optional.

Example:
  GET http://127.0.0.1/v1/assets?q=annihalizer&from=15&size=5
*/
func assets(res http.ResponseWriter, req *http.Request) {
	// handle query parameters
	p := req.URL.Query()
	q := paramStr(p.Get("q"), "*")
	from := paramUint(p.Get("from"), 0)
	size := paramUint(p.Get("size"), 10)
	if size < 1 {
		sendInterfaceError(&res, "size parameter must be >0")
		return
	}
	log.Printf("[assets] called with [q='%s',from=%v,size=%v] from %s", q, from, size, ip(req))

	// build and send the request to ES
	t1 := time.Now()
	result, err := elasticsearch.GetClient().Search().
		Index("mediaasset").Query(elastic.NewQueryStringQuery(q)).
		FetchSourceContext(elastic.NewFetchSourceContext(true).Exclude("*.relatedAssets")).
		From(from).Size(size).
		Do(context.Background())
	if err != nil {
		// log and return entire error (including root cause)
		e, _ := json.Marshal(err)
		log.Printf("[assets] ERROR: %s", e)
		sendServerError(&res, &err)
		return
	}
	log.Printf("[assets] received %d of %d hits in %dms, query took %dms", len(result.Hits.Hits), result.TotalHits(), time.Since(t1)/1e6, result.TookInMillis)

	// return anonymous array of hits to client
	sendCleanResponse(&res, result.Hits.Hits)
}
