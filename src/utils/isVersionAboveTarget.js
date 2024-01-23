/**
 * Checks if a version is valid, being above a specific target
 * @param {object} versions - The current version and the target version
 * @returns {boolean} True if the version is valid, false otherwise
 */

function isVersionAboveTarget({ version, target }) {
  let isValid = true; // Assume the version is valid unless proven otherwise

  if (version.major < target.major) {
    isValid = false;
  } else if (version.major === target.major) {
    if (version.minor < target.minor) {
    isValid = false;
    } else if (version.minor === target.minor) {
    if (version.patch <= target.patch) {
        isValid = false;
    }
    }
  }

  return isValid;
}

module.exports = {
  isVersionAboveTarget
}
