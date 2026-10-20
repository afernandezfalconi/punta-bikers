'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowDown, ArrowUp, ArrowUpRight, MapPin, Menu, X, Plus, Sun, Waves, Compass, MessageCircle, Bike, Hotel } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Lang = 'es' | 'en'
type Scooter = 'ws150-sport' | 'd125' | 'ws150-azul' | 'reptile-xt200'

const scooters: Scooter[] = ['ws150-sport', 'd125', 'ws150-azul', 'reptile-xt200']

const dict = {
  es: {
    home: 'Inicio',
    mainNav: 'Navegación principal',
    langLabel: 'Idioma',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    mobileNav: 'Navegación móvil',
    plan: 'Consultar',
    skip: 'Ir al contenido',
    heroAlt: 'Puerto Escondido',
    heroLocation: 'LA PUNTA · PUERTO ESCONDIDO, OAXACA',
    statement: ['La costa no se cuenta.', 'Se recorre.'],
    desc: ['Descubre Punta Biker: scooters premium en Puerto Escondido.', 'Entrega en punto de encuentro o en tu hotel.'],
    findCta: 'Consultar disponibilidad',
    feel: 'Explorar',
    cue: 'Conoce nuestros scooters',
    note: 'Consulta, no reserva.',
    ticker: ['PUERTO ESCONDIDO', 'RIDE THE COAST', 'SCOOTERS PREMIUM'],
    introLabel: ['Quiénes somos', 'PUNTA BIKER'],
    introH: ['La costa merece', 'ser recorrida en stil', 'o.'],
    introP: 'Ofrecemos scooters premium para que explores Puerto Escondido como quieras. Sin prisa. Sin compromiso. Solo dos ruedas y el mar.',
    introLink: 'Ver flota',
    fleetEyebrow: 'NUESTRA FLOTA',
    fleetH: ['Elige tu', 'scooter'],
    fleetP: ['Cuatro opciones, cada una para un viaje diferente.', 'Todas con GPS, seguro y asistencia 24/7.'],
    selection: 'Selección',
    wsLine: 'Deportiva, ágil, perfecta para explorar calles y playas.',
    d125Name: 'Dayang D125',
    d125Line: 'Potencia clásica. Comodidad y estabilidad en cada curva.',
    d125Eyebrow: 'DAYANG',
    wsAzulName: 'Italika WS150 Azul',
    wsAzulLine: 'El azul es el ritmo de Puerto Escondido.',
    wsAzulEyebrow: 'ITALIKA',
    reptilName: 'Vento Reptile Xt 200',
    reptilLine: 'Cuatrimoto de lujo. Para quien busca más.',
    reptilEyebrow: 'VENTO',
    spinAlt: 'Vista 360°',
    spinHint: 'Arrastra para rotar',
    ask: 'Consultar',
    expEyebrow: 'LA EXPERIENCIA',
    expH: ['Cada viaje es', 'una postal'],
    expP: 'No es solo transporte. Es la libertad de descubrir Puerto Escondido a tu ritmo.',
    expAlt: 'Atardecer en Puerto Escondido',
    postcards: 'POSTALES DE LA COSTA',
    moments: [
      ['AMANECER', 'Primeras luces', 'Cuando la costa despierta.'],
      ['MEDIODÍA', 'Ritmo constante', 'Playas, mercados, gente.'],
      ['ATARDECER', 'Respiración final', 'El mar resplandece.'],
    ],
    stepsEyebrow: 'TRES PASOS',
    stepsH: ['Cómo', 'funciona'],
    stepsP: ['Consulta disponibilidad, elige tu scooter y fecha.', 'Nos vemos en el punto de encuentro o en tu hotel.'],
    steps: [
      ['Consulta', 'Dinos cuándo y qué buscas.'],
      ['Confirma', 'Coordina la entrega.'],
      ['Explora', 'Disfruta Puerto Escondido.'],
    ],
    delEyebrow: 'FLEXIBILIDAD',
    delH: ['Entregamos', 'donde quieras'],
    del: ['Punto de encuentro', 'Nos vemos en La Punta o en el centro.'],
    delivery: [
      ['Punto de encuentro', 'Nos vemos en La Punta o en el centro.'],
      ['En tu hotel', 'Llegamos a tu puerta.'],
    ],
    faqEyebrow: 'PREGUNTAS',
    faqH: ['Lo que nos', 'preguntas siempre'],
    faqP: ['Seguro, depósito, documentación.', 'Todo aclarado antes de partir.'],
    faqs: [
      ['¿Necesito licencia internacional?', 'Sí. Llevá tu pasaporte o licencia original.'],
      ['¿Incluye seguro?', 'Sí. Cobertura integral en todos los scooters.'],
      ['¿Hay depósito?', 'Depósito de seguridad reembolsable. Coordinamos los detalles.'],
      ['¿Puedo ir a playas lejanas?', 'Sí. Autonomía de 150+ km en todos los modelos.'],
    ],
    footEyebrow: 'LISTO',
    footH: ['Comienza tu', 'aventura'],
    footCta: 'Consultar ahora',
    footSmall: 'Puerto Escondido, Oaxaca',
    backTop: '↑ Arriba',
  },
  en: {
    home: 'Home',
    mainNav: 'Main navigation',
    langLabel: 'Language',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    mobileNav: 'Mobile navigation',
    plan: 'Inquire',
    skip: 'Skip to content',
    heroAlt: 'Puerto Escondido',
    heroLocation: 'LA PUNTA · PUERTO ESCONDIDO, OAXACA',
    statement: ['The coast is not just told.', 'It\'s discovered.'],
    desc: ['Discover Punta Biker: premium scooters in Puerto Escondido.', 'Delivery at your meeting point or hotel.'],
    findCta: 'Check availability',
    feel: 'Explore',
    cue: 'Discover our fleet',
    note: 'Inquire, don\'t reserve.',
    ticker: ['PUERTO ESCONDIDO', 'RIDE THE COAST', 'PREMIUM SCOOTERS'],
    introLabel: ['Who we are', 'PUNTA BIKER'],
    introH: ['The coast deserves', 'to be explored in', 'style.'],
    introP: 'We offer premium scooters so you can explore Puerto Escondido however you want. No rush. No commitment. Just two wheels and the sea.',
    introLink: 'View fleet',
    fleetEyebrow: 'OUR FLEET',
    fleetH: ['Choose your', 'scooter'],
    fleetP: ['Four options, each for a different journey.', 'All with GPS, insurance and 24/7 support.'],
    selection: 'Selection',
    wsLine: 'Sporty, agile, perfect for exploring streets and beaches.',
    d125Name: 'Dayang D125',
    d125Line: 'Classic power. Comfort and stability in every curve.',
    d125Eyebrow: 'DAYANG',
    wsAzulName: 'Italika WS150 Blue',
    wsAzulLine: 'Blue is the rhythm of Puerto Escondido.',
    wsAzulEyebrow: 'ITALIKA',
    reptilName: 'Vento Reptile Xt 200',
    reptilLine: 'Luxury quad. For those who want more.',
    reptilEyebrow: 'VENTO',
    spinAlt: '360° view',
    spinHint: 'Drag to rotate',
    ask: 'Inquire',
    expEyebrow: 'THE EXPERIENCE',
    expH: ['Every ride is', 'a postcard'],
    expP: 'It\'s not just transport. It\'s the freedom to discover Puerto Escondido at your pace.',
    expAlt: 'Sunset in Puerto Escondido',
    postcards: 'COASTAL POSTCARDS',
    moments: [
      ['SUNRISE', 'First light', 'When the coast awakens.'],
      ['MIDDAY', 'Constant rhythm', 'Beaches, markets, people.'],
      ['SUNSET', 'Final breath', 'The sea glows.'],
    ],
    stepsEyebrow: 'THREE STEPS',
    stepsH: ['How it', 'works'],
    stepsP: ['Tell us when and what you\'re looking for.', 'We meet at your preferred location.'],
    steps: [
      ['Inquire', 'Tell us when and what you need.'],
      ['Confirm', 'Coordinate delivery.'],
      ['Explore', 'Enjoy Puerto Escondido.'],
    ],
    delEyebrow: 'FLEXIBILITY',
    delH: ['We deliver', 'where you want'],
    delivery: [
      ['Meeting point', 'We meet in La Punta or downtown.'],
      ['Your hotel', 'We come to your door.'],
    ],
    faqEyebrow: 'QUESTIONS',
    faqH: ['What you always', 'ask us'],
    faqP: ['Insurance, deposit, documentation.', 'Everything clear before departure.'],
    faqs: [
      ['Do I need an international license?', 'Yes. Bring your passport or original license.'],
      ['Does it include insurance?', 'Yes. Full coverage on all scooters.'],
      ['Is there a deposit?', 'Refundable security deposit. We coordinate the details.'],
      ['Can I go to distant beaches?', 'Yes. 150+ km range on all models.'],
    ],
    footEyebrow: 'READY',
    footH: ['Start your', 'adventure'],
    footCta: 'Inquire now',
    footSmall: 'Puerto Escondido, Oaxaca',
    backTop: '↑ Top',
  },
}

const stepIcons = [Bike, MessageCircle, Compass]

export default function Home() {
  const [lang, setLangState] = useState<Lang>('es')
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [motionAllowed, setMotionAllowed] = useState(false)
  const progress = useRef<HTMLDivElement>(null)
  const pageRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  function setLang(l: Lang) {
    setLangState(l)
    try {
      localStorage.setItem('pb-lang', l)
    } catch {}
  }

  useEffect(() => {
    const saved = localStorage.getItem('pb-lang')
    if (saved === 'en' || saved === 'es') setLangState(saved)
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    setMotionAllowed(!reduced.matches)

    const update = () => {
      setScrolled(window.scrollY > 40)
      const total = document.documentElement.scrollHeight - window.innerHeight
      if (progress.current) {
        progress.current.style.transform = `scaleX(${total > 0 ? window.scrollY / total : 0})`
      }
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)

    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('revealed')
            observer.unobserve(e.target)
          }
        }),
      { threshold: 0.08 }
    )

    pageRef.current?.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    pageRef.current?.classList.add('motion-enabled')

    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    menuRef.current?.querySelector<HTMLAnchorElement>('a')?.focus()

    function keydown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }

    document.addEventListener('keydown', keydown)
    return () => {
      document.body.style.overflow = previous
      document.removeEventListener('keydown', keydown)
    }
  }, [menuOpen])

  const t = dict[lang]
  const links = [
    { href: '#nosotros', label: t.introLabel[0] },
    { href: '#scooters', label: t.fleetEyebrow },
    { href: '#experiencia', label: t.expEyebrow },
    { href: '#como-funciona', label: t.stepsEyebrow },
  ]

  return (
    <div ref={pageRef} className="min-h-screen bg-stone-50 text-stone-950" style={{ scrollBehavior: 'smooth' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600;700&display=swap');
        h1, h2, h3, h4, h5, h6 { font-family: 'Cormorant', serif; font-weight: 700; letter-spacing: -0.02em; }
        body { font-family: 'Montserrat', sans-serif; }
        .premium-gold { color: #A16207; }
        .reveal { opacity: 0; transform: translateY(20px); transition: all 0.6s ease-out; }
        .motion-enabled .revealed { opacity: 1; transform: translateY(0); }
      `}</style>

      {/* Navigation */}
      <nav className={`sticky top-0 z-50 backdrop-blur-sm bg-white/80 border-b border-stone-200 transition-all ${scrolled ? 'shadow-md' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-amber-700">PUNTA</h1>
          <div className="hidden md:flex gap-12 text-sm font-medium">
            {links.map((link) => (
              <a key={link.href} href={link.href} className="hover:text-amber-700 transition-colors duration-300">
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex gap-3 sm:gap-4">
            <Link href="/auth/login">
              <Button variant="outline" className="border-stone-300 hover:border-amber-700 hover:text-amber-700 text-xs sm:text-sm h-10 px-4">
                {lang === 'es' ? 'Iniciar' : 'Sign In'}
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-amber-700 text-white text-xs sm:text-sm h-10 px-6 font-semibold hover:bg-amber-800 transition-all duration-300 shadow-md">
                {t.plan}
              </Button>
            </Link>
          </div>
          <button
            ref={menuButtonRef}
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2"
            aria-label={menuOpen ? t.closeMenu : t.openMenu}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-b from-amber-50 to-white py-20 sm:py-32 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-block px-4 py-2 border border-amber-700 text-amber-700 text-sm font-semibold tracking-widest">
            {lang === 'es' ? 'SCOOTERS PREMIUM' : 'PREMIUM SCOOTERS'}
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold leading-tight" style={{ textWrap: 'balance' }}>
            {lang === 'es' ? 'Recorre Puerto Escondido' : 'Ride Puerto Escondido'}
          </h1>
          <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            {t.statement[0]} <br /> {t.statement[1]}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-4">
            <Link href="/auth/signup">
              <button className="h-14 px-10 bg-stone-950 hover:bg-black text-white font-semibold text-base transition-all duration-300 shadow-xl hover:shadow-2xl cursor-pointer border border-stone-950">
                {t.findCta}
              </button>
            </Link>
            <a href="#scooters">
              <button className="h-14 px-10 bg-amber-700 text-white font-semibold text-base transition-all duration-300 shadow-lg hover:shadow-xl hover:bg-amber-800 border border-amber-700">
                {t.feel} <ArrowDown className="inline ml-2" size={16} />
              </button>
            </a>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-24 sm:py-32 px-4 border-y border-stone-200">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            {[
              { icon: '✦', title: lang === 'es' ? 'Consulta fácil' : 'Easy inquiry', desc: lang === 'es' ? 'Coordina en minutos' : 'Coordinate in minutes' },
              { icon: '🛡️', title: lang === 'es' ? 'Protección total' : 'Full protection', desc: lang === 'es' ? 'Seguro e GPS incluidos' : 'Insurance & GPS included' },
              { icon: '★', title: lang === 'es' ? 'Servicio concierge' : 'Concierge service', desc: lang === 'es' ? 'Asistencia 24/7' : '24/7 assistance' },
            ].map((feature, i) => (
              <div key={i} className="reveal space-y-6 border-l-4 border-amber-700 pl-6 sm:pl-8 hover:border-amber-600 transition-all duration-300">
                <div className="text-4xl sm:text-5xl text-amber-700">{feature.icon}</div>
                <div className="space-y-3">
                  <h3 className="text-2xl sm:text-3xl font-bold">{feature.title}</h3>
                  <p className="text-stone-600 text-base leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-stone-950 text-white py-20 sm:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <p className="text-amber-700 font-bold tracking-widest text-sm">
            {lang === 'es' ? 'LISTO PARA COMENZAR' : 'READY TO START'}
          </p>
          <h2 className="text-5xl sm:text-6xl font-bold">{t.footH[0]}</h2>
          <p className="text-lg text-stone-300 max-w-3xl mx-auto leading-relaxed">
            {lang === 'es'
              ? 'La costa espera. Tu scooter también. Consultá hoy.'
              : 'The coast is waiting. Your scooter too. Inquire today.'}
          </p>
          <Link href="/auth/signup">
            <Button className="bg-amber-700 text-white h-14 px-12 text-base font-semibold hover:bg-amber-800 shadow-2xl transition-all duration-300">
              {t.footCta}
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-300 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center space-y-6">
          <h3 className="text-2xl font-bold text-amber-700">PUNTA BIKERS</h3>
          <p className="text-sm">{t.footSmall}</p>
          <div className="flex justify-center gap-6 text-xs">
            <a href="#" className="hover:text-white transition-colors">
              {lang === 'es' ? 'Privacidad' : 'Privacy'}
            </a>
            <a href="#" className="hover:text-white transition-colors">
              {lang === 'es' ? 'Términos' : 'Terms'}
            </a>
            <a href="#" className="hover:text-white transition-colors">
              {lang === 'es' ? 'Contacto' : 'Contact'}
            </a>
          </div>
          <p className="text-xs">© 2026 PUNTA BIKERS. Ride the Coast.</p>
        </div>
      </footer>
    </div>
  )
}
