/**
 * @param {string} version 
 */
function getSemanticVersion(version) {
    if (!version) return null;
    const semanticVersion = version.replace(/>|>=|<|<=/g, "").match(/\d+/g);
    if (!semanticVersion) return null;
    const [major, minor = 0, patch = 0] = semanticVersion.map((v) => Number(v));
    
    return { major, minor, patch };
  }


/**
 * @param {string} version
 */
function useVersion(version) {
    console.log(version);
    process.exit(1);
}


/**
 * @param {string} versions
 * @returns {string[]}
 */
function parseVersions(versions) {
    return versions
      .split("\n")
      .filter((version) => /\d( \*)*$/.test(version))
      .map((version) => version.replace(/[a-z:()\-><\s*]/gi, "").trim());
  }


/**
 * @param {object} versions
 * @returns {boolean} 
 */
function isVersionAboveTarget({ version, target }) {
    let isValid = true;
  
    if (version.major < target.major) {
      isValid = false;
    } 
    else if (version.major === target.major) {
      if (version.minor < target.minor) {
        isValid = false;
      } 
    else if (version.minor === target.minor) {
        if (version.patch <= target.patch) {
          isValid = false;
        }
      }
    }
  
    return isValid;
}


/**
 * @param {string[]} versions 
 * @param {object} minimumVersion 
 * @param {object} maximumVersion
 * @returns {string[]}
 */
function filterValidVersions(versions, minimumVersion, maximumVersion) {
    return versions.filter((version) => {
      let isValid = true; 
  
      const semanticVersion = getSemanticVersion(version);
      if (!semanticVersion) return false;
  
      if (minimumVersion) {
        isValid = isVersionAboveTarget({
          version: semanticVersion,
          target: minimumVersion,
        });
      }
  
      if (maximumVersion) {
        isValid = isVersionAboveTarget({
          version: maximumVersion,
          target: semanticVersion,
        });
      }
  
      return isValid;
    });
}


exports.getSemanticVersion = getSemanticVersion
exports.parseVersions = parseVersions
exports.useVersion = useVersion
exports.filterValidVersions = filterValidVersions;