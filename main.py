from fastapi import FastAPI
from pydantic import BaseModel
app = FastAPI()


class SensorData(BaseModel):
    temp: str
    humidity: str

@app.post("/insert")
def add_readings(data: SensorData):
    return {
        "data": data
    }