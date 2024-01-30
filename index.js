// @ts-check
const { exec } = require("child_process");
const fs = require("fs").promises;
const { getSemanticVersion, parseVersions, useVersion, filterValidVersions } = require('./MODULES/versionManager');



async function readPackageJson() {
  try {
    const packageJson = await fs.readFile("package.json", "utf-8");
    return JSON.parse(packageJson);
  } catch (error) {
    throw new Error("Error: Unable to read package.json");
  }
}


function findMinMaxVersions(versions) {
  const minimumVersion = getSemanticVersion(
    versions.find((version) => version.startsWith(">"))
  );

  const maximumVersion = getSemanticVersion(
    versions.find((version) => version.startsWith("<"))
  );

  return { minimumVersion, maximumVersion };
}


async function main() {
  let packageJson;
  try {
    packageJson = await readPackageJson();
  } catch (error) {
    console.error(error.message);
    useVersion("current");
    return;
  }


  const packageJsonNodeVersions = packageJson?.engines?.node
    ?.split(/\|\||\s/)
    .map((version) => version.trim().replace(".x", ""));

  if (!packageJsonNodeVersions?.length) {
    useVersion("current");
    return;
  }

  const { minimumVersion, maximumVersion } = findMinMaxVersions(
    packageJsonNodeVersions
  );

  if (!minimumVersion && !maximumVersion) {
    const biggestVersion = packageJsonNodeVersions.reduce(
      (acc, version) => (acc > version ? acc : version),
      packageJsonNodeVersions[0]
    );
    useVersion(biggestVersion);
    return;
  }

  const nvmSource = `source ${process.env.NVM_DIR}/nvm.sh`;


  exec(`${nvmSource} && nvm list`, async (error, stdout) => {
    if (error) {
      console.error(error);
      return;
    }

    const versions = parseVersions(stdout);

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


  exec(`${nvmSource} && nvm ls-remote`, async (error, stdout) => {
    if (error) {
      console.error(error);
      return;
    }

    const versions = parseVersions(stdout);

    const filteredVersions = filterValidVersions(
      versions,
      minimumVersion,
      maximumVersion
    );

    if (filteredVersions.length) {
      const latestVersion = filteredVersions.pop();
      exec(`${nvmSource} && nvm install ${latestVersion}`, (error) => {
        if (error) {
          console.error(error);
          return;
        }

        latestVersion && useVersion(latestVersion);
      });
    }
  });
}

main();