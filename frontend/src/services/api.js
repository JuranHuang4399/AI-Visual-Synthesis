export async function generateCharacter(data) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/characters/generate`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to generate character");
  }

  return res.json();
}
