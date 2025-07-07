import julian from 'astronomia/julian';
import solar from 'astronomia/solar';
import moonposition from 'astronomia/moonposition';
import sidereal from 'astronomia/sidereal';
import coord from 'astronomia/coord';
import base from 'astronomia/base';
import rise from 'astronomia/rise';
import globe from 'astronomia/globe';
import { getTimezoneInfo, convertToUTC } from './utils.js';

/**
 * Calculate precise astronomical positions using birth time and location
 * @param {Date} birthDate - The birth date
 * @param {string} birthTime - Birth time in HH:MM format  
 * @param {number} latitude - Birth location latitude
 * @param {number} longitude - Birth location longitude
 * @returns {Promise<Object>} Astronomical calculation results
 */
export async function calculateAstronomicalPositions(birthDate, birthTime, latitude, longitude) {
  try {
    console.log('=== ASTRONOMICAL CALCULATION DEBUG ===');
    console.log('Input:', { birthDate, birthTime, latitude, longitude });
    
    // Get timezone information for the birth location and date
    const timezoneInfo = await getTimezoneInfo(latitude, longitude, birthDate, birthTime);
    console.log('Timezone info:', timezoneInfo);
    
    // Convert local birth time to UTC
    const utcDateTime = convertToUTC(birthDate, birthTime, timezoneInfo);
    console.log('UTC conversion:', {
      localTime: `${birthTime} (${timezoneInfo.timezone})`,
      utcTime: utcDateTime.toISOString(),
      utcOffset: timezoneInfo.utcOffset / 3600 + ' hours'
    });
    
    // Calculate Julian Day from UTC datetime
    const jd = julian.CalendarGregorianToJD(
      utcDateTime.getFullYear(),
      utcDateTime.getMonth() + 1, // astronomia expects 1-based months
      utcDateTime.getDate() + (utcDateTime.getHours() + utcDateTime.getMinutes() / 60) / 24
    );
    
    console.log('Julian Day calculation:', { jd });
    
    // Calculate planetary positions
    const T = base.J2000Century(jd);
    const sunLongitude = solar.apparentLongitude(T);
    const moonCoords = moonposition.position(jd);
    
    // Calculate Venus position
    const venusLongitude = calculateVenusPosition(jd);
    
    // Convert coordinates to zodiac signs
    const sunLongitudeDeg = sunLongitude * 180 / Math.PI;
    const moonLongitudeDeg = moonCoords.lon * 180 / Math.PI;
    const venusLongitudeDeg = venusLongitude;
    
    const sunSign = getZodiacSignFromLongitude(sunLongitudeDeg);
    const moonSign = getZodiacSignFromLongitude(moonLongitudeDeg);
    const venusSign = getZodiacSignFromLongitude(venusLongitudeDeg);
    
    console.log('Sun calculation:', { sunLongitudeRad: sunLongitude, sunLongitudeDeg, sunSign });
    console.log('Moon calculation:', { moonLongitudeRad: moonCoords.lon, moonLongitudeDeg, moonSign });
    console.log('Venus calculation:', { venusLongitudeDeg, venusSign });
    
    // Calculate ascendant (rising sign)
    const risingLongitude = calculateAscendant(jd, latitude, longitude);
    const risingSign = getZodiacSignFromLongitude(risingLongitude);
    
    console.log('Rising calculation:', { risingLongitude, risingSign });
    console.log('=== END DEBUG ===');
    
    return {
      success: true,
      sun: {
        Sign: { label: sunSign, key: sunSign.toLowerCase() },
        longitude: sunLongitudeDeg
      },
      moon: {
        Sign: { label: moonSign, key: moonSign.toLowerCase() },
        longitude: moonLongitudeDeg
      },
      venus: {
        Sign: { label: venusSign, key: venusSign.toLowerCase() },
        longitude: venusLongitudeDeg
      },
      ascendant: {
        Sign: { label: risingSign, key: risingSign.toLowerCase() },
        longitude: risingLongitude
      },
      julianDay: jd,
      coordinates: { latitude, longitude },
      timezone: timezoneInfo.timezone,
      utcOffset: timezoneInfo.utcOffset / 3600 // Convert to hours for display
    };
  } catch (error) {
    console.error('Astronomical calculation error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Calculate Venus position using simplified VSOP87 theory
 * @param {number} jd - Julian Day
 * @returns {number} Venus ecliptic longitude in degrees
 */
function calculateVenusPosition(jd) {
  try {
    // Calculate centuries from J2000
    const T = (jd - 2451545.0) / 36525;
    
    // Mean longitude of Venus (VSOP87 simplified)
    let L = 181.97980 + 58519.21191 * T;
    
    // Mean anomaly of Venus
    const M = (212.60322 + 58517.80387 * T) * Math.PI / 180;
    
    // Equation of center (simplified)
    const C = (0.00682 - 0.00005 * T) * Math.sin(M) * 180 / Math.PI +
              0.00138 * Math.sin(2 * M) * 180 / Math.PI;
    
    // True longitude
    L = L + C;
    
    // Normalize to 0-360
    L = ((L % 360) + 360) % 360;
    
    console.log('Venus position calculation:', { T, L, M: M * 180 / Math.PI, C });
    
    return L;
  } catch (error) {
    console.error('Venus calculation error:', error);
    // Return a default position if calculation fails
    return 0;
  }
}

/**
 * Calculate the Ascendant (Rising Sign) using the Placidus method
 * This is the most accurate method for calculating the ascendant
 * @param {number} jd - Julian Day
 * @param {number} latitude - Observer latitude in degrees
 * @param {number} longitude - Observer longitude in degrees (East positive, West negative)
 * @returns {number} Ascendant ecliptic longitude in degrees
 */
function calculateAscendant(jd, latitude, longitude) {
  try {
    console.log('Ascendant calculation inputs:', { jd, latitude, longitude });
    
    // Calculate apparent sidereal time at Greenwich
    const gmst = sidereal.apparent(jd);
    
    // Convert to Local Sidereal Time (LST) in radians
    // gmst is in radians, longitude is in degrees
    const lst = gmst + longitude * Math.PI / 180;
    
    // Normalize LST to 0-2π
    const lstNormalized = ((lst % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI);
    
    console.log('Sidereal time calculations:', { 
      gmstRad: gmst,
      gmstDeg: gmst * 180 / Math.PI,
      lstRad: lst,
      lstDeg: lst * 180 / Math.PI,
      lstNormalizedDeg: lstNormalized * 180 / Math.PI
    });
    
    // Calculate obliquity of the ecliptic
    const ε = base.obliquity(jd);
    
    console.log('Obliquity:', { 
      obliquityRad: ε, 
      obliquityDeg: ε * 180 / Math.PI 
    });
    
    // Convert latitude to radians
    const φ = latitude * Math.PI / 180;
    
    // Calculate the ascendant using the formula:
    // tan(A) = -cos(LST) / (sin(ε) * tan(φ) + cos(ε) * sin(LST))
    const numerator = -Math.cos(lstNormalized);
    const denominator = Math.sin(ε) * Math.tan(φ) + Math.cos(ε) * Math.sin(lstNormalized);
    
    console.log('Formula components:', { 
      numerator,
      denominator,
      cosLST: Math.cos(lstNormalized),
      sinEpsilon: Math.sin(ε),
      tanPhi: Math.tan(φ),
      cosEpsilon: Math.cos(ε),
      sinLST: Math.sin(lstNormalized)
    });
    
    // Calculate ascendant in radians
    let ascendantRad = Math.atan2(numerator, denominator);
    
    // Convert to degrees
    let ascendantLongitude = ascendantRad * 180 / Math.PI;
    
    // Normalize to 0-360 degrees
    ascendantLongitude = ((ascendantLongitude % 360) + 360) % 360;
    
    console.log('Final ascendant:', { 
      ascendantRad,
      ascendantLongitude,
      lstDegrees: lstNormalized * 180 / Math.PI,
      obliquityDegrees: ε * 180 / Math.PI
    });
    
    return ascendantLongitude;
  } catch (error) {
    console.error('Ascendant calculation error:', error);
    return 0; // Default to 0° Aries if calculation fails
  }
}

/**
 * Convert ecliptic longitude to zodiac sign
 * @param {number} longitude - Longitude in degrees (0-360)
 * @returns {string} Zodiac sign name
 */
function getZodiacSignFromLongitude(longitude) {
  // Normalize longitude to 0-360 range
  const normalizedLng = ((longitude % 360) + 360) % 360;
  
  const signs = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 
    'Leo', 'Virgo', 'Libra', 'Scorpio', 
    'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];
  
  const signIndex = Math.floor(normalizedLng / 30);
  return signs[signIndex] || 'Unknown';
}

/**
 * Get zodiac sign from astronomical position
 * @param {Object} celestialBody - Body from horoscope calculations
 * @returns {string} Zodiac sign name
 */
export function getZodiacSignFromPosition(celestialBody) {
  if (!celestialBody || !celestialBody.Sign) {
    return 'Unknown';
  }
  return celestialBody.Sign.label || celestialBody.Sign.key || 'Unknown';
}

/**
 * Get house position from astronomical data
 * @param {Object} celestialBody - Body from horoscope calculations
 * @returns {number} House number (1-12)
 */
export function getHouseFromPosition(celestialBody) {
  if (!celestialBody || !celestialBody.House) {
    return 0;
  }
  return celestialBody.House.id || 0;
}

/**
 * Format degrees for display
 * @param {number} degrees - Decimal degrees
 * @returns {string} Formatted degrees string
 */
export function formatDegrees(degrees) {
  if (typeof degrees !== 'number') return '0°';
  
  const wholeDegrees = Math.floor(degrees);
  const minutes = Math.floor((degrees - wholeDegrees) * 60);
  const seconds = Math.floor(((degrees - wholeDegrees) * 60 - minutes) * 60);
  
  return `${wholeDegrees}° ${minutes}' ${seconds}"`;
}

/**
 * Get interpretations for Moon sign
 * @param {string} moonSign - Moon sign name
 * @returns {Object} Moon sign interpretation
 */
export function getMoonSignInterpretation(moonSign) {
  const interpretations = {
    'Aries': {
      title: 'Moon in Aries',
      description: 'You have an impulsive, direct emotional nature. You feel things intensely and react quickly to situations. Your emotions are straightforward and honest.',
      traits: ['Impulsive', 'Direct', 'Enthusiastic', 'Quick-tempered', 'Pioneering']
    },
    'Taurus': {
      title: 'Moon in Taurus',
      description: 'You need stability and security in your emotional life. You have a calm, steady nature and prefer familiar, comfortable environments.',
      traits: ['Stable', 'Practical', 'Sensual', 'Stubborn', 'Reliable']
    },
    'Gemini': {
      title: 'Moon in Gemini',
      description: 'You have a curious, adaptable emotional nature. You need variety and mental stimulation to feel emotionally satisfied.',
      traits: ['Curious', 'Adaptable', 'Communicative', 'Restless', 'Intellectual']
    },
    'Cancer': {
      title: 'Moon in Cancer',
      description: 'You have a deeply nurturing, intuitive emotional nature. Family and home are extremely important to your emotional well-being.',
      traits: ['Nurturing', 'Intuitive', 'Protective', 'Moody', 'Empathetic']
    },
    'Leo': {
      title: 'Moon in Leo',
      description: 'You have a warm, generous emotional nature and need to feel appreciated. You express emotions dramatically and love being the center of attention.',
      traits: ['Generous', 'Dramatic', 'Confident', 'Proud', 'Creative']
    },
    'Virgo': {
      title: 'Moon in Virgo',
      description: 'You have a practical, analytical approach to emotions. You need to feel useful and helpful, and you express care through service.',
      traits: ['Practical', 'Analytical', 'Helpful', 'Critical', 'Organized']
    },
    'Libra': {
      title: 'Moon in Libra',
      description: 'You need harmony and balance in your emotional life. You are naturally diplomatic and seek to create peace in your relationships.',
      traits: ['Diplomatic', 'Harmonious', 'Charming', 'Indecisive', 'Cooperative']
    },
    'Scorpio': {
      title: 'Moon in Scorpio',
      description: 'You have intense, deep emotions and strong intuitive abilities. You need emotional depth and transformation in your life.',
      traits: ['Intense', 'Intuitive', 'Transformative', 'Secretive', 'Passionate']
    },
    'Sagittarius': {
      title: 'Moon in Sagittarius',
      description: 'You have an optimistic, freedom-loving emotional nature. You need adventure and philosophical exploration to feel emotionally fulfilled.',
      traits: ['Optimistic', 'Freedom-loving', 'Philosophical', 'Restless', 'Adventurous']
    },
    'Capricorn': {
      title: 'Moon in Capricorn',
      description: 'You have a serious, disciplined approach to emotions. You need structure and achievement to feel emotionally secure.',
      traits: ['Disciplined', 'Ambitious', 'Practical', 'Reserved', 'Responsible']
    },
    'Aquarius': {
      title: 'Moon in Aquarius',
      description: 'You have an independent, innovative emotional nature. You need freedom and intellectual stimulation in your emotional life.',
      traits: ['Independent', 'Innovative', 'Detached', 'Humanitarian', 'Unconventional']
    },
    'Pisces': {
      title: 'Moon in Pisces',
      description: 'You have a compassionate, intuitive emotional nature. You are highly empathetic and need creative or spiritual outlets.',
      traits: ['Compassionate', 'Intuitive', 'Creative', 'Dreamy', 'Empathetic']
    }
  };

  return interpretations[moonSign] || {
    title: 'Moon Sign',
    description: 'Your emotional nature and inner self.',
    traits: ['Unique', 'Individual']
  };
}

/**
 * Get interpretations for Rising sign (Ascendant)
 * @param {string} risingSign - Rising sign name
 * @returns {Object} Rising sign interpretation
 */
export function getRisingSignInterpretation(risingSign) {
  const interpretations = {
    'Aries': {
      title: 'Aries Rising',
      description: 'You come across as energetic, direct, and pioneering. People see you as a natural leader who takes initiative and faces challenges head-on.',
      traits: ['Energetic', 'Direct', 'Pioneering', 'Impulsive', 'Confident']
    },
    'Taurus': {
      title: 'Taurus Rising',
      description: 'You appear calm, reliable, and grounded. Others see you as someone who values stability and has a practical approach to life.',
      traits: ['Calm', 'Reliable', 'Practical', 'Stubborn', 'Sensual']
    },
    'Gemini': {
      title: 'Gemini Rising',
      description: 'You come across as curious, communicative, and adaptable. People see you as quick-witted and interested in many different topics.',
      traits: ['Curious', 'Communicative', 'Adaptable', 'Restless', 'Intellectual']
    },
    'Cancer': {
      title: 'Cancer Rising',
      description: 'You appear nurturing, protective, and emotionally sensitive. Others see you as caring and intuitive, with strong family values.',
      traits: ['Nurturing', 'Protective', 'Sensitive', 'Moody', 'Intuitive']
    },
    'Leo': {
      title: 'Leo Rising',
      description: 'You come across as confident, dramatic, and generous. People see you as someone who naturally commands attention and has a warm presence.',
      traits: ['Confident', 'Dramatic', 'Generous', 'Proud', 'Creative']
    },
    'Virgo': {
      title: 'Virgo Rising',
      description: 'You appear organized, analytical, and helpful. Others see you as someone who pays attention to details and has a practical approach.',
      traits: ['Organized', 'Analytical', 'Helpful', 'Critical', 'Modest']
    },
    'Libra': {
      title: 'Libra Rising',
      description: 'You come across as charming, diplomatic, and balanced. People see you as someone who values harmony and has good social skills.',
      traits: ['Charming', 'Diplomatic', 'Balanced', 'Indecisive', 'Cooperative']
    },
    'Scorpio': {
      title: 'Scorpio Rising',
      description: 'You appear intense, mysterious, and powerful. Others see you as someone with strong presence and deep, penetrating insights.',
      traits: ['Intense', 'Mysterious', 'Powerful', 'Secretive', 'Magnetic']
    },
    'Sagittarius': {
      title: 'Sagittarius Rising',
      description: 'You come across as optimistic, adventurous, and philosophical. People see you as someone who loves freedom and exploring new ideas.',
      traits: ['Optimistic', 'Adventurous', 'Philosophical', 'Restless', 'Honest']
    },
    'Capricorn': {
      title: 'Capricorn Rising',
      description: 'You appear serious, ambitious, and responsible. Others see you as someone who is goal-oriented and has a mature approach to life.',
      traits: ['Serious', 'Ambitious', 'Responsible', 'Reserved', 'Disciplined']
    },
    'Aquarius': {
      title: 'Aquarius Rising',
      description: 'You come across as independent, innovative, and humanitarian. People see you as someone who is unique and forward-thinking.',
      traits: ['Independent', 'Innovative', 'Humanitarian', 'Detached', 'Unconventional']
    },
    'Pisces': {
      title: 'Pisces Rising',
      description: 'You appear compassionate, dreamy, and intuitive. Others see you as someone who is empathetic and has a gentle, spiritual nature.',
      traits: ['Compassionate', 'Dreamy', 'Intuitive', 'Sensitive', 'Artistic']
    }
  };

  return interpretations[risingSign] || {
    title: 'Rising Sign',
    description: 'How others perceive you and your outward personality.',
    traits: ['Unique', 'Individual']
  };
}

/**
 * Get interpretations for Venus sign
 * @param {string} venusSign - Venus sign name
 * @returns {Object} Venus sign interpretation
 */
export function getVenusSignInterpretation(venusSign) {
  const interpretations = {
    'Aries': {
      title: 'Venus in Aries',
      description: 'You are direct and passionate in love. You value independence and excitement in relationships and may rush into romance.',
      traits: ['Direct', 'Passionate', 'Independent', 'Impulsive', 'Exciting']
    },
    'Taurus': {
      title: 'Venus in Taurus',
      description: 'You are sensual and steadfast in love. You value stability and comfort in relationships and are a patient and loyal partner.',
      traits: ['Sensual', 'Steadfast', 'Stable', 'Patient', 'Loyal']
    },
    'Gemini': {
      title: 'Venus in Gemini',
      description: 'You are intellectually engaged in love. You value communication and variety in relationships and are a curious and adaptable partner.',
      traits: ['Intellectual', 'Communicative', 'Varied', 'Curious', 'Adaptable']
    },
    'Cancer': {
      title: 'Venus in Cancer',
      description: 'You are emotionally nurturing in love. You value security and emotional connection in relationships and are a protective and caring partner.',
      traits: ['Nurturing', 'Emotional', 'Secure', 'Protective', 'Caring']
    },
    'Leo': {
      title: 'Venus in Leo',
      description: 'You are dramatic and generous in love. You value appreciation and passion in relationships and are a loyal and expressive partner.',
      traits: ['Dramatic', 'Generous', 'Appreciative', 'Passionate', 'Expressive']
    },
    'Virgo': {
      title: 'Venus in Virgo',
      description: 'You are thoughtful and helpful in love. You value quality and improvement in relationships and are an attentive and analytical partner.',
      traits: ['Thoughtful', 'Helpful', 'Quality-focused', 'Attentive', 'Analytical']
    },
    'Libra': {
      title: 'Venus in Libra',
      description: 'You are harmonious and diplomatic in love. You value balance and partnership and are a charming and accommodating partner.',
      traits: ['Harmonious', 'Diplomatic', 'Balanced', 'Charming', 'Accommodating']
    },
    'Scorpio': {
      title: 'Venus in Scorpio',
      description: 'You are intense and profound in love. You value depth and transformation in relationships and are a passionate and perceptive partner.',
      traits: ['Intense', 'Profound', 'Deep', 'Transformative', 'Passionate']
    },
    'Sagittarius': {
      title: 'Venus in Sagittarius',
      description: 'You are adventurous and optimistic in love. You value freedom and growth in relationships and are an enthusiastic and honest partner.',
      traits: ['Adventurous', 'Optimistic', 'Freedom-loving', 'Growth-oriented', 'Honest']
    },
    'Capricorn': {
      title: 'Venus in Capricorn',
      description: 'You are committed and responsible in love. You value tradition and achievement in relationships and are a reliable and measured partner.',
      traits: ['Committed', 'Responsible', 'Traditional', 'Achievement-oriented', 'Reliable']
    },
    'Aquarius': {
      title: 'Venus in Aquarius',
      description: 'You are unconventional and friendly in love. You value independence and innovation in relationships and are a unique and progressive partner.',
      traits: ['Unconventional', 'Friendly', 'Independent', 'Innovative', 'Progressive']
    },
    'Pisces': {
      title: 'Venus in Pisces',
      description: 'You are compassionate and romantic in love. You value spirituality and creativity in relationships and are an empathetic and dreamy partner.',
      traits: ['Compassionate', 'Romantic', 'Spiritual', 'Creative', 'Empathetic']
    }
  };

  return interpretations[venusSign] || {
    title: 'Venus Sign',
    description: 'How you express love and what you value in relationships.',
    traits: ['Unique', 'Individual']
  };
} 