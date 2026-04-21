from fastapi import FastAPI
from pydantic import BaseModel
from datetime import datetime

app = FastAPI()

# TEMP DB (replace with SQLite later)
DB = {}

class UserState(BaseModel):
    user_id: str
    state: dict

@app.get("/")
def home():
    return {"status": "DISCIPLINE BACKEND RUNNING"}

@app.post("/save")
def save(data: UserState):
    DB[data.user_id] = data.state
    return {"status": "saved"}

@app.get("/load/{user_id}")
def load(user_id: str):
    return DB.get(user_id, {})

@app.post("/nofap/start")
def start_nofap(user_id: str):
    DB.setdefault(user_id, {})
    DB[user_id]["nofap_start"] = datetime.utcnow().timestamp()
    return {"status": "started"}

@app.get("/nofap/days/{user_id}")
def get_days(user_id: str):
    user = DB.get(user_id, {})
    start = user.get("nofap_start")
    if not start:
        return {"days": 0}
    days = int((datetime.utcnow().timestamp() - start) / 86400)
    return {"days": days}