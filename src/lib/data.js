export async function loadData() {
    // Use import.meta.env.BASE_URL to get the correct base path
    const basePath = import.meta.env.BASE_URL;
    const [chineseZodiac, westernZodiac, zodiacVibes, planetaryPositions] = await Promise.all([
      fetch(`${basePath}chineseNewYear.json`).then(res => res.json()),
      fetch(`${basePath}westernZodiac.json`).then(res => res.json()),
      fetch(`${basePath}zodiacVibes.json`).then(res => res.json()),
      fetch(`${basePath}planetaryPositions.json`).then(res => res.json())
    ]);
    return { chineseZodiac, westernZodiac, zodiacVibes, planetaryPositions };
  }
  