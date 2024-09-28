package controllers

import (
	"auth_server/models"
	"fmt"
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var Database *gorm.DB

func InitDatabase() {
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		DatabaseHost, DatabaseLogin, DatabasePassword, DatabaseName, DatabasePort,
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Error connecting to database: %v", err)
	}

	Database = db
	fmt.Println("Database connected successfully!")
}

func RegisterUser(user models.UserDatabaseModel) (models.UserDatabaseModel, error) {
	if !validateBeforeInsert(user) {
		return models.UserDatabaseModel{}, fmt.Errorf("invalid user data")
	}

	hashedPassword := hashPassword(user.Password)
	user.Password = hashedPassword

	var client_id, _ = generateRandomHex(24)
	if client_id == "" {
		return models.UserDatabaseModel{}, fmt.Errorf("failed to generate client id")
	}

	user.ClientID = client_id

	err := Database.Model(&user).Select("name", "email", "password", "client_id").Create(&user).Error
	if err != nil {
		return models.UserDatabaseModel{}, err
	}

	return user, nil
}

func LoginUser(email, password string) (models.UserDatabaseModel, error) {
	if !validateBeforeLogin(email, password) {
		return models.UserDatabaseModel{}, fmt.Errorf("invalid user data")
	}

	var selectedUser models.UserDatabaseModel
	result := Database.Where("email = ?", email).First(&selectedUser)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			return models.UserDatabaseModel{}, fmt.Errorf("user not found")
		}
		return models.UserDatabaseModel{}, result.Error
	}

	fmt.Printf("User loaded: %+v\n", selectedUser)

	if !checkPassword(selectedUser.Password, password) {
		return models.UserDatabaseModel{}, fmt.Errorf("invalid password")
	}

	return selectedUser, nil
}
