from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from services import ConnectionWebSocketManager, CodeGeneratorManager

app = FastAPI()

ObjConnectWS = ConnectionWebSocketManager.ConnectionWebSocketManager({})
ObjCodeGen = CodeGeneratorManager.CodeGeneratorManager()


# Ruta para crear una nueva sala
@app.post("/create_room_id")
async def create_room_id():
    room_id = ObjCodeGen.gen_random_code()
    ObjConnectWS.room_connections = {room_id: []}
    
    print(ObjConnectWS.room_connections)
    return {"room_id" : room_id}

@app.websocket("/ws/{room_id}/{user}")
async def websocket_endpoint(websocket: WebSocket, room_id: str, user:str ):
    await ObjConnectWS.connect(websocket, room_id)
    try:
        while True:
            data = await websocket.receive_text()
            await ObjConnectWS.send_message(room_id, f"Mensaje en sala {user}: {data}")
            
    except WebSocketDisconnect:
        ObjConnectWS.disconnect(websocket, room_id)
