export default function PrivacyPage() {
  return (
    <main className="container" style={{ padding: "2rem", maxWidth: "900px", margin: "2rem auto" }}>
      <h1>Privacy Policy</h1>
      
      <p style={{ color: "#999", marginBottom: "2rem" }}>
        Last updated: April 2026
      </p>

      <section style={{ marginBottom: "2rem" }}>
        <h2>1. Introduction</h2>
        <p>
          Shopfront Marketplace ("we", "us", or "our") operates the Shopfront Marketplace website. 
          This page informs you of our policies regarding the collection, use, and disclosure of personal 
          data when you use our service and the choices you have associated with that data.
        </p>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h2>2. Information Collection and Use</h2>
        <p>We collect several different types of information:</p>
        
        <h3>Personal Data</h3>
        <ul style={{ paddingLeft: "1.5rem" }}>
          <li>Email address</li>
          <li>First name and last name</li>
          <li>Phone number</li>
          <li>Address, State, Province, ZIP/Postal code, City</li>
          <li>Cookies and Usage Data</li>
        </ul>

        <h3>Usage Data</h3>
        <p>
          We may also collect information on how the service is accessed and used ("Usage Data"). 
          This may include information such as your computer's IP address, browser type, browser version, 
          the pages you visit, the time and date of your visit, and other diagnostic data.
        </p>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h2>3. Security of Data</h2>
        <p>
          The security of your data is important to us but remember that no method of transmission 
          over the Internet or method of electronic storage is 100% secure. While we strive to use 
          commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
        </p>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h2>4. Changes to This Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you of any changes by 
          posting the new Privacy Policy on this page and updating the "Last updated" date at the top of this policy.
        </p>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h2>5. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at:
        </p>
        <p>
          Email: <a href="mailto:privacy@azcoglobal.com" style={{ color: "#0066c0" }}>privacy@azcoglobal.com</a><br />
          Address: N Block, Okhla, New Delhi - 110025, India
        </p>
      </section>
    </main>
  );
}