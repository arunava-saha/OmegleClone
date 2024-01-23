import { Socket } from "socket.io";
import http from "http";
import { Server } from "socket.io";
import { UserController } from "./controllers/User";

const server = http.createServer(http);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
const user = new UserController();

io.on("connection", (socket: Socket) => {
  console.log("a user connected");
  user.addUser("randomName", socket);
  socket.on("disconnect", () => {
    console.log("user disconnected");
    user.removeUser(socket.id);
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
