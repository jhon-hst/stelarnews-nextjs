import Head from 'next/head';

export default function AboutUs() {
  return (
    <div className="bg-white min-h-screen font-sans text-slate-800">
      <Head>
        <title>About Us | EstelarNews</title>
        <meta name="description" content="Learn more about EstelarNews, your trusted source for global trends, technology, and insightful stories." />
      </Head>

      {/* Hero Section */}
      <section className="bg-slate-900 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
            We Bridge the Gap Between <span className="text-blue-500">Data</span> and <span className="text-blue-500">Stories</span>.
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            EstelarNews is a premier digital destination dedicated to uncovering the trends and narratives that shape our modern world.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <main className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Mission</h2>
            <p className="text-slate-600 mb-4 text-lg leading-relaxed">
              In an era of information overload, clarity is the ultimate luxury. At <strong>EstelarNews</strong>, our mission is to filter the noise and deliver high-quality, verified content that informs, inspires, and empowers our global audience.
            </p>
            <p className="text-slate-600 text-lg leading-relaxed">
              We leverage cutting-edge technology and journalistic integrity to explore everything from technological breakthroughs to hidden travel gems and financial wisdom.
            </p>
          </div>
          <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100 shadow-sm">
            <h3 className="text-xl font-bold text-blue-900 mb-4 italic">"True journalism is about making the complex simple and the obscure visible."</h3>
            <p className="text-blue-700 font-medium">— The Estelar Editorial Team</p>
          </div>
        </div>

        {/* Core Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="text-blue-600 text-3xl mb-4">🛡️</div>
            <h4 className="text-xl font-bold text-slate-900 mb-2">Accuracy</h4>
            <p className="text-sm text-slate-600">Every story we publish undergoes a rigorous fact-checking process to ensure reliability.</p>
          </div>
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="text-blue-600 text-3xl mb-4">🌍</div>
            <h4 className="text-xl font-bold text-slate-900 mb-2">Global Vision</h4>
            <p className="text-sm text-slate-600">We analyze trends from every corner of the globe to provide a truly international perspective.</p>
          </div>
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="text-blue-600 text-3xl mb-4">⚡</div>
            <h4 className="text-xl font-bold text-slate-900 mb-2">Innovation</h4>
            <p className="text-sm text-slate-600">We utilize modern digital tools to deliver content that is fast, responsive, and engaging.</p>
          </div>
        </div>

      
      </main>
    </div>
  );
}
