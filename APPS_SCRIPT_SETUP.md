# Google Apps Script Email Handler (for GitHub Pages forms)

Follow these steps to receive form submissions at: vertexdigimediacom@gmail.com

1) Create the Apps Script project
- Go to https://script.google.com and create a new project.
- Replace Code.gs content with the script below.
- File > Project properties > Scopes: leave default.

2) Paste this code (Code.gs)

function doPost(e) {
  try {
    // Support JSON and URL-encoded bodies
    var body = e.postData && e.postData.contents ? e.postData.contents : '';
    var type = e.postData && e.postData.type ? e.postData.type : '';
    var payload = {};
    if (type.indexOf('application/json') > -1) {
      payload = JSON.parse(body);
    } else {
      // Expect URL-encoded keys: source, page, data, to
      var params = e.parameter || {};
      payload.source = params.source || 'unknown';
      payload.page = params.page || '';
      payload.to = params.to || '';
      payload.data = {};
      try { payload.data = JSON.parse(params.data || '{}'); } catch (err) {}
    }

    var to = payload.to || 'vertexdigimediacom@gmail.com';
    var source = payload.source || 'web';
    var page = payload.page || '';
    var data = payload.data || {};

    // Build email content
    var subject = 'New ' + source + ' inquiry - Vertex DigiMedia';
    var html = '<h2>New inquiry</h2>' +
      '<p><b>Source:</b> ' + source + '</p>' +
      '<p><b>Page:</b> ' + page + '</p>' +
      '<table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse">' +
      Object.keys(data).map(function(k){
        var v = ('' + (data[k] || '')).replace(/</g,'&lt;');
        return '<tr><td><b>' + k + '</b></td><td>' + v + '</td></tr>';
      }).join('') +
      '</table>';

    MailApp.sendEmail({
      to: to,
      subject: subject,
      htmlBody: html
    });

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err && err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput('OK');
}

3) Deploy as a Web App
- Click Deploy > New deployment.
- Type: Web app
- Description: Vertex forms
- Execute as: Me
- Who has access: Anyone
- Deploy, then copy the Web app URL.

4) Configure the website
- Open assets/js/main.js and set APPS_SCRIPT_URL to the copied URL.
- Ensure CONTACT_TO is 'vertexdigimediacom@gmail.com' (it already is).
- Commit and push.

5) Test
- Open the live site Contact form and submit a test. You should receive an email.

Notes
- The client script tries JSON (CORS) first, then falls back to URL-encoded with no-cors so it works even if CORS headers are missing.
- Honeypot field named hp is included to reduce spam.
- Never put secrets in the client. Apps Script contains the mail sending logic.
