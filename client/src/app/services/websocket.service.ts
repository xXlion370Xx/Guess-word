import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  connectWS(roomId: string, nameUser: string) {
    const url = `ws://127.0.0.1:8000/ws/${roomId}/${nameUser}`;

    return new WebSocket(url);
  }

  // connectWS(roomId: string, nameUser: string) {
  //   const url = `ws://127.0.0.1:8000/ws/${roomId}/${nameUser}`;

  //   let socket = new WebSocket(url);

  //   // Evento de apertura de conexión
  //   socket.onopen = function (event) {
  //     console.log("Conectado al servidor WebSocket.");
  //   };

  //   // Evento de recepción de mensaje
  //   socket.onmessage = function (event) {
  //     console.log("Sending message");
  //   };

  //   // Evento de cierre de conexión
  //   // Se cierra la conexion pero no se envia ningun dato al backend informando de este cierre
  //   socket.onclose = function (event) {
  //     console.log("Conexión cerrada.");
  //   };

  //   // Evento de error de conexión
  //   socket.onerror = function (error) {
  //     console.error("Error en la conexión WebSocket:", error);
  //     alert("Ocurrió un error en la conexión WebSocket. Por favor, verifica la configuración.");
  //   };
  // }
}
