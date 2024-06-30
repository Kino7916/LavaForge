import { BaseEventHandler } from "@tryforge/forgescript";
import { ForgeClient } from "@tryforge/forgescript/dist/core";
import { LavaForge } from "../Plugin";
import { LavalinkEvents } from "../Enums";

export class LavalinkEventHandler extends BaseEventHandler {
    public register(client: ForgeClient): void {
        LavaForge.Get(client).events.on(this.name as any, this.listener as any);
    }
}