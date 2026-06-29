import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import JewelryViewer from './components/JewelryViewer';
import './App.css';

const API_BASE = 'http://localhost:5000/api';

// Luxury design color theme configuration mapped to product ids
const themeConfig = {
  gold_necklace: {
    bgColor: '#3D331A',      // Dark antique gold shade
    textColor: '#FAF6EC',    // Light warm contrast text
    accentColor: '#B76E79',  // Rose gold accent
    // Extremely dark gold reflection
    cardBg: '#12100A',       
    cardText: '#ffffff',     // White text
    cardBorder: 'rgba(183, 110, 121, 0.45)', // Polished rose gold
    cardTagColor: '#D4AF37', // Dark yellow tag
    cardDescColor: '#E5D3C0' // Soft gold description
  },
  cuban_chain: {
    bgColor: '#3B3016',      // Dark warm bronze gold shade
    textColor: '#F5EEE0',    // Light cream contrast text
    accentColor: '#B76E79',  
    // Extremely dark bronze reflection
    cardBg: '#120E09',       
    cardText: '#ffffff',     
    cardBorder: 'rgba(183, 110, 121, 0.45)', 
    cardTagColor: '#D4AF37', 
    cardDescColor: '#E5D3C0' 
  },
  chain_set: {
    bgColor: '#272A2D',      // Dark steel platinum silver shade
    textColor: '#ECEFF1',    // Light platinum contrast text
    accentColor: '#B76E79',  
    // Extremely dark silver reflection
    cardBg: '#0B0D0F',       
    cardText: '#ffffff',     
    cardBorder: 'rgba(183, 110, 121, 0.45)', 
    cardTagColor: '#D4AF37', 
    cardDescColor: '#E5D3C0' 
  }
};

// Stagger transition variants for catalog product card entrance animations
const gridContainerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.15
    }
  }
};

const gridCardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 90,
      damping: 14
    }
  }
};

export default function App() {
  const [view, setView] = useState('catalog'); // 'catalog' or 'detail'
  
  // Resilient fallback dataset if database API is offline
  const fallbackModels = [
    { 
      modelId: 'gold_necklace', 
      name: 'Classic 18K Gold Rope Chain',
      price: 1299.00,
      material: '18K Yellow Gold Solid',
      weight: '24.5g',
      glbPath: '/models/gold_necklace__chain.glb',
      description: 'A classic 18-karat solid yellow gold rope chain, featuring diamond-cut detailing for maximum light reflection and sparkle.',
      ...themeConfig.gold_necklace
    },
    { 
      modelId: 'cuban_chain', 
      name: 'Miami Cuban Link Choker',
      price: 3450.00,
      material: '14K Yellow Gold Solid',
      weight: '62.1g',
      glbPath: '/models/cuban_chain.glb',
      description: 'An iconic heavy Miami Cuban link choker, featuring hand-polished solid 14-karat gold with a custom security clasp.',
      ...themeConfig.cuban_chain
    },
    { 
      modelId: 'chain_set', 
      name: 'Signature Double Chain Combo',
      price: 7800.00,
      material: '18K Gold & Sterling Silver',
      weight: '88.3g',
      glbPath: '/models/chain_set.glb',
      description: 'A premium double-layered necklace set combining a thick Cuban link in sterling silver and a classic rope chain in 18K solid yellow gold.',
      ...themeConfig.chain_set
    }
  ];

  const [models, setModels] = useState(fallbackModels);
  const [activeModel, setActiveModel] = useState(fallbackModels[0]);

  // Fetch products database from Express API
  const fetchJewelry = async () => {
    try {
      const res = await fetch(`${API_BASE}/jewelry`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          // Merge database entries with dynamic client-side color themes
          const mergedData = data.map(item => {
            const theme = themeConfig[item.modelId] || themeConfig.gold_necklace;
            return { ...item, ...theme };
          });
          setModels(mergedData);
          setActiveModel(mergedData[0]);
        }
      }
    } catch (err) {
      console.warn('Backend API offline, operating in client-side fallback:', err);
    }
  };

  useEffect(() => {
    fetchJewelry();
  }, []);

  return (
    <AnimatePresence mode="wait">
      {view === 'catalog' ? (
        /* Catalog Homepage view displaying cards dynamically */
        <motion.div 
          key="catalog"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 1,
            backgroundColor: ['#9B8145', '#808487', '#9B8145']
          }}
          exit={{ opacity: 0 }}
          transition={{ 
            opacity: { duration: 0.6 },
            backgroundColor: {
              duration: 12,
              repeat: Infinity,
              ease: 'easeInOut'
            }
          }}
          className="catalog-view"
        >
          <div className="catalog-header" style={{ zIndex: 10 }}>
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="nav-brand"
              style={{ justifyContent: 'center', marginBottom: '24px' }}
            >
              <span className="brand-dot" style={{ backgroundColor: '#B76E79', boxShadow: '0 0 12px #B76E79' }}></span>
              <span className="brand-text" style={{ color: '#ffffff' }}>MERN SPACE</span>
            </motion.div>
            
            <motion.h2 
              className="catalog-title"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              EXQUISITE JEWELRY COLLECTION
            </motion.h2>
            <motion.p 
              className="catalog-subtitle"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Select a piece to launch the interactive 3D studio experience
            </motion.p>
          </div>

          <motion.div 
            className="catalog-grid"
            variants={gridContainerVariants}
            initial="hidden"
            animate="show"
            style={{ zIndex: 10 }}
          >
            {models.map((model) => (
              <motion.div
                key={model.modelId}
                className="catalog-card"
                variants={gridCardVariants}
                onClick={() => {
                  setActiveModel(model);
                  setView('detail');
                }}
                whileHover={{ y: -8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                style={{ 
                  background: model.cardBg, 
                  borderColor: model.cardBorder,
                  color: model.cardText 
                }}
              >
                <div className="card-tag" style={{ color: model.cardTagColor }}>
                  {model.material}
                </div>
                <h3 className="card-name" style={{ color: model.cardText }}>{model.name}</h3>
                <p style={{ fontSize: '13px', color: model.cardDescColor, margin: '4px 0 0 0', lineHeight: '1.6' }}>
                  {model.description.length > 100 ? `${model.description.substring(0, 100)}...` : model.description}
                </p>
                
                <div className="card-price-row" style={{ borderTopColor: 'rgba(255, 255, 255, 0.05)' }}>
                  <span className="card-price" style={{ color: model.cardText }}>
                    ${typeof model.price === 'number' ? model.price.toLocaleString(undefined, {minimumFractionDigits: 2}) : model.price}
                  </span>
                  <span className="card-currency" style={{ color: `${model.cardDescColor}99` }}>USD</span>
                </div>
                
                <div 
                  className="btn-explore"
                  style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    color: '#ffffff'
                  }}
                >
                  Launch 3D Experience
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      ) : (
        /* Fullscreen 3D Details and rotating viewport stage */
        <motion.div 
          key="detail"
          className="fullscreen-app"
          animate={{ backgroundColor: activeModel.bgColor }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          style={{ color: activeModel.textColor }}
        >
          {/* Left panel: Specifications, logo, and selector controls */}
          <div className="left-panel">
            
            {/* Minimalist brand navigation with Back button */}
            <motion.div 
              className="nav-header"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '40px', justifyContent: 'space-between' }}
            >
              <div className="nav-brand">
                <span 
                  className="brand-dot" 
                  style={{ 
                    backgroundColor: activeModel.accentColor, 
                    boxShadow: `0 0 12px ${activeModel.accentColor}` 
                  }}
                ></span>
                <span className="brand-text" style={{ color: activeModel.textColor }}>MERN SPACE</span>
              </div>

              <button 
                className="btn-back-link" 
                onClick={() => setView('catalog')}
                style={{ color: activeModel.textColor, borderColor: `${activeModel.textColor}22` }}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ transform: 'rotate(180deg)' }}>
                  <path d="M2 5h6M5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Collection
              </button>
            </motion.div>

            {/* Product spec block - dynamic slide transition */}
            <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeModel.modelId}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <span style={{ fontSize: '10px', fontWeight: 600, color: activeModel.accentColor, textTransform: 'uppercase', letterSpacing: '2px' }}>
                      Jewelry Details
                    </span>
                  </div>
                  
                  <h1 style={{ fontSize: '32px', margin: 0, color: activeModel.textColor, fontWeight: 700, fontFamily: 'var(--font-heading)', lineHeight: '1.2' }}>
                    {activeModel.name}
                  </h1>
                  
                  <p style={{ fontSize: '14px', color: `${activeModel.textColor}aa`, lineHeight: '1.6', margin: 0 }}>
                    {activeModel.description}
                  </p>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '11px', background: 'rgba(0,0,0,0.02)', padding: '6px 12px', borderRadius: '6px', color: activeModel.textColor, border: '1px solid rgba(0,0,0,0.05)' }}>
                      Material: <strong style={{ color: activeModel.textColor }}>{activeModel.material}</strong>
                    </span>
                    <span style={{ fontSize: '11px', background: 'rgba(0,0,0,0.02)', padding: '6px 12px', borderRadius: '6px', color: activeModel.textColor, border: '1px solid rgba(0,0,0,0.05)' }}>
                      Weight: <strong style={{ color: activeModel.textColor }}>{activeModel.weight}</strong>
                    </span>
                  </div>

                  <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '20px', width: '100%', marginTop: '10px' }}>
                    <div style={{ fontSize: '9px', color: `${activeModel.textColor}77`, marginBottom: '4px', letterSpacing: '1px' }}>SUGGESTED RETAIL PRICE</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                      <span style={{ fontSize: '28px', fontWeight: 800, color: activeModel.textColor }}>
                        ${typeof activeModel.price === 'number' ? activeModel.price.toLocaleString(undefined, {minimumFractionDigits: 2}) : activeModel.price}
                      </span>
                      <span style={{ fontSize: '12px', color: `${activeModel.textColor}77`, fontWeight: 600 }}>USD</span>
                    </div>
                  </div>

                  <button style={{
                    width: '100%',
                    padding: '14px',
                    background: activeModel.textColor,
                    border: 'none',
                    borderRadius: '8px',
                    color: activeModel.bgColor,
                    fontWeight: 600,
                    fontSize: '14px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    marginTop: '10px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.opacity = '0.9';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.opacity = '1';
                  }}
                  >
                    Order Custom Piece
                  </button>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Model Selector bar inside Left Panel */}
            <motion.div 
              style={{
                background: 'rgba(0, 0, 0, 0.03)',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                padding: '6px',
                borderRadius: '99px',
                display: 'flex',
                gap: '4px',
                marginTop: '40px',
                width: '100%',
                justifyContent: 'space-between'
              }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {models.map((model) => (
                <button
                  key={model.modelId}
                  onClick={() => setActiveModel(model)}
                  style={{
                    flex: 1,
                    padding: '10px 0',
                    borderRadius: '99px',
                    border: 'none',
                    background: activeModel.modelId === model.modelId ? activeModel.textColor : 'transparent',
                    color: activeModel.modelId === model.modelId ? activeModel.bgColor : `${activeModel.textColor}99`,
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.19, 1, 0.22, 1)',
                    fontFamily: 'inherit',
                    textAlign: 'center'
                  }}
                >
                  {model.modelId === 'gold_necklace' ? 'Necklace' : model.modelId === 'cuban_chain' ? 'Cuban Link' : 'Double Combo'}
                </button>
              ))}
            </motion.div>

          </div>

          {/* Right panel: Size-normalized R3F 3D Viewport inheriting dynamic background */}
          <motion.div 
            className="right-panel"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.0, ease: 'easeOut', delay: 0.1 }}
          >
            <JewelryViewer activeModel={activeModel} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
