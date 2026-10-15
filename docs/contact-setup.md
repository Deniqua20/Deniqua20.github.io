# Enable direct contact submissions

GitHub Pages serves static files. Sending a message without opening a visitor's email app requires a verified form service endpoint. No such endpoint has been supplied or connected yet.

1. Create a form with a service such as [Formspree](https://formspree.io/) and verify the destination email address using that service's instructions.
2. Copy the public HTTPS form endpoint provided by the service. Do not copy an account API key into the website.
3. In `contact.html`, set the endpoint on the existing form:

   ```html
   <form id="contact-form" method="post" class="world-contact-form"
     data-endpoint="https://formspree.io/f/YOUR_FORM_ID">
   ```

   Replace the example with the real verified URL. Do not publish `YOUR_FORM_ID` as an actual endpoint.
4. The shared script changes the button to “Send message,” adjusts the explanatory text, validates the fields, and posts FormData. It resets the fields only after a successful response and retains them if delivery fails.
5. Run the local site, test with the configured service, confirm the received message, and then commit and push the change to `main`. GitHub Pages deploys it automatically.

Until a verified service is configured, the form validates the visitor's message and opens an email draft addressed to the owner's public email. The visitor reviews and sends it in their email app. No success message claims that an email was delivered.

If the chosen service expects a different field format or authentication method, adapt the submit handler in `assets/js/world.js` according to its official documentation. Never expose private service credentials in the browser. This site's existing handler supports public FormData endpoints and JSON success/error responses.
