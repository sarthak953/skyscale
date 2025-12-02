'use client';

export default function ShippingPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white py-16 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Shipping Policy</h1>
        
        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Shipping Information</h2>
            <p className="mb-4">
              At SkyScale, we are committed to delivering your premium scale models safely and efficiently. 
              Please review our shipping policy below for detailed information about our delivery process.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Processing Time</h2>
            <p className="mb-4">
              Orders are typically processed within 1-3 business days. During peak seasons or promotional periods, 
              processing times may be extended. You will receive a confirmation email once your order has been shipped.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Shipping Methods & Delivery Times</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Standard Shipping:</strong> 5-7 business days</li>
              <li><strong>Express Shipping:</strong> 2-3 business days</li>
              <li><strong>International Shipping:</strong> 10-21 business days (varies by location)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Shipping Costs</h2>
            <p className="mb-4">
              Shipping costs are calculated at checkout based on your location, package weight, and selected shipping method. 
              We offer free standard shipping on orders over a certain threshold (displayed at checkout).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">International Shipping</h2>
            <p className="mb-4">
              We ship to most countries worldwide. International customers are responsible for any customs duties, 
              taxes, or fees imposed by their country. These charges are not included in our shipping costs.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Order Tracking</h2>
            <p className="mb-4">
              Once your order ships, you will receive a tracking number via email. You can use this number to 
              monitor your shipment's progress through our carrier's website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Damaged or Lost Packages</h2>
            <p className="mb-4">
              If your package arrives damaged or goes missing during transit, please contact us immediately at 
              info@anaveedecals.com. We will work with the carrier to resolve the issue and ensure you receive 
              your order in perfect condition.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
            <p>
              For any shipping-related questions or concerns, please reach out to our customer support team at 
              info@anaveedecals.com or call us at +91 91373 20348.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
