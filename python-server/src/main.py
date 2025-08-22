from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Task(BaseModel):
    text: str

tasks = ["Write a diary entry from the future", "Create a time machine from a cardboard box", "Plan a trip to the dinosaurs", "Draw a futuristic city", "List items to bring on a time-travel adventure"]

@app.get("/")
def get_tasks():
    return "Hello World"

@app.post("/tasks")
def add_task(task: Task):
    tasks.append(task.text)
    return {"message": "Task added successfully"}

@app.get("/tasks")
def get_tasks():
    return {"tasks": tasks}
