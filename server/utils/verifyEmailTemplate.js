export default function verifyEmailTemplate({ name, url }) {
  return `
    <div>
      <h2>Hello ${name},</h2>
      <p>you registered successfully </p>
      <a href="${url}" style="padding:10px 15px; background:#007bff; color:white; text-decoration:none;">Verify Email</a>
      <p>If you didn’t request this, you can ignore this email.</p>
    </div>
  `;
}
