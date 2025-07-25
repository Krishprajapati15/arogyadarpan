const cron = require("node-cron");
const { sendScheduledReminders } = require("@/actions/medicineReminderAction");

// Run every minute to check for reminders
cron.schedule("* * * * *", async () => {
  console.log("Checking for scheduled reminders...");
  await sendScheduledReminders();
});
