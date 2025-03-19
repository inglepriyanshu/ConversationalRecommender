import { Star, Truck, Shield } from 'lucide-react'

export default function Features() {
  const features = [
    {
      icon: <Star className="w-8 h-8 text-green-500" />,
      title: "Eco-friendly Products",
      description: "All our products are sustainably sourced and environmentally conscious"
    },
    {
      icon: <Truck className="w-8 h-8 text-blue-600" />,
      title: "Fast Delivery",
      description: "Get your items delivered within 24 hours"
    },
    {
      icon: <Shield className="w-8 h-8 text-purple-600" />,
      title: "Secure Payment",
      description: "Your transactions are protected with bank-level security"
    }
  ]

  return (
    <section id="features" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          Why Choose Us
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6 rounded-lg bg-gray-50">
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}