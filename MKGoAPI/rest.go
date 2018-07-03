package main

import (
	"fmt"
	"net/http"
)

func registerRestHandlers(srv *http.Server) {
	http.HandleFunc("/", hRoot)
}

func hRoot(w http.ResponseWriter, req *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	fmt.Fprintf(w, `{"message":"Welcome to the Go bikinibottom API"}`)
}
