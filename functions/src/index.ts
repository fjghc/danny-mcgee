import * as functions from 'firebase-functions';
import * as nodemailer from 'nodemailer';
import * as cors from 'cors';

const corsHandler = cors({ origin: true });
const gmailEmail = functions.config().gmail.email;
const gmailPassword = encodeURIComponent(functions.config().gmail.password);
const mailTransport = nodemailer.createTransport(`smtps://${gmailEmail}:${gmailPassword}@smtp.gmail.com`);

export const sendMail = functions.https.onRequest((request, response) => {
  corsHandler(request, response, () => {

    return Promise.resolve()
      .then(() => {
        if (request.method !== 'POST') {
          const error = new Error('Only POST requests are accepted') as any;
          error.code = 405;
          throw error;
        }

        return mailTransport.sendMail(request.body)
          .then(_response => {
            response.send(_response);
          })
          .catch(error => {
            response.send(error);
          });
      });
  });
});
