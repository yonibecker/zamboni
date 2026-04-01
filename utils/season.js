/**
 * Returns the current NHL season ID in the format used by the NHL API (e.g. "20252026").
 * The NHL season typically starts in October, so if the current month is October or later,
 * the season is currentYear + nextYear. Otherwise it's previousYear + currentYear.
 */
const getCurrentSeason = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed (0 = January)
  if (month >= 9) {
    // October or later: new season has started
    return `${year}${year + 1}`;
  }
  // Before October: still in last year's season
  return `${year - 1}${year}`;
};

module.exports = { getCurrentSeason };
