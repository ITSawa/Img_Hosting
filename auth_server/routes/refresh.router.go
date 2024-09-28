package routes

import (
	"auth_server/controllers"
	"auth_server/models"
	"time"

	"github.com/gofiber/fiber/v2"
)

func SetupRefreshRoutes(app *fiber.App) {
	app.Post("/refresh", func(c *fiber.Ctx) error {
		refreshToken := c.Cookies("refresh_token")

		if refreshToken == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Missing refresh token",
			})
		}

		payload, err := controllers.ValidateRefreshToken(refreshToken)
		if err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Invalid refresh token",
			})
		}

		userPayload := models.UserJWTPayload{
			User: models.User{
				Name:     payload.User.Name,
				Email:    payload.User.Email,
				ID:       payload.User.ID,
				ClientID: payload.User.ClientID,
				Role:     payload.User.Role,
			},
		}

		accessToken, err := controllers.CreateAccessToken(userPayload)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to create access token",
			})
		}

		c.Cookie(&fiber.Cookie{
			Name:     "access_token",
			Value:    accessToken,
			Expires:  time.Now().Add(time.Minute * 15),
			HTTPOnly: true,
		})

		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"user": payload,
		})
	})
}
