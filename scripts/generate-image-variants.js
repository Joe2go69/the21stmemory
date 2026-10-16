/**
 * Generate small display copies of topic + series card art (see scripts/lib/image-variants.js).
 * Skips files that already exist. --force rebuilds everything.
 * Run: node scripts/generate-image-variants.js
 */
const { ensureTopicVariants, ensureSeriesVariants, collectTopicImages } = require('./lib/image-variants');

async function main() {
  const force = process.argv.includes('--force');
  const { images, sourceIds } = collectTopicImages();
  let written = 0;
  for (const rel of images) written += await ensureTopicVariants(rel, { force });
  for (const id of sourceIds) written += await ensureSeriesVariants(id, { force });
  console.log(`Image variants: ${images.length} topic images checked, ${written} files written`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
