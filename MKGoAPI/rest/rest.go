package rest

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"regexp"
	"strconv"
	"strings"
)

// arbitrary data structure for json
type jsonType map[string]interface{}

// RegisterRestHandlers registers all REST handlers to srv
func RegisterRestHandlers(srv *http.Server) {
	http.HandleFunc("/", root)
	http.HandleFunc("/v1/assets", assets)
}

// root handles everything except the registered REST handlers
func root(res http.ResponseWriter, req *http.Request) {
	sendResponse(&res, &jsonType{"message": "Welcome to the Go bikinibottom API"})
}

// respond with a JSON structure and a specific http status code
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

// convenience function to send HTTP 400 Bad Request response
func sendInterfaceError(res *http.ResponseWriter, message string) {
	sendStatusResponse(res, &jsonType{"error": message}, http.StatusBadRequest)
}

// convenience function to send HTTP 500 Internal Server Error response
func sendServerError(res *http.ResponseWriter, message string) {
	sendStatusResponse(res, &jsonType{"error": message}, http.StatusInternalServerError)
}

// return address part of req.RemoteAddr for logging
func ip(req *http.Request) string {
	return req.RemoteAddr[0:strings.LastIndex(req.RemoteAddr, ":")]
}

// parameter handling functions
var rxUint = regexp.MustCompile("^[0-9]+$")

func paramUint(param string, defaultValue uint) uint {
	if rxUint.MatchString(param) {
		v, _ := strconv.Atoi(param)
		return uint(v)
	}
	return defaultValue
}

func paramStr(param, defaultValue string) string {
	if param == "" {
		return defaultValue
	}
	return param
}
