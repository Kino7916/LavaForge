import { Interpreter } from "@tryforge/forgescript";
import { LavalinkEvents } from "../../Enums";
import { LavaForge } from "../../Plugin";
import { LavalinkEventHandler } from "../LavalinkEventHandler";

export default new LavalinkEventHandler(
    {
        name: LavalinkEvents.NodeReady,
        description: 'Emitted when lavalink nodes are connected to their instances websocket',
        listener(node) {
            const commands = LavaForge.Get(this).commands.get(LavalinkEvents.NodeReady);
            
            if (commands && commands.length > 0) {
                for (const command of commands) {
                    Interpreter.run({ command, client: this, data: command.compiled.code, obj: node })
                }
            }
        }
    }
)