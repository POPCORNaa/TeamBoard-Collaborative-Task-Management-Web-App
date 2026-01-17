import { isFeatureEnabled } from "../config/featureFlags.js";

/**
 * React hook to check if a feature flag is enabled
 * @param {string} flagName - The name of the feature flag
 * @returns {boolean} - True if the flag is enabled, false otherwise
 */
export const useFeatureFlag = (flagName) => {
  return isFeatureEnabled(flagName);
};

