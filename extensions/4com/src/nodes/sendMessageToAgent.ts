import { createNodeDescriptor, INodeFunctionBaseParams } from "@cognigy/extension-tools";
import axios from 'axios';
import * as qs from 'query-string';
export interface ISendMessageToAgentParams extends INodeFunctionBaseParams {
	config: {
		connection: {
			apiUrl: string;
			entranceId: string;
			proxyUrl: string;
			cogApiUrl: string;
			cogApiKey: string;
		};
		roomId: string;
		callbackUrl: string;
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
			key: "callbackUrl",
			label: "Message Server Callback Url",
			type: "cognigyText",
			defaultValue: "https://server.com/callback",
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
		{ type: "field", key: "callbackUrl" },
		{ type: "field", key: "message" },
		{ type: "section", key: "storageOption" },
	],
	appearance: {
		color: "#E50043"
	},
	function: async ({ cognigy, config }: ISendMessageToAgentParams) => {
		const { api, context, input } = cognigy;
		const { connection, roomId, message, callbackUrl, storeLocation, inputKey, contextKey } = config;
		const { apiUrl, entranceId, proxyUrl, cogApiUrl, cogApiKey } = connection;

		try {

			let url = qs.stringifyUrl({
				url: `${callbackUrl}/${roomId}`, query: {
					userId: input.userId,
					sessionId: input.sessionId,
					URLToken: input.URLToken,
					cogApiKey,
					cogApiUrl
				}
			});

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
					callback: url,
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