export function getWesternZodiac(birthday, westernZodiac) {
    const month = birthday.getMonth() + 1;
    const day = birthday.getDate();
  
    for (let sign of westernZodiac) {
      const [startMonth, startDay] = sign.start.split('-').map(Number);
      const [endMonth, endDay] = sign.end.split('-').map(Number);
      const afterStart = (month > startMonth) || (month === startMonth && day >= startDay);
      const beforeEnd = (month < endMonth) || (month === endMonth && day <= endDay);
      if (startMonth <= endMonth) {
        if (afterStart && beforeEnd) return sign.sign;
      } else {
        if (afterStart || beforeEnd) return sign.sign;
      }
    }
    return "Unknown";
  }
  
  export function getChineseZodiac(birthday, chineseZodiac) {
    const year = birthday.getFullYear();
    const thisYear = chineseZodiac.find(z => z.year === year);
    const lastYear = chineseZodiac.find(z => z.year === (year - 1));
    if (!thisYear) return { animal: "Unknown", element: "Unknown" };
    
    if (birthday < new Date(thisYear.newYear)) {
      return lastYear ? { animal: lastYear.animal, element: lastYear.element } : { animal: "Unknown", element: "Unknown" };
    } else {
      return { animal: thisYear.animal, element: thisYear.element };
    }
  }
  
  export function getZodiacVibe(westernSign, chineseSign, zodiacVibes) {
    return zodiacVibes.find(v => v.western === westernSign && v.chinese === chineseSign) || {
      vibe: "Unique Combination",
      description: "Your combination of Western and Chinese zodiac signs creates a truly unique energy that's all your own!"
    };
  }
  
  export function setupTheme() {
    // Check if user has a saved preference
    const savedTheme = localStorage.getItem('theme');
    
    // Check if user prefers dark mode from system settings
    const prefersDarkMode = window.matchMedia && 
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme based on saved preference or system preference
    const initialTheme = savedTheme || (prefersDarkMode ? 'dark' : 'light');
    setTheme(initialTheme);
    
    // Return the current theme for reactive state
    return initialTheme;
  }
  
  export function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }
  
  export function toggleTheme(currentTheme) {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    return newTheme;
  }
  
  export function getEasternCompatibility(chineseSign) {
    // Eastern zodiac compatibility based on triads and enemy relationships
    const triadGroups = {
      'Snake': { triad: ['Snake', 'Rooster', 'Ox'], enemy: 'Pig' },
      'Rooster': { triad: ['Snake', 'Rooster', 'Ox'], enemy: 'Cat' },
      'Ox': { triad: ['Snake', 'Rooster', 'Ox'], enemy: 'Goat' },
      
      'Rat': { triad: ['Rat', 'Dragon', 'Monkey'], enemy: 'Horse' },
      'Dragon': { triad: ['Rat', 'Dragon', 'Monkey'], enemy: 'Dog' },
      'Monkey': { triad: ['Rat', 'Dragon', 'Monkey'], enemy: 'Tiger' },
      
      'Tiger': { triad: ['Tiger', 'Dog', 'Horse'], enemy: 'Monkey' },
      'Dog': { triad: ['Tiger', 'Dog', 'Horse'], enemy: 'Dragon' },
      'Horse': { triad: ['Tiger', 'Dog', 'Horse'], enemy: 'Rat' },
      
      'Cat': { triad: ['Cat', 'Pig', 'Goat'], enemy: 'Rooster' },
      'Pig': { triad: ['Cat', 'Pig', 'Goat'], enemy: 'Snake' },
      'Goat': { triad: ['Cat', 'Pig', 'Goat'], enemy: 'Ox' }
    };
    
    const group = triadGroups[chineseSign] || {
      triad: [],
      enemy: 'Unknown'
    };
    
    // Filter out the current sign from triad to get only friends
    const friends = group.triad.filter(sign => sign !== chineseSign);
    
    return {
      'Best Friends': friends,
      'Enemy': [group.enemy]
    };
  }
  
  export function getCompatibility(westernSign, chineseSign) {
    // If Chinese sign is provided, use Eastern compatibility
    if (chineseSign) {
      return getEasternCompatibility(chineseSign);
    }
    
    // Otherwise use Western compatibility (keeping as fallback)
    const compatibilityMap = {
      'Aries': {
        'Best Match': ['Leo', 'Sagittarius'],
        'Good Match': ['Gemini', 'Aquarius', 'Libra'],
        'Challenge': ['Cancer', 'Capricorn']
      },
      'Taurus': {
        'Best Match': ['Virgo', 'Capricorn'],
        'Good Match': ['Cancer', 'Pisces', 'Scorpio'],
        'Challenge': ['Leo', 'Aquarius']
      },
      'Gemini': {
        'Best Match': ['Libra', 'Aquarius'],
        'Good Match': ['Aries', 'Leo', 'Sagittarius'],
        'Challenge': ['Virgo', 'Pisces']
      },
      'Cancer': {
        'Best Match': ['Scorpio', 'Pisces'],
        'Good Match': ['Taurus', 'Virgo', 'Capricorn'],
        'Challenge': ['Aries', 'Libra']
      },
      'Leo': {
        'Best Match': ['Aries', 'Sagittarius'],
        'Good Match': ['Gemini', 'Libra', 'Aquarius'],
        'Challenge': ['Taurus', 'Scorpio']
      },
      'Virgo': {
        'Best Match': ['Taurus', 'Capricorn'],
        'Good Match': ['Cancer', 'Scorpio', 'Pisces'],
        'Challenge': ['Gemini', 'Sagittarius']
      },
      'Libra': {
        'Best Match': ['Gemini', 'Aquarius'],
        'Good Match': ['Leo', 'Sagittarius', 'Aries'],
        'Challenge': ['Cancer', 'Capricorn']
      },
      'Scorpio': {
        'Best Match': ['Cancer', 'Pisces'],
        'Good Match': ['Virgo', 'Capricorn', 'Taurus'],
        'Challenge': ['Leo', 'Aquarius']
      },
      'Sagittarius': {
        'Best Match': ['Aries', 'Leo'],
        'Good Match': ['Libra', 'Aquarius', 'Gemini'],
        'Challenge': ['Virgo', 'Pisces']
      },
      'Capricorn': {
        'Best Match': ['Taurus', 'Virgo'],
        'Good Match': ['Scorpio', 'Pisces', 'Cancer'],
        'Challenge': ['Aries', 'Libra']
      },
      'Aquarius': {
        'Best Match': ['Gemini', 'Libra'],
        'Good Match': ['Aries', 'Leo', 'Sagittarius'],
        'Challenge': ['Taurus', 'Scorpio']
      },
      'Pisces': {
        'Best Match': ['Cancer', 'Scorpio'],
        'Good Match': ['Taurus', 'Virgo', 'Capricorn'],
        'Challenge': ['Gemini', 'Sagittarius']
      }
    };
    
    return compatibilityMap[westernSign] || {
      'Best Match': ['Unknown'],
      'Good Match': ['Unknown'],
      'Challenge': ['Unknown']
    };
  }
  
  // Saturn position table - average positions by period
  // This is a simplified version that uses approximate Saturn positions by years
  // In a real-world application, you would use precise astronomical calculations
  export function getSaturnPosition(birthday, planetaryPositions) {
    // Saturn stays in each sign for about 2.5-3 years
    // This is a simplified approach using birth year to determine position
    // In a production app, you'd use precise ephemeris calculations
    const year = birthday.getFullYear();
    
    // Simplified Saturn positions by year ranges
    const saturnPositions = [
      { range: [1929, 1932], sign: "Capricorn" },
      { range: [1932, 1935], sign: "Aquarius" },
      { range: [1935, 1938], sign: "Pisces" },
      { range: [1938, 1941], sign: "Aries" },
      { range: [1941, 1944], sign: "Taurus" },
      { range: [1944, 1946], sign: "Gemini" },
      { range: [1946, 1949], sign: "Cancer" },
      { range: [1949, 1951], sign: "Leo" },
      { range: [1951, 1953], sign: "Virgo" },
      { range: [1953, 1956], sign: "Libra" },
      { range: [1956, 1959], sign: "Scorpio" },
      { range: [1959, 1961], sign: "Sagittarius" },
      { range: [1961, 1964], sign: "Capricorn" },
      { range: [1964, 1967], sign: "Aquarius" },
      { range: [1967, 1969], sign: "Pisces" },
      { range: [1969, 1972], sign: "Aries" },
      { range: [1972, 1974], sign: "Taurus" },
      { range: [1974, 1977], sign: "Gemini" },
      { range: [1977, 1980], sign: "Cancer" },
      { range: [1980, 1983], sign: "Leo" },
      { range: [1983, 1985], sign: "Virgo" },
      { range: [1985, 1988], sign: "Libra" },
      { range: [1988, 1991], sign: "Scorpio" },
      { range: [1991, 1994], sign: "Capricorn" },
      { range: [1994, 1996], sign: "Aquarius" },
      { range: [1996, 1999], sign: "Pisces" },
      { range: [1999, 2001], sign: "Aries" },
      { range: [2001, 2003], sign: "Taurus" },
      { range: [2003, 2005], sign: "Cancer" },
      { range: [2005, 2007], sign: "Leo" },
      { range: [2007, 2010], sign: "Virgo" },
      { range: [2010, 2012], sign: "Libra" },
      { range: [2012, 2015], sign: "Scorpio" },
      { range: [2015, 2017], sign: "Sagittarius" },
      { range: [2017, 2020], sign: "Capricorn" },
      { range: [2020, 2023], sign: "Aquarius" },
      { range: [2023, 2026], sign: "Pisces" }
    ];
    
    const position = saturnPositions.find(p => year >= p.range[0] && year < p.range[1]);
    if (!position) return { sign: "Unknown", interpretation: "Position data not available for this time period." };
    
    // Find the interpretation from the planetary positions data
    const saturnData = planetaryPositions.find(p => p.planet === "Saturn");
    if (!saturnData) return { sign: position.sign, interpretation: "Interpretation not available." };
    
    const signData = saturnData.positions.find(p => p.sign === position.sign);
    return signData || { sign: position.sign, interpretation: "Interpretation not available." };
  }
  
  export function getVenusPosition(birthday, planetaryPositions) {
    // Venus changes signs approximately every 30 days
    // This is a simplified model using birth month
    // In a production app, you'd use precise ephemeris calculations
    const month = birthday.getMonth(); // 0-11
    const day = birthday.getDate();
    
    // Simplified Venus positions based on approximate monthly positions
    // These are not precise but serve as a demonstration
    const venusPositions = [
      { range: [0, 0, 20], sign: "Capricorn" }, // Jan 1-20
      { range: [0, 21, 31], sign: "Aquarius" }, // Jan 21-31
      { range: [1, 1, 18], sign: "Aquarius" }, // Feb 1-18
      { range: [1, 19, 29], sign: "Pisces" }, // Feb 19-29
      { range: [2, 1, 20], sign: "Pisces" }, // Mar 1-20
      { range: [2, 21, 31], sign: "Aries" }, // Mar 21-31
      { range: [3, 1, 19], sign: "Aries" }, // Apr 1-19
      { range: [3, 20, 30], sign: "Taurus" }, // Apr 20-30
      { range: [4, 1, 20], sign: "Taurus" }, // May 1-20
      { range: [4, 21, 31], sign: "Gemini" }, // May 21-31
      { range: [5, 1, 20], sign: "Gemini" }, // Jun 1-20
      { range: [5, 21, 30], sign: "Cancer" }, // Jun 21-30
      { range: [6, 1, 22], sign: "Cancer" }, // Jul 1-22
      { range: [6, 23, 31], sign: "Leo" }, // Jul 23-31
      { range: [7, 1, 22], sign: "Leo" }, // Aug 1-22
      { range: [7, 23, 31], sign: "Virgo" }, // Aug 23-31
      { range: [8, 1, 22], sign: "Virgo" }, // Sep 1-22
      { range: [8, 23, 30], sign: "Libra" }, // Sep 23-30
      { range: [9, 1, 22], sign: "Libra" }, // Oct 1-22
      { range: [9, 23, 31], sign: "Scorpio" }, // Oct 23-31
      { range: [10, 1, 21], sign: "Scorpio" }, // Nov 1-21
      { range: [10, 22, 30], sign: "Sagittarius" }, // Nov 22-30
      { range: [11, 1, 21], sign: "Sagittarius" }, // Dec 1-21
      { range: [11, 22, 31], sign: "Capricorn" } // Dec 22-31
    ];
    
    const position = venusPositions.find(p => 
      month === p.range[0] && day >= p.range[1] && day <= p.range[2]
    );
    
    if (!position) return { sign: "Unknown", interpretation: "Position data not available for this date." };
    
    // Find the interpretation from the planetary positions data
    const venusData = planetaryPositions.find(p => p.planet === "Venus");
    if (!venusData) return { sign: position.sign, interpretation: "Interpretation not available." };
    
    const signData = venusData.positions.find(p => p.sign === position.sign);
    return signData || { sign: position.sign, interpretation: "Interpretation not available." };
  }
  