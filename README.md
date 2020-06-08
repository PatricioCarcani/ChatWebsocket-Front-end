# Chat Websocket - Front-end
Sistema de Chat en tiempo real con WebSocket y protocolo STOMP.

# Front-end
https://github.com/PatricioCarcani/ChatWebsocket-Front-end
CLIENTE: StompJS
DEPENDENCIAS:
-Angular 9
-Bootstrap 4.5.0

# Back-end
SERVIDOR: WEBSOCKET (BROKER)
DEPENDENCIAS
-Spring Boot 2.3.0
-Spring Boot DevTools
-Websocket
-Spring Web
-Spring Data MongoDB

# Sobre las tecnologías usadas

SOCKETS: Comunicación bidireccional en tiempo real entre client y servidor y viceversa. También clientes con clientes.
Una sola URL endpoint para laconexión inicial y todos los mensajes fluyen en esa misma coneción TCP/IP.

PROTOCOLO STOMP (Simple/Streaming Text Oriented Messaging Protocol) - Capa de abstracción de los SOCKETS.
https://stomp.github.io/

STOMP es un sencillo protocolo diseñado para la comunicación asíncrona entre agentes y clientes a través de un mediador de mensajes o broker.
Brokers compatibles: JMS, RabbitMQ, ActiveMQ, Spring, HornetQ, Apollo, y más.

El protocolo está basado en frames, que son un comando (u operación), un mensaje (o body) y unas cabeceras del mensaje (headers).
Conjunto de operaciones: Connect, Subscribe, Unsuscribe, Send/Publish y Disconnect.
