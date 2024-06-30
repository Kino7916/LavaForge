import { EventManager, ForgeClient, ForgeExtension, FunctionManager } from "@tryforge/forgescript";
import { LavalinkCommandManager } from "./handlers/LavalinkCommandManager"
import { EventManager as Events } from "./events/EventManager";
import { LavaConnection } from "./core/LavaConnection";
import { Interfaces } from "./Interfaces";

class Plugin extends ForgeExtension {
    public readonly name: string = "@tryforge/lavaforge";
    public readonly version: string = "v0.0.1";
    public readonly description: string = "ae";

    public commands!: LavalinkCommandManager;
    public client!: ForgeClient
    public readonly events = new Events();
    protected readonly connections = new Array<LavaConnection>();

    private static readonly Instances = new WeakMap<ForgeClient, Plugin>();
    protected static readonly CommandsHandlerName = "lavaforge";
    protected static readonly EventsStorageName = "lavaforgeEvents";

    public init(client: ForgeClient): void {
        Plugin.Instances.set(client, this);

        this.client = client;
        this.commands = new LavalinkCommandManager(client);
        this.commands.handlerName = Plugin.CommandsHandlerName;

        FunctionManager.load(this.name, `${__dirname}/functions`);
        EventManager.load(Plugin.EventsStorageName, `${__dirname}/events/handlers`);
    }

    public onReceivingPacket = (packet: Interfaces.Packets.IncomingPacket) => {
        
    }

    static Get(client: ForgeClient) {
        return Plugin.Instances.get(client);
    }
}

export { Plugin as LavaForge }