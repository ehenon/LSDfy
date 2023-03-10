import 'dotenv/config';

/**
 * Get missing configuration variables as a list of strings.
 * @param {*} config - Configuration object to check.
 * @returns {Array<string>} List of missing config variables.
 */
export const getMissingConfigVariables = (config) => {
  const missingVariables = [];
  for (const [key, value] of Object.entries(config)) {
    if (!value) {
      missingVariables.push(key);
    }
  }
  return missingVariables;
};

export default {
  setlistFmApiKey: process.env.SETLISTFM_API_KEY,
  deezerUserId: process.env.DEEZER_USER_ID,
  deezerAccessToken: process.env.DEEZER_ACCESS_TOKEN,
};
