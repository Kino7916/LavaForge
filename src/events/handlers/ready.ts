import { Interpreter } from "@tryforge/forgescript";
import { Events } from "../../Enums";
import { LavalinkEventHandler } from "../LavalinkEventHandler";
import { Plugin } from "../../Plugin";

export default new LavalinkEventHandler(
    {
        name: Events.NodeReady,
        description: 'Emitted when lavalink nodes are connected to their instances websocket',
        listener(node) {
            const commands = Plugin.Get(this).commands.get(Events.NodeReady);
            
            if (commands && commands.length > 0) {
                for (const command of commands) {
                    Interpreter.run({ command, client: this, data: command.compiled.code, obj: node })
                }
            }
        }
    }
)