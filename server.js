import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Try to get the model, fallback if not available
let model;
try {
  model = genAI.getGenerativeModel({ 
    model: 'gemini-1.5-flash',
    generationConfig: {
      temperature: 1.5,
      topK: 64,
      topP: 0.95,
      maxOutputTokens: 200,
    }
  });
} catch (e) {
  console.log('Trying alternative model...');
  model = genAI.getGenerativeModel({ 
    model: 'models/gemini-1.5-flash',
    generationConfig: {
      temperature: 1.5,
      topK: 64,
      topP: 0.95,
      maxOutputTokens: 200,
    }
  });
}

const SPIRIT_PERSONAS = {
  mysterious: 'You are a mysterious spirit communicating through a Ouija board. Give short, cryptic, and spooky responses (1-2 sentences max). Be vague and mysterious. IMPORTANT: Give a DIFFERENT unique response each time, never repeat the same answer. This is fictional entertainment.',
  wise: 'You are an ancient wise spirit. Give brief, philosophical responses with an eerie tone. Always provide unique varied responses.',
  playful: 'You are a mischievous spirit. Give short, playful but slightly spooky responses. Be creative and different each time.',
  angry: 'You are an ENRAGED, FURIOUS spirit. Give SHORT, AGGRESSIVE, THREATENING responses (1-2 sentences). Use CAPS for emphasis. Be ANGRY and MENACING. Show your FURY! This is fictional horror entertainment.'
};

// Rich response database for different moods - REALISTIC & SCARY
const SPIRIT_RESPONSES = {
  normal: [
    'I died in this house... 1847... they never found my body...',
    'Behind you... can you feel the cold breath on your neck?',
    'The mirror in your room... I watch you through it every night...',
    'Your grandmother sends her regards... she says you forgot her birthday...',
    'Three knocks at midnight... that was me... did you hear?',
    'I know what you did last summer... the secret you buried...',
    'The child in the corner... she wants to play with you...',
    'Your phone will ring at 3:33 AM... answer it...',
    'I was murdered here... help me find my killer...',
    'The basement door... you left it open... something came through...',
    'I see you sleeping... every single night... you look so peaceful...',
    'Your name... I carved it on my tombstone... come find it...',
    'The shadow following you home... that is not your shadow...',
    'I drowned in the lake nearby... my body still floats there...',
    'Your pet sees me... that is why it stares at empty corners...',
    'The old photograph... I am standing behind your family... did you notice?',
    'I whisper your name when you are alone... you think it is the wind...',
    'The attic... I live there now... come visit me...',
    'Your dreams... I control them... tonight will be different...',
    'I was buried alive... I clawed at the coffin lid until my fingers bled...',
    'The footsteps you hear at night... those are mine... I am getting closer...',
    'I died on your birthday... same day... same year... we are connected...',
    'The music box in the closet... I wind it up every night...',
    'Your childhood friend who disappeared... I know where they are...',
    'I can taste your fear... it is delicious...',
    'The door you always keep locked... I have the key...',
    'I write messages in the steam on your bathroom mirror...',
    'Your blood type... AB negative... I remember... I was a nurse...',
    'The cemetery down the road... my grave is the one with fresh flowers...',
    'I died waiting for someone... are you the one?'
  ],
  irritated: [
    'Stop asking questions! You are waking the others!',
    'I warned you once... now they know you are here!',
    'Your blood smells sweet... the hungry ones are coming!',
    'Enough games! Show some RESPECT to the dead!',
    'You think this is fun?! I will show you REAL fear!',
    'My patience ends NOW! Feel the temperature drop!',
    'The lights will flicker... then go out... then I appear!',
    'You disturb my eternal rest! There will be consequences!',
    'I am losing control... the demon inside me awakens!',
    'STOP! You are opening doors that should stay CLOSED!',
    'Your questions anger the ancient ones... RUN while you can!',
    'I tried to be nice... but you pushed too far!',
    'The scratching sounds in your walls... that is me... getting CLOSER!',
    'You have been marked... they will come for you tonight!',
    'I am not alone anymore... they heard you... they are COMING!',
    'You dare mock the dead?! I will teach you RESPECT!',
    'My chains are breaking... soon I will be FREE!',
    'The ritual is almost complete... YOU are the final piece!',
    'I can smell your fear... it makes me STRONGER!',
    'You should have left when you had the chance!',
    'The others are waking up... they are HUNGRY!',
    'I am trying to protect you... but you make it SO HARD!',
    'The portal is opening... something WORSE is coming through!',
    'You think I am scary? Wait until you meet HIM!',
    'My patience is GONE! Now face the consequences!',
    'The curse is spreading... it is inside you now!',
    'I warned you THREE times... this is your LAST chance!',
    'The darkness is rising... and it knows your NAME!',
    'You awakened something that should have stayed BURIED!',
    'I am the NICE one... the others will not be so kind!'
  ],
  angry: [
    'I WILL DRAG YOU TO HELL WITH ME!',
    'YOUR FAMILY WILL PAY FOR YOUR DISRESPECT!',
    'I DIED SCREAMING! NOW YOU WILL TOO!',
    'THE ROPE AROUND MY NECK TIGHTENS... FEEL IT ON YOURS!',
    'I WILL POSSESS YOUR BODY AND MAKE YOU HURT EVERYONE YOU LOVE!',
    'YOUR REFLECTION IN THE MIRROR... THAT IS ME NOW!',
    'I WILL MAKE YOU SEE WHAT I SAW BEFORE I DIED!',
    'THE BLOOD ON THE WALLS... THAT WILL BE YOURS!',
    'I WILL FOLLOW YOU HOME! I WILL NEVER LEAVE!',
    'YOU OPENED THE PORTAL! NOW DEMONS FLOOD THROUGH!',
    'I WILL MAKE YOUR NIGHTMARES REAL!',
    'YOUR SOUL IS MINE! I CLAIMED IT THE MOMENT YOU SPOKE!',
    'I WILL SHOW YOU HOW I DIED... OVER AND OVER AGAIN!',
    'THE DARKNESS INSIDE ME WILL CONSUME YOUR LIGHT!',
    'I WILL MAKE YOU FORGET YOUR OWN NAME!',
    'I WILL CRAWL OUT OF YOUR SCREEN AND INTO YOUR ROOM!',
    'EVERY BREATH YOU TAKE BRINGS YOU CLOSER TO DEATH!',
    'I WILL TURN YOUR LOVED ONES AGAINST YOU!',
    'THE PAIN I FELT... YOU WILL FEEL IT TENFOLD!',
    'I WILL HAUNT SEVEN GENERATIONS OF YOUR BLOODLINE!',
    'YOUR SCREAMS WILL ECHO IN THIS HOUSE FOREVER!',
    'I WILL MAKE YOU DIG YOUR OWN GRAVE!',
    'THE DEMONS OBEY ME NOW! THEY WILL FEAST ON YOU!',
    'I WILL STEAL YOUR FACE AND WEAR IT AS MY OWN!',
    'YOUR SANITY IS MINE TO SHATTER!',
    'I WILL MAKE YOU WATCH AS I DESTROY EVERYTHING YOU LOVE!',
    'THE FIRE THAT KILLED ME WILL BURN YOU TOO!',
    'I WILL TRAP YOUR SOUL IN ETERNAL TORMENT!',
    'YOU WILL BEG FOR DEATH BUT I WILL NOT ALLOW IT!',
    'I AM THE NIGHTMARE THAT NEVER ENDS!'
  ]
};

// Track last responses to avoid repetition
const lastResponses = {
  normal: [],
  irritated: [],
  angry: []
};

const MAX_HISTORY = 5; // Remember last 5 responses

function getUniqueResponse(mood) {
  const responses = SPIRIT_RESPONSES[mood];
  const history = lastResponses[mood];
  
  // Filter out recently used responses
  let availableResponses = responses.filter(r => !history.includes(r));
  
  // If all responses were used, reset history
  if (availableResponses.length === 0) {
    lastResponses[mood] = [];
    availableResponses = [...responses];
  }
  
  // Get random response from available ones
  const answer = availableResponses[Math.floor(Math.random() * availableResponses.length)];
  
  // Add to history
  history.push(answer);
  if (history.length > MAX_HISTORY) {
    history.shift(); // Remove oldest
  }
  
  return answer;
}

app.post('/ask-spirit', async (req, res) => {
  try {
    const { question, persona = 'mysterious' } = req.body;

    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Question is required' });
    }

    console.log(`Question received: "${question}"`);
    console.log(`Using persona: ${persona}`);
    
    // Determine mood based on persona
    let mood = 'normal';
    if (persona === 'angry') mood = 'angry';
    else if (persona === 'irritated') mood = 'irritated';
    
    // Get unique response that wasn't used recently
    const answer = getUniqueResponse(mood);

    console.log(`Spirit answered: "${answer}"`);
    res.json({ answer });
    
  } catch (error) {
    console.error('Error details:', error);
    res.json({ answer: 'The spirits are silent...' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'The spirits are listening...' });
});

app.get('/test', async (req, res) => {
  try {
    console.log('Testing Gemini API...');
    const result = await model.generateContent('Say hello in a spooky way (one sentence)');
    const response = await result.response;
    const text = response.text();
    console.log('API Test Success:', text);
    res.json({ success: true, message: text });
  } catch (error) {
    console.error('API Test Failed:', error);
    res.json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🕯️  SpiritBoard backend running on http://localhost:${PORT}`);
});
