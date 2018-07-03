package rest

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

// arbitrary data structure for json
type jsonType map[string]interface{}

// RegisterRestHandlers registers all REST handlers to srv
func RegisterRestHandlers(srv *http.Server) {
	http.HandleFunc("/", root)
	http.HandleFunc("/assets", assets)
}

func sendStatusResponse(res *http.ResponseWriter, jsonData *jsonType, httpStatus int) {
	j, err := json.Marshal(jsonData)
	if err != nil { // can't imagine a case where this could happen, but you never know
		log.Printf("ERROR sendResponse(): %v, jsonData: %v", err, *jsonData)
		(*res).WriteHeader(http.StatusInternalServerError)
		fmt.Fprintf((*res), "ERROR marshalling JSON data\n\njsonData: %v\n\nerror: %v\n", *jsonData, err)
		return
	}

	// set content-type, status and body
	(*res).Header().Set("Content-Type", "application/json")
	// WriteHeader() *must* be called between Header() and Write(), otherwise either Content-Type will
	// be reset to "text/plain" or status will be reset to 200 OK
	(*res).WriteHeader(httpStatus)
	(*res).Write(append(j, '\n'))
}

// convenience function to send HTTP 200 OK response
func sendResponse(res *http.ResponseWriter, jsonData *jsonType) {
	sendStatusResponse(res, jsonData, http.StatusOK)
}

// root handles everything except the registered REST handlers
func root(res http.ResponseWriter, req *http.Request) {
	sendResponse(&res, &jsonType{"message": "Welcome to the Go bikinibottom API"})
}
