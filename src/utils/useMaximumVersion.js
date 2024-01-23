const { useVersion } = require("./useVersion");

/**
 * Uses the maximum node version encountered on nvmrc or package.json and finishes the process
 * @param {string[]} nodeVersions - An array of Node.js versions parsed from package.json
 */

function useMaximumVersion(nodeVersions) {
  const maximumNodeVersion = nodeVersions.reduce(
    (acc, version) => (acc > version ? acc : version),
    nodeVersions[0]
  );

  useVersion(maximumNodeVersion);
}

module.exports = {
  useMaximumVersion
}
