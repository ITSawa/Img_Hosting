package models

import "time"

type ApiKeyPayload struct {
	OwnerId    int    `json:"owner_id"`
	OwnerEmail string `json:"owner_email"`
	Validation string `json:"validation"`
}

type ApiKeyDatabaseModel struct {
	ApiKeyPayload
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
	CancelledAt time.Time `json:"cancelled_at"`
}

func (ApiKeyDatabaseModel) TableName() string {
	return "api_keys"
}
