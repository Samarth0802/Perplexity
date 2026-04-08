import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();

const OAuth2 = google.auth.OAuth2;

const createTransporter = async () => {
    const oauth2Client = new OAuth2(
        process.env.GMAIL_CLIENT_ID,
        process.env.GMAIL_CLIENT_SECRET,
        "https://developers.google.com/oauthplayground"
    );

    oauth2Client.setCredentials({
        refresh_token: process.env.GMAIL_REFRESH_TOKEN
    });

    return google.gmail({ version: 'v1', auth: oauth2Client });
};

const sendMail = async ({ to, subject, text, html }) => {
    try {
        const gmail = await createTransporter();
        
        // Encode subject to handle special characters properly
        const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
        
        // Build the email according to RFC 2822 formatting
        const messageParts = [
            `From: ${process.env.GMAIL_USER}`,
            `To: ${to}`,
            `Subject: ${utf8Subject}`,
            'MIME-Version: 1.0',
            'Content-Type: text/html; charset=utf-8',
            '',
            html || text || ''
        ];
        
        const emailBody = messageParts.join('\r\n');
        
        // Base64url encode the message as required by Gmail API
        const encodedMessage = Buffer.from(emailBody)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
            
        const result = await gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: encodedMessage,
            },
        });
        
        console.log("Mail sent successfully using Google APIs, id:", result.data.id);
        return result;
    } catch (error) {
        console.error("Error sending mail:", error);
    }
};

// Check connection early (creates the client instance)
createTransporter().then(() => {
    console.log("Mail server is ready (Gmail REST API)");
}).catch(err => {
    console.error("Failed to initialize mail service:", err);
});

export default sendMail;