import { createNodeDescriptor, INodeFunctionBaseParams } from "@cognigy/extension-tools";
import axios from "axios";

export interface IOfferControlParams extends INodeFunctionBaseParams {
	config: {
		connection: {
			domain: string;
			USER_API_KEY: string;
		};
		projectKey: string;
		jobId: string;
		storeLocation: string;
		contextKey: string;
		inputKey: string;
	};
}

export const jobStatusNode = createNodeDescriptor({
	type: "jobStatus",
	defaultLabel: "Get Job Status",
	fields: [
		{
			key: "connection",
			label: "Dataiku Connection",
			type: "connection",
			params: {
				connectionType: "Dataiku Connection",
				required: true
			}
		},
		{
			key: "projectKey",
			type: "text",
			label: "Enter the project key",
			defaultValue: "",
			params: {
				required: true
			}
		},
		{
			key: "jobId",
			type: "text",
			label: "Enter the job Id",
			defaultValue: "",
			params: {
				required: true
			}
		},
		{
			key: "inputKey",
			type: "cognigyText",
			label: "Input Key to store Result",
			defaultValue: "dataiku.request",
			condition: {
				key: "storeLocation",
				value: "input",
			}
		},
		{
			key: "contextKey",
			type: "cognigyText",
			label: "Context Key to store Result",
			defaultValue: "dataiku.request",
			condition: {
				key: "storeLocation",
				value: "context",
			}
		},
		{
			key: "storeLocation",
			type: "select",
			label: "Where to store the result",
			defaultValue: "input",
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
		}
	],
	sections: [
		{
			key: "Dataiku",
			label: "Advanced",
			defaultCollapsed: true,
			fields: [
				"projectKey",
				"jobId"
			]
		},
		{
			key: "storage",
			label: "Storage Options",
			defaultCollapsed: true,
			fields: [
				"storeLocation",
				"inputKey",
				"contextKey",
			]
		}
	],
	form: [
		{ type: "field", key: "connection" },
		{ type: "section", key: "Dataiku" },
		{ type: "section", key: "storage" }
	],
	appearance: {
		color: "#3bc5bb"
	},
	function: async ({ cognigy, config }: IOfferControlParams) => {
		const { api, input } = cognigy;
		const { connection, projectKey, jobId, storeLocation, contextKey, inputKey } = config;
		const { domain, USER_API_KEY } = connection;

		try {
			const response = await axios({
				method: 'get',
			  	url: `${domain}public/api/projects/${projectKey}/jobs/${jobId}`,
			  	headers: {
					'Content-Type': 'application/json',
					'Authorization': `Basic ${USER_API_KEY}`
				}
			});

			if (storeLocation === "context") {
				api.addToContext(contextKey, response.data, "simple");
			} else {
				// @ts-ignore
				api.addToInput(inputKey, response.data);
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