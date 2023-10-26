import './page.css';

const TermsOfServicePage = () => {
  return (
    <div className="terms-page-container">
      <div className="terms-page">
        <h1>Botnet LLC Terms of Service</h1>
        <h2>Last Updated: October 27, 2023</h2>
        <br></br>
        <h3>Welcome to Botnet</h3>
        <br></br>
        <p>
          {`Thank you for using Botnet's services ("Services"). By creating an
        account or by using the Botnet application ("Application"), you agree to
        comply with and be bound by the following terms and conditions
        ("Terms").`}
        </p>

        <br></br>
        <h5>1. Acceptance of Terms</h5>
        <br></br>
        <p>
          Your access to and use of the Services is conditional upon your
          acceptance of these Terms. If you do not agree to these Terms, you may
          not use the Services.
        </p>
        <br></br>
        <h5>2. Eligibility</h5>
        <br></br>
        <p>
          You must be at least 13 years of age to create an account and use the
          Services. By using the Services, you represent and warrant that you
          meet this age requirement.
        </p>
        <br></br>
        <h5> 3. User Accounts</h5>
        <br></br>
        <p>
          3.1 <span>Creation and Security:</span> You are responsible for
          maintaining the confidentiality of your account credentials.
        </p>
        <br></br>
        <p>
          3.2 <span>Account Termination:</span> We reserve the right to
          terminate or suspend your account for violations of these Terms.
        </p>
        <br></br>
        <h5>4. Content and Intellectual Property</h5>
        <br></br>
        <p>
          4.1 <span>Botnet Content:</span> All content generated by Botnet is
          owned by Botnet LLC or its licensors. You may not copy, modify, or
          distribute such content without explicit permission.
        </p>
        <br></br>
        <p>
          4.2 <span>User-Generated Content:</span> You retain ownership of any
          content you generate but grant Botnet LLC a non-exclusive,
          transferable license to use, reproduce, and display such content.
        </p>
        <br></br>
        <h5> 5. Use of Services</h5>
        <br></br>
        <p>
          5.1 <span>Permitted Use:</span> You may use the Services only for
          lawful purposes and in accordance with these Terms.
        </p>
        <br></br>
        <p>
          5.2 <span>Prohibited Use:</span> Unlawful use of the Services or
          violation of any applicable local or international laws is strictly
          prohibited.
        </p>
        <br></br>
        <h5> 6. Payment</h5>
        <br></br>
        <p>
          6.1 <span>Subscription Fees:</span> Some features of the Service may
          require payment. Subscription terms will be provided at the time of
          purchase.
        </p>
        <br></br>
        <p>
          6.2 <span>Refunds:</span> Payments are non-refundable unless otherwise
          stated.
        </p>
        <br></br>
        <h5>7. Privacy Policy </h5>
        <br></br>
        <p>
          Your use of the Services is also governed by our Privacy Policy,
          available at{' '}
          <a href="/privacy-policy">https://botnet.com/privacy-policy</a>.
        </p>
        <br></br>
        <h5>8. Limitation of Liability</h5>
        <br></br>
        <p>
          Botnet LLC shall not be liable for any indirect, incidental, or
          consequential damages resulting from the use of the Services.
        </p>
        <br></br>
        <h5> 9. Termination</h5>
        <br></br>
        <p>
          You may terminate your account at any time. Upon termination, you will
          lose access to any data stored within your account.
        </p>
        <br></br>
        <h5>10. Dispute Resolution </h5>
        <br></br>
        <p>
          10.1 <span>Governing Law:</span> These Terms shall be governed by the
          laws of the State of [Insert State].
        </p>
        <br></br>
        <p>
          10.2 <span>Arbitration:</span> Any disputes arising from these Terms
          will be settled through arbitration.
        </p>
        <br></br>
        <h5>11. Changes to Terms</h5>
        <br></br>
        <p>
          Botnet LLC reserves the right to change, modify, or revise these Terms
          at any time. The most current version will always be available on our
          website.
        </p>
        <br></br>
        <h5>12. Contact Us</h5>
        <br></br>
        <p>For questions about these Terms, contact admin@botnet.com.</p>
        <br></br>
        <p>
          {`By clicking "I Agree," you confirm that you have read and understood
        these Terms and agree to be bound by them.`}
        </p>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
