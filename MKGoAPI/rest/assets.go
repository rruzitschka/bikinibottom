package rest

import (
	"fmt"
	"net/http"
)

func assets(res http.ResponseWriter, req *http.Request) {
	res.Header().Set("Content-Type", "application/json")
	fmt.Fprintf(res, `{"message":"Welcome to the Go bikinibottom API"}`)
}
