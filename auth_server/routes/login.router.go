package routes

import (
	"auth_server/controllers"
	"auth_server/models"
	"time"

	"github.com/gofiber/fiber/v2"
)

func SetupLoginRoutes(app *fiber.App) {
	app.Post("/login", func(c *fiber.Ctx) error {
		var loginReq models.LoginRequest

		if err := c.BodyParser(&loginReq); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid request body",
			})
		}

		user, err := controllers.LoginUser(loginReq.Email, loginReq.Password)
		if err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		payload := models.UserJWTPayload{
			User: models.User{
				Name:     user.Name,
				Email:    user.Email,
				ID:       user.ID,
				ClientID: user.ClientID,
				Role:     user.Role,
			},
		}

		refreshToken, err := controllers.CreateRefreshToken(payload)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		accessToken, err := controllers.CreateAccessToken(payload)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		c.Cookie(&fiber.Cookie{
			Name:     "access_token",
			Value:    accessToken,
			Expires:  time.Now().Add(time.Hour * 1),
			HTTPOnly: true,
			Secure:   true,
			SameSite: "Lax",
		})

		c.Cookie(&fiber.Cookie{
			Name:     "refresh_token",
			Value:    refreshToken,
			Expires:  time.Now().Add(time.Hour * 24 * 7),
			HTTPOnly: true,
			Secure:   true,
			SameSite: "Lax",
		})

		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"user": payload,
		})
	})
}
