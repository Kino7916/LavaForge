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
    export type EndReasons = "finished" | "loadFailed" | "stopped" | "replaced" | "cleanup";

    export interface NodeInfo {
        url: string;
        username: string;
        connected: boolean;
    }
}


export namespace Interfaces {
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
            state: Interfaces.API.PlayerState;
        }

        export interface StatsPacket extends IPacket {
            op: "stats"
            uptime: number;
            players: number;
            playingPlayers: number;

            cpu: Interfaces.API.CPU;
            memory: Interfaces.API.Memory;
            frameStats: Interfaces.API.FrameStats | null;
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
}


export namespace Interfaces {
    export namespace Events {
        interface IEventPacket {
            type: EventTypes;
        }

        type NodeEvents = 
            "lavalinkNodeReady";
        type TrackEvents = 
            "lavalinkTrackStart" |
            "lavalinkTrackEnd" |
            "lavalinkTrackError";
        type EventHandler = (...args: any[]) => void;
        
        export interface EventArgs extends Record<NodeEvents & TrackEvents, EventHandler> {
            'lavalinkNodeReady': (node: NodeInfo) => void
        }

        export namespace Track {
            export interface TrackStart extends IEventPacket {
                type: "TrackStartEvent";
                track: API.Track;
            }

            export interface TrackEnd extends IEventPacket {
                type: "TrackEndEvent";
                track: API.Track;
                reason: EndReasons;
            }

            export interface TrackException extends IEventPacket {
                type: "TrackExceptionEvent";
                track: API.Track;
                exception: API.Exception;
            }

            export interface TrackStuck extends IEventPacket {
                type: "TrackStuckEvent";
                track: API.Track;
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
    }
}


export namespace Interfaces {
    export namespace Features {
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
    
        export interface ConnectionLibraryMethods {
            onReceivingPacket: (packet: Packets.IncomingPacket) => void;
        }

        export interface AudioPlayerState {
            guildId: string;
            track: string | null;
            paused: boolean;
            volume: number;
            state: Interfaces.API.PlayerState;
            voice: Interfaces.API.VoiceState;
            filters: Filters;
        }
    
        export interface Filters<PluginFilters extends Record<string, any> = Record<string, any>> {
            'volume'?: Filters.Volume;
            'equalizer'?: Filters.ArrayOfEqualizerBands;
            'karaoke'?: Filters.Karaoke;
            'timescale'?: Filters.Timescale;
            'tremolo'?: Filters.Tremolo;
            'vibrato'?: Filters.Vibrato;
            'rotation'?: Filters.Rotation;
            'distortion'?: Filters.Distortion;
            'channelMix'?: Filters.ChannelMix;
            'lowPass'?: Filters.LowPass;
    
            pluginFilters?: PluginFilters;
        }
    }
}


export namespace Interfaces {
    export namespace API {
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

        export interface PlaylistInfo {
            name: string;
            selectedTrack: number;
        }

        export interface VoiceState {
            token: string;
            endpoint: string;
            sessionId: string;
        }
            
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

        export interface Exception {
            message: string | null;
            severity: Severity;
            cause: string;
        }
    }
}


export namespace Interfaces {
    export namespace Filters {
        export type Volume = number;
        export type ArrayOfEqualizerBands = Filters.Equalizer[];
        export interface Equalizer {
            band: number;
            gain: number;
        }

        export interface Karaoke {
            level?: number;
            monoLevel?: number;
            filterBand?: number;
            filterWidth?: number;
        }

        export interface Timescale {
            speed?: number;
            pitch?: number;
            rate?: number;
        }

        export interface Tremolo {
            frequency?: number;
            depth?: number;
        }

        export interface Vibrato {
            frequency?: number;
            depth?: number;
        }

        export interface Rotation {
            rotationHz?: number;
        }

        export interface Distortion {
            sinOffset?: number;
            sinScale?: number;
            cosOffset?: number;
            cosScale?: number;
            tanOffset?: number;
            tanScale?: number;
            offset?: number;
            scale?: number;
        }

        export interface ChannelMix {
            leftToLeft?: number;
            leftToRight?: number;
            rightToLeft?: number;
            rightToRight?: number;
        }

        export interface LowPass {
            smoothing?: number;
        }
    }
}