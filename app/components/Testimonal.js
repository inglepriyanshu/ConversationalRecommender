import { User } from 'lucide-react'

export default function Testimonials() {
  const testimonials = [
    {
      name: "Shreya Ghoshal",
      role: "Verified Buyer",
      content: "The products exceeded my expectations. Fantastic quality and quick delivery!"
    },
    {
      name: "Allu Arjun",
      role: "Regular Customer",
      content: "I love how everything is eco-friendly. Will definitely shop again!"
    }
  ]

  return (
    <section id="testimonials" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          What Our Customers Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <User className="w-12 h-12 text-gray-400" />
                <div className="ml-4">
                  <h3 className="font-semibold">{testimonial.name}</h3>
                  <p className="text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-600 italic">{testimonial.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
