// @ts-check
const fs = require("fs");
const { chooseNodeVersionIfInstalled } = require("./handlers/chooseNodeVersionIfInstalled");
const { getMinimumAndMaximumVersion } = require("./utils/getMinimumAndMaximumVersion");
const { getPackageJsonNodeVersions } = require("./utils/getPackageJsonNodeVersions");
const { installNodeVersion } = require("./handlers/installNodeVersion");
const { useMaximumVersion } = require("./utils/useMaximumVersion");
const { useVersion } = require("./utils/useVersion");

let packageJson = "";

try {
  packageJson = fs.readFileSync("package.json", "utf-8");

  const parsedPackageJson = JSON.parse(packageJson);

  const packageJsonNodeVersions = getPackageJsonNodeVersions(parsedPackageJson);

  if (!packageJsonNodeVersions?.length) {
    useVersion("current");
  }

  const { minimumVersion, maximumVersion } = getMinimumAndMaximumVersion(packageJsonNodeVersions);

  // If the engines.node has only fixed versions, use the biggest one
  if (!minimumVersion && !maximumVersion) {
    useMaximumVersion(packageJsonNodeVersions)
  }

  // The exec command loses the nvm context, so we need to source it again
  const nvmSource = `. ${process.env.NVM_DIR}/nvm.sh`;

  chooseNodeVersionIfInstalled(nvmSource, minimumVersion, maximumVersion);

  installNodeVersion(nvmSource, minimumVersion, maximumVersion);
} catch {
  // Use the current version if there is no package.json
  useVersion("current");
}
