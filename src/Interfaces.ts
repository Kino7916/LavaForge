export namespace Interfaces {
    export type Severity = "common" | "suspicious" | "fault";
    export type OpCodes = "ready" | "playerUpdate" | "stats" | "event";
    export type LoadTypes = "search" | "track" | "playlist" | "empty" | "error";
    export type EventTypes = 
        "TrackStartEvent" | 
        "TrackEndEvent" | 
        "TrackStuckEvent" | 
        "TrackExceptionEvent" |
        "WebsocketClosedEvent";
    export type TrackEndReasons = "finished" | "loadFailed" | "stopped" | "replaced" | "cleanup";
    export type LavalinkEvents = 
        "lavalinkNodeReady";
        // "lavalinkNodeConnecting" |
        // "lavalinkNodeDisconnected" | 
        // "lavalinkTrackStart" |
        // "lavalinkTrackEnd" |
        // "lavalinkTrackError";
        
    export interface PlayerState {
        time: number;
        position: number;
        connected: boolean;
        ping: number;
    }

    export interface Memory {
        free: number;
        used: number;
        allocated: number;
        reserved: number;
    }
    
    export interface CPU {
        cores: number;
        systemLoad: number;
        lavalinkLoad: number;
    }
    
    export interface FrameStats {
        sent: number;
        dulled: number;
        deficit: number;
    }

    export interface Track<PluginInfo = unknown, UserData = unknown> {
        encoded: string;
        info: TrackInfo;
        pluginInfo: PluginInfo;
        userData: UserData;
    }

    export interface TrackInfo {
        isrc: string | null;
        identifier: string;
        uri: string;
        title: string;
        author: string;
        length: number;
        position: number;
        artworkUrl: string;
        sourceName: string;
        isStream: number;
        isSeekable: boolean;
    }

    export interface Exception {
        message: string | null;
        severity: Severity;
        cause: string;
    }

    export namespace Packets {
        export type IncomingPacket = ReadyPacket | PlayerUpdatePacket | StatsPacket | EventPacket;
        export interface IPacket { op: OpCodes }
        export interface ReadyPacket extends IPacket {
            op: "ready";
            resumed: boolean;
            sessionId: string;
        }

        export interface PlayerUpdatePacket extends IPacket {
            op: "playerUpdate";
            state: Interfaces.PlayerState;
        }

        export interface StatsPacket extends IPacket {
            op: "stats"
            uptime: number;
            players: number;
            playingPlayers: number;

            cpu: Interfaces.CPU;
            memory: Interfaces.Memory;
            frameStats: Interfaces.FrameStats | null;
        }
        
        interface IEventPacket extends IPacket {
            op: "event";
            type: EventTypes;
            guildId: string;
        }

        export type EventPacket = IEventPacket & (
            Interfaces.Events.Track.TrackStart |
            Interfaces.Events.Track.TrackEnd |
            Interfaces.Events.Track.TrackException |
            Interfaces.Events.Track.TrackStuck |
            Interfaces.Events.Discord.WebsocketClosed
        )
    }

    export namespace Events {
        interface IEventPacket {
            type: EventTypes;
        }

        export namespace Track {
            export interface TrackStart extends IEventPacket {
                type: "TrackStartEvent";
                track: Track;
            }

            export interface TrackEnd extends IEventPacket {
                type: "TrackEndEvent";
                track: Track;
                reason: TrackEndReasons;
            }

            export interface TrackException extends IEventPacket {
                type: "TrackExceptionEvent";
                track: Track;
                exception: Exception;
            }

            export interface TrackStuck extends IEventPacket {
                type: "TrackStuckEvent";
                track: Track;
                thresholdMs: number;
            }
        }

        export namespace Discord {
            export interface WebsocketClosed extends IEventPacket {
                type: "WebsocketClosedEvent";
                code: number;
                reason: string;
                byRemote: boolean;
            }
        }

        interface INode {

        }

        export interface LavaManagerEvents extends Record<LavalinkEvents, Function> {
            'lavalinkNodeReady': (node: INode) => void
        }
    }

    interface ConnectWithURL {
        url: string | URL;
    }

    interface ConnectWithHost {
        host: string;
        port: number;
        secure?: boolean;
    }

    export interface ConnectionCredentials {
        username: string;
        password: string;
    }

    export type ConnectionData = ConnectionCredentials & (ConnectWithURL | ConnectWithHost);

    export interface ConnectionPacketMethods {
        onReceivingPacket: (packet: Packets.IncomingPacket) => void;
    }
}