from fastapi import FastAPI, HTTPException
import httpx, os

app = FastAPI(title="MS History")

CUSTOMERS_URL = os.getenv("CUSTOMERS_URL", "http://ms-customers:8001/customers")
RESERVATIONS_URL = os.getenv("RESERVATIONS_URL", "http://ms-customers:8001/reservations")
ORDERS_URL = os.getenv("ORDERS_URL", None)
MENU_URL = os.getenv("MENU_URL", None)


@app.get("/history/{customer_id}")
async def get_customer_history(customer_id: int):
    async with httpx.AsyncClient() as client:
        try:
            customer_resp = await client.get(f"{CUSTOMERS_URL}/{customer_id}")
            if customer_resp.status_code != 200:
                raise HTTPException(status_code=customer_resp.status_code, detail="Customer not found")
            customer_data = customer_resp.json()

            reservations_data = []
            try:
                res_resp = await client.get(f"{RESERVATIONS_URL}")
                if res_resp.status_code == 200:
                    all_reservations = res_resp.json()
                    reservations_data = [r for r in all_reservations if r["customer_id"] == customer_id]
            except:
                pass

            orders_data = []
            if ORDERS_URL:
                try:
                    orders_resp = await client.get(f"{ORDERS_URL}?customer_id={customer_id}")
                    print("ORDERS URL:", f"{ORDERS_URL}?customer_id={customer_id}")
                    print("ORDERS status:", orders_resp.status_code)
                    try:
                        orders_json = orders_resp.json()
                        print("ORDERS parsed:", orders_json)
                        if orders_resp.status_code == 200:
                            orders_data = orders_json

                    except Exception as parse_error:
                        print("ORDERS parse error:", str(parse_error))
                except Exception as fetch_error:
                    print("ORDERS fetch error:", str(fetch_error))

            plato_ids_usados = set()
            for pedido in orders_data:
                pedido.pop("id", None)
                pedido.pop("cliente_id", None)
                for item in pedido.get("items", []):
                    item.pop("id", None)
                    item.pop("pedido_id", None)
                    plato_ids_usados.add(item["plato_id"])

            menu_data = []
            if MENU_URL and plato_ids_usados:
                for pid in plato_ids_usados:
                    try:
                        resp = await client.get(f"{MENU_URL}/{pid}")
                        if resp.status_code == 200:
                            plato = resp.json()
                            if isinstance(plato, dict):
                                menu_data.append(plato)
                    except:
                        pass
            
            return {
                "customer": customer_data,
                "reservations": reservations_data,
                "orders": orders_data,
                "menu": menu_data
            }

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error fetching history: {str(e)}")
