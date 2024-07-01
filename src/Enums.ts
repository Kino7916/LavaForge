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

export enum Events {
    NodeReady = "lavalinkNodeReady",
    // NodeConnecting = "lavalinkNodeConnecting",
    // NodeDisconnected = "lavalinkNodeDisconnected",

    TrackStart = "lavalinkTrackStart",
    TrackEnd = "lavalinkTrackEnd",
    TrackError = "lavalinkTrackError"
}

export enum Filters {
    Volume = "volume",
    Equalizer = "equalizer",
    Karaoke = "karaoke",
    TimeScale = "timescale",
    Tremolo = "tremolo",
    Vibrato = "vibrato",
    Rotation = "rotation",
    Distortion = "distortion",
    ChannelMix = "channelMix",
    LowPass = "lowPass"
}