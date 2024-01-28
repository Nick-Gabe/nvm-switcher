// @ts-check
const { exec } = require("child_process");
const fs = require("fs");
const { getSemanticVersion, parseVersions, useVersion, filterValidVersions } = require('./MODULES/versionManager')


let packageJson = "";

try {
  packageJson = fs.readFileSync("package.json", "utf-8");
} catch {
  useVersion("current");
}

const parsedPackageJson = JSON.parse(packageJson);

const packageJsonNodeVersions = parsedPackageJson?.engines?.node
  ?.split(/\|\||\s/)
  .map((version) => version.trim().replace(".x", ""));

if (!packageJsonNodeVersions?.length) {
  useVersion("current");
}

const minimumVersion = getSemanticVersion(
  packageJsonNodeVersions.find((version) => version.startsWith(">"))
);

const maximumVersion = getSemanticVersion(
  packageJsonNodeVersions.find((version) => version.startsWith("<"))
);

if (!minimumVersion && !maximumVersion) {
  const biggestVersion = packageJsonNodeVersions.reduce(
    (acc, version) => (acc > version ? acc : version),
    packageJsonNodeVersions[0]
  );
  useVersion(biggestVersion);
}

const nvmSource = `source ${process.env.NVM_DIR}/nvm.sh`;

exec(`${nvmSource} && nvm list`, (error, stdout) => {
  if (error) {
    console.log(error);
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

exec(`${nvmSource} && nvm ls-remote`, (error, stdout) => {
  if (error) {
    console.log(error);
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
        console.log(error);
        return;
      }

      latestVersion && useVersion(latestVersion);
    });
  }
});

useVersion("current");