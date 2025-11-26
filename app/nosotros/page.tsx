"use client"
import React from 'react'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { MessageCircle } from 'lucide-react'

export default function NosotrosPage() {
  const team = [
    {
      name: 'Matías',
      role: 'Socio fundador de Solidev. Titulado en Ingeniería en Informática.',
      color: 'from-cyan-500 to-cyan-400',
      img: '/images/matias.png',
      whatsapp: '+56 9 1234 5678'
    },
    {
      name: 'Raúl',
      role: 'Socio fundador de Solidev. Titulado en Ingeniería en Informática.',
      color: 'from-emerald-400 to-emerald-500',
      img: '/images/raul.png',
      whatsapp: '+56 9 2345 6789'
    },
    {
      name: 'Cris',
      role: 'Socio fundador de Solidev. Titulado en Ingeniería en Informática.',
      color: 'from-violet-500 to-violet-400',
      img: '/images/cris.png',
      whatsapp: '+56 9 3456 7890'
    },
    {
      name: 'Daniel',
      role: 'Socio fundador de Solidev. Titulado en Ingeniería en Informática.',
      color: 'from-rose-500 to-rose-400',
      img: '/images/daniel.png',
      whatsapp: '+56 9 4567 8901'
    }
  ]

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 px-6 py-12">
      <div className="max-w-6xl mx-auto">
        {/* ¿Qué es SOLIDEV? */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center mb-16">
          <div className="md:col-span-2">
            <h2 className="text-3xl font-extrabold text-teal-400 mb-4">¿QUÉ ES <span className="text-white">SOLIDEV</span>?</h2>
            <p className="text-gray-300 leading-relaxed">
              Es una empresa tecnológica de desarrollo de páginas web. Lorem ipsum dolor sit amet,
              consectetur adipiscing elit. Proin a maximus risus, a consectetur velit. In quis condimentum
              metus, a accumsan odio. Ut tincidunt, felis et dapibus iaculis, orci urna eleifend nulla,
              vel vehicula nisi enim non est. Phasellus quis aliquet enim. Cras dui dui, ultricies at orci et,
              euismod vulputate urna.
            </p>
          </div>

          <div className="w-full">
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img src="https://placehold.co/600x360/111827/9ca3af?text=Security" alt="security" className="w-full h-auto object-cover" />
            </div>
          </div>
        </section>

        {/* Equipo Solidev */}
        <section className="mb-16">
          <h3 className="text-2xl text-center text-teal-400 font-extrabold mb-8">EQUIPO SOLIDEV</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((member) => (
              <article key={member.name} className="relative bg-gray-800 rounded-xl p-4 shadow-lg">
                <div className="flex flex-col items-center text-center">
                  <div className="w-48 h-48 mb-4 flex items-center justify-center">
                    <div className="w-44 h-44 rounded-md overflow-hidden border-4 border-white bg-gray-800">
                      <img src={member.img} alt={member.name} className="w-full h-full object-contain bg-gray-800" />
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-white">{member.name}</h4>
                  <p className="text-sm text-gray-300 mt-2 px-2">{member.role}</p>
                </div>

                <div className="mt-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className={`w-full py-2 rounded-md bg-gradient-to-r ${member.color} text-white font-semibold shadow-md flex items-center justify-center gap-2`}>
                        <MessageCircle className="h-5 w-5" />
                        Contáctame
                      </button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-800 text-white border-home-light shadow-dark-soft">
                      <DialogHeader>
                        <DialogTitle>Contacto</DialogTitle>
                      </DialogHeader>
                      <div className="flex items-start gap-4">
                        <div className="w-20 h-20 rounded-md overflow-hidden border bg-gray-800">
                          <img src={member.img} alt={member.name} className="w-full h-full object-contain bg-gray-800" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-300">{member.role}</p>
                      <div className="mt-4 p-3 rounded-md border border-home-light bg-home-dark-3 shadow-dark-soft">
                        <p className="text-sm text-home-white">WhatsApp: <span className="font-semibold">{member.whatsapp}</span></p>
                        <div className="mt-2 h-1.5 w-full rounded bg-gradient-blue-2" />
                        <a
                          href={`https://wa.me/${member.whatsapp.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-md bg-home-green-whatsapp text-white font-semibold transition-colors hover:opacity-90"
                        >
                          <MessageCircle className="h-5 w-5" />
                          Enviar WhatsApp
                        </a>
                      </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="absolute top-3 right-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white border border-white/10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Lo que creemos */}
        <section className="mb-12">
          <h3 className="text-2xl text-center text-teal-400 font-extrabold mb-8">LO QUE CREEMOS</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center px-6">
            <div>
              <h4 className="text-xl font-semibold text-white mb-2">Visión</h4>
              <p className="text-gray-300 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin a maximus risus, a consectetur velit.</p>
            </div>
            <div>
              <h4 className="text-xl font-semibold text-white mb-2">Misión</h4>
              <p className="text-gray-300 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin a maximus risus, a consectetur velit.</p>
            </div>
            <div>
              <h4 className="text-xl font-semibold text-white mb-2">Valores</h4>
              <p className="text-gray-300 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin a maximus risus, a consectetur velit.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
