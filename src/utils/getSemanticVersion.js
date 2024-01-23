/**
 * Extracts the major, minor and patch version from a string: [major, minor, patch]
 * @param {string} version - The version to be parsed
 */

function getSemanticVersion(version) {
  if (!version) return null;
  // Removes comparison characters and gets the major, minor and patch version
  const semanticVersion = version.replace(/>|>=|<|<=/g, "").match(/\d+/g);
  if (!semanticVersion) return null;

  const [major, minor = 0, patch = 0] = semanticVersion.map((v) => Number(v));
  return { major, minor, patch };
}

module.exports = {
  getSemanticVersion
}
