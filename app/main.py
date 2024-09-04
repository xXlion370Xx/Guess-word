from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from typing import List
import uuid

app = FastAPI()

valid_rooms = {}

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.room_connections = {}

    async def connect(self, websocket: WebSocket, room_id: str):
        if room_id not in valid_rooms:
            await websocket.close(code=1008)
            return

        await websocket.accept()
        self.active_connections.append(websocket)
        if room_id not in self.room_connections:
            self.room_connections[room_id] = []
        self.room_connections[room_id].append(websocket)

    def disconnect(self, websocket: WebSocket, room_id: str):
        self.active_connections.remove(websocket)
        if room_id in self.room_connections:
            self.room_connections[room_id].remove(websocket)

    async def send_message(self, room_id: str, message: str):
        if room_id in self.room_connections:
            for connection in self.room_connections[room_id]:
                await connection.send_text(message)

manager = ConnectionManager()


# Ruta para crear una nueva sala
@app.post("/create_room")
async def create_room():
    room_id = str(uuid.uuid4())  
    valid_rooms[room_id] = []  
    return {"room_id": room_id}

@app.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    await manager.connect(websocket, room_id)
    try:
        while True:
            data = await websocket.receive_text()
            if room_id in valid_rooms:
                await manager.send_message(room_id, f"Mensaje en sala {room_id}: {data}")
            else:
                await websocket.send_text("ID de sala no válido.")
    except WebSocketDisconnect:
        manager.disconnect(websocket, room_id)
