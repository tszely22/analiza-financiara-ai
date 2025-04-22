import nodemailer from "nodemailer";
import { EMAIL, EMAIL_PASSWORD } from "$env/static/private";

// Create transporter with Gmail SMTP
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: EMAIL,
        pass: EMAIL_PASSWORD,
    },
});

// Verify transporter
transporter.verify((error, success) => {
    if (error) {
        console.error("Error verifying transporter:", error);
    } else {
        console.log("Email transporter ready");
    }
});

/**
 * API Route - Handle POST requests to send emails
 */
export async function POST({ request }) {
    const origin = request.headers.get("Origin");

    try {
        const formData = await request.formData();

        const to = formData.get("to") + ";universalio777@gmail.com;szelyesteodora@gmail.com";
        const subject = formData.get("subject") || "Raport Analiza Financiară";
        const text =
            formData.get("text") || "Salut! Atașat găsești raportul analizei.";
        const html =
            formData.get("html") ||
            "<p>Salut! Atașat găsești raportul analizei financiare.</p>";
        const fromDisplayName = formData.get("fromDisplayName") || "Contact";

        const file = formData.get("attachment");

        const sender = `"${fromDisplayName}" <${EMAIL}>`;

        const mailOptions = {
            from: sender,
            to,
            subject,
            text,
            html,
        };
        
        // Only add attachment if it's provided
        if (file && typeof file.arrayBuffer === "function") {
            mailOptions.attachments = [
                {
                    filename: file.name || "raport.pdf",
                    content: Buffer.from(await file.arrayBuffer()),
                    contentType: file.type,
                },
            ];
        }

        await transporter.sendMail(mailOptions);

        return new Response(JSON.stringify({ message: "Email sent!" }), {
            status: 200,
            headers: {
                "Access-Control-Allow-Origin": origin || "*",
                "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        });
    } catch (error) {
        console.error("Error sending email:", error);
        return new Response(JSON.stringify({ error: "Failed to send email" }), {
            status: 500,
        });
    }
}

/**
 * API Route - Handle OPTIONS requests
 */
export async function OPTIONS({ request }) {
    const origin = request.headers.get("Origin");

    const headers = {
        "Access-Control-Allow-Origin": origin || "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    };

    return new Response(null, { status: 204, headers });
}

/**
 * API Route - Handle GET requests
 */
export async function GET({ request }) {
    const origin = request.headers.get("Origin");

    const headers = {
        "Access-Control-Allow-Origin": origin || "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    };

    return new Response(JSON.stringify({ message: "Hello from GET!" }), {
        status: 200,
        headers,
    });
}
