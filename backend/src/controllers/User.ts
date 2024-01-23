import { Socket } from "socket.io";
import { RoomController } from "./Room";

export interface UserProps {
  socket: Socket;
  name: string;
}

export class UserController {
  private users: UserProps[];
  private queue: string[];
  private roomController: RoomController;

  constructor() {
    this.users = [];
    this.queue = [];
    this.roomController = new RoomController();
  }

  addUser(name: string, socket: Socket) {
    this.users.push({
      name,
      socket,
    });
    this.queue.push(socket.id);
    socket.emit("lobby");
    this.clearQueue();
    this.initHandlers(socket);
  }

  removeUser(socketId: string) {
    const user = this.users.find((x) => x.socket.id === socketId);

    this.users = this.users.filter((x) => x.socket.id !== socketId);
    this.queue = this.queue.filter((x) => x === socketId);
  }

  clearQueue() {
    console.log("inside clear queues");
    console.log(this.queue.length);
    if (this.queue.length < 2) {
      return;
    }

    const id1 = this.queue.pop();
    const id2 = this.queue.pop();
    console.log("id is " + id1 + " " + id2);
    const user1 = this.users.find((x) => x.socket.id === id1);
    const user2 = this.users.find((x) => x.socket.id === id2);

    if (!user1 || !user2) {
      return;
    }
    console.log("creating roonm");

    const room = this.roomController.createRoom(user1, user2);
    this.clearQueue();
  }

  initHandlers(socket: Socket) {
    socket.on("offer", ({ sdp, roomId }: { sdp: string; roomId: string }) => {
      this.roomController.onOffer(roomId, sdp, socket.id);
    });

    socket.on("answer", ({ sdp, roomId }: { sdp: string; roomId: string }) => {
      this.roomController.onAnswer(roomId, sdp, socket.id);
    });

    socket.on("add-ice-candidate", ({ candidate, roomId, type }) => {
      this.roomController.onIceCandidates(roomId, socket.id, candidate, type);
    });
  }
}
