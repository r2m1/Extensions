import { IConnectionSchema } from "@cognigy/extension-tools";

export const dataikuConnection: IConnectionSchema = {
    type: "Dataiku Connection",
    label: "Holds an API Key and domain for a Dataiku App request",
    fields: [
        { fieldName: "domain"},
        { fieldName: "USER_API_KEY"}
    ]
};