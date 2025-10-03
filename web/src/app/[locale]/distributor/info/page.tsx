"use client";

import Link from "next/link";

export default function DistributorInfo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">K</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">KobKlein</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link
              href="/auth/signin"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/distributor/signup"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Apply Now
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              🏪 <span className="text-green-600">Distributor</span> Program
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Become part of Haiti&apos;s financial revolution. Serve your community
              and build a sustainable income stream with KobKlein.
            </p>
            <Link
              href="/distributor/signup"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg inline-block"
            >
              Apply to Become a Distributor
            </Link>
          </div>

          {/* What is a Distributor */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">What is a KobKlein Distributor?</h2>
            <p className="text-lg text-gray-600 mb-6">
              KobKlein Distributors are local business owners who provide essential financial services
              to their communities. As a distributor, you&apos;ll help people:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <div className="text-green-600 text-xl">✓</div>
                <div>
                  <h3 className="font-semibold mb-1">Cash In</h3>
                  <p className="text-gray-600">Load money onto KobKlein cards</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="text-green-600 text-xl">✓</div>
                <div>
                  <h3 className="font-semibold mb-1">Cash Out</h3>
                  <p className="text-gray-600">Withdraw cash from digital accounts</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="text-green-600 text-xl">✓</div>
                <div>
                  <h3 className="font-semibold mb-1">Remittance Pickup</h3>
                  <p className="text-gray-600">Distribute money sent from abroad</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="text-green-600 text-xl">✓</div>
                <div>
                  <h3 className="font-semibold mb-1">Bill Payments</h3>
                  <p className="text-gray-600">Accept utility and service payments</p>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-xl p-8 text-white mb-12">
            <h2 className="text-3xl font-bold mb-6 text-center">Why Become a Distributor?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-xl font-semibold mb-2">Earn Commission</h3>
                <p className="opacity-90">
                  Earn up to 2% commission on every transaction. More transactions = more income.
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🌱</div>
                <h3 className="text-xl font-semibold mb-2">Grow Your Business</h3>
                <p className="opacity-90">
                  Attract new customers and increase foot traffic to your existing business.
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="text-xl font-semibold mb-2">Serve Community</h3>
                <p className="opacity-90">
                  Provide essential financial services to your neighbors and community.
                </p>
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Requirements</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-green-600 mb-4">Basic Requirements</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>Existing business location</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>Valid government ID</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>Smartphone with internet</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>Basic cash float (starting at $500 USD)</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-blue-600 mb-4">Ideal Candidates</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center space-x-2">
                    <span className="text-blue-500">•</span>
                    <span>Grocery stores & markets</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-blue-500">•</span>
                    <span>Pharmacies</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-blue-500">•</span>
                    <span>Gas stations</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-blue-500">•</span>
                    <span>Electronics shops</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-blue-500">•</span>
                    <span>Restaurants & bars</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* How it Works */}
          <div className="bg-gray-50 rounded-xl p-8 mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How It Works</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <h3 className="font-semibold mb-2">Apply</h3>
                <p className="text-gray-600 text-sm">Submit your application with business details</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  2
                </div>
                <h3 className="font-semibold mb-2">Review</h3>
                <p className="text-gray-600 text-sm">We review and approve qualified applications</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <h3 className="font-semibold mb-2">Training</h3>
                <p className="text-gray-600 text-sm">Complete our comprehensive training program</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  4
                </div>
                <h3 className="font-semibold mb-2">Launch</h3>
                <p className="text-gray-600 text-sm">Start serving customers and earning commissions</p>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How much can I earn?</h3>
                <p className="text-gray-600">
                  Earnings depend on transaction volume. Active distributors typically earn $200-800 USD per month.
                  High-volume locations can earn even more.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What support do you provide?</h3>
                <p className="text-gray-600">
                  We provide comprehensive training, marketing materials, technical support, and ongoing assistance.
                  Our team is available 6 days a week to help you succeed.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Do I need special equipment?</h3>
                <p className="text-gray-600">
                  You only need a smartphone. We provide the KobKlein distributor app and all necessary tools.
                  No additional hardware required.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How long does approval take?</h3>
                <p className="text-gray-600">
                  Most applications are reviewed within 48 hours. Once approved, training takes 2-3 days,
                  and you can start serving customers immediately after.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Join Our Network?</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Take the first step towards building a sustainable income while serving your community.
            </p>
            <Link
              href="/distributor/signup"
              className="bg-green-600 hover:bg-green-700 text-white px-12 py-4 rounded-lg text-xl font-semibold transition-all transform hover:scale-105 shadow-lg inline-block"
            >
              Apply Now - It&apos;s Free!
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}