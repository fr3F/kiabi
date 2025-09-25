import { checkMongoConnection } from "../../config/environments/mongo/db_mongo.config.js";
import {
  createSocketConnection,
  setupSocketDataListener,
  setupSocketErrorListener
} from "../rfid/util/socketUhf.js";

function initSocketRFIDReader(ip, port, io) {
  checkMongoConnection();
  const socket = createSocketConnection(ip, port);
  setupSocketDataListener(socket,io);
  setupSocketErrorListener(socket);
}

export { initSocketRFIDReader };
