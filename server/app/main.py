from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Body
from fastapi.responses import JSONResponse
from services import ConnectionWebSocketManager, CodeGeneratorManager
from schemas.user_schema import CreateModel
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
async def create_room_id(user_schema: CreateModel):
    room_id = ObjCodeGen.gen_random_code()
    ObjConnectWS.room_connections = {room_id: []}
    
    print(ObjConnectWS.room_connections)
    return JSONResponse(status_code=200, content={"status" : 200, "user_name": user_schema.nickname, "owner": user_schema.owner, "room_id": room_id})

@app.websocket("/ws/{room_id}/{user}")
async def websocket_endpoint(websocket: WebSocket, room_id: str, user:str ):
    await ObjConnectWS.connect(websocket, room_id, user)
    try:
        while True:
            try:

                data = await websocket.receive_text()
                await ObjConnectWS.send_message(room_id, f"Mensaje en sala {user}: {data}")

            except WebSocketDisconnect:
                print(f"Ninckname {user} disconnected from room {room_id}")
                break
    except WebSocketDisconnect:
        ObjConnectWS.disconnect(websocket, room_id)

@app.get('/random_word', tags=['Crear'])
def gen_random_word():
    word = ObjCodeGen.gen_random_word()

    return JSONResponse(status_code=word[1], content={"status" : word[1], "random_word": word[0]})

