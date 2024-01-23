const { chooseNodeVersionIfInstalled } = require("./chooseNodeVersionIfInstalled");
const { getMinimumAndMaximumVersion } = require("../utils/getMinimumAndMaximumVersion");
const { installNodeVersion } = require("./installNodeVersion");
const { useMaximumVersion } = require("../utils/useMaximumVersion");
const { getNodeVersionsFromFile } = require("../utils/getNodeVersionsFromFile");

/**
 * Handles the NVM file
 * @param {string} nvmFile - The content of the .nvmrc file
 */

function handleNvmFile(nvmFile) {
  const parsedNvmFile = getNodeVersionsFromFile(nvmFile.trim());
  
  const { minimumVersion, maximumVersion } = getMinimumAndMaximumVersion(parsedNvmFile);
  
  // If the nvm file has only a fixed version, use the biggest one
  if (!minimumVersion && !maximumVersion) {
    useMaximumVersion(parsedNvmFile)
  }
  
  // The exec command loses the nvm context, so we need to source it again
  const nvmSource = `. ${process.env.NVM_DIR}/nvm.sh`;
  // If the node version is already installed, use it
  chooseNodeVersionIfInstalled(nvmSource, minimumVersion, maximumVersion);
  // If the node version is not installed, install it
  installNodeVersion(nvmSource, minimumVersion, maximumVersion);
}

module.exports = {
  handleNvmFile
};
