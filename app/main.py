from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from typing import List
from services import ConnectionWebSocketManager
import uuid

app = FastAPI()

manager = ConnectionWebSocketManager.ConnectionWebSocketManager({})


# Ruta para crear una nueva sala
@app.post("/create_room_id")
async def create_room_id():
    room_id = str(uuid.uuid4())
    manager.room_connections = {room_id: []}
    
    print(manager.room_connections)
    return {"room_id" : room_id}

@app.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    await manager.connect(websocket, room_id)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.send_message(room_id, f"Mensaje en sala {room_id}: {data}")
            
    except WebSocketDisconnect:
        manager.disconnect(websocket, room_id)
