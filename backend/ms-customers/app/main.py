from fastapi import FastAPI
from . import models, database
from .routers import customers, reservations

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="MS Customers & Reservations")

app.include_router(customers.router)
app.include_router(reservations.router)
