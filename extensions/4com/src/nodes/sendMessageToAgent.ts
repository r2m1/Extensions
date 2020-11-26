import { createNodeDescriptor, INodeFunctionBaseParams } from "@cognigy/extension-tools";
import axios from 'axios';

export interface ISendMessageToAgentParams extends INodeFunctionBaseParams {
	config: {
		connection: {
			apiUrl: string;
			entranceId: string;
			proxyUrl: string;
			callbackUrl: string;
		};
		roomId: string;
		message: string;
		storeLocation: string;
		inputKey: string;
		contextKey: string;
	};
}
export const sendMessageToAgentNode = createNodeDescriptor({
	type: "sendMessageToAgent",
	defaultLabel: "Send Message To Agent",
	fields: [
		{
			key: "connection",
			label: "4Com Connection",
			type: "connection",
			params: {
				connectionType: "4com",
				required: true
			}
		},
		{
			key: "roomId",
			label: "Room Id",
			type: "cognigyText",
			defaultValue: "{{context.livechat.roomId}}",
			params: {
				required: true
			}
		},
		{
			key: "message",
			label: "Message",
			type: "cognigyText",
			description: "The user text message that should be sent to the 4Com agent",
			defaultValue: "{{input.text}}",
			params: {
				required: true
			}
		},
		{
			key: "storeLocation",
			type: "select",
			label: "Where to store the result",
			params: {
				options: [
					{
						label: "Input",
						value: "input"
					},
					{
						label: "Context",
						value: "context"
					}
				],
				required: true
			},
			defaultValue: "context"
		},
		{
			key: "inputKey",
			type: "cognigyText",
			label: "Input Key to store Result",
			defaultValue: "livechat.message",
			condition: {
				key: "storeLocation",
				value: "input"
			}
		},
		{
			key: "contextKey",
			type: "cognigyText",
			label: "Context Key to store Result",
			defaultValue: "livechat.message",
			condition: {
				key: "storeLocation",
				value: "context"
			}
		}
	],
	sections: [
		{
			key: "storageOption",
			label: "Storage Option",
			defaultCollapsed: true,
			fields: [
				"storeLocation",
				"inputKey",
				"contextKey"
			]
		},
	],
	form: [
		{ type: "field", key: "connection" },
		{ type: "field", key: "roomId" },
		{ type: "field", key: "message" },
		{ type: "section", key: "storageOption" },
	],
	appearance: {
		color: "#E50043"
	},
	function: async ({ cognigy, config }: ISendMessageToAgentParams) => {
		const { api, context } = cognigy;
		const { connection, roomId, message, storeLocation, inputKey, contextKey } = config;
		const { apiUrl, entranceId, proxyUrl, callbackUrl } = connection;

		try {

			const response = await axios({
				method: 'post',
				url: `${proxyUrl}${apiUrl}entrances/${entranceId}/chats/${roomId}/messages`,
				headers: {
					'Content-Type': 'application/json'
				},
				data: {
					type: 'chatmsg',
					payload: {
						person: context.livechat?.person,
						message: {
							timestamp: new Date().toISOString(),
							content: message
						}
					},
					callback: callbackUrl.replace('{chat_id}', roomId),
					origin: 'chat'
				}
			});

			if (storeLocation === "context") {
				api.addToContext(contextKey, true, "simple");
			} else {
				// @ts-ignore
				api.addToInput(inputKey, true);
			}
		} catch (error) {
			if (storeLocation === "context") {
				api.addToContext(contextKey, error, "simple");
			} else {
				// @ts-ignore
				api.addToInput(inputKey, error);
			}
		}
	}
});