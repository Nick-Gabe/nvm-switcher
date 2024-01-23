const { useVersion } = require("./useVersion");

/**
 * Uses the maximum node version encountered on package.json and finishes the process
 * @param {string[]} packageJsonNodeVersions - An array of Node.js versions parsed from package.json
 */

function useMaximumVersion(packageJsonNodeVersions) {
  const maximumNodeVersion = packageJsonNodeVersions.reduce(
    (acc, version) => (acc > version ? acc : version),
    packageJsonNodeVersions[0]
  );

  useVersion(maximumNodeVersion);
}

module.exports = {
  useMaximumVersion
}
