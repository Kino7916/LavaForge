import { BaseCommandManager } from "@tryforge/forgescript";
import { Events } from "../Enums";

export class LavalinkCommandManager extends BaseCommandManager<Events> {
    handlerName: string;
}