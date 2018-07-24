const WebSocket = require('ws');
const DEVICE_NAME = "leds";
const WIDTH = 8;
const HEIGHT = 64;
const data = [];

const fadecandyWebsocket = new WebSocket("ws://localhost:7890");
fadecandyWebsocket.on('open', () => {

  class AbstractCeilingConnection {
    constructor(channel) {
      this.socket =  new WebSocket(`ws://192.168.8.106:3000/output/${DEVICE_NAME}/${channel}`, 'echo-protocol');
      this.socket.on('message', this.onMessage.bind(this));
    }

    async onMessage(message) {
      // Implement on message handler
    }

    send() {
      const packet = new Uint8Array([0,0,0,0].concat(data));
      fadecandyWebsocket.send(packet.buffer)
      fadecandyWebsocket.send(packet.buffer)
    }

    setPixel(x, y, r, g, b) {
      const index = (x * HEIGHT + y) * 3;
      data[index] = r;
      data[index + 1] = g;
      data[index + 2] = b;
    }

    getR(x, y) {
      const index = (x * HEIGHT + y) * 3;
      return data[index] || 0;
    }
    
    getG(x, y) {
      const index = (x * HEIGHT + y) * 3;
      return data[index + 1] || 0;
    }
    
    getB(x, y) {
      const index = (x * HEIGHT + y) * 3;
      return data[index + 2] || 0;
    }

    getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }

    getMessageValue(message) {
      const array = new Uint8Array(message);
      return array[0];
    }
  }

  class PurpleWaveCeilingConnection extends AbstractCeilingConnection {
    constructor() {
      super("purple-wave");
    }
    
    async onMessage(message) {
      const twinkleY = this.getRandomInt(0, HEIGHT);
      const twinkleX = this.getRandomInt(0, WIDTH);
      const masterBrightness = this.getMessageValue(message) / 255;

      for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
          let rand = 0;
          
          if (twinkleY == y && twinkleX == x) {
            rand = this.getRandomInt(-200, 200);
          } else {
            rand = this.getRandomInt(-60, 60);
          }
          
          let r = this.getR(x, y);
          let g = this.getG(x, y);
          r = r + rand;
          g = g + rand;
          if (r > 255) {
            r = 255;
          }
          
          if (r < 150) {
            r = 150;
          }
          
          if (g > 100) {
            g = 100;
          }
          
          if (g < 40) {
            g = 40;
          }
          
          this.setPixel(x, y, r * masterBrightness, 10, g * masterBrightness);
        }
        this.send();
      }
    }
  }

  class RedTwinkleCeilingConnection extends AbstractCeilingConnection {
    constructor() {
      super("red-twinkle");
    }
    
    async onMessage(message) {
      // Implement on message handler
    }
  }

  class BlueTwinkleCeilingConnection extends AbstractCeilingConnection {
    constructor() {
      super("blue-twinkle");
    }
    
    async onMessage(message) {
      // Implement on message handler
    }
  }
  
  new PurpleWaveCeilingConnection();
});