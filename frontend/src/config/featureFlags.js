// Feature flags configuration
// You can control feature visibility using these flags
export const featureFlags = {
  // Enable/disable the Counter component
  enableCounter: true,

  // Add more feature flags here as your app grows
  // enableNewFeature: false,
  // enableBetaFeature: true,
};

/**
 * Check if a feature flag is enabled
 * @param {string} flagName - The name of the feature flag
 * @returns {boolean} - True if the flag is enabled, false otherwise
 */
export const isFeatureEnabled = (flagName) => {
  return featureFlags[flagName] === true;
};

