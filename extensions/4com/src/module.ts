import { createExtension } from "@cognigy/extension-tools";

import { startLiveChatNode } from "./nodes/startLiveChat";
import { fourComConnection } from "./connections/4comConnection";
import { joinLeaveLiveChatNode } from "./nodes/joinLeaveLiveChat";
import { sendMessageToAgentNode } from "./nodes/sendMessageToAgent";


export default createExtension({
	nodes: [
		startLiveChatNode,
		joinLeaveLiveChatNode,
		sendMessageToAgentNode
	],

	connections: [
		fourComConnection
	]
});