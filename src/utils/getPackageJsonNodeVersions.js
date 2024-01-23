/**
 * Returns an array that contains the node versions encountered in the package.json file
 * @param {string[]} packageJsonNodeVersions - An array of Node.js versions parsed from package.json
 * @returns {string[]} An array that contains all node versions available in the package.json
 */

function getPackageJsonNodeVersions(parsedPackageJson) {
  // Extract an array of accepted Node.js versions from the engines.node field
  const packageJsonNodeVersions = parsedPackageJson?.engines?.node
    ?.split(/\|\||\s/)
    .map((version) => version.trim().replace(".x", ""));

  return packageJsonNodeVersions;
}

module.exports = {
  getPackageJsonNodeVersions
}
