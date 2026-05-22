const fs = require('fs');
const path = require('path');

const translations = {
  "cal-rezeki-yang-tak-tertukar-7109": {
    "Title_en": "Unswapped Fortune",
    "Description_en": "This artwork is inspired by QS. Hud: 6, \"And there is no creature on earth but that upon Allah is its provision,\" an affirmation that there is no single creature on earth whose sustenance is not guaranteed by Allah.",
    "LongDescription_en": "Calligraphy standing bright against a dark background becomes a metaphor for certainty amidst the uncertainty of life, about a portion that has been measured before the first step is taken. In every layer of texture and shadow, there is an implied message that fortune is not something to be pursued with fear, but believed in with tranquility because what has been decreed will never be swapped, will never be late, and will never go to the wrong address."
  },
  "cal-untitled-3942": {
    "Title_en": "A Pause Behind the Calm",
    "Description_en": "There is a different kind of tranquility when viewing this painting. Condro successfully captures a moment where nature seems to pause, allowing yellow lotus flowers to emerge amidst the dark water surface.",
    "LongDescription_en": "The choice of dark colors dominating the canvas is not to drown the object, but to provide space for the yellow of the flowers and the green of the leaves to appear more alive. The thick brushstroke technique (impasto) provides real texture; you can almost feel the physical form of every petal and water ripple.\n\nThis painting does not try to be grand or dramatic. Instead, it feels honest. For me, this artwork is a reminder that beauty is often found in quiet moments, in inconspicuous places, and in calm simplicity."
  },
  "lan-001": {
    "Title_en": "The Charm of the White Crater Mist",
    "Description_en": "Through textured and richly detailed brushstrokes, this painting captures the magical moment when thick mist blankets the stairs leading to the White Crater.",
    "LongDescription_en": "The bright color accents of the visitors' umbrellas provide a touch of life amidst nature's melancholy. The thick paint texture on the wet-looking steps gives a real sensory impression, as if inviting us to feel the cold and damp air creeping between the trees of the mountain forest.\n\nCondro Puspitosari worked on this canvas over several weeks, building layer upon layer of oil paint to achieve the atmospheric depth that makes the mist feel tangible. The technique of layered glazes thin, translucent applications of color over dried layers creates a luminosity that cannot be achieved any other way.\n\nThis painting is not a photograph of a place. It is a feeling made visible the sensation of standing in silence as the world slowly reveals itself at dawn."
  },
  "lan-003": {
    "Title_en": "From the Bridge",
    "Description_en": "This painting captures a row of fishing boats resting on the calm riverbanks, viewed from an elevated perspective.",
    "LongDescription_en": ""
  },
  "lan-004": {
    "Title_en": "Emerald Canopy",
    "Description_en": "An immersive journey into the tropical rainforest canopy where light filters through a thousand shades of green, alive and breathing.",
    "LongDescription_en": "\"Emerald Canopy\" invites the viewer to look upward into the dense tropical canopy of the Indonesian rainforest, where sunlight filters through countless layers of leaves, creating a cathedral of green light. It is an immersive work that fills the viewer's field of vision with life and color.\n\nCondro mixed over forty distinct shades of green to achieve the natural variety found in a real forest canopy. The painting rewards close inspection individual leaves, hanging vines, and scattered epiphytes emerge from the overall impression of lush abundance.\n\nThis piece brings the forest indoors. It is particularly suited to spaces that seek a connection with nature a living room, a meditation space, a hotel lobby that wants to ground its guests in the beauty of the natural world."
  },
  "lan-nirwana-kecil-di-dalam-pasu-3202": {
    "Title_en": "A Small Nirvana in a Vase",
    "Description_en": "There is a very strong classical impression in this painting. Condro presents a floral composition in a vase that feels like a sweet piece of memory.",
    "LongDescription_en": "This artwork is proof that \"nirvana\" doesn't always have to be something grand or distant. Sometimes, it is just a bunch of flowers on a table, which, if we take the time to look at them, can provide a sense of peace and warmth amidst a busy day."
  },
  "lan-senandung-hijau-teratai-3369": {
    "Title_en": "\"The Green Song of the Lotus\"",
    "Description_en": "\"The Green Song of the Lotus\" captures a moment of animated silence upon the lake's surface. Through a dynamic play of brush textures, this canvas seems to sing a melody of tranquility. Amidst the domination of deep greens and faintly moving water reflections, the presence of elegantly blooming pink lotus flowers marks a life growing in peace. An artwork that invites the eyes to gaze, and the soul to rest.",
    "LongDescription_en": "Gazing at \"The Green Song of the Lotus\" is a visual journey to a quiet corner of a lake, yet full of life. This artwork successfully captures nature's duality: absolute tranquility as well as subtle movement.\n\nThe artist keenly explores a rich green color palette—from deep moss to light green glows catching light refractions. The thick and bold brushstrokes on the canvas do not let the water appear static; they create living ripples, like a gentle, unbroken song.\n\nAbove this green melody, pink lotus buds serve as the main protagonists. They bloom boldly, protruding among the calm, round lily pads. The color contrast presented does not clash, but blends into a harmonious symphony. There is a depth of emotion presented here—a reminder that even in the quietest spaces, beauty will always find a way to bloom and speak.\n\n\"The Green Song of the Lotus\" is not just a landscape painting; it is a visual poem about peace, balance, and the eternal elegance of nature."
  },
  "lan-senandung-sunyi-telaga-3079": {
    "Title_en": "The Silent Song of the Lake",
    "Description_en": "In Condro's latest work (2026), we are invited to witness a celebration of life growing within absolute silence. This lotus landscape painting displays technical maturity and a captivating depth of feeling, combining a dynamic impressionistic style with a contemplative atmosphere.",
    "LongDescription_en": "The visual focus is immediately drawn to the cluster of pink lotuses in the foreground, blooming elegantly above a bed of fresh green leaves. However, the magical power of this painting actually lies in how the artist processes the water background. By using deep dark colors—a blend of dark green, faint sapphire blue, and black shadows—this canvas successfully creates the illusion of mysterious water depth."
  },
  "lan-teratai-di-langi-0404": {
    "Title_en": "Lotus in Langi",
    "Description_en": "This painting depicts the peacefulness of a pond filled with lotus plants.",
    "LongDescription_en": "With soft yet textured color strokes, there is a blend of leafy green and pink flower accents naturally scattered on the water's surface. The light blue color dominating the background gives the impression of clear water and a bright morning atmosphere. Its simple composition provides a calm feeling for anyone who sees it, as if standing by the pond while enjoying a gentle breeze."
  },
  "cal-bacalah-4050": {
    "Title_en": "Read",
    "Description_en": "This verse was the first to descend upon the Messenger, may God bless him and grant him peace. The letter was revealed at the beginning of prophethood. At that time he could not write and did not understand about faith. Then Gabriel came bringing a revelation. Then Gabriel ordered the prophet to read it. He -sallallahu 'alaihi wa sallam- refused. He said,",
    "LongDescription_en": "\"I cannot read.\" (HR. Bukhari no. 3). He kept saying that until he finally read it. Then the verse came down,\n\n\"Read with (mentioning) the name of your Lord Who created\". What is meant by creating here is creating creatures in general. But what is specifically meant here is humans. Man was created from a blood clot as mentioned in the next verse,\n\n\"He created man from a blood clot.\"\n\nMan is not only created, but he is also governed and prohibited. To explain these commands and prohibitions, the Messenger was sent and Al Kitab (Al Qur'an) was revealed. Therefore, after narrating the command to read, it is mentioned about the creation of man."
  },
  "_cal-002": {
    "Title_en": "To Your Lord You Hope",
    "Description_en": "Meaning:",
    "LongDescription_en": ""
  }
};

const dir = path.join(process.cwd(), 'public', 'artworks');
const folders = fs.readdirSync(dir, { withFileTypes: true }).filter(d => d.isDirectory() && d.name !== 'calligraphy' && d.name !== 'landscape');

for (const f of folders) {
  const infoPath = path.join(dir, f.name, 'info.txt');
  if (fs.existsSync(infoPath) && translations[f.name]) {
    let raw = fs.readFileSync(infoPath, 'utf8');
    if (!raw.includes('Title_en:')) {
      const { Title_en, Description_en, LongDescription_en } = translations[f.name];
      let appendText = `\nTitle_en: ${Title_en}\nDescription_en: ${Description_en}`;
      if (LongDescription_en) {
        appendText += `\nLongDescription_en:\n${LongDescription_en}`;
      }
      fs.appendFileSync(infoPath, appendText, 'utf8');
      console.log(`Updated ${f.name}`);
    }
  }
}
console.log('Done appending translations.');
