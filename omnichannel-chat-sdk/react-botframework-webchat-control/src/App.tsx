import './App.css';

import { useCallback, useState } from 'react'

import { FluentThemeProvider } from 'botframework-webchat-fluent-theme';
import { OmnichannelChatSDK } from '@microsoft/omnichannel-chat-sdk';
import ReactWebChat from 'botframework-webchat';
import fetchChatSDKConfig from './utils/fetchChatSDKConfig';
import loadOmnichannelConfig from './utils/LoadOmnichannelConfig';

function App() {
  const [chatSDK, setChatSDK] = useState<OmnichannelChatSDK>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [chatAdapter, setChatAdapter] = useState<any>(undefined);

  const [botId, setBotId] = useState('');

  const [status, setStatus] = useState('Not Initialized'); // New state for status

  const handleBotIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBotId(event.target.value);
  };

  const loadChatSDK = useCallback(async () => {
        
    const omnichannelConfig = loadOmnichannelConfig(botId);

    const chatSDKConfig = fetchChatSDKConfig();

    const init = async () => {
      const chatSDK = new OmnichannelChatSDK(omnichannelConfig, chatSDKConfig);
      await chatSDK.initialize();
      setChatSDK(chatSDK);
      await chatSDK.getLiveChatConfig();
      console.log("Chat SDK initialized!");
      setStatus("Initialized")
    }

    init();

  }, [botId]);

  const startChat = useCallback(async () => {
    await chatSDK?.startChat();
    console.log("Chat started!");
    setStatus('Chat started'); // Update status
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await chatSDK?.onNewMessage((message: any) => {
      console.log(`New message!`)
      console.log(message?.content);
    });

    const chatAdapter = await chatSDK?.createChatAdapter();
    setChatAdapter(chatAdapter);
  }, [chatSDK]);

  const endChat = useCallback(async () => {
    await chatSDK?.endChat();
    setStatus('Chat ended'); // Update status
  }, [chatSDK]);

  const resetChatSDK = useCallback(async () => {
    console.log("Resetting chat SDK...")

    setChatSDK(undefined);
    setChatAdapter(undefined);
    setStatus('Not Initialized'); // Reset status

    setBotId('');

    console.log("Chat SDK reset!");
  },[]);

  return (
    <div className="app-container">
      <div className="card">
        <h1>Omnichannel Chat Configuration</h1>
        {status && <p className="status-label">Status : {status}</p>} {/* Status label */}

        <div className="form-group">
          <label htmlFor="botId">Bot ID (GUID format):</label>
          <input
            type="text"
            id="botId"
            placeholder="Enter the CPS Bot ID"
            value={botId}
            onChange={handleBotIdChange}
          />
        </div>
        <div className="button-group">
          <button id="initButton" onClick={loadChatSDK}>
            Initialize
          </button>
          <button id="resetButton" onClick={resetChatSDK}>
            Reset
          </button>

        </div>
        
      </div>
  
      <div className="card">
        <h2>Chat Controls</h2>
        <div id="controls" className="button-group">
          <button id="startChatButton" onClick={startChat}>
            Start Chat
          </button>
          <button id="endchatButton" onClick={endChat}>
            End Chat
          </button>
        </div>
      </div>
  
      <div className="chat-container">
        {chatAdapter && (
          <FluentThemeProvider>
            <ReactWebChat directLine={chatAdapter} />
          </FluentThemeProvider>
        )}
      </div>
    </div>
  );
}

export default App
