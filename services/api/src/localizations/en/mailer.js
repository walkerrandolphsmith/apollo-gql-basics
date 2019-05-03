export default {
  errors: {
    fromRequired: 'Email address is required',
    toRequired: "Recepient's email address is required",
    subjectRequired: 'Subject is required',
    bodyRequired: 'Message is required',
  },
  verificationEmail: {
    from: 'community@quillio.io',
    subject: 'Verify your email',
    body: ({ host, port, token }) => `
              Verify your account with the following link:
              http://${host}:${port}/verify/${token}
          `,
  },
  resetPasswordEmail: {
    from: 'community@quillio.io',
    subject: 'Reset account password',
    body: ({ host, port, token }) => `
              Reset password with the following link:
              http://${host}:${port}/reset/${token}
          `,
  },
};
