export async function loadData() {
    const [chineseZodiac, westernZodiac, zodiacVibes, planetaryPositions] = await Promise.all([
      fetch('/chartreader/chineseNewYear.json').then(res => res.json()),
      fetch('/chartreader/westernZodiac.json').then(res => res.json()),
      fetch('/chartreader/zodiacVibes.json').then(res => res.json()),
      fetch('/chartreader/planetaryPositions.json').then(res => res.json())
    ]);
    return { chineseZodiac, westernZodiac, zodiacVibes, planetaryPositions };
  }
  