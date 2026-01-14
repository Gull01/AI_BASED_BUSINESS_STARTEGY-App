from fastapi import FastAPI
from mangum import Mangum

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Test API is working", "status": "ok"}

@app.get("/test")
def test():
    return {"test": "success"}

handler = Mangum(app)
