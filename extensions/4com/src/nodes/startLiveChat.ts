import { createNodeDescriptor, INodeFunctionBaseParams } from "@cognigy/extension-tools";
import axios from 'axios';

export interface IStartLiveChatParams extends INodeFunctionBaseParams {
	config: {
		connection: {
			apiUrl: string;
			entranceId: string;
		};
		firstname: string;
		lastname: string;
		zipCode: string;
		customerNumber: string;
		contextKey: string;
	};
}
export const startLiveChatNode = createNodeDescriptor({
	type: "startLiveChat",
	defaultLabel: "Start Live Chat",
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
			key: "firstname",
			label: "First Name",
			type: "cognigyText",
			defaultValue: "Cognigy",
			params: {
				required: true
			}
		},
		{
			key: "lastname",
			label: "Last Name",
			type: "cognigyText",
			defaultValue: "User",
			params: {
				required: true
			}
		},
		{
			key: "zipCode",
			label: "Zip Code",
			type: "number",
			defaultValue: 40221,
			params: {
				required: true
			}
		},
		{
			key: "customerNumber",
			label: "Customer Number",
			type: "number",
			description: "The customer id or number",
			defaultValue: Math.floor(Math.random() * 90000) + 10000, // Random customer Number
			params: {
				required: true
			}
		},
		{
			key: "contextKey",
			type: "cognigyText",
			label: "Context Key to store Result",
			defaultValue: "livechat",
		}
	],
	sections: [
		{
			key: "userDetails",
			label: "User Details",
			defaultCollapsed: true,
			fields: [
				"firstname",
				"lastname",
				"zipCode",
				"customerNumber"
			]
		}
	],
	form: [
		{ type: "field", key: "connection" },
		{ type: "field", key: "contextKey" },
		{ type: "section", key: "userDetails" }
	],
	appearance: {
		color: "#E50043"
	},
	function: async ({ cognigy, config }: IStartLiveChatParams) => {
		const { api, input } = cognigy;
		const { connection, firstname, lastname, zipCode, customerNumber, contextKey } = config;
		const { apiUrl, entranceId } = connection;

		try {

			const response = await axios({
				method: 'post',
				url: `${apiUrl}chats?entrance_id=${entranceId}`,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				data: `Name=${lastname}&Vorname=${firstname}&PLZ=${zipCode}&Kundennummer=${customerNumber}`
			});

			let { data } = response;

			// the json response needs to include a room uuid.
			if (!data || typeof data !== 'object' || !data.room_uuid) {
				api.addToContext(contextKey, `Error, we could not aquire a room_uuid: ${data}`, "simple");
			}

			api.addToContext(contextKey, {
				roomId: data.room_uuid,
				person: {
					id: input.userId,
					role: 'participant',
					gender: 'd',
					firstname,
					lastname,
					phone: '',
					email: '',
					properties: {
						source: 'chat'
					},
					avatar: ''
				}
			}, "simple");
		} catch (error) {
			api.addToContext(contextKey, error, "simple");
		}
	}
});