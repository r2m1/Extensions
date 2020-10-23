import { createExtension } from "@cognigy/extension-tools";

import { sendEmailWithAttachmentNode } from "./nodes/sendEmailWithAttachment";
import { smtpConnection } from "./connections/smtpConnection";
import { getConversationNode } from "./nodes/getConversation";
import { cognigyApiConnection } from "./connections/cognigyApiConnection";
import { intentDisambiguationNode } from "./nodes/intentDisambiguation";
import { jsonToXMLNode } from "./nodes/jsonToXML";
import { xmlToJSONNode } from "./nodes/xmlToJSON";

export default createExtension({
	nodes: [
		sendEmailWithAttachmentNode,
		getConversationNode,
		intentDisambiguationNode,
		jsonToXMLNode,
		xmlToJSONNode
	],

	connections: [
		smtpConnection,
		cognigyApiConnection
	]
});