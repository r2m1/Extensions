Integrates with 4Com Live Chat.

### Connection
This Extension needs a Connection to be defined and passed to the Nodes. The Connection must have the following keys:

1. API URL
  - key: apiUrl
  - value: 4Com API Base URL, e.g. https://api.multichannelacd.de/chat/v1/product/acd123/
2. Entrance ID
  - key: entranceId
  - value: 4Com Live Chat entrance id
3. Proxy URL
  - key: proxyUrl
  - value: URL of the used proxy for sending the message callbacks to the 4Com message server.
4. Cognigy API URL
  - key: cogApiUrl
  - value: Cognigy.AI API Base Url, such https://api-trial.cognigy.ai/new/
5. Cognigy API Key
  - key: cogApiKey
  - value: Cognigy.AI API Key


# Node: Start Live Chat

This node initializes a new live chat session in 4Com. Therefore, it will be executed once in a Cognigy.AI Flow in order to create the required `roomId`. Furthermore, it stores the following data information into the context object:

```json
"livechat": {
    "roomId": "93c-afb66bbbc107",
    "person": {
      "id": "a.teusz@cognigy.com",
      "role": "participant",
      "gender": "d",
      "firstname": "Cognigy",
      "lastname": "User",
      "phone": "",
      "email": "",
      "properties": {
        "source": "chat"
      },
      "avatar": ""
    }
  }
```
# Node: Join / Leave Live Chat

After creating a live chat **room** with the `Start Live Chat` node, the Cognigy user needs to **join** this session in order to send and retreive messages. However, this node also provides the opportunity to **leave** a running chat session. Next to the user's behavior, the `roomId` needs to be provided which was created before.

Since the 4Com agent messages need to be forwarded to the Cognigy.AI endpoint, such as the webchat, the third required argument is the **Message Server Callback Url**. This could look such as: `https://4com-message-server.com/callback`.

This node will return the chosen behavior:

```json
{
  "livechat": {
    "...": "...",
    "behavior": "chatjoin"
  }
}
```

# Send Message to Live Agent

This node sends a text message to the 4Com live chat room and thus to the agent. In this case, the default value for the text is the `{{input.text}}` user input message. It will return `true`, if the message was sent successfully:

```json
{
  "livechat": {
    "...": "...",
    "message": true
  }
}