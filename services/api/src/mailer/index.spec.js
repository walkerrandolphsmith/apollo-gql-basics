import { expect } from 'chai';
import { spy } from 'sinon';
import { buildMailer, __RewireAPI__ } from '.';

describe('./libs/mailer/index', () => {
  const noopMailGun = function() {
    return {};
  };

  describe.skip('Sending an email with valid from, to, subject, and message', () => {
    const sendSpy = spy((data, fn) => {
      fn();
    });

    function mailgun() {
      return {
        messages: () => ({
          send: sendSpy,
        }),
      };
    }

    __RewireAPI__.__Rewire__('Mailgun', mailgun);
    const { sendEmail } = buildMailer({});

    it('should get a status of OK', done => {
      sendEmail({
        from: 'walker',
        to: 'recipient',
        subject: 'subject',
        html: 'message',
      })
        .then(response => {
          expect(sendSpy).to.have.been.called;
          done();
        })
        .catch(err => {
          done(new Error('message should have been sent'));
        });
    });
  });

  describe('Sending an email without sender', () => {
    __RewireAPI__.__Rewire__('Mailgun', noopMailGun);
    const { sendEmail } = buildMailer({});

    it('should have an error', done => {
      sendEmail({
        from: '',
        to: 'recipient',
        subject: 'subject',
        html: 'message',
      })
        .then(() => {
          done(new Error('message should not have been sent'));
        })
        .catch(err => {
          expect(err).to.exist;
          done();
        });
    });
  });

  describe('Sending an email without to address', () => {
    __RewireAPI__.__Rewire__('Mailgun', noopMailGun);
    const { sendEmail } = buildMailer({});

    it('should have an error', done => {
      sendEmail({
        from: 'sender',
        to: '',
        subject: 'subject',
        html: 'message',
      })
        .then(() => {
          done(new Error('message should not have been sent'));
        })
        .catch(err => {
          expect(err).to.exist;
          done();
        });
    });
  });

  describe('Sending an email without a subject', () => {
    __RewireAPI__.__Rewire__('Mailgun', noopMailGun);
    const { sendEmail } = buildMailer({});

    it('should have an error', done => {
      sendEmail({
        from: 'sender',
        to: 'to',
        subject: '',
        html: 'message',
      })
        .then(() => {
          done(new Error('message should not have been sent'));
        })
        .catch(err => {
          expect(err).to.exist;
          done();
        });
    });
  });

  describe('Sending an email without a message', () => {
    __RewireAPI__.__Rewire__('Mailgun', noopMailGun);
    const { sendEmail } = buildMailer({});

    it('should have an error', done => {
      sendEmail({
        from: 'sender',
        to: 'to',
        subject: 'subject',
        html: '',
      })
        .then(() => {
          done(new Error('message should not have been sent'));
        })
        .catch(err => {
          expect(err).to.exist;
          done();
        });
    });
  });
});
