package rest

import (
	"log"
	"net/http"
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
	log.Printf("[assets] called with [q='%s',alexa=%v,from=%v,size=%v] from %s\n", q, alexa, from, size, ip(req))
	sendResponse(&res, &jsonType{"q": q, "alexa": alexa, "from": from, "size": size})
}
