"use client"

export function MarqueeBanner() {
  return (
    <div className="relative overflow-hidden rounded-lg py-3 mb-8 shadow-lg" 
         style={{
           backgroundColor: '#121212',
           borderTop: '1px solid #121212',
           borderBottom: '1px solid #121212',
           boxShadow: '0 4px 6px rgba(0,0,0,0.15)'
         }}>
      {/* Overlay/brillo del marquee */}
      <div className="absolute inset-0 pointer-events-none"
           style={{
             background: 'linear-gradient(90deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.10) 100%)'
           }}>
      </div>
      
      <div className="animate-marquee whitespace-nowrap relative z-10">
        <div className="inline-flex items-center space-x-8 font-medium"
             style={{ 
               color: '#ECF0F1',
               textShadow: '0 1px 2px rgba(0,0,0,0.30)'
             }}>
          <span className="flex items-center gap-2">
            <span className="text-2xl">💊</span>
            <span>Por compras superiores a $50.000</span>
            <span className="text-2xl">🍄</span>
            <span className="highlight font-bold px-2 py-1 rounded animate-pulse"
                  style={{
                    background: 'linear-gradient(135deg, #FFFFFF 0%, #000000 100%)',
                    color: '#FFFFFF',
                    boxShadow: '0 0 10px rgba(231,76,60,0.40)',
                    animation: 'pulse-shadow 2s ease-in-out infinite alternate'
                  }}>
              DESPACHO GRATIS
            </span>
            <span className="text-2xl">🚛</span>
          </span>
          {/* Duplicate for seamless loop */}
          <span className="flex items-center gap-2">
            <span className="text-2xl">💊</span>
            <span>Por compras superiores a $50.000</span>
            <span className="text-2xl">🍄</span>
            <span className="highlight font-bold px-2 py-1 rounded animate-pulse"
                  style={{
                    background: 'linear-gradient(135deg, #FFFFFF 0%, #000000 100%)',
                    color: '#FFFFFF',
                    boxShadow: '0 0 10px rgba(231,76,60,0.40)',
                    animation: 'pulse-shadow 2s ease-in-out infinite alternate'
                  }}>
              DESPACHO GRATIS
            </span>
            <span className="text-2xl">🚛</span>
          </span>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes pulse-shadow {
          from {
            box-shadow: 0 0 10px rgba(231,76,60,0.40);
          }
          to {
            box-shadow: 0 0 15px rgba(231,76,60,0.60);
          }
        }
      `}</style>
    </div>
  )
}
