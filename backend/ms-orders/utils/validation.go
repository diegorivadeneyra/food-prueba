package utils

import (
    "fmt"
    "net/http"
    "encoding/json"
    "os"
)

type MenuResponse struct {
    Success bool        `json:"success"`
    Data    []MenuItem  `json:"data"`
}

type MenuItem struct {
    ID     string  `json:"_id"`
    Precio float64 `json:"precio"`
}


func ObtenerPreciosMenu() (map[string]float64, error) {
    url := fmt.Sprintf("%s/api/v1/menu", os.Getenv("MENU_URL"))
    resp, err := http.Get(url)
    if err != nil {
        fmt.Println("❌ Error al obtener menú:", err)
        return nil, err
    }
    defer resp.Body.Close()

    var menuResp MenuResponse
    if err := json.NewDecoder(resp.Body).Decode(&menuResp); err != nil {
        fmt.Println("❌ Error al decodificar menú:", err)
        return nil, err
    }

    precios := make(map[string]float64)
    for _, item := range menuResp.Data {
        precios[item.ID] = item.Precio
    }

    return precios, nil
}

func ValidateCliente(clienteID int) bool {
    base := os.Getenv("CLIENTES_URL")
    url := fmt.Sprintf("%s/customers/%d", base, clienteID)
    resp, err := http.Get(url)
    return err == nil && resp.StatusCode == http.StatusOK
}

func ValidatePlato(platoID string) bool {
    url := fmt.Sprintf("%s/api/v1/menu/%s", os.Getenv("MENU_URL"), platoID)
    resp, err := http.Get(url)
    if err != nil {
        fmt.Println("❌ Error al conectar con ms-menu:", err)
        return false
    }
    defer resp.Body.Close()

    if resp.StatusCode != http.StatusOK {
        fmt.Println("❌ Plato no encontrado:", platoID)
        return false
    }
    return true
}

func GetPrecioPlato(platoID string) (float64, bool) {
    precios, err := ObtenerPreciosMenu()
    if err != nil {
        return 0, false
    }
    precio, ok := precios[platoID]
    return precio, ok
}