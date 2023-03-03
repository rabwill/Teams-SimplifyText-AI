const axios = require("axios");
const querystring = require("querystring");
const { TeamsActivityHandler, CardFactory } = require("botbuilder");
const { Configuration, OpenAIApi } =require("openai");
const config = require("./config.js");

const configuration = new Configuration({
  apiKey: config.openai_key
});
const openai = new OpenAIApi(configuration);
console.log(config)
class TeamsBot extends TeamsActivityHandler {
   // Action.
   
handleTeamsMessagingExtensionFetchTask(context, action) {      
  try{
      switch (action.commandId) {
        case "sixyoldify":
          return sixyoldifyCommand(context, action);     
        default:
          throw new Error("NotImplemented");
      }
    }catch(e){
      console.log(e);
    }
    }
    
}
  async function sixyoldifyCommand(context, action) {
    const message = action.messagePayload;    
    const plainText = message.body.content.replace(/(<([^>]+)>)/gi, "");
    const data={text:plainText,title:"Simplified"};
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
    } ;
    return response;
  }

  async function callPrompt(data){
    const response =   await openai.createCompletion(       
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
    return `Conversation between an AI and a Human Child who is six years old.
    AI explains all questions of the child in a simple and respectful manner.
    
    Examples:
    
    Human Child: What is Quantum Physics
    AI: 
    
    Current query:
    
  
    Human Child: ${text}
    
    
    AI: `
  }


module.exports.TeamsBot = TeamsBot;
