package controllers

import (
	"auth_server/models"
	"regexp"
	"strconv"
	"strings"
)

var sqlInjectionPattern = regexp.MustCompile(`(?i)(?:')|(?:--)|(/\*(?:.|[\r\n])*?\*/)|(?:\b(select|union|insert|update|delete|drop|alter|create|truncate)\b)`)

func IsSQLInjection(input string) bool {
	lowerInput := strings.ToLower(input)
	return sqlInjectionPattern.MatchString(lowerInput)
}

var emailPattern = regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)

func isEmailValid(email string) bool {
	return emailPattern.MatchString(email)
}

func isPasswordValid(password string) bool {
	return len(password) >= 8 && len(password) <= 40
}

func isInt(input string) bool {
	_, err := strconv.Atoi(input)
	return err == nil
}

func validateBeforeInsert(user models.UserDatabaseModel) bool {
	return !IsSQLInjection(user.Name) && !IsSQLInjection(user.Email) && isEmailValid(user.Email) && user.Name != "" && user.Email != "" && isPasswordValid(user.Password)
}

func validatePayload(user models.UserJWTPayload) bool {
	return user.Name != "" && isEmailValid(user.Email) && user.Email != "" && user.ID != 0
}

func validateBeforeLogin(email, password string) bool {
	return !IsSQLInjection(email) && isEmailValid(email) && password != ""
}
