import { BaseCommandManager } from "@tryforge/forgescript";
import { LavalinkEvents } from "../Enums";

export class LavalinkCommandManager extends BaseCommandManager<LavalinkEvents> {
    handlerName: string;
}