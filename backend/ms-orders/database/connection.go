package database

import (
    "database/sql"
    "time"
    "fmt"
    "os"

    _ "github.com/go-sql-driver/mysql"
)

var DB *sql.DB

func Connect() {
    dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s",
        os.Getenv("DB_USER"),
        os.Getenv("DB_PASSWORD"),
        os.Getenv("DB_HOST"),
        os.Getenv("DB_PORT"),
        os.Getenv("DB_NAME"),
    )

    var err error
    for i := 0; i < 10; i++ {
        DB, err = sql.Open("mysql", dsn)
        if err == nil && DB.Ping() == nil {
            fmt.Println("✅ Conectado a MySQL")
            return
        }
        fmt.Println("⏳ Esperando conexión a MySQL...")
        time.Sleep(2 * time.Second)
    }
    panic("❌ Error al conectar a la base de datos: " + err.Error())
}
