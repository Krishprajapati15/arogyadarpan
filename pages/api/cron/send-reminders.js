import { sendScheduledReminders } from "@/actions/medicineReminderAction";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const result = await sendScheduledReminders();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to send reminders" });
  }
}
