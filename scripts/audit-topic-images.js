/**
 * Validates topic image paths referenced in data files exist on disk.
 * Run: node scripts/audit-topic-images.js
 */
const { main } = require('./audit-all-images.js');
main();