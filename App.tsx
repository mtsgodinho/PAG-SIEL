
import React, { useState, useRef, useEffect } from 'react';
import { 
  CheckCircle, 
  Users, 
  Award, 
  MessageCircle, 
  Instagram, 
  MapPin, 
  Scissors, 
  UserCheck, 
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Gift
} from 'lucide-react';

// --- Constants ---
const WHATSAPP_LINK = "https://api.whatsapp.com/message/YDBQBOD6FZ7SP1?autoload=1&app_absent=0&utm_source=ig";
const INSTAGRAM_LINK = "https://www.instagram.com/sielfelip/";

const EXPERT_PHOTOS = [
  "https://i.imgur.com/Ha0AIsp.png", // Hero/Main
  "https://i.imgur.com/t2hR4pF.png"  // Bio/Authority
];

const REAL_RESULTS = [
  "https://i.imgur.com/XjsCtNk.png",
  "https://i.imgur.com/xGNcOpy.png",
  "https://i.imgur.com/DBuvaBY.png",
  "https://i.imgur.com/kMzJBmF.png",
  "https://i.imgur.com/F6uvCXN.png",
  "https://i.imgur.com/Il83NNE.png",
  "https://i.imgur.com/lCgvTjV.png"
];

const EXPERIENCE_CAROUSEL = [
  "https://i.imgur.com/pJHuqy4.png",
  "https://i.imgur.com/N5myge2.png",
  "https://i.imgur.com/BvtLOK9.png",
  "https://i.imgur.com/mA9ns9X.png",
  "https://i.imgur.com/eKMhcbK.png",
  "https://i.imgur.com/ZhXxacD.png",
  "https://i.imgur.com/rAVSvWC.png",
  "https://i.imgur.com/mQoIR2X.png",
  "https://i.imgur.com/X4JbjMo.png"
];

const WHEEL_PRIZES = [
  { text: "5% OFF", color: "#1c1c1c" },
  { text: "10% OFF", color: "#d4af37" }, // Target
  { text: "15% OFF", color: "#1c1c1c" },
  { text: "LIMPEZA", color: "#2d2d2d" },
  { text: "20% OFF", color: "#1c1c1c" },
  { text: "BRINDE", color: "#d4af37" },
  { text: "5% OFF", color: "#1c1c1c" },
  { text: "BARBA", color: "#2d2d2d" },
];

// --- Components ---

const ButtonCTA: React.FC<{ text: string, subText?: string, className?: string }> = ({ text, subText, className }) => (
  <div className={`flex flex-col items-center gap-2 w-full max-w-sm mx-auto ${className}`}>
    <a 
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-gradient-gold text-zinc-900 font-bold py-4 px-6 rounded-full w-full flex items-center justify-center gap-3 text-lg uppercase tracking-wider shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:scale-105 transition-transform duration-300"
    >
      <MessageCircle fill="currentColor" size={24} />
      {text}
    </a>
    {subText && <span className="text-zinc-500 text-xs italic tracking-wide">{subText}</span>}
  </div>
);

const FloatingWhatsApp: React.FC = () => (
  <a 
    href={WHATSAPP_LINK}
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-6 right-6 z-[90] bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 animate-bounce-slow"
    aria-label="WhatsApp"
  >
    <MessageCircle fill="currentColor" size={32} />
    <span className="absolute -top-1 -right-1 flex h-4 w-4">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
      <span className="relative inline-flex rounded-full h-4 w-4 bg-white"></span>
    </span>
  </a>
);

const Lightbox: React.FC<{ isOpen: boolean, image: string, onClose: () => void }> = ({ isOpen, image, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4" onClick={onClose}>
      <button className="absolute top-6 right-6 text-white" onClick={onClose}><X size={32} /></button>
      <img src={image} className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" alt="Visualização" />
    </div>
  );
};

const SectionTitle: React.FC<{ title: string, subtitle?: string, center?: boolean }> = ({ title, subtitle, center = true }) => (
  <div className={`mb-10 ${center ? 'text-center' : 'text-left'}`}>
    <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white leading-tight">{title}</h2>
    {subtitle && <p className="text-zinc-400 text-sm md:text-base max-w-md mx-auto">{subtitle}</p>}
    <div className={`h-1 w-20 bg-gradient-gold mt-4 ${center ? 'mx-auto' : ''}`}></div>
  </div>
);

const DiscountWheelModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasWon, setHasWon] = useState(false);

  const spinWheel = () => {
    if (isSpinning || hasWon) return;
    setIsSpinning(true);

    const segmentAngle = 360 / WHEEL_PRIZES.length;
    const targetSegmentIndex = 1; // 10% OFF
    // To land the middle of the segment at the top (0 deg)
    // The segments start at i * segmentAngle.
    // The middle of segment i is at (i * segmentAngle) + (segmentAngle / 2).
    // To move that point to the top (pointer position), we subtract it from 360.
    const targetAngle = 360 - (targetSegmentIndex * segmentAngle + segmentAngle / 2);
    const totalRotation = (360 * 6) + targetAngle; // 6 full spins + target

    setRotation(totalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setHasWon(true);
    }, 4000);
  };

  // Generate conic gradient string for the wheel background
  const segmentAngle = 360 / WHEEL_PRIZES.length;
  const conicGradient = WHEEL_PRIZES.map((prize, i) => 
    `${prize.color} ${i * segmentAngle}deg ${(i + 1) * segmentAngle}deg`
  ).join(', ');

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-zinc-950 border border-gold/30 rounded-3xl p-8 max-w-sm w-full text-center relative overflow-hidden shadow-[0_0_60px_rgba(212,175,55,0.3)]">
        {!hasWon && <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"><X size={24} /></button>}
        
        <h3 className="text-2xl font-bold mb-2 text-white italic">Sorteio Exclusivo!</h3>
        <p className="text-zinc-400 text-sm mb-10">Gire a roleta e ganhe um presente especial para elevar seu estilo.</p>

        <div className="relative w-64 h-64 mx-auto mb-10">
          {/* Pointer */}
          <div className="absolute top-[-15px] left-1/2 -translate-x-1/2 z-40">
            <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[24px] border-t-white filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"></div>
          </div>
          
          {/* Wheel Body */}
          <div 
            className="w-full h-full rounded-full border-[6px] border-zinc-800 relative transition-transform duration-[4000ms] cubic-bezier(0.2, 0, 0.1, 1) shadow-[0_0_40px_rgba(0,0,0,0.8)]"
            style={{ 
              transform: `rotate(${rotation}deg)`,
              background: `conic-gradient(${conicGradient})`
            }}
          >
            {/* Text Labels */}
            {WHEEL_PRIZES.map((prize, i) => {
              const labelRotation = i * segmentAngle + segmentAngle / 2;
              return (
                <div 
                  key={i}
                  className="absolute top-0 left-0 w-full h-full flex items-start justify-center pt-8 pointer-events-none"
                  style={{ transform: `rotate(${labelRotation}deg)` }}
                >
                  <span 
                    className={`font-bold text-[11px] tracking-tighter uppercase whitespace-nowrap ${i === 1 || i === 5 ? 'text-zinc-900' : 'text-white/80'}`}
                    style={{ textShadow: i === 1 || i === 5 ? 'none' : '0 1px 2px rgba(0,0,0,0.5)' }}
                  >
                    {prize.text}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Center Hub */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-zinc-900 border-[3px] border-gold/50 rounded-full z-30 flex items-center justify-center shadow-2xl">
            <div className="bg-zinc-800 w-10 h-10 rounded-full flex items-center justify-center border border-gold/20">
              <Scissors size={20} className="text-gold" />
            </div>
          </div>
        </div>

        {!hasWon ? (
          <button 
            onClick={spinWheel}
            disabled={isSpinning}
            className={`w-full py-4 rounded-full font-bold text-lg transition-all duration-500 transform active:scale-95 ${isSpinning ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-gradient-gold text-zinc-900 shadow-[0_4px_15px_rgba(212,175,55,0.4)]'}`}
          >
            {isSpinning ? 'SORTEANDO...' : 'GIRAR AGORA'}
          </button>
        ) : (
          <div className="animate-in fade-in zoom-in duration-700">
            <div className="flex flex-col items-center gap-4 mb-8">
              <div className="bg-gold/10 p-5 rounded-full text-gold animate-bounce">
                <Gift size={40} />
              </div>
              <h4 className="text-3xl font-bold text-white tracking-tight uppercase">Excelente!</h4>
              <div className="space-y-1">
                <p className="text-gold font-bold text-2xl uppercase tracking-[0.2em]">10% OFF</p>
                <p className="text-zinc-400 text-sm italic">Garantido para seu próximo atendimento.</p>
              </div>
            </div>
            <a 
              href={`${WHATSAPP_LINK}&text=Olá Siel! Ganhei 10% de desconto na roleta e quero agendar meu horário.`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] text-white font-bold py-5 px-6 rounded-full w-full flex items-center justify-center gap-3 text-lg uppercase shadow-[0_4px_20px_rgba(37,211,102,0.3)] hover:scale-105 transition-transform"
            >
              <MessageCircle fill="currentColor" size={24} />
              RESGATAR PRÊMIO
            </a>
            <button onClick={onClose} className="mt-6 text-zinc-600 text-xs hover:text-zinc-400 uppercase tracking-widest transition-colors">Fechar</button>
          </div>
        )}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [showWheel, setShowWheel] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWheel(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 300;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen selection:bg-amber-500/30 overflow-x-hidden">
      {/* Discount Wheel */}
      {showWheel && <DiscountWheelModal onClose={() => setShowWheel(false)} />}

      {/* Floating Button */}
      <FloatingWhatsApp />

      {/* Lightbox for Gallery */}
      <Lightbox isOpen={!!selectedImg} image={selectedImg || ''} onClose={() => setSelectedImg(null)} />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col justify-end pb-12 pt-10 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={EXPERT_PHOTOS[0]} 
            className="w-full h-full object-cover object-center grayscale-[20%] brightness-[0.7]" 
            alt="Siel Felipe" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent"></div>
        </div>
        
        <div className="relative z-10 px-6 max-w-xl">
          <span className="text-gold font-semibold tracking-widest text-sm uppercase mb-3 block border-l-2 border-gold pl-3">Especialista em Imagem Masculina</span>
          <h1 className="text-5xl font-bold text-white mb-6 leading-[1.1]">
            Eu sou Siel Felipe, <br/>
            <span className="italic">o Corte do Rei.</span>
          </h1>
          <p className="text-zinc-200 text-lg mb-8 font-light leading-relaxed">
            Transformando sua imagem com a autoridade de quem já formou mais de 100 profissionais. Descubra o corte que impõe respeito e reflete sua essência.
          </p>
          <ButtonCTA 
            text="MARQUE SEU HORÁRIO" 
            subText="Atendimento personalizado via WhatsApp"
            className="!items-start !mx-0"
          />
        </div>
      </section>

      {/* Authority Section */}
      <section className="py-20 px-6 bg-zinc-950">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <div className="relative">
            <div className="absolute -inset-2 border border-gold/30 rounded-lg"></div>
            <img 
              src={EXPERT_PHOTOS[1]} 
              className="relative w-full h-[400px] object-cover rounded-lg shadow-2xl" 
              alt="Sobre Siel Felipe"
            />
            <div className="absolute bottom-4 left-4 glass-card px-4 py-2 rounded-md">
              <p className="text-gold font-bold text-sm">10+ Anos de Estrada</p>
            </div>
          </div>
          <div>
            <SectionTitle title="A Autoridade Por Trás da Lâmina" center={false} />
            <div className="space-y-6 text-zinc-300">
              <p className="leading-relaxed">
                Minha missão nunca foi "apenas cortar cabelo". Ao longo de uma década, aperfeiçoei técnicas que elevam a autoestima e reforçam a presença de cada homem que senta na minha cadeira.
              </p>
              <div className="space-y-4">
                {[
                  "Mentor e formador de +100 barbeiros profissionais.",
                  "Especialista em visagismo e harmonização masculina.",
                  "Referência em Capão da Canoa e região.",
                  "Atendimento 100% focado em consultoria e resultado."
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle className="text-gold flex-shrink-0" size={20} />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-20 bg-zinc-900 overflow-hidden">
        <div className="px-6 max-w-5xl mx-auto">
          <SectionTitle 
            title="Resultados Reais" 
            subtitle="Não é sorte, é técnica. Veja como uma avaliação profissional transforma o visual."
          />
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {REAL_RESULTS.map((img, i) => (
              <div 
                key={i} 
                className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer bg-zinc-800"
                onClick={() => setSelectedImg(img)}
              >
                <img 
                  src={img} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  alt={`Resultado ${i + 1}`} 
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Maximize2 className="text-white" />
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-zinc-500 text-[10px] mt-6 uppercase tracking-widest">
            *Resultados podem variar de pessoa para pessoa
          </p>
        </div>
      </section>

      {/* Trust Cards Section */}
      <section className="py-20 px-6 bg-zinc-950">
        <SectionTitle title="Por Que Confiar?" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { icon: UserCheck, title: "Avaliação Honestíssima", text: "Eu não empurro serviços. Eu analiso o que realmente favorece seu rosto." },
            { icon: Scissors, title: "Técnica de Mestre", text: "Mais de 10 anos dominando as ferramentas para o corte perfeito." },
            { icon: Award, title: "Autoridade Reconhecida", text: "Mentor de profissionais. Quem ensina, domina a arte profundamente." },
            { icon: Users, title: "Atendimento Exclusivo", text: "Cada consulta é única. Sem pressa, foco total na sua transformação." },
            { icon: MessageCircle, title: "Clareza Total", text: "Explico o porquê de cada escolha técnica no seu visual." },
            { icon: MapPin, title: "Conforto & Localização", text: "Ambiente premium pensado para o homem moderno no coração de Capão." },
          ].map((card, idx) => (
            <div key={idx} className="glass-card p-8 rounded-2xl group hover:border-gold/50 transition-colors">
              <div className="bg-gold/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-gold/20 transition-colors">
                <card.icon className="text-gold" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">{card.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{card.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mid CTA */}
      <section className="py-16 px-6 bg-gradient-to-b from-zinc-950 to-zinc-900 text-center">
        <div className="max-w-xl mx-auto">
          <h3 className="text-2xl font-bold mb-4">Pronto para elevar seu padrão?</h3>
          <p className="text-zinc-400 mb-8">Defina o visual que impõe respeito e autoridade.</p>
          <ButtonCTA text="MARQUE SEU HORÁRIO" />
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 bg-zinc-900">
        <SectionTitle title="Como Funciona o Atendimento" subtitle="3 passos simples para o seu novo visual." />
        <div className="max-w-2xl mx-auto space-y-12">
          {[
            { step: "01", title: "Contato Inicial", text: "Clique no botão e me mande um 'Oi' no WhatsApp. Sem burocracia." },
            { step: "02", title: "Agendamento", text: "Escolhemos o melhor horário para você vir até o Corte do Rei." },
            { step: "03", title: "Transformação", text: "Realizamos uma consultoria de imagem completa e definimos seu novo estilo." }
          ].map((item, idx) => (
            <div key={idx} className="flex gap-6 items-start">
              <div className="text-4xl font-bold text-gold/20 leading-none">{item.step}</div>
              <div>
                <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
                <p className="text-zinc-400 text-sm">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center bg-gold/5 p-6 rounded-lg border border-gold/10 max-w-sm mx-auto">
          <p className="text-gold text-sm font-semibold italic">"Foco total na experiência e no resultado."</p>
        </div>
      </section>

      {/* Experience Carousel Section */}
      <section className="py-20 bg-zinc-950 overflow-hidden relative">
        <div className="px-6 max-w-5xl mx-auto mb-10">
          <SectionTitle title="Bastidores & Experiência" subtitle="A rotina de quem respira a barbearia clássica e moderna diariamente." />
        </div>
        
        <div className="relative group/carousel max-w-6xl mx-auto">
          {/* Scroll Buttons */}
          <button 
            onClick={() => scrollCarousel('left')}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-zinc-950/80 border border-gold/30 p-3 rounded-full text-gold hover:bg-gold hover:text-zinc-900 transition-all hidden md:flex items-center justify-center shadow-xl opacity-0 group-hover/carousel:opacity-100"
            aria-label="Anterior"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={() => scrollCarousel('right')}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-zinc-950/80 border border-gold/30 p-3 rounded-full text-gold hover:bg-gold hover:text-zinc-900 transition-all hidden md:flex items-center justify-center shadow-xl opacity-0 group-hover/carousel:opacity-100"
            aria-label="Próximo"
          >
            <ChevronRight size={24} />
          </button>

          <div 
            ref={carouselRef}
            className="flex gap-4 overflow-x-auto px-6 pb-8 snap-x no-scrollbar scroll-smooth"
          >
            {EXPERIENCE_CAROUSEL.map((img, i) => (
              <div key={i} className="flex-shrink-0 w-64 md:w-80 h-96 rounded-2xl overflow-hidden snap-center relative group">
                <img src={img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Siel Felipe Trabalho" />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                   <span className="text-white text-xs font-bold tracking-widest uppercase">Atendimento Premium</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 bg-zinc-950 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-gold/10 blur-[100px] rounded-full"></div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Sua imagem diz muito sobre quem você é.</h2>
          <p className="text-zinc-300 text-lg mb-10 leading-relaxed">
            Não deixe sua primeira impressão nas mãos de qualquer um. <br/>
            Agende hoje sua <strong>consultoria estratégica personalizada.</strong>
          </p>
          <ButtonCTA 
            text="MARQUE SEU HORÁRIO" 
            subText="Vagas limitadas para atendimento exclusivo"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-zinc-800 bg-zinc-950 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="signature text-gold mb-6 opacity-80">Siel Felipe</div>
          <div className="text-white font-bold text-xl mb-2">Corte do Rei</div>
          <p className="text-zinc-500 text-sm mb-6">Barbeiro Profissional & Mentor de Especialistas</p>
          
          <div className="flex justify-center gap-6 mb-8 text-zinc-400">
            <a href={INSTAGRAM_LINK} target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors"><Instagram size={24} /></a>
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors"><MessageCircle size={24} /></a>
          </div>

          <div className="text-zinc-500 text-xs space-y-2 max-w-xs mx-auto">
            <p className="flex items-center justify-center gap-2">
              <MapPin size={14} className="text-gold" />
              Rua Maneca Quadros 252, Arroio Teixeira
            </p>
            <p>Capão da Canoa - RS | CEP: 95555-000</p>
          </div>

          <div className="mt-10 pt-6 border-t border-zinc-900 text-[10px] text-zinc-600 uppercase tracking-widest">
            © {new Date().getFullYear()} Siel Felipe - Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
