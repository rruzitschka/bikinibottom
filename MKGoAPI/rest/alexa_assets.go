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

// structure to return to Alexa
type alexaHit struct {
	ID             string `json:"id"`
	Name           string `json:"name"`
	Language       string `json:"language"`
	ProductionYear int
	Synopsis       string        `json:"synopsis"`
	Actors         []interface{} `json:"actors"`
	Genres         []string      `json:"genres"`
}

/*
The assets handler returns up to size documents matching the full text search query, q.
Instead of returning the entire _source document, some selected fields are copied to the top level.
All parameters are optional.

Example:
  GET http://127.0.0.1/v1/alexa/assets?q=annihalizer&from=5&size=5
*/
func alexaAssets(res http.ResponseWriter, req *http.Request) {
	fName := "alexaAssets"

	// handle query parameters
	p := req.URL.Query()
	q := paramStr(p.Get("q"), "*")
	from := paramUint(p.Get("from"), 0)
	size := paramUint(p.Get("size"), 10)
	if size < 1 {
		sendInterfaceError(&res, "size parameter must be >0")
		return
	}
	log.Printf("[%s] called with [q='%s',from=%v,size=%v] from %s", fName, q, from, size, ip(req))

	// build and send the request for selected alexa relevant fields to ES
	t1 := time.Now()
	result, err := elasticsearch.GetClient().Search("mediaasset").
		Query(elastic.NewQueryStringQuery(q)).
		FetchSourceContext(elastic.NewFetchSourceContext(true).
			Include("genres", "mediaLangs.actors.name", "originalName", "mediaLangs.langId", "productionYear", "mediaLangs.synopsis.short")).
		From(from).Size(size).
		Do(context.Background())
	if err != nil {
		// log and return entire error (including root cause)
		e, _ := json.Marshal(err)
		log.Printf("[%s] ERROR: %s", fName, e)
		sendServerError(&res, &err)
		return
	}
	log.Printf("[%s] received %d of %d hits in %dms, query took %dms", fName, len(result.Hits.Hits), result.TotalHits(), time.Since(t1)/1e6, result.TookInMillis)

	// handle json parsing errors
	defer panicHandler(&res)

	// compile alexa response
	hitArray := []*alexaHit{}
	for _, hit := range result.Hits.Hits {
		var r jsonType
		json.Unmarshal(*hit.Source, &r)

		ml := r["mediaLangs"].([]interface{})[0].(map[string]interface{})
		a := alexaHit{
			ID:             hit.Id,
			Name:           r["originalName"].(string),
			Language:       ml["langId"].(string),
			ProductionYear: int(r["productionYear"].(float64)),
			Synopsis:       ml["synopsis"].(map[string]interface{})["short"].(string),
		}

		// optionally add actors
		if _, exists := ml["actors"]; exists {
			a.Actors = ml["actors"].([]interface{})
		}

		// optionally add genres
		if _, exists := r["genres"]; exists {
			for _, g := range r["genres"].([]interface{}) {
				a.Genres = append(a.Genres, string(g.(string)))
			}
		}

		// add alexaHit to response
		hitArray = append(hitArray, &a)
	}

	// return anonymous array of hits to client
	sendCleanResponse(&res, &hitArray)
}
