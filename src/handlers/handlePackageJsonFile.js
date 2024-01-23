const { chooseNodeVersionIfInstalled } = require("./chooseNodeVersionIfInstalled");
const { useMaximumVersion } = require("../utils/useMaximumVersion");
const { getMinimumAndMaximumVersion } = require("../utils/getMinimumAndMaximumVersion");
const { getNodeVersionsFromFile } = require("../utils/getNodeVersionsFromFile");
const { installNodeVersion } = require("./installNodeVersion");
const { useVersion } = require("../utils/useVersion");

/**
 * Handles the package.json file
 * @param {string} packageJson - The content of the package.json file
 */

function handlePackageJsonFile(packageJson) {
  const parsedPackageJson = packageJson && JSON.parse(packageJson);
  const packageJsonNodeVersions = getNodeVersionsFromFile(parsedPackageJson?.engines?.node);

  if (!packageJsonNodeVersions?.length) {
    useVersion("current");
  }

  // If the engines.node has only fixed versions, use the biggest one
  const {
    minimumVersion,
    maximumVersion
  } = getMinimumAndMaximumVersion(packageJsonNodeVersions);

  if (!minimumVersion && !maximumVersion) {
    useMaximumVersion(packageJsonNodeVersions);
  }

  // The exec command loses the nvm context, so we need to source it again
  const nvmSource = `. ${process.env.NVM_DIR}/nvm.sh`;
  // If the node version is already installed, use it
  chooseNodeVersionIfInstalled(nvmSource, minimumVersion, maximumVersion);
// If the node version is not installed, install it
  installNodeVersion(nvmSource, minimumVersion, maximumVersion);
}

module.exports = {
  handlePackageJsonFile
};
