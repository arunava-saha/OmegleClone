import { UserProps } from "./User";

let GLOBAL_ROOM_ID = 1;

interface RoomProps {
  user1: UserProps;
  user2: UserProps;
}

export class RoomController {
  private rooms: Map<string, RoomProps>;
  constructor() {
    this.rooms = new Map<string, RoomProps>();
  }

  createRoom(user1: UserProps, user2: UserProps) {
    const roomId = this.generate().toString();
    this.rooms.set(roomId.toString(), {
      user1,
      user2,
    });

    user1.socket.emit("send-offer", {
      roomId,
    });

    user2.socket.emit("send-offer", {
      roomId,
    });
  }

  onOffer(roomId: string, sdp: string, senderSocketid: string) {
    const room = this.rooms.get(roomId);
    if (!room) {
      return;
    }
    const receivingUser =
      room.user1.socket.id === senderSocketid ? room.user2 : room.user1;
    receivingUser?.socket.emit("offer", {
      sdp,
      roomId,
    });
  }

  onAnswer(roomId: string, sdp: string, senderSocketid: string) {
    const room = this.rooms.get(roomId);
    if (!room) {
      return;
    }
    const receivingUser =
      room.user1.socket.id === senderSocketid ? room.user2 : room.user1;

    receivingUser?.socket.emit("answer", {
      sdp,
      roomId,
    });
  }

  onIceCandidates(
    roomId: string,
    senderSocketid: string,
    candidate: any,
    type: "sender" | "receiver"
  ) {
    const room = this.rooms.get(roomId);
    if (!room) {
      return;
    }
    const receivingUser =
      room.user1.socket.id === senderSocketid ? room.user2 : room.user1;
    receivingUser.socket.emit("add-ice-candidate", { candidate, type });
  }

  generate() {
    return GLOBAL_ROOM_ID++;
  }
}
