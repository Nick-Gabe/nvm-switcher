// @ts-check
const { handleNvmFile } = require("./handlers/handleNvmFile");
const { handlePackageJsonFile } = require("./handlers/handlePackageJsonFile");
const { readFile } = require("./utils/readFile");
const { useVersion } = require("./utils/useVersion");

try {
  const nvmFileContent = readFile(".nvmrc");
  const packageJsonFileContent = readFile("package.json");

  if ((packageJsonFileContent === null) && (nvmFileContent === null)) {
    throw new Error(".nvmrc and package.json files not found. Setting the current installed version."); 
  }

  if (nvmFileContent) {
    handleNvmFile(nvmFileContent)
  }

  if (packageJsonFileContent) {
    handlePackageJsonFile(packageJsonFileContent);
  }
} catch {
  // Use the current version if there are no package.json and nvmrc files or any error occurs
  useVersion("current");
}
