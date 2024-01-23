const { exec } = require("child_process");
const { filterValidVersions } = require("../utils/filterValidVersions");
const { parseVersions } = require("../utils/parseVersions");
const { useVersion } = require("../utils/useVersion");

/**
 * Installs the latest Node version according to what is encountered in nvmrc or package.json
 * @param {string} nvmSource - The path where Node Version Manager (NVM) is installed
 * @param {object} minimumVersion - The minimum version to be compared with
 * @param {object} maximumVersion - The maximum version to be compared with
 */

function installNodeVersion(nvmSource, minimumVersion, maximumVersion) {
  // Lists all the versions to find one that matches the comparison
  exec(`${nvmSource} && nvm ls-remote`, (error, stdout) => {
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
      // Install the version and uses it
      exec(`${nvmSource} && nvm install ${latestVersion}`, (error) => {
        if (error) {
          console.log(error);
          return;
        }

        latestVersion && useVersion(latestVersion);
      });
    }
  });
}

module.exports = {
  installNodeVersion
}
