import fs from 'fs';
import path from 'path';
import translate from 'google-translate-api-x';

const targetLangs = ['id', 'ar', 'tr', 'de', 'es'];

// Helper to parse info.txt
function parseInfoTxt(txt) {
  const lines = txt.split(/\r?\n/);
  const data = {};
  let currentKey = null;

  for (const line of lines) {
    const keyMatch = line.match(/^([A-Za-z_]+):\s*(.*)/); // Added _ to support translated keys
    if (keyMatch) {
      currentKey = keyMatch[1];
      data[currentKey] = keyMatch[2].trim();
    } else if (currentKey?.startsWith("LongDescription")) {
      data[currentKey] = ((data[currentKey] || "") + "\n" + line).trimStart();
    }
  }
  return data;
}

// Helper to build info.txt
function buildInfoTxt(data) {
  let content = "";
  // Ensure we keep the order of standard fields if possible, or just iterate
  const standardKeys = [
    "Title", "Artist", "Category", "Medium", "Size", "SizeW", "SizeH", "SizeD", 
    "Year", "Status", "Frame", "ReadyToHang", "Authenticity", "Packaging", 
    "Handling", "ShipsFrom", "Description", "LongDescription"
  ];
  
  // Collect all keys
  const allKeys = [...standardKeys];
  for (const key of Object.keys(data)) {
    if (!allKeys.includes(key)) {
      allKeys.push(key);
    }
  }

  for (const key of allKeys) {
    if (data[key] !== undefined) {
      if (key.startsWith("LongDescription")) {
        content += `${key}:\n${data[key]}\n`;
      } else {
        content += `${key}: ${data[key]}\n`;
      }
    }
  }
  
  return content.trim();
}

async function translateText(text, lang) {
  if (!text) return "";
  try {
    const res = await translate(text, { to: lang });
    return res.text;
  } catch (err) {
    console.error(`Failed to translate to ${lang}:`, err.message);
    return "";
  }
}

async function run() {
  const artworksDir = path.join(process.cwd(), "public", "artworks");
  if (!fs.existsSync(artworksDir)) return;

  const folders = fs.readdirSync(artworksDir, { withFileTypes: true })
    .filter(d => d.isDirectory() && d.name !== "calligraphy" && d.name !== "landscape");

  for (const folder of folders) {
    const infoPath = path.join(artworksDir, folder.name, "info.txt");
    if (!fs.existsSync(infoPath)) continue;

    console.log(`Processing ${folder.name}...`);
    const raw = fs.readFileSync(infoPath, "utf8");
    const data = parseInfoTxt(raw);
    
    let updated = false;

    for (const lang of targetLangs) {
      // Translate Title
      if (data.Title && !data[`Title_${lang}`]) {
        console.log(`  Translating Title to ${lang}...`);
        data[`Title_${lang}`] = await translateText(data.Title, lang);
        updated = true;
      }
      // Translate Description
      if (data.Description && !data[`Description_${lang}`]) {
        console.log(`  Translating Description to ${lang}...`);
        data[`Description_${lang}`] = await translateText(data.Description, lang);
        updated = true;
      }
      // Translate LongDescription
      if (data.LongDescription && !data[`LongDescription_${lang}`]) {
        console.log(`  Translating LongDescription to ${lang}...`);
        data[`LongDescription_${lang}`] = await translateText(data.LongDescription, lang);
        updated = true;
      }
    }

    if (updated) {
      const newContent = buildInfoTxt(data);
      fs.writeFileSync(infoPath, newContent, "utf8");
      console.log(`✅ Updated ${folder.name}/info.txt`);
    } else {
      console.log(`No new translations needed for ${folder.name}.`);
    }
  }
}

run().catch(console.error);
