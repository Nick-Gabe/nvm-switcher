/**
 * Returns an array that contains the node versions encountered in the nvmrc or package.json file
 * @param {string[]} nodeVersions - An array of Node.js versions parsed from nvmrc or package.json
 * @returns {string[]} An array that contains all node versions available in the nvmrc or package.json
 */

function getNodeVersionsFromFile(nodeVersions) {
  // Extract an array of accepted Node.js versions
  const packageJsonNodeVersions = nodeVersions
    ?.split(/\|\||\s/)
    .map((version) => version.trim().replace(".x", ""));

  return packageJsonNodeVersions;
}

module.exports = {
  getNodeVersionsFromFile
}
