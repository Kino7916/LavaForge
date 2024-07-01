import { RawData, WebSocket } from "ws";
import { Interfaces } from "../Interfaces";
import * as Enums from "../Enums";

export class LavaConnection {
    #net: WebSocket;
    #ready: boolean;
    #connected: boolean;
    #sessionId: string;

    protected readonly methods = new Array<Interfaces.Features.ConnectionLibraryMethods>();
    protected readonly connectionInfo: Interfaces.Features.ConnectionData;
    protected readonly connectionUrl: URL;
    protected readonly protocolSecure: boolean
    public constructor(connectionInfo: Interfaces.Features.ConnectionData) {
        this.connectionInfo = connectionInfo;
        this.connectionUrl = LavaConnection.getURLFromInfo(connectionInfo);
        this.protocolSecure = LavaConnection.isSecure(this.connectionUrl.protocol);
    }

    public get isConnected() { return this.#connected }
    public get isSecure() { return this.protocolSecure }
    public get url() { return this.connectionUrl.toString() }
    public get username() { return this.connectionInfo.username }

    static getURLFromInfo(connectionInfo: Interfaces.Features.ConnectionData) {
        if ('url' in connectionInfo) {
            const url = new URL(connectionInfo.url);
            url.protocol = 
                LavaConnection.isSecure(url.protocol) ? "wss": "ws:";

            return url
        } else {
            const url = new URL(`wss://${connectionInfo.host}/v4/websocket`);
            url.protocol = connectionInfo.secure ? 'wss:' : 'ws:';

            if (connectionInfo.port) {
                url.port = connectionInfo.port.toString();
            }
            
            return url
        }
    }

    static isSecure(protocol: string) {
        if (protocol === "https:" || protocol === "wss:") {
            return true;
        }

        return false;
    }

    static headers(info: Interfaces.Features.ConnectionData) {
        return {
            'Authorization': info.password,
            'User-Id': '',
            'Client-Name': '',
            'Session-Id': ''
        }
    }

    public addMethods(methods: Interfaces.Features.ConnectionLibraryMethods) {
        this.methods.push(methods);
    }

    public Connect(userId: string) {
        const headers = LavaConnection.headers(this.connectionInfo);
        headers['User-Id'] = userId;
        headers['Client-Name'] = `Client(${userId})`;
        
        if (this.#sessionId) {
            headers['Session-Id'] = this.#sessionId;
        }

        this.#net = new WebSocket(this.connectionUrl, { headers });
        this.#net.once('open', this.onInternalOpen.bind(this));
        this.#net.once('close', this.onInternalClose.bind(this));
        this.#net.once('error', this.onInternalError.bind(this));
        this.#net.on("message", this.onInternalMessage.bind(this));
    }

    protected onInternalOpen() {
        this.#connected = true;
    }

    protected onInternalClose(code: number, reason: Buffer) {
        this.#connected = false;
    }

    protected onInternalError(error: Error) {
        // Do something here
        console.error(error);
    }

    protected onInternalMessage(data: RawData, isBinary: boolean) {
        let packet: Interfaces.Packets.IncomingPacket;
        try {
            packet = JSON.parse(data.toString())
        } catch {
            throw new Error("Failed to parse lavalink packet");
        }

        switch (packet.op) {
            case Enums.OpCodes.Ready: {
                this.#ready = true;
                this.#sessionId = packet.sessionId;
            }
            break;
            case Enums.OpCodes.Stats: break; // Dunno what to do with this yet
        }

        if (this.methods.length) {
            for (const method of this.methods) {
                method.onReceivingPacket(packet);
            }
        }
    }
}