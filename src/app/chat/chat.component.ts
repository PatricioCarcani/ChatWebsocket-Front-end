import { Component, OnInit } from '@angular/core';
import { Client } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { Mensaje } from './models/mensaje';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  private client: Client;
  conectado: boolean = false;
  mensaje: Mensaje = new Mensaje();
  mensajes: Mensaje[] = [];
  escribiendo: string;
  clienteId: string;

  constructor() {
    this.clienteId = 'id-' + new Date().getTime() + '-' + Math.random().toString(36).substr(2);
   }

  ngOnInit(): void {
    this.client = new Client();
    this.client.webSocketFactory = () => {
      return new SockJS("http://localhost:8080/chat-websocket");
    }

    this.client.onConnect = (frame) => {
      console.log('Conectados: ' + this.client.connected + ' : ' + frame);
      this.conectado=true;
      
      //suscribirse y escuchar a evento chat
      this.client.subscribe('/chat/mensaje', e => {
        let mensaje: Mensaje = JSON.parse(e.body) as Mensaje;
        mensaje.fecha = new Date(mensaje.fecha);
        // asigna color solo al cliente conectado
        if(!this.mensaje.color && mensaje.tipo=='NUEVO_USUARIO' && this.mensaje.username==mensaje.username){
          this.mensaje.color=mensaje.color;
        }

        this.mensajes.push(mensaje);
        console.log(mensaje);
      });

      //suscribirse y escuchar a evento keyup/escribiendo
      this.client.subscribe('/chat/escribiendo', e => {
        this.escribiendo=e.body;
        //solo aparece por 5'
        setTimeout(() => this.escribiendo='', 3000)
      });

      this.client.subscribe('/chat/historial/' + this.clienteId, e => {
      const historial = JSON.parse(e.body) as Mensaje[];
      this.mensajes = historial.map(m =>{
          m.fecha = new Date(m.fecha);
          return m
        }).reverse() //debido a que se recibe desc
      });

      this.client.publish({destination: '/app/historial', body: this.clienteId });

      this.mensaje.tipo = 'NUEVO_USUARIO';
      this.client.publish({destination: '/app/mensaje', body: JSON.stringify(this.mensaje)});
      
    }

    this.client.onDisconnect = (frame) => {
      console.log('Desconectados: ' + !this.client.connected + ' : ' + frame);
      // reset de los atributos de la clase
      this.conectado = false;
      this.mensaje = new Mensaje();
      this.mensajes = [];
    }    

  } // fin init

  conectar(): void {
    this.client.activate();
  }

  desconectar(): void {
    this.client.deactivate();
  }

  enviarMensaje(): void {
    this.mensaje.tipo='MENSAJE';
    // message mapping
    this.client.publish({destination: '/app/mensaje', body: JSON.stringify(this.mensaje)});
    // texto reiniciado
    this.mensaje.texto = '';
  }

  escribiendoEvento(): void {
    this.client.publish({ destination:'/app/escribiendo', body: this.mensaje.username })
  }

}
