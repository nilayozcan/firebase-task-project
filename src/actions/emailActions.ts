'use server';

/**
 * @fileOverview Placeholder email sending actions.
 * In a real application, these functions would integrate with an email service
 * (e.g., SendGrid, Mailgun, AWS SES) to send actual emails.
 */

interface EmailResult {
  success: boolean;
  error?: string;
}

/**
 * Sends a verification email to the user.
 * @param email The user's email address.
 * @param verificationLink The link the user will click to verify their account.
 * @returns Promise<EmailResult>
 */
export async function sendVerificationEmail(email: string, verificationLink: string): Promise<EmailResult> {
  console.log("\n**************************************************************************************");
  console.log("*                            !!! IMPORTANT SIMULATION NOTE !!!                         *");
  console.log("*  This is a SIMULATED email action. NO ACTUAL EMAIL IS SENT.                        *");
  console.log("*  The verification link for development/testing purposes is printed below.          *");
  console.log("**************************************************************************************");
  console.log(`[SIMULATED EMAIL] To: ${email}`);
  console.log(`[SIMULATED EMAIL] Subject: Hesabınızı Doğrulayın - A Kalender`);
  console.log(`[SIMULATED EMAIL] BODY (HTML - In a real email, this would be rendered):
    <h1>A Kalender'e Hoş Geldiniz!</h1>
    <p>Hesabınızı doğrulamak için lütfen aşağıdaki bağlantıya tıklayın:</p>
    <p><a href="${verificationLink}" style="padding: 10px 15px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Hesabımı Doğrula</a></p>
    <p>Veya bu bağlantıyı tarayıcınızda açın: ${verificationLink}</p>
    <p>Bu isteği siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.</p>`);
  console.log(`[SIMULATED EMAIL] Verification Link (for easy access): ${verificationLink}`);
  console.log("**************************************************************************************\n");
  
  // TODO: Replace this with actual email sending logic using an email service.
  // Example using a hypothetical email service SDK:
  //
  // import { EmailClient } from '@your-email-service/sdk';
  // const emailClient = new EmailClient({ apiKey: process.env.EMAIL_SERVICE_API_KEY });
  //
  // try {
  //   const response = await emailClient.send({
  //     to: email,
  //     from: 'noreply@akalender.com', // Replace with your verified sender email
  //     subject: 'Hesabınızı Doğrulayın - A Kalender',
  //     html: `
  //       <h1>A Kalender'e Hoş Geldiniz!</h1>
  //       <p>Hesabınızı doğrulamak için lütfen aşağıdaki bağlantıya tıklayın:</p>
  //       <p><a href="${verificationLink}" style="padding: 10px 15px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Hesabımı Doğrula</a></p>
  //       <p>Veya bu bağlantıyı tarayıcınızda açın: ${verificationLink}</p>
  //       <p>Bu isteği siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.</p>
  //     `,
  //   });
  //   if (response.success) { // Check the actual response structure of your email service
  //     console.log(`[EmailAction] Successfully sent verification email to ${email}`);
  //     return { success: true };
  //   } else {
  //     console.error(`[EmailAction] Failed to send verification email to ${email}:`, response.error);
  //     return { success: false, error: response.error || 'Email service reported a failure' };
  //   }
  // } catch (error) {
  //   console.error('[EmailAction] Error sending verification email:', error);
  //   return { success: false, error: error instanceof Error ? error.message : 'Unknown error during email sending' };
  // }
  
  // Simulate network delay and success for placeholder
  await new Promise(resolve => setTimeout(resolve, 700)); 
  console.log(`[EmailAction Placeholder] Successfully SIMULATED sending verification email to ${email}.`);
  return { success: true };
}

/**
 * Sends a password reset email to the user.
 * @param email The user's email address.
 * @param resetLink The link the user will click to reset their password.
 * @returns Promise<EmailResult>
 */
export async function sendPasswordResetEmail(email: string, resetLink: string): Promise<EmailResult> {
  console.log("\n**************************************************************************************");
  console.log("*                            !!! IMPORTANT SIMULATION NOTE !!!                         *");
  console.log("*  This is a SIMULATED email action. NO ACTUAL EMAIL IS SENT.                        *");
  console.log("*  The password reset link for development/testing purposes is printed below.        *");
  console.log("**************************************************************************************");
  console.log(`[SIMULATED EMAIL] To: ${email}`);
  console.log(`[SIMULATED EMAIL] Subject: Şifre Sıfırlama İsteği - A Kalender`);
  console.log(`[SIMULATED EMAIL] BODY (HTML - In a real email, this would be rendered):
      <h1>Şifre Sıfırlama İsteği</h1>
      <p>A Kalender hesabınız için bir şifre sıfırlama talebinde bulundunuz.</p>
      <p>Şifrenizi sıfırlamak için lütfen aşağıdaki bağlantıya tıklayın:</p>
      <p><a href="${resetLink}" style="padding: 10px 15px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Şifremi Sıfırla</a></p>
      <p>Veya bu bağlantıyı tarayıcınızda açın: ${resetLink}</p>
      <p>Bu bağlantı 1 saat süreyle geçerlidir.</p>
      <p>Bu isteği siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.</p>`);
  console.log(`[SIMULATED EMAIL] Password Reset Link (for easy access): ${resetLink}`);
  console.log("**************************************************************************************\n");

  // TODO: Replace this with actual email sending logic.
  // Example:
  //
  // import { EmailClient } from '@your-email-service/sdk';
  // const emailClient = new EmailClient({ apiKey: process.env.EMAIL_SERVICE_API_KEY });
  //
  // try {
  //   const response = await emailClient.send({
  //     to: email,
  //     from: 'noreply@akalender.com', // Replace with your verified sender email
  //     subject: 'Şifre Sıfırlama İsteği - A Kalender',
  //     html: `
  //       <h1>Şifre Sıfırlama İsteği</h1>
  //       <p>A Kalender hesabınız için bir şifre sıfırlama talebinde bulundunuz.</p>
  //       <p>Şifrenizi sıfırlamak için lütfen aşağıdaki bağlantıya tıklayın:</p>
  //       <p><a href="${resetLink}" style="padding: 10px 15px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Şifremi Sıfırla</a></p>
  //       <p>Veya bu bağlantıyı tarayıcınızda açın: ${resetLink}</p>
  //       <p>Bu bağlantı 1 saat süreyle geçerlidir.</p>
  //       <p>Bu isteği siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.</p>
  //     `,
  //   });
  //   if (response.success) {
  //     console.log(`[EmailAction] Successfully sent password reset email to ${email}`);
  //     return { success: true };
  //   } else {
  //     console.error(`[EmailAction] Failed to send password reset email to ${email}:`, response.error);
  //     return { success: false, error: response.error || 'Email service reported a failure' };
  //   }
  // } catch (error) {
  //   console.error('[EmailAction] Error sending password reset email:', error);
  //   return { success: false, error: error instanceof Error ? error.message : 'Unknown error during email sending' };
  // }

  // Simulate network delay and success for placeholder
  await new Promise(resolve => setTimeout(resolve, 700));
  console.log(`[EmailAction Placeholder] Successfully SIMULATED sending password reset email to ${email}.`);
  return { success: true };
}