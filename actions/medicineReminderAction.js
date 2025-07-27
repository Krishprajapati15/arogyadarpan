"use server";

import nodemailer from "nodemailer";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const generateEmailHTML = (
  medicineName,
  dosage,
  instructions,
  time,
  reminderType
) => {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Medicine Reminder</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                background: linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%);
                color: #ffffff;
                line-height: 1.6;
                padding: 20px;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
                border-radius: 20px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                overflow: hidden;
                border: 1px solid #333;
            }
            .header {
                background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
                padding: 30px;
                text-align: center;
                position: relative;
            }
            .pill-icon {
                width: 60px;
                height: 60px;
                background: rgba(255,255,255,0.2);
                border-radius: 50%;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 15px;
                backdrop-filter: blur(10px);
            }
            .header h1 {
                font-size: 28px;
                font-weight: 700;
                margin-bottom: 8px;
                position: relative;
                z-index: 1;
            }
            .header p {
                opacity: 0.9;
                font-size: 16px;
                position: relative;
                z-index: 1;
            }
            .content {
                padding: 40px 30px;
                background: #1a1a1a;
            }
            .reminder-card {
                background: linear-gradient(145deg, #2d2d2d, #1e1e1e);
                border-radius: 15px;
                padding: 25px;
                margin-bottom: 25px;
                border: 1px solid #333;
                box-shadow: inset 0 1px 0 rgba(255,255,255,0.1);
            }
            .medicine-name {
                font-size: 24px;
                font-weight: 700;
                color: #60a5fa;
                margin-bottom: 15px;
                text-align: center;
            }
            .detail-row {
                display: flex;
                align-items: center;
                margin-bottom: 12px;
                padding: 8px 0;
                border-bottom: 1px solid rgba(255,255,255,0.1);
            }
            .detail-row:last-child {
                border-bottom: none;
            }
            .detail-icon {
                width: 20px;
                height: 20px;
                margin-right: 12px;
                opacity: 0.8;
            }
            .detail-label {
                font-weight: 600;
                color: #9ca3af;
                min-width: 80px;
            }
            .detail-value {
                color: #ffffff;
                flex: 1;
            }
            .time-highlight {
                background: linear-gradient(135deg, #059669, #10b981);
                color: white;
                padding: 8px 16px;
                border-radius: 25px;
                font-weight: 600;
                display: inline-block;
                box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
            }
            .instructions {
                background: linear-gradient(145deg, #374151, #4b5563);
                border-radius: 10px;
                padding: 20px;
                margin-top: 20px;
                border-left: 4px solid #60a5fa;
            }
            .footer {
                background: #111;
                padding: 25px 30px;
                text-align: center;
                border-top: 1px solid #333;
            }
            .footer p {
                color: #9ca3af;
                font-size: 14px;
                margin-bottom: 10px;
            }
            .health-tip {
                background: linear-gradient(135deg, #1e40af, #3730a3);
                border-radius: 10px;
                padding: 15px;
                margin-top: 20px;
                text-align: center;
            }
            @media (max-width: 600px) {
                .container { margin: 10px; }
                .header, .content, .footer { padding: 20px; }
                .medicine-name { font-size: 20px; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="pill-icon">
                    <svg width="30" height="30" fill="white" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                </div>
                <h1>⏰ Medicine Reminder</h1>
                <p>Time to take your medication</p>
            </div>
            
            <div class="content">
                <div class="reminder-card">
                    <div class="medicine-name">💊 ${medicineName}</div>
                    
                    <div class="detail-row">
                        <svg class="detail-icon" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                        <span class="detail-label">Time:</span>
                        <span class="detail-value time-highlight">${time}</span>
                    </div>
                    
                    <div class="detail-row">
                        <svg class="detail-icon" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                        </svg>
                        <span class="detail-label">Date:</span>
                        <span class="detail-value">${currentDate}</span>
                    </div>
                    
                    ${
                      dosage
                        ? `
                    <div class="detail-row">
                        <svg class="detail-icon" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M21.5 9h-3.5l1.5-1.5L17 6l-3 3h-4l-3-3L5.5 7.5L7 9H3.5c-.83 0-1.5.67-1.5 1.5v3c0 .83.67 1.5 1.5 1.5H7l-1.5 1.5L7 18l3-3h4l3 3 1.5-1.5L17 15h4.5c.83 0 1.5-.67 1.5-1.5v-3c0-.83-.67-1.5-1.5-1.5z"/>
                        </svg>
                        <span class="detail-label">Dosage:</span>
                        <span class="detail-value">${dosage}</span>
                    </div>
                    `
                        : ""
                    }
                    
                    <div class="detail-row">
                        <svg class="detail-icon" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        <span class="detail-label">Type:</span>
                        <span class="detail-value">${
                          reminderType === "always"
                            ? "Daily Reminder"
                            : reminderType === "specific-day"
                            ? "Weekly Reminder"
                            : "One-time Reminder"
                        }</span>
                    </div>
                </div>
                
                ${
                  instructions
                    ? `
                <div class="instructions">
                    <h3 style="margin-bottom: 10px; color: #60a5fa;">📋 Instructions:</h3>
                    <p>${instructions}</p>
                </div>
                `
                    : ""
                }
                
                <div class="health-tip">
                    <strong>💡 Health Tip:</strong> Taking your medication at the same time every day helps maintain consistent levels in your body for optimal effectiveness.
                </div>
            </div>
            
            <div class="footer">
                <p>This is an automated reminder from your Medicine Reminder System</p>
                <p style="font-size: 12px; opacity: 0.7;">Stay healthy, stay consistent! 🌟</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

// Main function to send medicine reminder
export async function sendMedicineReminder(formData) {
  try {
    const {
      medicineName,
      email,
      reminderType,
      time,
      specificDate,
      specificDay,
      dosage,
      instructions,
    } = formData;

    // Validate required fields
    if (!medicineName || !email || !time) {
      return { success: false, error: "Please fill in all required fields." };
    }

    // Store reminder in database
    const savedReminder = await prisma.medicineReminder.create({
      data: {
        medicineName,
        email,
        reminderType,
        time,
        specificDate: specificDate || null,
        specificDay: specificDay || null,
        dosage: dosage || null,
        instructions: instructions || null,
        isActive: true,
      },
    });

    // Create transporter and send immediate confirmation email
    const transporter = createTransporter();
    const htmlContent = generateEmailHTML(
      medicineName,
      dosage,
      instructions,
      time,
      reminderType
    );

    // Create subject line
    let subject = `💊 Medicine Reminder Confirmation: ${medicineName}`;
    if (reminderType === "specific-date" && specificDate) {
      subject += ` - ${new Date(specificDate).toLocaleDateString()}`;
    } else if (reminderType === "specific-day" && specificDay) {
      subject += ` - Every ${
        specificDay.charAt(0).toUpperCase() + specificDay.slice(1)
      }`;
    } else {
      subject += " - Daily Reminder";
    }

    const mailOptions = {
      from: `"Medicine Reminder System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      html: htmlContent,
      text: `
Medicine Reminder Confirmation: ${medicineName}

Time: ${time}
${dosage ? `Dosage: ${dosage}` : ""}
${instructions ? `Instructions: ${instructions}` : ""}

Your reminder has been set successfully! You will receive notifications as scheduled.
      `,
    };

    await transporter.sendMail(mailOptions);

    return {
      success: true,
      message:
        "Medicine reminder set successfully! You will receive email notifications as scheduled.",
      reminderId: savedReminder.id,
    };
  } catch (error) {
    console.error("Error sending medicine reminder:", error);
    return {
      success: false,
      error:
        "Failed to set up medicine reminder. Please check your configuration.",
    };
  }
}

// Function to get all active reminders for a user
export async function getUserReminders(email) {
  try {
    const reminders = await prisma.medicineReminder.findMany({
      where: {
        email: email,
        isActive: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, reminders };
  } catch (error) {
    console.error("Error fetching reminders:", error);
    return { success: false, error: "Failed to fetch reminders" };
  }
}

// Function to update reminder status
export async function updateReminderStatus(reminderId, isActive) {
  try {
    await prisma.medicineReminder.update({
      where: { id: reminderId },
      data: { isActive },
    });

    return { success: true, message: "Reminder status updated successfully" };
  } catch (error) {
    console.error("Error updating reminder:", error);
    return { success: false, error: "Failed to update reminder" };
  }
}

// Function to delete reminder
export async function deleteReminder(reminderId) {
  try {
    await prisma.medicineReminder.delete({
      where: { id: reminderId },
    });

    return { success: true, message: "Reminder deleted successfully" };
  } catch (error) {
    console.error("Error deleting reminder:", error);
    return { success: false, error: "Failed to delete reminder" };
  }
}

// Function to send scheduled reminders (to be called by cron job)
export async function sendScheduledReminders() {
  try {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
    const currentDay = now
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();
    const currentDate = now.toISOString().split("T")[0]; // YYYY-MM-DD format

    // Get all active reminders that should be sent now
    const reminders = await prisma.medicineReminder.findMany({
      where: {
        isActive: true,
        time: currentTime,
        OR: [
          { reminderType: "always" },
          {
            reminderType: "specific-day",
            specificDay: currentDay,
          },
          {
            reminderType: "specific-date",
            specificDate: currentDate,
          },
        ],
      },
    });

    const transporter = createTransporter();
    const results = [];

    for (const reminder of reminders) {
      try {
        const htmlContent = generateEmailHTML(
          reminder.medicineName,
          reminder.dosage,
          reminder.instructions,
          reminder.time,
          reminder.reminderType
        );

        const mailOptions = {
          from: `"Medicine Reminder System" <${process.env.EMAIL_USER}>`,
          to: reminder.email,
          subject: `💊 Time to take your medicine: ${reminder.medicineName}`,
          html: htmlContent,
        };

        await transporter.sendMail(mailOptions);

        // Update last sent timestamp
        await prisma.medicineReminder.update({
          where: { id: reminder.id },
          data: { lastSent: new Date() },
        });

        results.push({ success: true, reminderId: reminder.id });

        // If it's a one-time reminder (specific-date), deactivate it
        if (reminder.reminderType === "specific-date") {
          await prisma.medicineReminder.update({
            where: { id: reminder.id },
            data: { isActive: false },
          });
        }
      } catch (error) {
        console.error(`Error sending reminder ${reminder.id}:`, error);
        results.push({
          success: false,
          reminderId: reminder.id,
          error: error.message,
        });
      }
    }

    return { success: true, results, totalProcessed: reminders.length };
  } catch (error) {
    console.error("Error in sendScheduledReminders:", error);
    return { success: false, error: "Failed to process scheduled reminders" };
  }
}
