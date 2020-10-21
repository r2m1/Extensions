import { createExtension } from "@cognigy/extension-tools";

import { soapRequestNode } from "./nodes/soapRequest";
import { basicConnection } from "./connections/basicConnection";


export default createExtension({
	nodes: [
		soapRequestNode
	],

	connections: [
		basicConnection
	]
});