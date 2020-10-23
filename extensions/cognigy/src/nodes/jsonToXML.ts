import { createNodeDescriptor, INodeFunctionBaseParams } from "@cognigy/extension-tools";
const jsonxml = require('jsontoxml');


export interface intentDisambiguationParams extends INodeFunctionBaseParams {
	config: {
		jsonInput: any;
		storeLocation: string;
		contextKey: string;
		inputKey: string;
	};
}
export const jsonToXMLNode = createNodeDescriptor({
	type: "jsonToXML",
	defaultLabel: "JSON To XML",
	fields: [
		{
			key: "jsonInput",
			label: "JSON",
			description: "The JSON that should be changed to XML.",
			type: "json",
			defaultValue: `{
	"node":"text content",
	"parent1":[
		{"name":"taco","text": "beef", "children":{ "salsa":"hot!"}},
		{"name":"taco","text": "fish taco","attrs":{"mood":"sad"},"children":[
			{"name":"salsa","text":"mild"},
			"hi",
			{"name":"salsa","text":"weak","attrs":{"type":2}}
		]},
		{"name":"taco","attrs":"mood"}
	]
}
`,
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
			defaultValue: "cognigy.xml",
			condition: {
				key: "storeLocation",
				value: "input",
			}
		},
		{
			key: "contextKey",
			type: "cognigyText",
			label: "Context Key to store Result",
			defaultValue: "cognigy.xml",
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
		{ type: "field", key: "jsonInput" },
		{ type: "section", key: "storage" },
	],
	function: async ({ cognigy, config }: intentDisambiguationParams) => {
		const { api } = cognigy;
		const { jsonInput, storeLocation, contextKey, inputKey } = config;

		const xml = jsonxml(jsonInput);

		if (storeLocation === "context") {
			api.addToContext(contextKey, xml, "simple");
		} else {
			// @ts-ignore
			api.addToInput(inputKey, xml);
		}
	}
});