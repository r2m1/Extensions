import { createNodeDescriptor, INodeFunctionBaseParams } from "@cognigy/extension-tools";
const xml2js = require('xml2js');


export interface xmlToJSONParams extends INodeFunctionBaseParams {
	config: {
		xmlInput: any;
		storeLocation: string;
		contextKey: string;
		inputKey: string;
	};
}
export const xmlToJSONNode = createNodeDescriptor({
	type: "xmlToJSON",
	defaultLabel: "XML To JSON",
	fields: [
		{
			key: "xmlInput",
			label: "Path to XML",
			description: "The XML that should be changed to JSON.",
			type: "cognigyText",
			params: {
				required: true
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
		},
		{
			key: "inputKey",
			type: "cognigyText",
			label: "Input Key to store Result",
			defaultValue: "cognigy.json",
			condition: {
				key: "storeLocation",
				value: "input",
			}
		},
		{
			key: "contextKey",
			type: "cognigyText",
			label: "Context Key to store Result",
			defaultValue: "cognigy.json",
			condition: {
				key: "storeLocation",
				value: "context",
			}
		},
	],
	sections: [
		{
			key: "storage",
			label: "Storage Option",
			defaultCollapsed: true,
			fields: [
				"storeLocation",
				"inputKey",
				"contextKey",
			]
		},
	],
	form: [
		{ type: "field", key: "xmlInput" },
		{ type: "section", key: "storage" },
	],
	function: async ({ cognigy, config }: xmlToJSONParams) => {
		const { api } = cognigy;
		const { xmlInput, storeLocation, contextKey, inputKey } = config;

		try {
			const result = await xml2js.parseStringPromise(xmlInput, { mergeAttrs: true });

			// convert it to a JSON string
			// const json = JSON.stringify(result, null, 4);

			if (storeLocation === "context") {
				api.addToContext(contextKey, result, "simple");
			} else {
				// @ts-ignore
				api.addToInput(inputKey, result);
			}
		} catch (err) {
			if (storeLocation === "context") {
				api.addToContext(contextKey, err, "simple");
			} else {
				// @ts-ignore
				api.addToInput(inputKey, err);
			}
		}

	}
});