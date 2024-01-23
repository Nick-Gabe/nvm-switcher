const { getSemanticVersion } = require("./getSemanticVersion");

/**
 * Extracts the major, minor and patch version from a string: [major, minor, patch]
 * @param {string[]} packageJsonNodeVersions - An array of Node.js versions parsed from package.json
 */

function getMinimumAndMaximumVersion(packageJsonNodeVersions) {
  const minimumVersion = getSemanticVersion(
    packageJsonNodeVersions.find((version) => version.startsWith(">"))
  );

  const maximumVersion = getSemanticVersion(
    packageJsonNodeVersions.find((version) => version.startsWith("<"))
  );

  return {
    minimumVersion: minimumVersion,
    maximumVersion: maximumVersion
  }
}

module.exports = {
  getMinimumAndMaximumVersion
}
