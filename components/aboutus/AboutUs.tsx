export default function AboutUs() {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-sky-600 to-indigo-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">About Skyscale</h1>
          <p className="text-xl text-sky-100">Where Precision Meets Passion in Scale Modeling</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Who We Are */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Who We Are</h2>
              <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                Skyscale is an online platform by <span className="font-semibold text-sky-700">Anave Decal Services Private Limited</span>, 
                a company renowned for precision, creativity, and innovation in the scale modeling space.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                We offer an extensive collection of scale models, decals, tools, and accessories designed for hobbyists, 
                collectors, and creators who share our passion for miniaturization and craftsmanship.
              </p>
            </div>
            <div className="bg-gradient-to-br from-sky-100 to-indigo-100 rounded-2xl p-8 shadow-lg">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-sky-600 rounded-full flex items-center justify-center text-white text-xl font-bold">✓</div>
                  <span className="text-lg font-medium">Premium Scale Models</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-sky-600 rounded-full flex items-center justify-center text-white text-xl font-bold">✓</div>
                  <span className="text-lg font-medium">Custom Decals</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-sky-600 rounded-full flex items-center justify-center text-white text-xl font-bold">✓</div>
                  <span className="text-lg font-medium">Professional Tools</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-sky-600 rounded-full flex items-center justify-center text-white text-xl font-bold">✓</div>
                  <span className="text-lg font-medium">Expert Accessories</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-sky-600">
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                To provide model enthusiasts with superior products and experiences, enhancing creativity and quality 
                in the modeling community. We strive to be the bridge between imagination and reality, one scale model at a time.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-indigo-600">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                To be the most trusted and innovative global destination for scale modeling enthusiasts. We envision a world 
                where every modeler has access to the finest tools and materials to bring their creative visions to life.
              </p>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Precision</h3>
              <p className="text-gray-600 text-sm">Passion for accuracy in every detail</p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Community</h3>
              <p className="text-gray-600 text-sm">Growing together as modelers</p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💡</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Innovation</h3>
              <p className="text-gray-600 text-sm">Pushing boundaries in modeling</p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✨</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Integrity</h3>
              <p className="text-gray-600 text-sm">Honest and transparent always</p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⭐</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Quality</h3>
              <p className="text-gray-600 text-sm">Excellence in every product</p>
            </div>
          </div>
        </section>

        {/* Our Brands */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Our Brands</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-sky-50 to-white rounded-2xl shadow-lg p-8 border border-sky-200">
              <h3 className="text-2xl font-bold text-sky-700 mb-4">Hobbyist Decals</h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Specializes in custom and authentic decals for aircraft, automotive, military, and train models. 
                Bringing precision and authenticity to every scale model project.
              </p>
              <div className="space-y-2">
                <a href="https://hobbyistdecals.com" target="_blank" rel="noopener noreferrer" 
                   className="block text-sky-600 hover:text-sky-800 font-medium">
                  🌐 hobbyistdecals.com
                </a>
                <a href="https://hobbyistdecals.in" target="_blank" rel="noopener noreferrer" 
                   className="block text-sky-600 hover:text-sky-800 font-medium">
                  🌐 hobbyistdecals.in
                </a>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl shadow-lg p-8 border border-indigo-200">
              <h3 className="text-2xl font-bold text-indigo-700 mb-4">Skalx</h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                An upcoming brand focused on precision-engineered scale models including aircraft, buses, trucks, 
                and military vehicles. Innovation meets craftsmanship.
              </p>
              <div className="space-y-2">
                <a href="https://skalx.in" target="_blank" rel="noopener noreferrer" 
                   className="block text-indigo-600 hover:text-indigo-800 font-medium">
                  🌐 skalx.in <span className="text-sm text-gray-500">(Under Development)</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center bg-gradient-to-r from-sky-600 to-indigo-600 rounded-3xl shadow-2xl p-12 text-white">
          <h2 className="text-4xl font-bold mb-6">Join the Skyscale Experience</h2>
          <p className="text-xl mb-8 text-sky-100">
            Explore the art of miniaturization and become part of a community that celebrates precision, 
            creativity, and the timeless craft of scale modeling.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/store" className="bg-white text-sky-700 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg">
              Explore Our Store
            </a>
            <a href="/contact" className="bg-sky-800 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-sky-900 transition-colors shadow-lg">
              Get in Touch
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}