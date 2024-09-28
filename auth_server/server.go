package main

import (
	"auth_server/controllers"
	"auth_server/routes"
	"flag"
	"fmt"
	"log"

	"github.com/gofiber/fiber/v2"
)

func main() {
	port := flag.String("port", "4401", "Port on which the server will run")

	flag.Parse()

	finalPort := *port
	if finalPort == "" {
		finalPort = controllers.ServerPort
	}

	app := fiber.New(fiber.Config{
		DisableStartupMessage: true,
	})

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello, World!")
	})

	controllers.InitDatabase()
	routes.SetupLoginRoutes(app)
	routes.SetupRegistrationRoutes(app)
	routes.SetupRefreshRoutes(app)
	routes.SetupLogoutRoutes(app)

	address := ":" + finalPort
	fmt.Println("Server started on port:", finalPort)
	err := app.Listen(address)
	if err != nil {
		log.Fatalf("Error starting server: %v", err)
	}
}
