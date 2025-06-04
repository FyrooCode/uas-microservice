// Simple script to run the tracking number migration once
const { runTrackingNumberMigration } = require('./dist/migrations/runMigration');

async function runMigration() {
  console.log('🔄 Running tracking number migration...');
  try {
    await runTrackingNumberMigration();
    console.log('✅ Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
