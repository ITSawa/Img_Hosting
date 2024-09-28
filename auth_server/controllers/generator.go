package controllers

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
)

func generateRandomHex(length int) (string, error) {
	if length%2 != 0 {
		return "", fmt.Errorf("length must be an even number")
	}

	bytes := make([]byte, length/2)
	_, err := rand.Read(bytes)
	if err != nil {
		return "", err
	}

	hexString := hex.EncodeToString(bytes)
	return hexString, nil
}
