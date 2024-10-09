import json
from fastapi import WebSocket
from fastapi.responses import JSONResponse
from typing import List


class ConnectionWebSocketManager:
    def __init__(self, room_connections):
        self.active_connections: List[WebSocket] = []
        self._room_connections: dict = room_connections

    async def connect(self, websocket: WebSocket, room_id: str, nickname: str):
        if room_id not in self._room_connections:
            await websocket.close(code=1008)
            return JSONResponse(status_code=400, content={"status_code": 400, "room_exist": False, "nickname": nickname, "room_id": room_id })
        await websocket.accept()
        self.active_connections.append(websocket)
        self._room_connections[room_id].append(websocket)
        
        return JSONResponse(status_code=200, content={"status_code": 200, "room_exist": True, "nickname": nickname, "room_id": room_id })

        
       
    def disconnect(self, websocket: WebSocket, room_id: str):
        self.active_connections.remove(websocket)
        if room_id in self._room_connections:
            self._room_connections[room_id].remove(websocket)

    async def send_message(self, user_name: str, message: str, room_id: str):
        if room_id in self._room_connections:
            print(self._room_connections[room_id])
            for connection in self._room_connections[room_id]:
                await connection.send_text(json.dumps({"user_name": user_name, "message": message}))
                
    @property
    def room_connections(self):
        return self._room_connections
    
    @room_connections.setter
    def room_connections(self, value):
        if not isinstance(value, dict):
            raise ValueError("Error en el setter rooms")
        
        self._room_connections.update(value)