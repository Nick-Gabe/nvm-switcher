const { exec } = require("child_process");
const { filterValidVersions } = require("../utils/filterValidVersions");
const { parseVersions } = require("../utils/parseVersions");
const { useVersion } = require("../utils/useVersion");

/**
 * Chooses and uses a Node.js version from the installed versions based if it matches the one from nvmrc or package.json
 * @param {string} nvmSource - The path where Node Version Manager (NVM) is installed
 * @param {object} minimumVersion - The minimum version to be compared with
 * @param {object} maximumVersion - The maximum version to be compared with
 */

function chooseNodeVersionIfInstalled(nvmSource, minimumVersion, maximumVersion) {
  // Checks if you have any installed version that is valid
  exec(`${nvmSource} && nvm list`, (error, stdout) => {
    if (error) {
      console.log(error);
      return;
    }

    const versions = parseVersions(stdout);

    // Filter versions that match the comparison criteria
    const filteredVersions = filterValidVersions(
      versions,
      minimumVersion,
      maximumVersion
    );

    if (filteredVersions.length) {
      const latestVersion = filteredVersions.pop();
      latestVersion && useVersion(latestVersion);
    }
  });
}

module.exports = {
  chooseNodeVersionIfInstalled
}
