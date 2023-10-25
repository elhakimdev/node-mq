import * as Net from "node:net";
export const server = Net.createServer((socket) => {
    // 'connection' listener.
    console.log('client connected');
    socket.on('end', () => {
      console.log('client disconnected');
    });
    socket.write('hello\r\n');
    socket.pipe(socket);
});