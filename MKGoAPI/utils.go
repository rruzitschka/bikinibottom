package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"
)

// define custom log time format
type tlog struct{}

func (t *tlog) Write(bytes []byte) (int, error) {
	return fmt.Print(time.Now().Format("2006-01-02 15:04:05.000 ") + string(bytes))
}

func init() {
	log.SetFlags(0) // disable default log date/time output
	log.SetOutput(new(tlog))
}

// gracefully shutdown server on Ctrl-C / SIGINT
func sigIntHandler(srv *http.Server) {
	sigint := make(chan os.Signal, 1)
	signal.Notify(sigint, os.Interrupt)
	<-sigint // wait for signal to arrive

	log.Print("got SIGINT, shutting down server")
	go func() { // enforce shutdown after 1 second
		time.Sleep(time.Second)
		log.Fatal("server didn't shutdown within 1s, exiting")
	}()

	if err := srv.Shutdown(context.Background()); err != nil {
		log.Print(err)
	}
}
