from fastapi import FastAPI
from . import models, database
from .routers import customers, reservations
from .populate_customers import populate_if_empty

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="MS Customers & Reservations")
@app.on_event("startup")
def startup_event():
    populate_if_empty()
  
app.include_router(customers.router)
app.include_router(reservations.router)
