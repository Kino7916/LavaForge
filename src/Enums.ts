export enum OpCodes {
    Ready = "ready",
    PlayerUpdate = "playerUpdate",
    Stats = "stats",
    Event = "event"
}

export enum LoadTypes {
    Search = "search",
    Track = "track",
    Playlist = "playlist",
    Empty = "empty",
    Error = "error"
}

export enum EventTypes {
    TrackStart = "TrackStartEvent",
    TrackEnd = "TrackEndEvent",
    TrackStuck = "TrackStuckEvent",
    TrackException = "TrackExceptionEvent",
    TrackError = EventTypes.TrackException,
    WebsocketClosed = "WebsocketClosedEvent"
}

export enum Severity {
    Common = "common",
    Suspicious = "suspicious",
    Amogus = Severity.Suspicious,
    Fault = "fault"
}

export enum EndReasons {
    Finished = "finished",
    Replaced = "replaced",
    Cleaned = "cleanup",
    Stopped = "stopped",
    LoadFailed = "loadFailed"
}

export enum LavalinkEvents {
    NodeReady = "lavalinkNodeReady",
    // NodeConnecting = "lavalinkNodeConnecting",
    // NodeDisconnected = "lavalinkNodeDisconnected",

    // TrackStart = "lavalinkTrackStart",
    // TrackEnd = "lavalinkTrackEnd",
    // TrackError = "lavalinkTrackError"
}