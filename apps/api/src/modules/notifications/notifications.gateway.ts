import {
  WebSocketGateway, WebSocketServer, SubscribeMessage,
  OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket, MessageBody
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { Logger } from '@nestjs/common'

@WebSocketGateway({ cors: { origin: '*' }, namespace: '/ws' })
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server

  private readonly logger = new Logger(NotificationsGateway.name)
  private readonly userSockets = new Map<string, string[]>()

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`)
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`)
    for (const [userId, sockets] of this.userSockets) {
      const updated = sockets.filter(id => id !== client.id)
      if (updated.length === 0) this.userSockets.delete(userId)
      else this.userSockets.set(userId, updated)
    }
  }

  @SubscribeMessage('join')
  handleJoin(@ConnectedSocket() client: Socket, @MessageBody() userId: string) {
    const sockets = this.userSockets.get(userId) ?? []
    this.userSockets.set(userId, [...sockets, client.id])
    client.join(`user:${userId}`)
    this.logger.log(`User ${userId} joined`)
  }

  notifyUser(userId: string, event: string, data: unknown) {
    this.server.to(`user:${userId}`).emit(event, data)
  }

  broadcastToProject(projectId: string, event: string, data: unknown) {
    this.server.to(`project:${projectId}`).emit(event, data)
  }
}
