import { createNodeDescriptor, INodeFunctionBaseParams } from "@cognigy/extension-tools";
import axios from 'axios';

export interface IJoinLeaveLiveChatParams extends INodeFunctionBaseParams {
	config: {
		connection: {
			apiUrl: string;
			entranceId: string;
			proxyUrl: string;
			callbackUrl: string;
		};
		behavior: 'chatjoin' | 'chatleft';
		roomId: string;
		storeLocation: string;
		inputKey: string;
		contextKey: string;
	};
}
export const joinLeaveLiveChatNode = createNodeDescriptor({
	type: "joinLeaveLiveChat",
	defaultLabel: "Join / Leave Live Chat",
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
			key: "behavior",
			type: "select",
			label: "Join or Leave Chat",
			params: {
				options: [
					{
						label: "Join",
						value: "chatjoin"
					},
					{
						label: "Leave",
						value: "chatleft"
					}
				],
				required: true
			},
			defaultValue: "chatjoin"
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
			defaultValue: "livechat.behavior",
			condition: {
				key: "storeLocation",
				value: "input"
			}
		},
		{
			key: "contextKey",
			type: "cognigyText",
			label: "Context Key to store Result",
			defaultValue: "livechat.behavior",
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
		{ type: "field", key: "behavior" },
		{ type: "field", key: "roomId"},
		{ type: "section", key: "storageOption" },
	],
	appearance: {
		color: "#E50043"
	},
	function: async ({ cognigy, config }: IJoinLeaveLiveChatParams) => {
		const { api, input, context } = cognigy;
		const { connection, behavior, roomId, storeLocation, inputKey, contextKey } = config;
		const { apiUrl, entranceId, proxyUrl, callbackUrl } = connection;

		try {

			const response = await axios({
				method: 'post',
				url: `${proxyUrl}${apiUrl}entrances/${entranceId}/chats/${roomId}/messages`,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				data: {
					type: behavior,
					payload: {
						person: context.livechat?.person,
						metadata: {
							originurl: '',
							channel: roomId,
							customer: `${context.livechat?.person?.firstname} ${context.livechat?.person?.lastname}`,
							feedbackurl: '',
							timestamp: new Date().toISOString()
						},
						callback: callbackUrl.replace('{chat_id}', roomId),
					}
				}
			});

			if (storeLocation === "context") {
				api.addToContext(contextKey, behavior, "simple");
			} else {
				// @ts-ignore
				api.addToInput(inputKey, behavior);
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