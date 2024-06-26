// pages/pricing.js
import Head from 'next/head';

export default function Pricing() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Head>
        <title>Pricing - DardiBook</title>
      </Head>
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center mb-8">Pricing</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8" style={{"maxHeight": "75vh",
    "overflowY": "auto"}}>
          {/* Pricing Tier 1 */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Starter Plan</h2>
            <p className="text-gray-700 mb-4">Perfect for small clinics</p>
            <p className="text-2xl font-bold text-green-500 mb-4">$99 / month</p>
            <ul className="mb-6">
              <li className="flex items-center text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 9a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                Basic features
              </li>
              <li className="flex items-center text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 9a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                Limited support
              </li>
            </ul>
            <a href="#" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-300 block text-center">
              Get Started
            </a>
          </div>

          {/* Pricing Tier 2 */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Business Plan</h2>
            <p className="text-gray-700 mb-4">Ideal for medium-sized hospitals</p>
            <p className="text-2xl font-bold text-green-500 mb-4">$199 / month</p>
            <ul className="mb-6">
              <li className="flex items-center text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 9a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                Advanced features
              </li>
              <li className="flex items-center text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 9a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                Priority support
              </li>
            </ul>
            <a href="#" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-300 block text-center">
              Get Started
            </a>
          </div>

          {/* Pricing Tier 3 */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Enterprise Plan</h2>
            <p className="text-gray-700 mb-4">For large hospital chains</p>
            <p className="text-2xl font-bold text-green-500 mb-4">$499 / month</p>
            <ul className="mb-6">
              <li className="flex items-center text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 9a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                All features included
              </li>
              <li className="flex items-center text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 9a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                Dedicated support
              </li>
            </ul>
            <a href="#" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-300 block text-center">
              Get Started
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
