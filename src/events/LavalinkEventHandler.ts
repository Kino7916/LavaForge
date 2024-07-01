import { BaseEventHandler } from "@tryforge/forgescript";
import { ForgeClient } from "@tryforge/forgescript/dist/core";
import { Plugin } from "../Plugin";
import { Interfaces } from "../Interfaces";

export class LavalinkEventHandler extends BaseEventHandler<Interfaces.Events.EventArgs> {
    public register(client: ForgeClient): void {
        Plugin.Get(client).events.on(this.name, this.listener as any);
    }
}