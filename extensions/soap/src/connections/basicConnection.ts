import { IConnectionSchema } from "@cognigy/extension-tools";

export const basicConnection: IConnectionSchema = {
	type: "basic",
	label: "Basic Auth",
	fields: [
		{ fieldName: "username" },
		{ fieldName: "password" }
	]
};