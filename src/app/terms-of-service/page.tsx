import Head from 'next/head';

export default function TermsOfService() {
  return (
    <div className="bg-white min-h-screen font-sans text-slate-800">
      <Head>
        <title>Terms of Service | EstelarNews</title>
        <meta name="robots" content="noindex" />
      </Head>

      <main className="max-w-4xl mx-auto px-6 py-12 md:py-20">
        <header className="border-b border-slate-200 pb-8 mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-sm text-slate-500 italic">
            Last Updated: March 15, 2026
          </p>
        </header>

        <section className="space-y-8 leading-relaxed text-sm md:text-base">
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">1. Agreement to Terms</h2>
            <p>
              By accessing or using <strong>EstelarNews</strong> (EstelarNews.com), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">2. Intellectual Property Rights</h2>
            <p>
              The content on EstelarNews, including text, graphics, logos, and images, is the property of EstelarNews or its content suppliers and is protected by international copyright laws. You may not reproduce, distribute, or create derivative works without express written permission.
            </p>
          </div>

          <div className="bg-amber-50 p-6 rounded-xl border border-amber-100">
            <h2 className="text-xl font-bold text-amber-900 mb-3">3. Disclaimer of Content</h2>
            <p className="text-amber-800">
              The information provided on EstelarNews is for <strong>informational and entertainment purposes only</strong>. While we strive for accuracy, we make no warranties about the completeness or reliability of the content. Any action you take upon the information on this website is strictly at your own risk.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">4. Third-Party Links & Ads</h2>
            <p>
              EstelarNews contains links to third-party websites and advertisements. We do not monitor or control these external sites. We are not responsible for the content, privacy policies, or practices of any third-party websites. <strong>The inclusion of any link does not imply endorsement by EstelarNews.</strong>
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">5. Limitations of Liability</h2>
            <p>
              In no event shall EstelarNews or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website.
            </p>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-3">6. Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws of the United States, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </div>

          <div className="mt-12 p-8 bg-slate-900 rounded-2xl text-center text-white">
            <h2 className="text-xl font-bold mb-2 text-white">Questions?</h2>
            <p className="text-slate-400 mb-4">
              If you have any questions regarding these Terms, please contact us.
            </p>
            <a href="mailto:info@EstelarNews.com" className="text-blue-400 font-bold hover:text-blue-300 transition-colors">
              info@EstelarNews.com
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
