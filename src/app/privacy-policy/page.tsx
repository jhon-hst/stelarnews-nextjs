import Head from 'next/head';

export default function PrivacyPolicy() {
  return (
    <div className="bg-white min-h-screen font-sans text-slate-800">
      <Head>
        <title>Privacy Policy | EstelarNews</title>
        <meta name="robots" content="noindex" />
      </Head>

      <main className="max-w-4xl mx-auto px-6 py-12 md:py-20">
        <header className="border-b border-slate-200 pb-8 mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-500 italic">
            Last Updated: March 15, 2026
          </p>
        </header>

        <section className="space-y-8 leading-relaxed">
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">1. Introduction</h2>
            <p>
              Welcome to <strong>EstelarNews</strong> (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, and disclose information when you visit our website <span className="text-blue-600">EstelarNews.com</span>.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">2. Information We Collect</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Log Data:</strong> Like most websites, our servers automatically collect information such as your IP address, browser type, referring URLs, and pages viewed.</li>
              <li><strong>Cookies and Tracking Technologies:</strong> We use cookies to enhance your experience, analyze site traffic, and serve targeted advertisements.</li>
              <li><strong>Device Information:</strong> We collect information about the device you use to access our site, including hardware model and operating system.</li>
            </ul>
          </div>

          <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-3">3. How We Use Your Information</h2>
            <p className="mb-4">We use the collected data to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, operate, and maintain our website.</li>
              <li>Improve and personalize your experience.</li>
              <li>Understand and analyze how you use our site.</li>
              <li><strong>Serve personalized advertisements (Interest-based advertising).</strong></li>
              <li>Prevent fraudulent activity and improve security.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">4. Third-Party Advertising and Analytics</h2>
            <p>
              We work with third-party advertising networks (such as Google AdSense, Taboola, or Outbrain) and analytics providers. These partners may use cookies, pixels, and similar technologies to collect information about your activities on this and other websites to provide you with relevant advertising.
            </p>
            <p className="mt-4 font-semibold text-blue-600">
              Facebook & TikTok Pixels: We use conversion pixels to track the effectiveness of our advertising campaigns.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-2">California Privacy Rights (CCPA)</h2>
              <p className="text-sm">
                If you are a California resident, you have the right to request access to the personal information we collect, the right to request deletion, and the right to opt-out of the sale of your personal information.
              </p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-2">GDPR Compliance</h2>
              <p className="text-sm">
                For users in the European Economic Area (EEA), we process personal data based on legitimate interests and consent. You have the right to access, rectify, or erase your personal data.
              </p>
            </div>
          </div>

          <div className="mt-12 p-8 bg-blue-50 rounded-2xl text-center">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Contact Us</h2>
            <p className="text-slate-600">
              If you have questions about this Privacy Policy, please contact us at:
            </p>
            <a href="mailto:info@EstelarNews.com" className="text-blue-600 font-bold hover:underline">
              info@EstelarNews.com
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
