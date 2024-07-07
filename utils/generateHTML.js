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
    return html
}

module.exports = generateHTML;
