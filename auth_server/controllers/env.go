package controllers

import (
	"os"

	"fmt"

	"github.com/joho/godotenv"
)

var (
	RefreshSecret     string
	AccessSecret      string
	CryptoSecret      string
	CrossServerSecret string
	ServerPort        string

	DatabaseLogin    string
	DatabasePassword string
	DatabaseHost     string
	DatabasePort     string
	DatabaseName     string
	DatabaseType     string
)

func init() {
	err := godotenv.Load(".env")
	if err != nil {
		fmt.Printf("Error loading .env file: %v", err)
	} else {
		// log.Println(".env file loaded successfully")
		fmt.Println(".env file loaded successfully")
	}

	RefreshSecret = os.Getenv("REFRESH_SECRET")
	AccessSecret = os.Getenv("ACCESS_SECRET")
	CryptoSecret = os.Getenv("CRYPTO_SECRET")
	CrossServerSecret = os.Getenv("CROSS_SERVER_SECRET")
	ServerPort = os.Getenv("SERVER_PORT")

	DatabaseLogin = os.Getenv("DATABASE_LOGIN")
	DatabasePassword = os.Getenv("DATABASE_PASSWORD")
	DatabaseHost = os.Getenv("DATABASE_HOST")
	DatabasePort = os.Getenv("DATABASE_PORT")
	DatabaseName = os.Getenv("DATABASE_NAME")
	DatabaseType = os.Getenv("DATABASE_TYPE")
}
