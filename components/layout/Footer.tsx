 'use client';

import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
  <footer className="bg-gradient-to-t from-indigo-100 via-sky-50 to-white pt-16 pb-8 fade-in">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <Image src="/images/logo1.png" alt="SkyScale Logo" width={150} height={50} className="mb-4" />
            <p className="text-gray-600 mb-4">
              Premium scale models for collectors and enthusiasts. Bringing precision and quality to every piece.
            </p>
            <div className="flex space-x-4 items-center">
              <a href="#" className="text-gray-600 hover:text-blue-600">
                <Image src="/images/facebook-icon.svg" alt="Facebook" width={24} height={24} />
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600">
                <Image src="/images/twitter-icon.svg" alt="Twitter" width={24} height={24} />
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600">
                <Image src="/images/instagram-icon.svg" alt="Instagram" width={24} height={24} />
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600">
                <Image src="/images/youtube-icon.svg" alt="YouTube" width={24} height={24} />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">SHOP</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/store" className="text-gray-600 hover:text-blue-600">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/store?category=aircraft" className="text-gray-600 hover:text-blue-600">
                  Aircraft Models
                </Link>
              </li>
              <li>
                <Link href="/store?category=ships" className="text-gray-600 hover:text-blue-600">
                  Ships and Boats
                </Link>
              </li>
              <li>
                <Link href="/store?category=scifi" className="text-gray-600 hover:text-blue-600">
                  Science Fiction
                </Link>
              </li>
              <li>
                <Link href="/store?category=figures" className="text-gray-600 hover:text-blue-600">
                  Figures
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">SUPPORT</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-blue-600">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="text-gray-600 hover:text-blue-600">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="text-gray-600 hover:text-blue-600">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-blue-600">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/gdpr" className="text-gray-600 hover:text-blue-600">
                  GDPR Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">CONTACT</h3>
            <div className="space-y-2">
              <p className="text-gray-600">
                Get in touch with us for any inquiries.
              </p>
              <Link href="/contact" className="text-blue-600 hover:text-blue-700 font-medium">
                Visit Contact Page →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-300">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Skyscale. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link href="/terms" className="text-gray-600 hover:text-blue-600 text-sm">
                Terms & Conditions
              </Link>
              <Link href="/gdpr" className="text-gray-600 hover:text-blue-600 text-sm">
                GDPR Policy
              </Link>
              <Link href="/cookie-policy" className="text-gray-600 hover:text-blue-600 text-sm">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;