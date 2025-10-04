from faker import Faker
import psycopg2

def populate_if_empty():
    fake = Faker()
    try:
        conn = psycopg2.connect(
            dbname="customersdb",
            user="admin",
            password="admin",
            host="db-customers",
            port="5432"
        )
        cur = conn.cursor()
        cur.execute("SELECT COUNT(*) FROM customers")
        count = cur.fetchone()[0]

        if count == 0:
            for _ in range(20000):
                name = fake.name()
                email = fake.unique.email()
                phone = fake.phone_number()
                cur.execute(
                    "INSERT INTO customers (name, email, phone) VALUES (%s, %s, %s)",
                    (name, email, phone)
                )
            conn.commit()
            print("✅ Insertados 20,000 clientes falsos.")
        else:
            print("⚠️ La tabla ya tiene datos, no se insertó nada.")

        cur.close()
        conn.close()
    except Exception as e:
        print(f"❌ Error al poblar la base: {e}")
