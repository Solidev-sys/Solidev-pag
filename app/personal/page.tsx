export default function PersonalPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Nuestro Equipo</h1>
        
        <div className="space-y-8">
          <p className="text-gray-700 text-center max-w-2xl mx-auto">
            Conoce al equipo de profesionales que hacen posible SoliDev. Estamos comprometidos con la excelencia y la innovación.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Miembro del equipo 1 */}
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <h3 className="font-bold text-lg">Juan Pérez</h3>
              <p className="text-blue-600 mb-2">CEO & Fundador</p>
              <p className="text-gray-600 text-sm">
                Experto en desarrollo de software con más de 10 años de experiencia.
              </p>
            </div>
            
            {/* Miembro del equipo 2 */}
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <h3 className="font-bold text-lg">María González</h3>
              <p className="text-blue-600 mb-2">CTO</p>
              <p className="text-gray-600 text-sm">
                Especialista en arquitectura de software y soluciones empresariales.
              </p>
            </div>
            
            {/* Miembro del equipo 3 */}
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <h3 className="font-bold text-lg">Carlos Rodríguez</h3>
              <p className="text-blue-600 mb-2">Lead Developer</p>
              <p className="text-gray-600 text-sm">
                Desarrollador full-stack con experiencia en React y Node.js.
              </p>
            </div>
            
            {/* Miembro del equipo 4 */}
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <h3 className="font-bold text-lg">Ana Martínez</h3>
              <p className="text-blue-600 mb-2">UX/UI Designer</p>
              <p className="text-gray-600 text-sm">
                Diseñadora con enfoque en experiencia de usuario y accesibilidad.
              </p>
            </div>
            
            {/* Miembro del equipo 5 */}
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <h3 className="font-bold text-lg">Roberto Sánchez</h3>
              <p className="text-blue-600 mb-2">DevOps Engineer</p>
              <p className="text-gray-600 text-sm">
                Especialista en infraestructura y automatización de procesos.
              </p>
            </div>
            
            {/* Miembro del equipo 6 */}
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <h3 className="font-bold text-lg">Laura Torres</h3>
              <p className="text-blue-600 mb-2">Project Manager</p>
              <p className="text-gray-600 text-sm">
                Gestora de proyectos con metodologías ágiles y tradicionales.
              </p>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <h2 className="text-xl font-semibold mb-4">¿Quieres unirte a nuestro equipo?</h2>
            <p className="text-gray-700 mb-4">
              Estamos siempre en búsqueda de talento para seguir creciendo.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors">
              Ver Vacantes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}