// @ts-check
const { exec } = require("child_process");
const fs = require("fs");

let packageJson = "";

try {
  packageJson = fs.readFileSync("package.json", "utf-8");
} catch {
  // Use the current version if there is no package.json
  useVersion("current");
}

const parsedPackageJson = JSON.parse(packageJson);

// Extract an array of accepted Node.js versions from the engines.node field
const packageJsonNodeVersions = parsedPackageJson.engines.node
  .split(/\|\||\s/)
  .map((version) => version.trim().replace(".x", ""));

const minimumVersion = getSemanticVersion(
  packageJsonNodeVersions.find((version) => version.startsWith(">"))
);

const maximumVersion = getSemanticVersion(
  packageJsonNodeVersions.find((version) => version.startsWith("<"))
);

// If the engines.node has only fixed versions, use the biggest one
if (!minimumVersion && !maximumVersion) {
  const biggestVersion = packageJsonNodeVersions.reduce(
    (acc, version) => (acc > version ? acc : version),
    packageJsonNodeVersions[0]
  );
  useVersion(biggestVersion);
}

// The exec command loses the nvm context, so we need to source it again
const nvmSource = `source ${process.env.NVM_DIR}/nvm.sh`;

// First it tries to check if you have any installed version that is valid
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

// If no version is found, continue using the current one
useVersion("current");

// -------------------------------
// Helper functions

/**
 * Extracts the major, minor and patch version from a string: [major, minor, patch]
 * @param {string} version - The version to be parsed
 */
function getSemanticVersion(version) {
  if (!version) return null;
  // Removes comparison characters and gets the major, minor and patch version
  const semanticVersion = version.replace(/>|>=|<|<=/g, "").match(/\d+/g);
  if (!semanticVersion) return null;

  const [major, minor = 0, patch = 0] = semanticVersion.map((v) => Number(v));
  return { major, minor, patch };
}

/**
 * Uses a specific Node.js version and finishes the process
 * @param {string} version - The version to be used
 */
function useVersion(version) {
  console.log(version);
  process.exit(1);
}

/**
 * Parses the versions from the nvm list command stdout and turns them into an array of x.y.z strings
 * @param {string} versions - The versions to be parsed
 * @returns {string[]} The parsed versions
 */
function parseVersions(versions) {
  return versions
    .split("\n")
    .filter((version) => /\d( \*)*$/.test(version))
    .map((version) => version.replace(/[a-z:()\-><\s*]/gi, "").trim());
}

/**
 * Checks if a version is valid, being above a specific target
 * @param {object} versions - The current version and the target version
 * @returns {boolean} True if the version is valid, false otherwise
 */
function isVersionAboveTarget({ version, target }) {
  let isValid = true; // Assume the version is valid unless proven otherwise

  if (version.major < target.major) {
    isValid = false;
  } else if (version.major === target.major) {
    if (version.minor < target.minor) {
      isValid = false;
    } else if (version.minor === target.minor) {
      if (version.patch <= target.patch) {
        isValid = false;
      }
    }
  }

  return isValid;
}

/**
 * Filters the versions that match the comparison criteria
 * @param {string[]} versions - The versions to be filtered
 * @param {object} minimumVersion - The version to be compared with
 * @param {object} maximumVersion - The version to be compared with
 * @returns {string[]} The filtered versions
 */
function filterValidVersions(versions, minimumVersion, maximumVersion) {
  return versions.filter((version) => {
    let isValid = true; // Assume the version is valid unless proven otherwise

    const semanticVersion = getSemanticVersion(version);
    if (!semanticVersion) return false;

    if (minimumVersion) {
      // If the minimum is above the version, it won't be valid
      isValid = isVersionAboveTarget({
        version: semanticVersion,
        target: minimumVersion,
      });
    }

    if (maximumVersion) {
      // If the version is above the maximum, it won't be valid
      isValid = isVersionAboveTarget({
        version: maximumVersion,
        target: semanticVersion,
      });
    }

    return isValid;
  });
}
