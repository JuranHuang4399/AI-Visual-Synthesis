import fetch from "node-fetch";

const API = "http://localhost:5000/api/characters/generate";

async function testImageCount(count) {
  console.log(`\n=== Testing imageCount = ${count} ===`);

  const payload = {
    name: "TestCharacter",
    characterClass: "Mage",
    personality: "Calm",
    appearance: "Blue robe",
    specialFeatures: "Magic staff",
    imageCount: count,
  };

  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  console.log("Status:", res.status);
  console.log("Story:", data.story);
  console.log("Image Count Returned:", data.images?.length);
}

async function runTests() {
  await testImageCount(1);
  await testImageCount(4);
  await testImageCount(8);
}

runTests();
