import { createNodeDescriptor, INodeFunctionBaseParams } from "@cognigy/extension-tools";
import axios from 'axios';


export interface ISoapRequestParams extends INodeFunctionBaseParams {
	config: {
		basicAuth: {
			username: string;
			password: string;
		};
		authentication: "basic";
		wsdl: string;
		xml: string;
		storeLocation: string;
		inputKey: string;
		contextKey: string;
	};
}
export const soapRequestNode = createNodeDescriptor({
	type: "soapRequest",
	defaultLabel: "SOAP Request",
	fields: [
		{
			key: "authentication",
			label: "Select Authentication",
			type: "select",
			defaultValue: "basic",
			params: {
				required: true,
				options: [
					{
						label: "Basic",
						value: "basic"
					}
				],
			}
		},
		{
			key: "basicAuth",
			label: "Basic Auth",
			type: "connection",
			params: {
				connectionType: "basic",
				required: true
			},
			condition: {
				key: "authentication",
				value: "basic",
			}
		},
		{
			key: "wsdl",
			label: "WSDL",
			type: "cognigyText",
			description: "The SOAP WSDL URL",
			params: {
				required: true
			}
		},
		{
			key: "xml",
			label: "Envelope XML",
			description: "The SOAP XML content for the request.",
			type: "xml",
			defaultValue:  `
<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:xsd="http://www.w3.org/2001/XMLSchema"
</soapenv:Envelope>
			`,
			params: {
				required: true,
			},
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
			defaultValue: "input"
		},
		{
			key: "inputKey",
			type: "cognigyText",
			label: "Input Key to store Result",
			defaultValue: "soap",
			condition: {
				key: "storeLocation",
				value: "input"
			}
		},
		{
			key: "contextKey",
			type: "cognigyText",
			label: "Context Key to store Result",
			defaultValue: "soap",
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
		{
			key: "connectionSection",
			label: "Authentication",
			defaultCollapsed: false,
			fields: [
				"authentication",
				"basicAuth"
			]
		},
	],
	form: [
		{ type: "section", key: "connectionSection" },
		{ type: "field", key: "wsdl" },
		{ type: "field", key: "xml" },
		{ type: "section", key: "storageOption" },
	],
	function: async ({ cognigy, config }: ISoapRequestParams) => {
		const { api } = cognigy;
		const { basicAuth, wsdl, xml, authentication, storeLocation, inputKey, contextKey } = config;
		const { username, password } = basicAuth;

		try {

			const response = await axios({
				method: 'post',
				url: wsdl,
				headers: {
				  'Content-Type': 'text/xml'
				},
				auth: {
				  username,
				  password
				},
				data: xml
			  });

			let cleanedResponse = response.data.replace(/\r?\n|\r/g, "");

			if (storeLocation === "context") {
				api.addToContext(contextKey, cleanedResponse, "simple");
			} else {
				// @ts-ignore
				api.addToInput(inputKey, cleanedResponse);
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