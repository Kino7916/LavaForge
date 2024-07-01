import { EventManager, ForgeClient, ForgeExtension, FunctionManager } from "@tryforge/forgescript";
import { LavalinkCommandManager } from "./handlers/LavalinkCommandManager"
import { EventManager as Events } from "./events/EventManager";
import { LavaConnection } from "./core/LavaConnection";
import { Interfaces } from "./Interfaces";

const LavaForge = Symbol("LavaForge");

declare module '@tryforge/forgescript' {
    interface ForgeClient {
        [LavaForge]: Plugin;
    }
}

class Plugin extends ForgeExtension {
    public readonly name: string = "@tryforge/lavaforge";
    public readonly version: string = "v0.0.1";
    public readonly description: string = "ae";

    public commands!: LavalinkCommandManager;
    public readonly events = new Events();
    protected readonly connections = new Array<LavaConnection>();

    protected static readonly CommandsHandlerName = "lavaforge";
    protected static readonly EventsStorageName = "lavaforgeEvents";

    public init(client: ForgeClient): void {
        client[LavaForge] = this;
        this.commands = new LavalinkCommandManager(client);
        this.commands.handlerName = Plugin.CommandsHandlerName;

        FunctionManager.load(this.name, `${__dirname}/functions`);
        EventManager.load(Plugin.EventsStorageName, `${__dirname}/events/handlers`);
    }

    public onReceivingPacket(packet: Interfaces.Packets.IncomingPacket) {
        
    }

    static Get(client: ForgeClient) {
        return client[LavaForge];
    }

    static AudioPlayer(client: ForgeClient, guildId: string) {
        
    }
}

export { Plugin }