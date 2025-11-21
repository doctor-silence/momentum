// This is a mock SDK to replace the functionality of the removed @base44/sdk.
// Its methods log to the console instead of making real API calls.

const agentSDK = {
  createConversation: (options) => {
    console.log('[Mock SDK] createConversation called with:', options);
    // Return a mock conversation object
    return {
      id: `mock_conv_${Date.now()}`,
      ...options,
    };
  },

  subscribeToConversation: (conversationId, callback) => {
    console.log(`[Mock SDK] Subscribed to conversation: ${conversationId}`);
    // Immediately send some mock data to the callback
    setTimeout(() => {
        callback({
            type: 'message',
            message: {
                id: 'mock_msg_1',
                role: 'agent',
                text: 'This is a mock response from the agent SDK. The original @base44/sdk has been removed.'
            }
        });
    }, 1000);

    // Return a mock unsubscribe function
    const unsubscribe = () => {
      console.log(`[Mock SDK] Unsubscribed from conversation: ${conversationId}`);
    };
    return unsubscribe;
  },

  addMessage: async (conversation, message) => {
    console.log('[Mock SDK] addMessage called with:', conversation, message);
    // Return a resolved promise as if the message was sent successfully
    return Promise.resolve();
  },
};

export default agentSDK;
