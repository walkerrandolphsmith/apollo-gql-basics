//import Mailgun from 'mailgun-js';

function send(data, resolve, reject) {
  console.log(data);
  resolve('I sent');
}

export const buildMailer = ({ host, port, translate }) => {
  // const mailgun = new Mailgun({
  //   apiKey,
  //   domain,
  // });

  const sendEmail = data =>
    new Promise((resolve, reject) => {
      if (!data.from) {
        reject(new Error(translate('mailer.errors.fromRequired')));
      }
      if (!data.to) {
        reject(new Error(translate('mailer.errors.toRequired')));
      }
      if (!data.subject) {
        reject(new Error(translate('mailer.errors.subjectRequired')));
      }
      if (!data.html) {
        reject(new Error(translate('mailer.errors.bodyRequired')));
      }

      // mailgun.messages().send(data, (err, body) => {
      //   if (err) reject(err);
      //   resolve(body);
      // });
      return send(data);
    });

  function sendVerificationEmail(email, token) {
    const data = {
      from: translate('mailer.resetEmail.from'),
      to: email,
      subject: translate('mailer.verificationEmail.subject'),
      html: translate('mailer.verificationEmail.body', {
        host,
        port,
        token,
      }),
    };
    return sendEmail(data);
  }

  function sendResetPasswordEmail(email, token) {
    const data = {
      from: translate('mailer.resetEmail.from'),
      to: email,
      subject: translate('mailer.resetEmail.subject'),
      html: translate('mailer.resetEmail.body', {
        host,
        port,
        token,
      }),
    };
    return sendEmail(data);
  }

  return {
    sendEmail,
    sendVerificationEmail,
    sendResetPasswordEmail,
  };
};
