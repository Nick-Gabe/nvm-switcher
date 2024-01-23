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

module.exports = {
  parseVersions
}
