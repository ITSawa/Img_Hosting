package models

type User struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	ID       int    `json:"id"`
	ClientID string `json:"client_id"`
	Role     string `json:"role"`
}

type UserDatabaseModel struct {
	User
	Password string `json:"password"`
}

func (UserDatabaseModel) TableName() string {
	return "users"
}

type UserJWTPayload struct {
	User
}

func (u UserDatabaseModel) GetName() string {
	return u.Name
}

func (u UserDatabaseModel) GetEmail() string {
	return u.Email
}

func (u UserDatabaseModel) GetID() int {
	return u.ID
}
