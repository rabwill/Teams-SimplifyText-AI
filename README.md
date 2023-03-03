# Simplify-Text

This app is a Teams message extension app which will simplify a text in the Teams conversation.
The app is built using Teams Toolkit for Visual Studio Code and uses OpenAI's completions API to generate simplified text. It also uses the moderation API to check if the message violate OpenAI's content policy.

![simplify app added into teams and showing a simplified text of a message](/bot/images/simplify-ai-app.gif)

## Command

**Simplify it for me** - To generate a simplified version of the message passed.


## Prerequisites

- [Node.js](https://nodejs.org/en/), supported versions: 18
- An M365 account. If you do not have M365 account, apply one from [M365 developer program](https://developer.microsoft.com/en-us/microsoft-365/dev-program)
- [Teams Toolkit Visual Studio Code Extension](https://aka.ms/teams-toolkit) version v4.2.4 
- [Open AI key](https://platform.openai.com/account/api-keys)

## Debug

- From Visual Studio Code: Start debugging the project by hitting the `F5` key in Visual Studio Code. 
- Alternatively use the `Run and Debug Activity Panel` in Visual Studio Code and click the `Run and Debug` green arrow button.

## Test the app 

- Clone repository
- Open project in VS Code
- Start a debug session to provision resources on first run
- Add the following variables to bot\src\.env.teamsfx.local
- OPENAI_API_KEY=(your OpenAI key)
- Stop and start debug session for variables to take effect

## Further reading

### Bot

- [Bot Basics](https://docs.microsoft.com/azure/bot-service/bot-builder-basics?view=azure-bot-service-4.0)
- [Bot Framework Documentation](https://docs.botframework.com/)
- [Azure Bot Service Introduction](https://docs.microsoft.com/azure/bot-service/bot-service-overview-introduction?view=azure-bot-service-4.0)

### Message Extension

- [Search Command](https://docs.microsoft.com/en-us/microsoftteams/platform/messaging-extensions/how-to/search-commands/define-search-command)
- [Action Command](https://docs.microsoft.com/en-us/microsoftteams/platform/messaging-extensions/how-to/action-commands/define-action-command)
- [Link Unfurling](https://docs.microsoft.com/en-us/microsoftteams/platform/messaging-extensions/how-to/link-unfurling?tabs=dotnet)
