from pydantic import BaseModel
from datetime import datetime
from typing import List


class ReservationBase(BaseModel):
    date: datetime
    table_number: int


class ReservationCreate(ReservationBase):
    pass


class Reservation(ReservationBase):
    id: int

    class Config:
        orm_mode = True


class CustomerBase(BaseModel):
    name: str
    email: str
    phone: str


class CustomerCreate(CustomerBase):
    pass


class Customer(CustomerBase):
    id: int
    reservations: List[Reservation] = []

    class Config:
        orm_mode = True
