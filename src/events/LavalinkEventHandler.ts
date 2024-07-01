import { BaseEventHandler } from "@tryforge/forgescript";
import { ForgeClient } from "@tryforge/forgescript/dist/core";
import { Plugin } from "../Plugin";

export class LavalinkEventHandler extends BaseEventHandler {
    public register(client: ForgeClient): void {
        Plugin.Get(client).events.on(this.name as any, this.listener as any);
    }
}