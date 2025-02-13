from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Body
from fastapi.responses import JSONResponse
from services import ConnectionWebSocketManager, CodeGeneratorManager
from schemas.user_schema import UserInfoModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ObjConnectWS = ConnectionWebSocketManager.ConnectionWebSocketManager({})
ObjCodeGen = CodeGeneratorManager.CodeGeneratorManager()


# Ruta para crear una nueva sala
@app.post("/create_room_id", tags=['Crear'])
async def create_room_id(user_schema: UserInfoModel):
    room_id = ObjCodeGen.gen_random_code()
    ObjConnectWS.room_connections = {room_id: []}
    ObjConnectWS.room_connections[room_id].append({"user_name": user_schema.user_name, "owner": True})
    
    print(ObjConnectWS.room_connections)
    return JSONResponse(status_code=200, content={"status" : 200, "room_id": room_id})

#Conexion al websocket
@app.websocket("/ws/{room_id}/{user}")
async def websocket_endpoint(websocket: WebSocket, room_id: str, user:str ):
    await ObjConnectWS.connect(websocket, room_id, user)
    try:
        while True:
            try:
                data = await websocket.receive_text()
                await ObjConnectWS.send_message(user, data, room_id)

            except WebSocketDisconnect:
                print(f"user_name {user} disconnected from room {room_id}")
                break
    except WebSocketDisconnect:
        ObjConnectWS.disconnect(websocket, room_id)

# Generador palabra random
@app.get('/random_word', tags=['Crear'])
def gen_random_word():
    word = ObjCodeGen.gen_random_word()

    return JSONResponse(status_code=word[1], content={"status" : word[1], "random_word": word[0]})

# Get info of a especific room
@app.get('/get_room_info/{room_id}', tags=['Consultar'])
def get_rooms(room_id: str):
    if room_id not in ObjConnectWS.room_connections:
        return JSONResponse(status_code=404, content={"status":404, "message": "Room not found"})
    
    room_info = ObjConnectWS.room_connections[room_id]
    filtered_data = [item for item in room_info if not isinstance(item, WebSocket)]
    
    return JSONResponse(status_code=200, content={"status":200, "message": filtered_data})
    
# Get room active list
@app.get('/get_active_rooms', tags=['Consultar'])
def get_rooms():
    active_rooms = list(ObjConnectWS.room_connections.keys())
    print(active_rooms)
    return JSONResponse(status_code=200, content={"status":200, "message": active_rooms})

@app.post('/join_room', tags=['Unirse'])
def join_user_to_room(user_info: UserInfoModel):
    if user_info.room_id in ObjConnectWS.room_connections:
        ObjConnectWS.room_connections[user_info.room_id].append({"user_name": user_info.user_name, "owner": False})
        
        return JSONResponse(status_code=200, content={"status": 200, "message": "User joined to room successfully"})
    else:
        return JSONResponse(status_code=404, content={"status": 404, "message": "Room not found"})