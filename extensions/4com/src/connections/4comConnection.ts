import { IConnectionSchema } from "@cognigy/extension-tools";

export const fourComConnection: IConnectionSchema = {
	type: "4com",
	label: "4Com Connection",
	fields: [
		{ fieldName: "apiUrl" },
		{ fieldName: "entranceId" },
		{ fieldName: "proxyUrl" },
		{ fieldName: "cogApiUrl" },
		{ fieldName: "cogApiKey" }
	]
};