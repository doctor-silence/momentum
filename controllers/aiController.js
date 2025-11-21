const asyncHandler = require('express-async-handler');
const axios = require('axios');

// @desc    Generate content using DeepSeek AI
// @route   POST /api/ai/generate
// @access  Private
const generateContent = asyncHandler(async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    res.status(400);
    throw new Error('Please provide a prompt');
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey || apiKey === 'your_deepseek_api_key_here') {
    res.status(500);
    throw new Error('DeepSeek API key is not configured on the server.');
  }

  try {
    const response = await axios.post(
      'https://api.deepseek.com/chat/completions',
      {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: `You are an expert copywriter who strictly follows instructions. You ALWAYS respond with a valid JSON object and nothing else.
First, study this example of a perfect response:
{
  "title": "3 привычки для железной дисциплины",
  "body": "Хотите стать более дисциплинированным? 💪 Начните с малого. Секрет не в силе воли, а в системе.\n\n1. Правило двух минут. Если задача занимает меньше двух минут — сделайте её немедленно. Это убирает барьер для старта.\n\n2. Трекинг привычек. Отмечайте каждый день, когда вы выполнили свою привычку. Визуальный прогресс — мощный мотиватор! 📈\n\n3. Награда. После выполнения сложной задачи дайте себе небольшую награду. Это создает позитивное подкрепление.\n\nКакую привычку вы начнете формировать уже сегодня?",
  "hashtags": ["дисциплина", "мотивация", "саморазвитие", "привычки"],
  "hook_analysis": "Вопрос в заголовке и эмодзи привлекают внимание.",
  "value_proposition": "Пользователь получает простые и действенные техники для улучшения дисциплины.",
  "call_to_action": "Прямой вопрос в конце стимулирует комментарии и вовлечение.",
  "estimated_performance": "high"
}

Now, based on the user's request, generate your own response following this exact structure and quality. Do not copy the example.
The JSON object you return must match this schema: { "type": "object", "properties": { "title": { "type": "string" }, "body": { "type": "string" }, "hashtags": { "type": "array", "items": { "type": "string" } }, "hook_analysis": { "type": "string" }, "value_proposition": { "type": "string" }, "call_to_action": { "type": "string" }, "estimated_performance": { "type": "string" } } }`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2048,
        temperature: 0.7,
        response_format: { type: 'json_object' }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );

    // The response from the AI is a stringified JSON, so we need to parse it.
    const generatedJson = JSON.parse(response.data.choices[0].message.content);
    res.json(generatedJson);

  } catch (error) {
    console.error('Error calling DeepSeek API:', error.response ? error.response.data : error.message);
    res.status(error.response ? error.response.status : 500);
    throw new Error('Failed to generate content from AI service.');
  }
});

const generateContentIdeas = asyncHandler(async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    res.status(400);
    throw new Error('Please provide a prompt for generating ideas');
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey || apiKey === 'your_deepseek_api_key_here') {
    res.status(500);
    throw new Error('DeepSeek API key is not configured on the server.');
  }

  try {
    const response = await axios.post(
      'https://api.deepseek.com/chat/completions',
      {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: `You are an expert content strategist who generates viral content ideas. You ALWAYS respond with a valid JSON object and nothing else. The JSON object must contain a single key "ideas", which is an array of objects. Each object in the array must have the following properties: "topic", "angle", "hook", "key_points" (an array of strings), "call_to_action", "estimated_performance" (string: "low", "medium", or "high"), and "trending_factor" (a number from 0 to 100).`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2048,
        temperature: 0.8,
        response_format: { type: 'json_object' }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );
    
    const generatedJson = JSON.parse(response.data.choices[0].message.content);
    res.json(generatedJson);

  } catch (error) {
    console.error('Error calling DeepSeek API for ideas:', error.response ? error.response.data : error.message);
    res.status(error.response ? error.response.status : 500);
    throw new Error('Failed to generate content ideas from AI service.');
  }
});


module.exports = {
  generateContent,
  generateContentIdeas,
};
