package routes

import (
	"time"

	"github.com/gofiber/fiber/v2"
)

func SetupLogoutRoutes(app *fiber.App) {
	app.Post("/logout", func(c *fiber.Ctx) error {
		c.Cookie(&fiber.Cookie{
			Name:     "access_token",
			Value:    "",
			Expires:  time.Now().Add(-time.Hour),
			HTTPOnly: true,
		})
		c.Cookie(&fiber.Cookie{
			Name:     "refresh_token",
			Value:    "",
			Expires:  time.Now().Add(-time.Hour),
			HTTPOnly: true,
		})
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"message": "Logout successful",
		})
	})
}
