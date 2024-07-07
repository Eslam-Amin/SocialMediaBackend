const generateHTML = ({
  // link = "localhost:3001/auth/",
  link,
  logo = process.env.LOGO_URL,
  backgroundColor = "#ffffff",
  primaryColor = process.env.PRIMARY_COLOR,
  secondaryColor = "#ffffff",
  emailTitle,
  emailSubTitle,
  btnText,
  btnLink,
  belowLink,
  footerNote,
  footerLink,
  user
}) => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Social Network - Email Notification</title>
    <style>
        /* Reset styles */
        body, html {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            line-height: 1.6;
            background-color: #f7f7f7;
        }
        /* Wrapper styles */
        .wrapper {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 10px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        }
        /* Header styles */
        .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 1px solid #ddd;
        }
        .header img {

          width:100px  
          min-width: 75px;
          max-width: 150px;
          height: auto;
        }
        .header h1 {
            color: #333;
            margin: 20px 0 10px;
        }
        /* Content styles */
        .content {
            padding: 30px;
        }
        .content p {
            color: #555;
            margin-bottom: 20px;
        }
        /* Button styles */
        .button {
            display: inline-block;
            background-color: #4CAF50;
            color: #fff;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            transition: background-color 0.3s ease;
        }
        .button:hover {
            background-color: #45a049;
        }
        /* Footer styles */
        .footer {
            margin-top: 20px;
            text-align: center;
            color: #888;
            padding: 20px 0;
            border-top: 1px solid #ddd;
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="header">
            <img src='${logo}' alt="App Logo">
            <h1>Welcome to Our Social Network</h1>
        </div>
        <div class="content">
            <p>Hi ${user.name},</p>
            <p>Welcome to Our Social Network! You're just one step away from joining millions of users worldwide.</p>
            <p>To get ${btnText}, click the button below to do it:</p>
            <p><a href="${btnLink}" class="button">${btnText}</a></p>
            <p>If you didn't create an account, please disregard this email.</p>
            <p style="margin: 0;"><b>NOTE</b>: This Link will expire after 10mins.</p>

        </div>
        <div class="footer">
            <p>&copy; 2024 Our Social Network. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`
  const html3 = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Social Network - Email Notification</title>
    <style>
        /* Reset styles */
        body, html {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            line-height: 1.6;
        }
        /* Wrapper styles */
        .wrapper {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f7f7f7;
            border-radius: 10px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        }
        /* Header styles */
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .header h1 {
            color: #333;
        }
        /* Content styles */
        .content {
            background-color: #fff;
            padding: 30px;
            border-radius: 5px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        }
        .content p {
            color: #555;
            margin-bottom: 20px;
        }
        /* Button styles */
        .button {
            display: inline-block;
            background-color: #4CAF50;
            color: #fff;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            transition: background-color 0.3s ease;
        }
        .button:hover {
            background-color: #45a049;
        }
        /* Footer styles */
        .footer {
            margin-top: 20px;
            text-align: center;
            color: #888;
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="header">
            <h1>Welcome to Our Social Network</h1>
        </div>
        <div class="content">
            <p>Hi [User],</p>
            <p>Welcome to Our Social Network! You're just one step away from joining millions of users worldwide.</p>
            <p>To get started, click the button below to verify your email address:</p>
            <p><a href="VERIFICATION_LINK_HERE" class="button">Verify Email Address</a></p>
            <p>If you didn't create an account, please disregard this email.</p>
            <p style="margin: 0;"><b>NOTE</b>: This Link will expire after 10mins.</p>

        </div>
        <div class="footer">
            <p>&copy; 2024 Our Social Network. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`
  const html2 = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
</head>
<body>
    <table style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="background-color: #f2f2f2; padding: 20px;">
                <h2>Email Verification</h2>
                <p>Dear User,</p>
                <p>Thank you for registering. To complete your registration, please click the button below to verify your email address:</p>
                <p><a href="VERIFICATION_LINK_HERE" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a></p>
                <p>If you didn't request this, please ignore this email.</p>
                <p>Regards,<br>Your App Team</p>
            </td>
        </tr>
    </table>
</body>
</html>
`
  const html1 = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>Email Confirmation</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style type="text/css">
      @media screen {
        @font-face {
          font-family: 'Source Sans Pro';
          font-style: normal;
          font-weight: 400;
          src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
        }
        @font-face {
          font-family: 'Source Sans Pro';
          font-style: normal;
          font-weight: 700;
          src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
        }
      }
      body,
      table,
      td,
      a {
        -ms-text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%;
      }
      table,
      td {
        mso-table-rspace: 0pt;
        mso-table-lspace: 0pt;
      }
      img {
        -ms-interpolation-mode: bicubic;
      }
      a[x-apple-data-detectors] {
        font-family: inherit !important;
        font-size: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
        color: inherit !important;
        text-decoration: none !important;
      }
      div[style*="margin: 16px 0;"] {
        margin: 0 !important;
      }
      body {
        width: 100% !important;
        height: 100% !important;
        padding: 0 !important;
        margin: 0 !important;
      }
      table {
        border-collapse: collapse !important;
      }
      a {
        color: #1a82e2;
      }
      img {
        height: auto;
        line-height: 100%;
        text-decoration: none;
        border: 0;
        outline: none;
      }
    </style>
  </head>
  <body style="background-color: ${backgroundColor};">
    <!-- start body -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
      <!-- start logo -->
      <tr>
        <td align="center" bgcolor="${backgroundColor}">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
            <tr>
              <td align="center" valign="top" style="padding: 36px 24px;">
                <a href="${link}" target="_blank" style="display: inline-block;">
                  <img
                    src=${logo}
                    alt="Logo" border="0" width="350"
                    style="display: block; width: 150px; max-width: 250px; min-width: 100px;">
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <!-- end logo -->
      <!-- start hero -->
      <tr>
        <td align="center" bgcolor="${backgroundColor}">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
            <tr>
              <td align="left" bgcolor="${secondaryColor}"
                style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
                <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">${emailTitle}</h1>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <!-- end hero -->
      <!-- start copy block -->
      <tr>
        <td align="center" bgcolor="${backgroundColor}">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
            <!-- start copy -->
            <tr>
              <td align="left" bgcolor="${secondaryColor}"
                style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                <p style="margin: 0;">${emailSubTitle}</p>
              </td>
            </tr>
            <!-- end copy -->
            <!-- start button -->
            <tr>
              <td align="left" bgcolor="${secondaryColor}">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td align="center" bgcolor="${secondaryColor}" style="padding: 12px;">
                      <table border="0" cellpadding="0" cellspacing="0">
                        <tr>
                          <td id="mainButton" align="center" bgcolor="${primaryColor}" style="border-radius: 6px;">
                            <a href="${btnLink}" target="_blank" style="display: block; padding: 20px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: white; text-decoration: none !important; border-radius: 6px;">
                              ${btnText}
                            </a>
                          </td>
                        </tr>
                      </table>
                  </tr>
                </table>
              </td>
            </tr>
            <!-- end button -->
            <!-- start copy -->
            <tr>
              <td align="left" bgcolor="${secondaryColor}"
                style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                <p style="margin: 0;">If that doesn't work, please login again:</p>
                <p style="margin: 0;"><a href="${link}"
                    target="_blank">${belowLink}</a></p>
                <p style="margin: 0;"><b>NOTE</b>: This Link will expire after 10mins.</p>
              </td>
            </tr>
            <!-- end copy -->
            <!-- start copy -->
            <tr>
              <td align="left" bgcolor="${secondaryColor}"
                style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf">
                <p style="margin: 0;">Cheers,<br>${process.env.APP_NAME}.</p>
              </td>
            </tr>
            <!-- end copy -->
          </table>
        </td>
      </tr>
      <!-- end copy block -->
      <!-- start footer -->
      <tr>
        <td align="center" bgcolor="${backgroundColor}" style="padding: 24px;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
            <!-- start permission -->
            <tr>
              <td align="center" bgcolor="${backgroundColor}"
                style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
                <p style="margin: 0;">${footerNote}</p>
              </td>
            </tr>
            <!-- end permission -->
            <!-- start unsubscribe -->
            ${footerLink ? `
              <tr>
                <td align="center" bgcolor="${backgroundColor}"
                  style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
                  <a href="${link}">
                    <p style="margin: 0;">${footerLink}</p>
                  </a>
                </td>
              </tr>`
      : ""}
            <!-- end unsubscribe -->
          </table>
        </td>
      </tr>
      <!-- end footer -->
    </table>
    <!-- end body -->
  </body>
  </html>`;
  return html;
};

module.exports = generateHTML;
