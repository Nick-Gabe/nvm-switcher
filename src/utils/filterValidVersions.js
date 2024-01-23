const { getSemanticVersion } = require("./getSemanticVersion");
const { isVersionAboveTarget } = require("./isVersionAboveTarget");

/**
 * Filters the versions that match the comparison criteria
 * @param {string[]} versions - The versions to be filtered
 * @param {object} minimumVersion - The version to be compared with
 * @param {object} maximumVersion - The version to be compared with
 * @returns {string[]} The filtered versions
 */

function filterValidVersions(versions, minimumVersion, maximumVersion) {
  return versions.filter((version) => {
    let isValid = true; // Assume the version is valid unless proven otherwise

    const semanticVersion = getSemanticVersion(version);
    if (!semanticVersion) return false;

    if (minimumVersion) {
      // If the minimum is above the version, it won't be valid
      isValid = isVersionAboveTarget({
        version: semanticVersion,
        target: minimumVersion,
      });
    }

    if (maximumVersion) {
      // If the version is above the maximum, it won't be valid
      isValid = isVersionAboveTarget({
        version: maximumVersion,
        target: semanticVersion,
      });
    }

    return isValid;
  });
}

module.exports = {
  filterValidVersions
}
