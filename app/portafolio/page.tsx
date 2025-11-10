export default function PortafolioPage() {
  return (
    <div className="min-h-screen bg-neutral-900 text-teal-100">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-teal-300 mb-6">Portafolio</h1>
        <p className="text-teal-200 mb-8">Proyectos destacados que muestran nuestro trabajo.</p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map((i) => (
            <div key={i} className="bg-neutral-800 rounded-lg h-40 flex items-center justify-center text-teal-200">
              Proyecto {i}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}