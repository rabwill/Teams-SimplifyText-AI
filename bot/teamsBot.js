const { TeamsActivityHandler, CardFactory } = require("botbuilder");
const { Configuration, OpenAIApi } = require("openai");
const config = require("./config.js");
//OpenAI config
const configuration = new Configuration({
  apiKey: config.openai_key
});
const openai = new OpenAIApi(configuration);

class TeamsBot extends TeamsActivityHandler {
// Action.

  handleTeamsMessagingExtensionFetchTask(context, action) {
    try {
      switch (action.commandId) {
        case "simplify":
          return simplifyCommand(context, action);
        default:
          throw new Error("NotImplemented");
      }
    } catch (e) {
      console.log(e);
    }
  }

}
//Command
async function simplifyCommand(context, action) {
  const message = action.messagePayload;
  const plainText = message.body.content.replace(/(<([^>]+)>)/gi, "");
  //check modertation of content
  const resModeration = await openai.createModeration({
    input: plainText,
  });
  const errorCard = {
    task: {
      type: "continue",
      value: {
        card: CardFactory.adaptiveCard({
          body: [
            {
              "text": "Sorry, this message violates OpenAI's Content Policy",
              "type": "TextBlock",
              "wrap": true,
              "size": "medium",
              "weight": "bolder"
            }
          ],
          type: 'AdaptiveCard',
          version: '1.0'
        }),
        title: "This is the simplified form of the message"
      }
    }
  };
  if (resModeration.data.results[0].flagged)
    return errorCard
  else {
    const data = { text: plainText, title: "Simplified" };
    const reply = await callPrompt(data);
    const response = {
      task: {
        type: "continue",
        value: {
          card: CardFactory.adaptiveCard({
            body: [
              {
                "text": "Here is the simplified form of ",
                "type": "TextBlock",
                "wrap": true,
                "size": "medium",
                "weight": "bolder"
              },
              {
                "text": plainText,
                "type": "TextBlock",
                "isSubtle": true,
                "wrap": true

              },
              {
                "text": reply,
                "type": "TextBlock",
                "weight": "bolder",
                "wrap": true
              }
            ],
            type: 'AdaptiveCard',
            version: '1.0'
          }),
          title: "This is the simplified form of the message"
        }
      }
    };
    return response;
  }

}
//Call OpenAI completion API
async function callPrompt(data) {
  const response = await openai.createCompletion(
    {
      prompt: generatePrompt(data.text),
      model: 'text-davinci-003',
      temperature: 0.7,
      max_tokens: 512,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    }
  );

  if (response.status != 429) {
    return response.data?.choices[0]?.text ?? '';
  } else {
    throw new Error(`The request to OpenAI was rate limited. Please try again later.`);
  }
}
function generatePrompt(text) {
  return `Conversation between an AI and a Human needs to simplify the message.
    AI explains all messages in a simple and respectful manner.
    
    Examples:
    
    Human: What is Quantum Physics
    AI: 
    
    Current query:
    
  
    Human: ${text}
    
    
    AI: `
}

module.exports.TeamsBot = TeamsBot;
