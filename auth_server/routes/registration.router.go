package routes

import (
	"auth_server/controllers"
	"auth_server/models"

	"time"

	"github.com/gofiber/fiber/v2"
)

func SetupRegistrationRoutes(app *fiber.App) {
	app.Post("/registration", func(c *fiber.Ctx) error {
		var registrationReq models.RegistrationRequest

		if err := c.BodyParser(&registrationReq); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid request body",
			})
		}

		UserSet := models.UserDatabaseModel{
			User: models.User{
				Name:  registrationReq.Name,
				Email: registrationReq.Email,
			},
			Password: registrationReq.Password,
		}

		user, err := controllers.RegisterUser(UserSet)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
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
