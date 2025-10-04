package models

type Pedido struct {
    ID         int          `json:"id"`
    ClienteID  int          `json:"cliente_id"`
    Fecha      string       `json:"fecha"`
    Estado     string       `json:"estado"`    
    Notas      string       `json:"notas"`      
    Items      []ItemPedido `json:"items"`      
    Total      float64      `json:"total"`                  
}

type ItemPedido struct {
    ID        int     `json:"id"`
    PedidoID  int     `json:"pedido_id"`
    PlatoID   string  `json:"plato_id"`   
    Nombre    string  `json:"nombre"`     
    Precio    float64 `json:"precio"`     
    Cantidad  int     `json:"cantidad"`
}

