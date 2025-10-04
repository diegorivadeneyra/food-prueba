from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.exc import OperationalError
import os
import time

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://admin:admin@db-customers:5432/customersdb")

MAX_RETRIES = 10
RETRY_DELAY = 2  # segundos

for i in range(MAX_RETRIES):
    try:
        engine = create_engine(DATABASE_URL)
        # Intento de conexión real
        connection = engine.connect()
        connection.close()
        break
    except OperationalError:
        print(f"[DB] Intento {i+1} fallido. Reintentando en {RETRY_DELAY}s...")
        time.sleep(RETRY_DELAY)
else:
    raise Exception("[DB] No se pudo conectar a la base de datos después de varios intentos.")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
