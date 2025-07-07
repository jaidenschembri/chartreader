<script>
  import { onMount } from 'svelte';
  import { loadData } from './lib/data.js';
  import { 
    getWesternZodiac, 
    getChineseZodiac, 
    getZodiacVibe, 
    setupTheme, 
    toggleTheme, 
    getCompatibility,
    getSaturnPosition,
    getVenusPosition,
    geocodeLocation,
    searchLocations,
    debounce
  } from './lib/utils.js';
  import { 
    calculateAstronomicalPositions, 
    getZodiacSignFromPosition, 
    getMoonSignInterpretation, 
    getRisingSignInterpretation,
    getVenusSignInterpretation,
    formatDegrees
  } from './lib/astro.js';

  let birthday = new Date().toISOString().split('T')[0];
  let birthTime = '12:00';
  let birthLocation = '';
  let latitude = null;
  let longitude = null;
  let locationSuggestions = [];
  let showDropdown = false;
  let isSearchingLocation = false;
  let selectedLocationIndex = -1;
  let result = null;
  let error = '';
  let data = {};
  let loading = true;
  let generatingResult = false;
  let theme = 'dark'; // default theme
  let showCompatibility = false;
  let showPlanetaryInfo = false;
  let showMoonRising = false;
  let resultElement;

  onMount(() => {
    try {
      // Initialize theme
      theme = setupTheme();
      
      // Load zodiac data
      loadData().then(result => {
        data = result;
        loading = false;
      }).catch(err => {
        error = "Failed to load zodiac data.";
        loading = false;
      });
    } catch (err) {
      error = "Failed to load zodiac data.";
      loading = false;
    }
  });

  function handleToggleTheme() {
    theme = toggleTheme(theme);
  }

  function toggleCompatibility() {
    showCompatibility = !showCompatibility;
  }
  
  function togglePlanetaryInfo() {
    showPlanetaryInfo = !showPlanetaryInfo;
  }

  // Debounced search function
  const debouncedSearch = debounce(async (query) => {
    if (!query || query.length < 3) {
      locationSuggestions = [];
      showDropdown = false;
      return;
    }

    isSearchingLocation = true;
    try {
      const suggestions = await searchLocations(query);
      locationSuggestions = suggestions;
      showDropdown = suggestions.length > 0;
      selectedLocationIndex = -1;
    } catch (err) {
      console.error('Search error:', err);
      locationSuggestions = [];
      showDropdown = false;
    } finally {
      isSearchingLocation = false;
    }
  }, 300);

  function handleLocationInput() {
    debouncedSearch(birthLocation);
    // Clear coordinates when typing
    latitude = null;
    longitude = null;
  }

  function selectLocation(location) {
    birthLocation = location.shortName;
    latitude = location.latitude;
    longitude = location.longitude;
    locationSuggestions = [];
    showDropdown = false;
    selectedLocationIndex = -1;
    error = ''; // Clear any previous errors
  }

  function handleLocationKeydown(event) {
    if (!showDropdown || locationSuggestions.length === 0) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        selectedLocationIndex = Math.min(selectedLocationIndex + 1, locationSuggestions.length - 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        selectedLocationIndex = Math.max(selectedLocationIndex - 1, -1);
        break;
      case 'Enter':
        event.preventDefault();
        if (selectedLocationIndex >= 0) {
          selectLocation(locationSuggestions[selectedLocationIndex]);
        }
        break;
      case 'Escape':
        event.preventDefault();
        showDropdown = false;
        selectedLocationIndex = -1;
        break;
    }
  }

  function handleLocationBlur() {
    // Delay hiding dropdown to allow for clicks
    setTimeout(() => {
      showDropdown = false;
      selectedLocationIndex = -1;
    }, 150);
  }

  async function generateProfile() {
    generatingResult = true;
    error = '';
    
    try {
      // Fix date parsing to avoid timezone issues
      // Parse the date string manually to avoid UTC conversion issues
      const [year, month, day] = birthday.split('-').map(Number);
      const date = new Date(year, month - 1, day); // month is 0-based in Date constructor
      
      const western = getWesternZodiac(date, data.westernZodiac);
      const chineseData = getChineseZodiac(date, data.chineseZodiac);

      if (chineseData.animal === "Unknown") {
        error = "We couldn't determine your Chinese zodiac sign. Try another year.";
        generatingResult = false;
        return;
      }

      // Base result with traditional calculations
      let newResult = {
        western,
        chinese: chineseData.animal,
        chineseElement: chineseData.element,
        compatibility: getCompatibility(western, chineseData.animal),
        saturn: getSaturnPosition(date, data.planetaryPositions),
        venus: getVenusPosition(date, data.planetaryPositions),
        ...getZodiacVibe(western, chineseData.animal, data.zodiacVibes)
      };

      // Enhanced mode: use astronomical calculations
      if (birthTime && latitude && longitude) {
        try {
          const astroResults = await calculateAstronomicalPositions(
            date, 
            birthTime, 
            latitude, 
            longitude
          );
          
          if (astroResults.success) {
            // Structure the astronomical results to match expected format
            const moonSign = astroResults.moon.Sign.label;
            const risingSign = astroResults.ascendant.Sign.label;
            const venusSign = astroResults.venus.Sign.label;
            
            // Update sun sign with astronomical precision
            newResult.western = astroResults.sun.Sign.label;
            
            // Add sun longitude data
            newResult.sun = {
              sign: astroResults.sun.Sign.label,
              longitude: astroResults.sun.longitude
            };
            
            // Add moon sign data
            newResult.moon = {
              sign: moonSign,
              longitude: astroResults.moon.longitude,
              ...getMoonSignInterpretation(moonSign)
            };
            
            // Add rising sign data  
            newResult.rising = {
              sign: risingSign,
              longitude: astroResults.ascendant.longitude,
              ...getRisingSignInterpretation(risingSign)
            };
            
            // Replace simplified Venus with astronomical Venus
            newResult.venus = {
              sign: venusSign,
              longitude: astroResults.venus.longitude,
              ...getVenusSignInterpretation(venusSign)
            };
            
            // Add precision indicators
            newResult.isPrecise = true;
            newResult.precision = 'astronomical';
            newResult.coordinates = astroResults.coordinates;
            newResult.timezone = astroResults.timezone;
            newResult.utcOffset = astroResults.utcOffset;
          } else {
            throw new Error(astroResults.error || 'Astronomical calculation failed');
          }
        } catch (astroError) {
          console.error('Astronomical calculation error:', astroError);
          // Fallback to basic mode - no moon/rising signs
          newResult.precision = 'basic';
          newResult.error = 'Using basic calculation due to astronomical error: ' + astroError.message;
        }
      }

      result = newResult;
      showCompatibility = false;
      showPlanetaryInfo = false;
      showMoonRising = false;
      generatingResult = false;
    } catch (err) {
      console.error('Profile generation error:', err);
      error = "Something went wrong. Please try again.";
      generatingResult = false;
    }
  }
</script>

<main class="container">
  <button class="theme-toggle" on:click={handleToggleTheme} aria-label="Toggle theme">
    {#if theme === 'dark'}
      <!-- Sun icon for dark mode -->
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
    {:else}
      <!-- Moon icon for light mode -->
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    {/if}
  </button>

  <h1>Enter Your Birthday</h1>
  
  {#if loading}
    <div class="loading-container">
      <div class="loading-spinner"></div>
      <p>Loading zodiac data...</p>
    </div>
  {:else}
    <div id="birthday-form">
      <div class="form-group">
        <label for="birth-date">Birth Date</label>
        <input id="birth-date" type="date" bind:value={birthday} max={new Date().toISOString().split('T')[0]} />
      </div>
      
      <div class="form-group">
        <label for="birth-time">Birth Time</label>
        <input id="birth-time" type="time" bind:value={birthTime} />
      </div>
      
      <div class="form-group location-group">
        <label for="birth-location">Birth Location</label>
        <div class="location-input-container">
          <input 
            id="birth-location" 
            type="text" 
            bind:value={birthLocation} 
            placeholder="Start typing a city name..." 
            on:input={handleLocationInput}
            on:keydown={handleLocationKeydown}
            on:blur={handleLocationBlur}
            on:focus={() => {if (locationSuggestions.length > 0) showDropdown = true}}
            autocomplete="off"
          />
          {#if isSearchingLocation}
            <div class="search-indicator">
              <div class="search-spinner"></div>
            </div>
          {/if}
          
          {#if showDropdown && locationSuggestions.length > 0}
            <div class="location-dropdown">
              {#each locationSuggestions as suggestion, index}
                <div 
                  class="location-option {index === selectedLocationIndex ? 'selected' : ''}"
                  on:click={() => selectLocation(suggestion)}
                  on:mouseenter={() => selectedLocationIndex = index}
                >
                  <div class="location-name">{suggestion.shortName}</div>
                  <div class="location-full">{suggestion.displayName}</div>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      </div>
      
      <div class="coordinates-display">
        {#if latitude !== null && longitude !== null}
          <small>Coordinates: {latitude.toFixed(4)}°, {longitude.toFixed(4)}°</small>
        {/if}
      </div>
      
      <button id="generateBtn" on:click={generateProfile} disabled={generatingResult || !birthLocation}>
        {#if generatingResult}
          <span class="spinner-small"></span> Reading the stars...
        {:else}
          Generate Chart
        {/if}
      </button>
    </div>

    {#if error}
      <div class="error">{error}</div>
    {/if}

    {#if result}
      <div class="result" bind:this={resultElement}>
        <!-- Header Section -->
        <div class="result-header">
          <h2>Astrological Chart Reading</h2>
          <div class="subtitle">
            {new Date(birthday).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })} at {birthTime}
            {#if birthLocation}
              • {birthLocation}
            {/if}
            {#if result.isPrecise}
              • Astronomical Precision
            {/if}
          </div>
        </div>

        <!-- Main Chart Data Table -->
        <table class="chart-table">
          <thead>
            <tr>
              <th>Planet/Point</th>
              <th>Sign</th>
              <th>Degree</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="planet">☉ Sun</td>
              <td class="sign">{result.western}</td>
              <td class="degree">
                {#if result.isPrecise && result.sun?.longitude}
                  {formatDegrees(result.sun.longitude % 30)}
                {:else}
                  —
                {/if}
              </td>
            </tr>
            {#if result.moon}
              <tr>
                <td class="planet">☽ Moon</td>
                <td class="sign">{result.moon.sign}</td>
                <td class="degree">
                  {#if result.isPrecise && result.moon.longitude}
                    {formatDegrees(result.moon.longitude % 30)}
                  {:else}
                    —
                  {/if}
                </td>
              </tr>
            {/if}
            {#if result.rising}
              <tr>
                <td class="planet">↗ Ascendant</td>
                <td class="sign">{result.rising.sign}</td>
                <td class="degree">
                  {#if result.isPrecise && result.rising.longitude}
                    {formatDegrees(result.rising.longitude % 30)}
                  {:else}
                    —
                  {/if}
                </td>
              </tr>
            {/if}
            {#if result.venus}
              <tr>
                <td class="planet">♀ Venus</td>
                <td class="sign">{result.venus.sign || result.venus.Sign?.label}</td>
                <td class="degree">
                  {#if result.isPrecise && result.venus.longitude}
                    {formatDegrees(result.venus.longitude % 30)}
                  {:else}
                    —
                  {/if}
                </td>
              </tr>
            {/if}
            <tr>
              <td class="planet">♄ Saturn</td>
              <td class="sign">{result.saturn.sign}</td>
              <td class="degree">—</td>
            </tr>
            <tr>
              <td class="planet">Chinese</td>
              <td class="sign">{result.chinese}</td>
              <td class="degree">{result.chineseElement}</td>
            </tr>
          </tbody>
        </table>

        <!-- Sun Sign Interpretation -->
        <h3 class="section-header">Solar Analysis</h3>
        <div class="interpretation-section">
          <h4>Sun in {result.western}</h4>
          <p>{result.description}</p>
          <p><strong>Core Essence:</strong> {result.vibe}</p>
        </div>

        <!-- Moon Sign Interpretation -->
        {#if result.moon}
          <h3 class="section-header">Lunar Analysis</h3>
          <div class="interpretation-section">
            <h4>{result.moon.title}</h4>
            <p>{result.moon.description}</p>
            <div class="traits">
              {#each result.moon.traits as trait}
                <span class="trait">{trait}</span>
              {/each}
            </div>
          </div>
        {/if}

        <!-- Rising Sign Interpretation -->
        {#if result.rising}
          <h3 class="section-header">Ascendant Analysis</h3>
          <div class="interpretation-section">
            <h4>{result.rising.title}</h4>
            <p>{result.rising.description}</p>
            <div class="traits">
              {#each result.rising.traits as trait}
                <span class="trait">{trait}</span>
              {/each}
            </div>
          </div>
        {/if}

        <!-- Venus Interpretation -->
        {#if result.venus && (result.venus.title || result.venus.description)}
          <h3 class="section-header">Venus Analysis</h3>
          <div class="interpretation-section">
            <h4>{result.venus.title || `Venus in ${result.venus.sign || result.venus.Sign?.label}`}</h4>
            <p>{result.venus.description || result.venus.interpretation}</p>
            {#if result.venus.traits}
              <div class="traits">
                {#each result.venus.traits as trait}
                  <span class="trait">{trait}</span>
                {/each}
              </div>
            {/if}
          </div>
        {/if}

        <!-- Saturn Interpretation -->
        <h3 class="section-header">Saturn Analysis</h3>
        <div class="interpretation-section">
          <h4>Saturn in {result.saturn.sign}</h4>
          <p>{result.saturn.interpretation}</p>
        </div>

        <!-- Compatibility Analysis -->
        <h3 class="section-header">Compatibility Matrix</h3>
        <div class="interpretation-section">
          <h4>Chinese Zodiac Compatibility</h4>
          <table class="compatibility-table">
            <thead>
              <tr>
                <th>Relationship Type</th>
                <th>Compatible Signs</th>
              </tr>
            </thead>
            <tbody>
              <tr class="positive">
                <td>Best Friends</td>
                <td>{result.compatibility['Best Friends'].join(', ')}</td>
              </tr>
              <tr class="negative">
                <td>Challenging</td>
                <td>{result.compatibility['Enemy'].join(', ')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    {/if}
  {/if}
</main>
