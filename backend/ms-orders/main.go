package main

import (
    "log"
    "os"

    "ms-orders/database"
    "ms-orders/handlers"

    "github.com/gin-gonic/gin"
)

func main() {
    database.Connect()

    r := gin.Default()
    r.POST("/pedidos", handlers.CrearPedido)
    r.GET("/pedidos", handlers.ListarPedidos)

    port := os.Getenv("PORT")
    if port == "" {
        port = "8002"
    }
    log.Fatal(r.Run(":" + port))
}
