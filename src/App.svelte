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
    getVenusPosition
  } from './lib/utils.js';

  let birthday = new Date().toISOString().split('T')[0];
  let result = null;
  let error = '';
  let data = {};
  let loading = true;
  let generatingResult = false;
  let theme = 'dark'; // default theme
  let showCompatibility = false;
  let showPlanetaryInfo = false;
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

  function generateProfile() {
    generatingResult = true;
    error = '';
    
    setTimeout(() => {
      try {
        const date = new Date(birthday);
        const western = getWesternZodiac(date, data.westernZodiac);
        const chineseData = getChineseZodiac(date, data.chineseZodiac);
        const saturnData = getSaturnPosition(date, data.planetaryPositions);
        const venusData = getVenusPosition(date, data.planetaryPositions);

        if (chineseData.animal === "Unknown") {
          error = "We couldn't determine your Chinese zodiac sign. Try another year.";
          generatingResult = false;
          return;
        }

        result = {
          western,
          chinese: chineseData.animal,
          chineseElement: chineseData.element,
          compatibility: getCompatibility(western, chineseData.animal),
          saturn: saturnData,
          venus: venusData,
          ...getZodiacVibe(western, chineseData.animal, data.zodiacVibes)
        };
        showCompatibility = false;
        showPlanetaryInfo = false;
        generatingResult = false;
      } catch (err) {
        error = "Something went wrong. Please try again.";
        generatingResult = false;
      }
    }, 800); // Slight delay for better UX
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
      <input type="date" bind:value={birthday} max={new Date().toISOString().split('T')[0]} />
      <button id="generateBtn" on:click={generateProfile} disabled={generatingResult}>
        {#if generatingResult}
          <span class="spinner-small"></span> Reading the stars...
        {:else}
          Generate
        {/if}
      </button>
    </div>

    {#if error}
      <div class="error">{error}</div>
    {/if}

    {#if result}
      <div class="result" bind:this={resultElement}>
        <p>Your Sun Sign: <strong>{result.western}</strong></p>
        <p>Your Chinese Zodiac: <strong>{result.chinese}</strong> ({result.chineseElement} Element)</p>
        <div class="vibe-section">
          <h2>Your Vibe: {result.vibe}</h2>
          <p>{result.description}</p>
        </div>

        <div class="section-buttons">
          <button class="toggle-btn" on:click={togglePlanetaryInfo}>
            {showPlanetaryInfo ? 'Hide' : 'Show'} Planetary Placements
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="{showPlanetaryInfo ? '18 15 12 9 6 15' : '6 9 12 15 18 9'}"></polyline>
            </svg>
          </button>
          
          <button class="toggle-btn" on:click={toggleCompatibility}>
            {showCompatibility ? 'Hide' : 'Show'} Compatibility
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="{showCompatibility ? '18 15 12 9 6 15' : '6 9 12 15 18 9'}"></polyline>
            </svg>
          </button>
        </div>

        {#if showPlanetaryInfo}
          <div class="planetary-section">
            <h3>Planetary Placements</h3>
            
            <div class="planet-groups">
              <div class="planet-group saturn">
                <h4>Saturn in {result.saturn.sign}</h4>
                <p>{result.saturn.interpretation}</p>
              </div>
              
              <div class="planet-group venus">
                <h4>Venus in {result.venus.sign}</h4>
                <p>{result.venus.interpretation}</p>
              </div>
            </div>
          </div>
        {/if}
        
        {#if showCompatibility}
          <div class="compatibility-section">
            <h3>{result.chinese} compatibility</h3>
            
            <div class="compatibility-groups">
              <div class="compat-group best">
                <h4>Best Friends</h4>
                <div class="compat-signs">
                  {#each result.compatibility['Best Friends'] as sign}
                    <span class="compat-sign">{sign}</span>
                  {/each}
                </div>
              </div>
              
              <div class="compat-group challenge">
                <h4>Enemy</h4>
                <div class="compat-signs">
                  {#each result.compatibility['Enemy'] as sign}
                    <span class="compat-sign">{sign}</span>
                  {/each}
                </div>
              </div>
            </div>
          </div>
        {/if}
      </div>
    {/if}
  {/if}
</main>
