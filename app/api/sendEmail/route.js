import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const formData = await req.formData(); // Get the form data from the request
    const to = formData.get("to");
    const subject = formData.get("subject");
    const text = formData.get("text");
    const files = formData.getAll("files");

    // Ensure `to` is an array, splitting if necessary
    const emailRecipients = typeof to === "string" ? to.split(",") : to;

    // Set up the transporter with Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Prepare the attachments array with async map
    const attachments = await Promise.all(
      files.map(async (file) => ({
        filename: file.name,
        content: Buffer.from(await file.arrayBuffer()), // Convert ArrayBuffer to Buffer
      }))
    );

    const mailOptions = {
      from: "sardarsami12221@gmail.com",
      to: emailRecipients, // Use array of recipients
      subject: subject,
      text: text,
      attachments: attachments,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ message: "Email sent successfully!" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error sending email", details: error.message }), {
      status: 500,
    });
  }
}
