// const { onDocumentUpdated } = require("firebase-functions/v2/firestore");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { onCall } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");

const admin = require("firebase-admin");
admin.initializeApp();

const notifications = require("./notifications");
const packageExtraction = require("./packageExtraction");
const payments = require("./payments");
const couriers = require("./couriers");

// Define secrets
const GEMINI_API_KEY = defineSecret("GEMINI_API_KEY");
const TWILIO_ACCOUNT_SID = defineSecret("TWILIO_ACCOUNT_SID");
const TWILIO_AUTH_TOKEN = defineSecret("TWILIO_AUTH_TOKEN");
const SENDGRID_API_KEY = defineSecret("SENDGRID_API_KEY");

// Function to send notifications on package status change
// exports.onPackageStatusChange = onDocumentUpdated("packages/{packageId}", async (event) => {
//     const newValue = event.data.after.data();
//     const previousValue = event.data.before.data();
//
//     if (newValue.status !== previousValue.status) {
//         console.log(`Package ${event.params.packageId} status changed from ${previousValue.status} to ${newValue.status}`);
//         // Implement notification logic here, passing secrets if needed
//         // await notifications.sendNotification(newValue.customerId, `סטטוס החבילה שלך השתנה ל: ${newValue.status}`, { secrets: { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, SENDGRID_API_KEY } });
//     }
//     return null;
// });

// Function to send payment reminders (scheduled for 6th of every month)
exports.sendPaymentReminder = onSchedule({ schedule: "0 0 6 * *", secrets: [TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, SENDGRID_API_KEY] }, async (event) => {
    console.log("Sending monthly payment reminders");
    // Implement payment reminder logic here
    // await payments.sendPaymentReminders({ secrets: { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, SENDGRID_API_KEY } });
    return null;
});

// Function to extract package details from WhatsApp message
exports.extractPackageFromWhatsApp = onCall({ secrets: [GEMINI_API_KEY, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN] }, async (request) => {
    // Implement WhatsApp extraction logic here
    // return packageExtraction.extractFromWhatsApp(request.data.message, { secrets: { GEMINI_API_KEY, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } });
    return { status: "success", message: "WhatsApp extraction function called" };
});

// Function to extract package details from image (OCR)
exports.extractPackageFromImage = onCall({ secrets: [GEMINI_API_KEY] }, async (request) => {
    // Implement image OCR extraction logic here
    // return packageExtraction.extractFromImage(request.data.imageUrl, { secrets: { GEMINI_API_KEY } });
    return { status: "success", message: "Image OCR extraction function called" };
});

// Function to process subscription payment
exports.processSubscriptionPayment = onCall({ secrets: [TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, SENDGRID_API_KEY] }, async (request) => {
    // Implement payment processing logic here
    // return payments.processPayment(request.data.userId, request.data.packageId, { secrets: { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, SENDGRID_API_KEY } });
    return { status: "success", message: "Subscription payment function called" };
});

// Function to create courier account and notify
exports.createCourierAndNotify = onCall({ secrets: [TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, SENDGRID_API_KEY] }, async (request) => {
    // Implement courier creation and notification logic here
    // return couriers.createCourier(request.data.email, request.data.password, { secrets: { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, SENDGRID_API_KEY } });
    return { status: "success", message: "Create courier function called" };
});

