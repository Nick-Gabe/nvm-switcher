/**
 * Uses a specific Node.js version and finishes the process
 * @param {string} version - The version to be used
 */

function useVersion(version) {
  console.log(version);
  process.exit(1);
}

module.exports = {
  useVersion
}
