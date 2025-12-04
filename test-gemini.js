import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testModels() {
  console.log('Testing Gemini API...\n');
  
  const modelsToTry = [
    'gemini-pro',
    'gemini-1.5-pro',
    'gemini-1.5-flash',
    'gemini-1.0-pro'
  ];
  
  for (const modelName of modelsToTry) {
    try {
      console.log(`Trying model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent('Say hello');
      const response = await result.response;
      const text = response.text();
      console.log(`✅ SUCCESS with ${modelName}: ${text}\n`);
      break;
    } catch (error) {
      console.log(`❌ FAILED with ${modelName}: ${error.message}\n`);
    }
  }
}

testModels();
