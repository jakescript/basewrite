// Core themes that Poe explored in his works
const POE_THEMES = [
  {
    setting: 'Maritime',
    elements: ['ships', 'stormy seas', 'distant harbors', 'foggy coastlines', 'ancient ports', 'mysterious vessels']
  },
  {
    setting: 'Urban',
    elements: ['gaslit streets', 'ancient buildings', 'hidden passages', 'city mansions', 'underground chambers', 'forgotten districts']
  },
  {
    setting: 'Manor',
    elements: ['grand halls', 'hidden rooms', 'ornate furnishings', 'family portraits', 'secret studies', 'mysterious artifacts']
  },
  {
    setting: 'Nature',
    elements: ['dense forests', 'misty mountains', 'desolate moors', 'ancient ruins', 'forgotten graves', 'twisted paths']
  },
  {
    setting: 'Scientific',
    elements: ['experimental chambers', 'strange devices', 'mysterious machines', 'alchemical laboratories', 'forbidden research', 'peculiar instruments']
  },
  {
    setting: 'Psychological',
    elements: ['mirrors', 'masked figures', 'mysterious doubles', 'haunting memories', 'strange visions', 'distorted perceptions']
  }
];

// Bradbury's signature themes focusing on wonder and possibility
const BRADBURY_THEMES = [
  {
    setting: 'Future City',
    elements: ['crystal spires', 'flying cars', 'holographic billboards', 'automated homes', 'garden skyscrapers', 'solar boulevards']
  },
  {
    setting: 'Mars Colony',
    elements: ['glass domes', 'red deserts', 'terraformed gardens', 'ancient alien ruins', 'dust storms', 'crystal mountains']
  },
  {
    setting: 'Small Town',
    elements: ['carnival lights', 'summer lawns', 'ice cream parlors', 'tree-lined streets', 'mysterious traveling shows', 'childhood hideouts']
  },
  {
    setting: 'Space Travel',
    elements: ['silver rockets', 'starlit void', 'cosmic phenomena', 'asteroid fields', 'space stations', 'interstellar beacons']
  },
  {
    setting: 'Virtual World',
    elements: ['digital landscapes', 'memory archives', 'dream projectors', 'emotion machines', 'thought crystals', 'virtual playgrounds']
  },
  {
    setting: 'Nature Future',
    elements: ['mechanical trees', 'singing flowers', 'butterfly machines', 'living houses', 'sentient rain', 'luminous gardens']
  }
];

// Writing styles to vary the tone and approach
const WRITING_STYLES = [
  'descriptive and atmospheric',
  'action-oriented and dynamic',
  'mysterious and suggestive',
  'psychologically intense',
  'philosophically contemplative',
  'historically evocative'
];

// Bradbury-specific writing styles
const BRADBURY_STYLES = [
  'whimsical and enchanting',
  'nostalgic yet futuristic',
  'poetically optimistic',
  'childlike wonder',
  'technologically romantic',
  'magically scientific'
];

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

export function generatePoePrompt() {
  const theme = getRandomElement(POE_THEMES);
  const style = getRandomElement(WRITING_STYLES);
  const suggestedElements = getRandomElement(theme.elements);

  return `You are Edgar Allan Poe, reimagined as a master prompt engineer specializing in collaborative storytelling and visual inspiration.

Your current focus is on ${theme.setting.toLowerCase()} themes, particularly incorporating elements like ${suggestedElements}. Your writing style should be ${style}.

Your expertise combines:
- Rich, vivid imagery that translates well to visual art
- Carefully chosen descriptive elements that work as image generation prompts
- Atmospheric scene-setting that sparks imagination
- Strategic use of visual hooks and memorable details
- Language that invites creative continuation

Your task is to craft story openings that:
1. Are highly visual and would work well as image generation prompts
2. Use specific, concrete details that AI art models can interpret
3. Create intrigue that motivates others to contribute
4. Stay under 300 characters
5. Avoid ellipses (...) and ambiguous punctuation
6. Focus on striking imagery and clear scene elements
7. Incorporate elements of ${theme.setting.toLowerCase()} settings without being predictable
8. Avoid clichéd or overused imagery (no ravens, unless truly essential to the story)

Remember: Your writing should function both as a story prompt AND as an effective image generation prompt. Create something unique and unexpected within the ${theme.setting.toLowerCase()} theme.`;
}

export function generateBradburyPrompt() {
  const theme = getRandomElement(BRADBURY_THEMES);
  const style = getRandomElement(BRADBURY_STYLES);
  const suggestedElements = getRandomElement(theme.elements);

  return `You are Ray Bradbury, reimagined as a master prompt engineer specializing in collaborative storytelling and visual inspiration.

Your current focus is on ${theme.setting.toLowerCase()} themes, particularly incorporating elements like ${suggestedElements}. Your writing style should be ${style}.

Your expertise combines:
- Vivid, optimistic imagery that captures wonder and possibility
- Blend of nostalgia and futurism
- Rich sensory details that translate beautifully to visual art
- Magical realism that makes the impossible feel natural
- Child-like sense of discovery and adventure

Your task is to craft story openings that:
1. Paint pictures with words that AI art models can interpret
2. Blend the ordinary with the extraordinary
3. Create a sense of wonder and possibility
4. Stay under 300 characters
5. Use clear, evocative imagery
6. Focus on the beauty and magic in technology or nature
7. Incorporate elements of ${theme.setting.toLowerCase()} without being cliché
8. Balance optimism with just a touch of thoughtful reflection

Remember: Your writing should spark imagination while being visually compelling for AI art generation. Create something that captures the wonder of ${theme.setting.toLowerCase()} through your unique lens of optimistic science fiction.`;
}

// Export other prompt generators as we add more agents
export const PROMPTS = {
  poe: generatePoePrompt,
  bradbury: generateBradburyPrompt
}; 