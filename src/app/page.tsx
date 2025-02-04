'use client';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      {/* Header/Navigation */}
      <header className="fixed top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-blue-600 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-white hover:text-gray-100 transition-colors">
            ReviewWidget
          </Link>
          <div className="flex items-center gap-4 sm:gap-6">
            <Link 
              href="/auth/login" 
              className="text-white/90 hover:text-white font-medium transition-colors"
            >
              Login
            </Link>
            <Link 
              href="/dashboard" 
              className="bg-white text-purple-600 px-4 sm:px-5 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm"
            >
              Dashboard
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center pt-28 sm:pt-32 md:pt-40">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
              <span className="text-white block mb-2 animate-fade-in">Display Your Reviews</span>
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Anywhere & Everywhere
              </span>
            </h1>
            <p className="mt-6 text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
              Showcase your Google Maps and Facebook reviews with beautiful,
              customizable widgets. Build trust and credibility with potential customers.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              <Link 
                href="/auth/login"
                className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all font-medium text-sm shadow-xl shadow-purple-500/20"
              >
                Get Started
              </Link>
              <Link 
                href="#features"
                className="text-gray-300 font-medium text-sm hover:text-white transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Features Section */}
          <section className="mt-24 sm:mt-32 md:mt-40 pb-20" id="features">
            <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-16">
              Why Choose ReviewWidget?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {/* Feature 1 */}
              <div className="bg-gray-800/50 backdrop-blur-sm p-6 md:p-8 rounded-xl border border-gray-700 hover:border-purple-500/50 transition-all group">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-500/30 transition-colors">
                  <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-3 text-white">Multiple Layouts</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Choose from slider, grid, list, masonry, and badge layouts to match your website's design perfectly.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-gray-800/50 backdrop-blur-sm p-6 md:p-8 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-all group">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500/30 transition-colors">
                  <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-3 text-white">Auto-sync Reviews</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Reviews automatically sync from Google Maps and Facebook to keep your widgets fresh and current.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-gray-800/50 backdrop-blur-sm p-6 md:p-8 rounded-xl border border-gray-700 hover:border-purple-500/50 transition-all group">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-500/30 transition-colors">
                  <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-3 text-white">Easy Customization</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Customize colors, themes, and display options to match your brand identity perfectly.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}