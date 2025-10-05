const cron = require("node-cron");
const { sendScheduledReminders } = require("@/actions/medicineReminderAction");

// Run every minute to check for reminders
cron.schedule("0 6 * * *", async () => {
  console.log("Checking for scheduled reminders...");
  await sendScheduledReminders();
});
