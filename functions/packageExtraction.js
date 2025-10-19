const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.extractFromWhatsApp = async (message) => {
    console.log(`Extracting from WhatsApp message: ${message}`);
    // Placeholder for Gemini AI integration for NLP
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Extract package details (sender, recipient, address, items, weight, dimensions) from the following WhatsApp message: "${message}". Return as a JSON object.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);
    return { status: 'success', extractedData: text };
};

exports.extractFromImage = async (imageUrl) => {
    console.log(`Extracting from image: ${imageUrl}`);
    // Placeholder for Gemini AI integration for OCR
    // This would typically involve sending the image to a service like Google Cloud Vision or directly to Gemini if it supports image input for OCR tasks.
    return { status: 'success', extractedData: 'OCR data from image (placeholder)' };
};

