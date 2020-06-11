import { NextApiRequest, NextApiResponse } from 'next';
import isBlank from '../../utils/isBlank';

type Data = {
  status?: 'mail_sent' | 'validation_failed';
};

export default (req: NextApiRequest, res: NextApiResponse<Data>) => {
  fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'post',
    headers: {
      authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [
        {
          to: [{ email: process.env.MAIL_TO }],
          subject: isBlank(req.body.subject) ? 'Contact Form' : req.body.subject,
        },
      ],
      from: {
        email: process.env.MAIL_FROM,
        name: req.body.fullName,
      },
      content: [
        {
          type: 'text/plain',
          value: `Email: ${req.body.email}
Full Name: ${req.body.fullName}
Phone: ${req.body.phone}
Subject: ${req.body.subject}

${req.body.message}`,
        },
      ],
    }),
  })
    .then((response) => {
      res.status(200).json({
        status: response.status > 400 ? 'validation_failed' : 'mail_sent',
      });
    })
    .catch(() => {
      res.status(400).json({ status: 'validation_failed' });
    });
};
