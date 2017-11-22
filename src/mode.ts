import * as semver from 'semver';
/**
 * Gets match mode from info of match
 */
export function getMode(match: any): string {
  if (match.map === 'midwars') {
    return 'Mid Wars';
  } else if (match.map === 'riftwars') {
    return 'Rift Wars';
  } else if (match.map === 'devowars') {
    return 'Devo Wars';
  } else if (match.map === 'capturetheflag') {
    return 'Capture the Flag';
  } else if (match.setup_alt_pick + match.setup_nl + match.setup_officl === 3) {
    let version = match.version;
    // count the periods
    const count = (version.match(/\./g) || []).length;
    if (count > 2) {
      // remove extra patch version
      version = version.replace(/(\.[0-9]+)$/, '');
    }
    // seasons
    if (semver.satisfies(version,  '>=4.3.0')) {
      return 'Season 5';
    }
    if (semver.satisfies(version,  '>=4.1.0')) {
      return 'Season 3';
    }
    if (semver.satisfies(version,  '>=4.0.1')) {
      return 'Season 2';
    }
    // "4.0.0.1", "4.0.0.2", "4.0.0.3", "4.0.1.3", "4.0.1.4"
    return 'Season 1';
  } else if (match.setup_nl + match.setup_officl === 2) {
    return 'Ranked';
  }
  return 'Unknown';
}

/**
 * Gets match type from match mode
 */
export function getType(mode: string) {
  const m = mode.toLowerCase();
  if (m.includes('season')) {
    return 'season';
  } else if (m.includes('ranked')) {
    return 'ranked';
  }
  return 'other';
}
