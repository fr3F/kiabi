import { attachParser, createSerialPort, setupDataListener, setupErrorListener } from "./util/uhf.util.js";

function initRFIDReader(portName = "/dev/ttyUSB0", baudRate = 115200) {
  const port = createSerialPort(portName, baudRate);
  const parser = attachParser(port);

  setupDataListener(parser);
  setupErrorListener(port);
}

export { initRFIDReader };
