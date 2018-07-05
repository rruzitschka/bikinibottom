package rest

import "net/http"

// root handles everything except the registered REST handlers
func root(res http.ResponseWriter, req *http.Request) {
	sendResponse(&res, &jsonType{"message": "Welcome to the Go bikinibottom API"})
}
