import { RawData, WebSocket } from "ws";
import { Interfaces } from "../Interfaces";
import * as Enums from "../Enums";

export class LavaConnection {
    #net: WebSocket;
    #ready: boolean;
    #connected: boolean;
    #sessionId: string;

    protected readonly methods = new Array<Interfaces.ConnectionPacketMethods>();
    protected readonly connectionInfo: Interfaces.ConnectionData;
    protected readonly href: URL;
    public constructor(connectionInfo: Interfaces.ConnectionData) {
        this.connectionInfo = connectionInfo;
        this.href = LavaConnection.getURLFromInfo(connectionInfo)
    }

    public get isConnected() { return this.#connected }
    public get isSecure() { return LavaConnection.isSecure(this.href.protocol) }

    static getURLFromInfo(connectionInfo: Interfaces.ConnectionData) {
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

    static headers(info: Interfaces.ConnectionData, userId: string) {
        return {
            'Authorization': info.password,
            'User-Id': userId,
            'Client-Name': '',
            'Session-Id': ''
        }
    }

    public AddMethod(methods: Interfaces.ConnectionPacketMethods) {
        this.methods.push(methods);
    }

    public Connect(userId: string) {
        const headers = LavaConnection.headers(this.connectionInfo, userId);
        headers['Client-Name'] = `Client(${userId})`;
        
        if (this.#sessionId) {
            headers['Session-Id'] = this.#sessionId;
        }

        this.#net = new WebSocket(this.href, { headers });
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