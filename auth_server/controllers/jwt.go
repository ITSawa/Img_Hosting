package controllers

import (
	"auth_server/models"
	"fmt"
	"time"

	"github.com/dgrijalva/jwt-go"
)

func CreateToken(SecretKey string, params map[string]interface{}, expiration time.Duration) (string, error) {
	if SecretKey == "" || params == nil {
		return "", nil
	}

	claims := jwt.MapClaims{}
	for key, value := range params {
		claims[key] = value
	}
	// Установка времени жизни токена
	claims["exp"] = time.Now().Add(expiration).Unix()

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(SecretKey))
}

func validateToken(SecretKey string, tokenString string) (*models.UserJWTPayload, error) {
	if SecretKey == "" || tokenString == "" {
		return nil, fmt.Errorf("invalid secret key or token")
	}

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(SecretKey), nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		id, ok := claims["id"].(float64)
		if !ok {
			return nil, fmt.Errorf("invalid ID type in token")
		}

		payload := &models.UserJWTPayload{
			User: models.User{
				Name:     claims["name"].(string),
				Email:    claims["email"].(string),
				ID:       int(id),
				ClientID: claims["client_id"].(string),
				Role:     claims["role"].(string),
			},
		}
		return payload, nil
	}

	return nil, fmt.Errorf("invalid token")
}

func CreateRefreshToken(user models.UserJWTPayload) (string, error) {
	payload := map[string]interface{}{
		"name":      user.Name,
		"email":     user.Email,
		"id":        user.ID,
		"client_id": user.ClientID,
		"role":      user.Role,
	}
	return CreateToken(RefreshSecret, payload, time.Hour*24*7)
}

func ValidateRefreshToken(tokenString string) (*models.UserJWTPayload, error) {
	return validateToken(RefreshSecret, tokenString)
}

func CreateAccessToken(user models.UserJWTPayload) (string, error) {
	payload := map[string]interface{}{
		"name":      user.Name,
		"email":     user.Email,
		"id":        user.ID,
		"client_id": user.ClientID,
		"role":      user.Role,
	}
	return CreateToken(AccessSecret, payload, time.Minute*40)
}

func ValidateAccessToken(tokenString string) (*models.UserJWTPayload, error) {
	return validateToken(AccessSecret, tokenString)
}
