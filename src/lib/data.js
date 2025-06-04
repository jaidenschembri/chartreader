export async function loadData() {
    const [chineseZodiac, westernZodiac, zodiacVibes, planetaryPositions] = await Promise.all([
      fetch('/chineseNewYear.json').then(res => res.json()),
      fetch('/westernZodiac.json').then(res => res.json()),
      fetch('/zodiacVibes.json').then(res => res.json()),
      fetch('/planetaryPositions.json').then(res => res.json())
    ]);
    return { chineseZodiac, westernZodiac, zodiacVibes, planetaryPositions };
  }
  