/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { EventEmitter } from 'node:events';
import * as Net from 'node:net';
import { hostname } from 'node:os';
export type EventEmitterContructorOption = ConstructorParameters<
  typeof EventEmitter
>[0];
export type NetworkConfig = Net.ListenOptions;
export type SocketConnection = {
  id: string;
  socket: Net.Socket;
};
export class MqServer extends EventEmitter {
  private static instance: MqServer;
  protected server: Net.Server | undefined;
  protected clientConnections: Array<SocketConnection> = [];
  private constructor(options?: EventEmitterContructorOption) {
    super(options);
    this.server = new Net.Server();
  }
  public static getInstance(): MqServer {
    if (!MqServer.instance) {
      MqServer.instance = new MqServer();
    }
    return MqServer.instance;
  }
  protected getNetworkAddress() {
    return this.server!.address() as Net.AddressInfo;
  }
  protected handleServerListeningEvents() {
    console.log('Prepare & Starting MQTT Broker');
    console.log('Listening TCP connection on PORT', this.getNetworkAddress().port);
  }
  protected handleServerConnectionEvents(stream: Net.Socket) {
    console.log('Got  Connection From', stream.address());
    this.clientConnections.push({ id: `socket`, socket: stream });
    console.log(this.clientConnections);
    stream.write('Welcome');
  }
  protected handleServerErrorEvents(err: Error) {
    console.log(
      'An error occured, we will make a error handling based on Latest MQTT 5.0 Specification',
      err
    );
  }
  protected handleServerCloseEvents() {
    console.log('Connection has been Closed');
  }
  public init(port = 1883): MqServer {
    this.server!.listen(port)
      .on('listening', (_stream: any) => this.handleServerListeningEvents())
      .on('connection', (netSocket) =>
        this.handleServerConnectionEvents(netSocket)
      )
      .on('error', (err) => this.handleServerErrorEvents(err))
      .on('close', () => this.handleServerCloseEvents());
    return this;
  }
}
