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

  // Location geocoding function for single result
  export async function geocodeLocation(locationString) {
    try {
      // Use a free geocoding service (Nominatim from OpenStreetMap)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(locationString)}`
      );
      
      if (!response.ok) {
        throw new Error('Geocoding service unavailable');
      }
      
      const data = await response.json();
      
      if (data.length === 0) {
        throw new Error('Location not found');
      }
      
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
        displayName: data[0].display_name
      };
    } catch (error) {
      console.error('Geocoding error:', error);
      throw new Error('Unable to find location coordinates');
    }
  }

  // Location search function for autocomplete suggestions
  export async function searchLocations(query) {
    if (!query || query.length < 3) {
      return [];
    }

    try {
      // Get multiple results for autocomplete
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=8&q=${encodeURIComponent(query)}&addressdetails=1`
      );
      
      if (!response.ok) {
        throw new Error('Location search service unavailable');
      }
      
      const data = await response.json();
      
      return data.map(location => ({
        id: location.place_id,
        displayName: location.display_name,
        shortName: formatLocationName(location),
        latitude: parseFloat(location.lat),
        longitude: parseFloat(location.lon),
        type: location.type,
        importance: location.importance
      })).sort((a, b) => b.importance - a.importance); // Sort by importance
      
    } catch (error) {
      console.error('Location search error:', error);
      return [];
    }
  }

  // Helper function to format location names nicely
  function formatLocationName(location) {
    const address = location.address || {};
    const parts = [];
    
    // Add city/town/village
    if (address.city) parts.push(address.city);
    else if (address.town) parts.push(address.town);
    else if (address.village) parts.push(address.village);
    else if (address.municipality) parts.push(address.municipality);
    
    // Add state/province
    if (address.state) parts.push(address.state);
    else if (address.province) parts.push(address.province);
    
    // Add country
    if (address.country) parts.push(address.country);
    
    // If we couldn't parse nicely, use the display name but truncated
    if (parts.length === 0) {
      return location.display_name.length > 50 
        ? location.display_name.substring(0, 50) + '...'
        : location.display_name;
    }
    
    return parts.join(', ');
  }

  // Debounce function to limit API calls
  export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  /**
   * Get timezone information for coordinates and date
   * @param {number} latitude - Latitude in degrees
   * @param {number} longitude - Longitude in degrees
   * @param {Date} birthDate - Birth date for historical timezone lookup
   * @param {string} birthTime - Birth time in HH:MM format
   * @returns {Promise<Object>} Timezone information with UTC offset
   */
  export async function getTimezoneInfo(latitude, longitude, birthDate, birthTime) {
    try {
      // For demo purposes, we'll use a fallback approach since we don't want to require API keys
      // In production, you'd use a service like Geoapify, TimeZone API, or similar
      
      // First, try to determine timezone from coordinates using a simple lookup
      const timezone = getTimezoneFromCoordinates(latitude, longitude);
      
      // Calculate UTC offset for the specific date
      const utcOffset = calculateUTCOffset(timezone, birthDate, birthTime);
      
      return {
        timezone,
        utcOffset,
        isDST: isDaylightSavingTime(timezone, birthDate)
      };
    } catch (error) {
      console.error('Timezone lookup error:', error);
      // Fallback to UTC if timezone lookup fails
      return {
        timezone: 'UTC',
        utcOffset: 0,
        isDST: false
      };
    }
  }

  /**
   * Simple timezone lookup based on coordinates
   * This is a basic implementation - in production you'd use a proper API
   */
  function getTimezoneFromCoordinates(lat, lng) {
    // Major timezone regions (simplified)
    const timezoneRegions = [
      // North America
      { bounds: { north: 71, south: 15, west: -168, east: -52 }, zones: {
        'Pacific': { west: -168, east: -120 },
        'Mountain': { west: -120, east: -105 },
        'Central': { west: -105, east: -90 },
        'Eastern': { west: -90, east: -67 }
      }},
      // Europe
      { bounds: { north: 71, south: 35, west: -10, east: 40 }, zones: {
        'Europe/London': { west: -10, east: 2 },
        'Europe/Paris': { west: 2, east: 15 },
        'Europe/Berlin': { west: 15, east: 30 }
      }},
      // Add more regions as needed
    ];
    
    // Simple lookup for common locations
    if (lat >= 48 && lat <= 49.5 && lng >= -125 && lng <= -120) {
      return 'America/Vancouver'; // Pacific Northwest
    }
    if (lat >= 40 && lat <= 45 && lng >= -125 && lng <= -120) {
      return 'America/Los_Angeles'; // California
    }
    if (lat >= 40 && lat <= 45 && lng >= -75 && lng <= -70) {
      return 'America/New_York'; // Eastern US
    }
    
    // Default fallback based on longitude
    const utcOffset = Math.round(lng / 15);
    return `UTC${utcOffset >= 0 ? '+' : ''}${utcOffset}`;
  }

  /**
   * Calculate UTC offset for a specific timezone and date
   */
  function calculateUTCOffset(timezone, birthDate, birthTime) {
    try {
      // Parse birth time
      const [hours, minutes] = birthTime.split(':').map(Number);
      
      // Create a date object for the birth moment in the local timezone
      const localDate = new Date(birthDate.getFullYear(), birthDate.getMonth(), birthDate.getDate(), hours, minutes);
      
      console.log('Offset calculation start:', { timezone, localDate: localDate.toISOString() });
      
      // Use browser's timezone detection for known timezones
      if (timezone.includes('/')) {
        // For IANA timezone names, try to use Intl.DateTimeFormat
        try {
          const formatter = new Intl.DateTimeFormat('en', {
            timeZone: timezone,
            timeZoneName: 'longOffset'
          });
          
          const parts = formatter.formatToParts(localDate);
          const offsetPart = parts.find(part => part.type === 'timeZoneName');
          
          console.log('Intl.DateTimeFormat result:', { parts, offsetPart });
          
          if (offsetPart && offsetPart.value.includes('GMT')) {
            const offsetStr = offsetPart.value.replace('GMT', '');
            const match = offsetStr.match(/([+-])(\d{1,2}):?(\d{2})?/);
            console.log('Offset parsing:', { offsetStr, match });
            
            if (match) {
              const [, sign, hourStr, minuteStr] = match;
              const offsetHours = parseInt(hourStr) || 0;
              const offsetMinutes = parseInt(minuteStr) || 0;
              const totalOffset = (offsetHours * 60 + offsetMinutes) * (sign === '-' ? -1 : 1);
              const offsetSeconds = totalOffset * 60;
              
              console.log('Intl offset calculation:', {
                sign, offsetHours, offsetMinutes, totalOffset, offsetSeconds,
                explanation: `${sign}${offsetHours}:${minuteStr || '00'} = ${totalOffset} minutes = ${offsetSeconds} seconds`
              });
              
              return offsetSeconds; // Convert to seconds
            }
          }
        } catch (e) {
          console.warn('Intl timezone lookup failed:', e);
        }
      }
      
      // Fallback: hardcoded offsets for common timezones
      console.log('Using fallback hardcoded offsets');
      const timezoneOffsets = {
        'America/Vancouver': -8, // PST base
        'America/Los_Angeles': -8, // PST base  
        'America/Denver': -7, // MST base
        'America/Chicago': -6, // CST base
        'America/New_York': -5, // EST base
        'Europe/London': 0, // GMT base
        'Europe/Paris': 1, // CET base
        'Europe/Berlin': 1, // CET base
        'UTC': 0
      };
      
      let baseOffset = timezoneOffsets[timezone] || 0;
      
      // Check for daylight saving time
      if (isDaylightSavingTime(timezone, birthDate)) {
        baseOffset += 1; // Add 1 hour for DST (makes it less negative for western timezones)
      }
      
      console.log('Fallback UTC offset calculation:', {
        timezone,
        baseOffset,
        isDST: isDaylightSavingTime(timezone, birthDate),
        finalOffsetHours: baseOffset,
        finalOffsetSeconds: baseOffset * 3600,
        explanation: `For ${timezone}: base ${baseOffset-1} + DST ${isDaylightSavingTime(timezone, birthDate) ? 1 : 0} = ${baseOffset} hours`
      });
      
      return baseOffset * 3600; // Convert hours to seconds (will be negative for western timezones)
    } catch (error) {
      console.error('UTC offset calculation error:', error);
      return 0; // Default to UTC
    }
  }

  /**
   * Check if daylight saving time was in effect for a given timezone and date
   */
  function isDaylightSavingTime(timezone, date) {
    // This is a simplified implementation
    // In production, you'd want a proper DST calculation library
    
    const year = date.getFullYear();
    const month = date.getMonth(); // 0-based
    
    console.log('DST check:', { timezone, year, month, monthName: date.toLocaleString('default', { month: 'long' }) });
    
    // DST rules for common timezones (simplified)
    const dstRules = {
      'America/Vancouver': { start: { month: 2, week: 2 }, end: { month: 10, week: 1 } }, // March 2nd Sun - Nov 1st Sun
      'America/Los_Angeles': { start: { month: 2, week: 2 }, end: { month: 10, week: 1 } },
      'America/Denver': { start: { month: 2, week: 2 }, end: { month: 10, week: 1 } },
      'America/Chicago': { start: { month: 2, week: 2 }, end: { month: 10, week: 1 } },
      'America/New_York': { start: { month: 2, week: 2 }, end: { month: 10, week: 1 } },
      'Europe/London': { start: { month: 2, week: -1 }, end: { month: 9, week: -1 } }, // Last Sun March - Last Sun Oct
      'Europe/Paris': { start: { month: 2, week: -1 }, end: { month: 9, week: -1 } },
      'Europe/Berlin': { start: { month: 2, week: -1 }, end: { month: 9, week: -1 } }
    };
    
    const rule = dstRules[timezone];
    if (!rule) {
      console.log('No DST rule found for timezone:', timezone);
      return false;
    }
    
    // Simple check: DST is typically active from March/April to October/November
    // June (month 5) should definitely be DST
    const isDST = month >= 3 && month <= 9; // April (3) through October (9)
    
    console.log('DST result:', { 
      month, 
      isDST, 
      explanation: `Month ${month} (${date.toLocaleString('default', { month: 'long' })}) is ${isDST ? 'in' : 'not in'} DST period (April-October)` 
    });
    
    return isDST;
  }

  /**
   * Convert local time to UTC using timezone information
   * @param {Date} birthDate - Birth date
   * @param {string} birthTime - Birth time in HH:MM format
   * @param {Object} timezoneInfo - Timezone information from getTimezoneInfo
   * @returns {Date} UTC date
   */
  export function convertToUTC(birthDate, birthTime, timezoneInfo) {
    try {
      const [hours, minutes] = birthTime.split(':').map(Number);
      
      // Check if the user's current system timezone matches the birth location timezone
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      console.log('Timezone comparison:', {
        userSystemTimezone: userTimezone,
        birthLocationTimezone: timezoneInfo.timezone,
        match: userTimezone === timezoneInfo.timezone
      });
      
      if (userTimezone === timezoneInfo.timezone) {
        // User is in the same timezone as birth location
        // Date constructor will automatically handle the timezone conversion
        const localDateTime = new Date(
          birthDate.getFullYear(),
          birthDate.getMonth(),
          birthDate.getDate(),
          hours,
          minutes
        );
        
        console.log('Same timezone - using Date constructor directly:', {
          inputTime: `${hours}:${minutes.toString().padStart(2, '0')}`,
          localDateTime: localDateTime.toString(),
          utcDateTime: localDateTime.toISOString(),
          explanation: 'Date constructor automatically converts local time to UTC'
        });
        
        return localDateTime;
      } else {
        // User is in different timezone - need manual conversion
        // Create the date as if it were UTC, then adjust for the birth location timezone
        const utcDateTime = new Date(Date.UTC(
          birthDate.getFullYear(),
          birthDate.getMonth(),
          birthDate.getDate(),
          hours,
          minutes
        ));
        
        // Adjust for the birth location timezone offset
        const adjustedDateTime = new Date(utcDateTime.getTime() - (timezoneInfo.utcOffset * 1000));
        
        console.log('Different timezone - manual conversion:', {
          userTimezone,
          birthTimezone: timezoneInfo.timezone,
          inputTime: `${hours}:${minutes.toString().padStart(2, '0')}`,
          utcBase: utcDateTime.toISOString(),
          offsetSeconds: timezoneInfo.utcOffset,
          finalUTC: adjustedDateTime.toISOString()
        });
        
        return adjustedDateTime;
      }
    } catch (error) {
      console.error('UTC conversion error:', error);
      // Fallback: assume UTC
      const [hours, minutes] = birthTime.split(':').map(Number);
      return new Date(
        birthDate.getFullYear(),
        birthDate.getMonth(),
        birthDate.getDate(),
        hours,
        minutes
      );
    }
  }
  