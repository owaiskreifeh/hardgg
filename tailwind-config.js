tailwind.config = {
    theme: {
        extend: {
            colors: {
                // Modern Gaming Color Palette
                'primary': '#00D4FF',
                'primary-dark': '#0099CC',
                'primary-light': '#66E6FF',
                'secondary': '#FF6B35',
                'accent': '#7C3AED',
                'success': '#10B981',
                'warning': '#F59E0B',
                'error': '#EF4444',
                
                // Neutral Colors
                'bg-primary': '#0A0A0F',
                'bg-secondary': '#1A1A2E',
                'bg-tertiary': '#16213E',
                'bg-card': '#1E1E2E',
                'bg-overlay': 'rgba(10, 10, 15, 0.95)',
                
                // Text Colors
                'text-primary': '#FFFFFF',
                'text-secondary': '#A1A1AA',
                'text-muted': '#71717A',
                
                // Border Colors
                'border-primary': '#27272A',
                'border-secondary': '#3F3F46',
                'border-accent': '#00D4FF',
                
                // Legacy Retro Colors (for backward compatibility)
                'retro-purple': '#6B46C1',
                'retro-pink': '#EC4899',
                'retro-cyan': '#06B6D4',
                'retro-green': '#10B981',
                'retro-orange': '#F59E0B',
                'retro-dark': '#1F2937',
                'retro-darker': '#111827',
                'retro-accent': '#8B5CF6'
            },
            fontFamily: {
                'gaming': ['Orbitron', 'monospace'],
                'gaming-bold': ['Orbitron', 'monospace'],
                'gaming-light': ['Orbitron', 'monospace'],
                'inter': ['Inter', 'sans-serif'],
                'retro': ['Courier New', 'monospace'],
                'pixel': ['Monaco', 'Menlo', 'Ubuntu Mono', 'monospace']
            },
            animation: {
                'fade-in': 'fadeIn 0.6s ease-out',
                'slide-up': 'slideInUp 0.4s ease-out',
                'pulse': 'pulse 2s ease-in-out infinite',
                'spin': 'spin 1s linear infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
                'scan': 'scan 2s linear infinite',
                'blink': 'blink 1s step-end infinite'
            },
            boxShadow: {
                'glow': '0 0 20px rgba(0, 212, 255, 0.3)',
                'glow-lg': '0 0 40px rgba(0, 212, 255, 0.4)',
                'gaming': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                'gaming-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                'gaming-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            },
            backdropBlur: {
                'gaming': '20px'
            },
            borderRadius: {
                'gaming': '0.75rem',
                'gaming-lg': '1rem',
                'gaming-xl': '1.5rem'
            },
            spacing: {
                'gaming': '1.5rem',
                'gaming-lg': '2rem',
                'gaming-xl': '3rem'
            },
            zIndex: {
                'dropdown': '1000',
                'sticky': '1020',
                'fixed': '1030',
                'modal-backdrop': '1040',
                'modal': '1050',
                'popover': '1060',
                'tooltip': '1070'
            }
        }
    },
    plugins: [
        // Custom plugin for gaming utilities
        function({ addUtilities, theme }) {
            const gamingUtilities = {
                '.gaming-bg': {
                    background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 50%, var(--bg-tertiary) 100%)',
                    position: 'relative',
                    minHeight: '100vh'
                },
                '.gaming-card': {
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-md)',
                    transition: 'all var(--transition-normal)',
                    position: 'relative',
                    overflow: 'hidden',
                    backdropFilter: 'blur(10px)'
                },
                '.gaming-button': {
                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    color: 'white',
                    fontFamily: 'var(--font-inter)',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    padding: 'var(--space-sm) var(--space-lg)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-normal)',
                    position: 'relative',
                    overflow: 'hidden',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    boxShadow: 'var(--shadow-md)'
                },
                '.gaming-button-secondary': {
                    background: 'transparent',
                    border: '2px solid var(--border-accent)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--primary)',
                    fontFamily: 'var(--font-inter)',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    padding: 'var(--space-sm) var(--space-lg)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-normal)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                },
                '.gaming-input': {
                    background: 'var(--bg-card)',
                    border: '2px solid var(--border-primary)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-inter)',
                    fontSize: '1rem',
                    padding: 'var(--space-md)',
                    transition: 'all var(--transition-normal)',
                    width: '100%'
                },
                '.gaming-tag': {
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-secondary)',
                    borderRadius: 'var(--radius-xl)',
                    color: 'var(--text-secondary)',
                    fontFamily: 'var(--font-inter)',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    padding: 'var(--space-xs) var(--space-md)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-normal)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                },
                '.gaming-modal': {
                    position: 'fixed',
                    inset: '0',
                    background: 'var(--bg-overlay)',
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 'var(--z-modal)',
                    padding: 'var(--space-md)'
                },
                '.gaming-modal-content': {
                    background: 'var(--bg-card)',
                    borderRadius: 'var(--radius-xl)',
                    maxWidth: '90vw',
                    maxHeight: '90vh',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-xl)',
                    position: 'relative'
                },
                '.gaming-header': {
                    background: 'rgba(26, 26, 46, 0.95)',
                    backdropFilter: 'blur(20px)',
                    borderBottom: '1px solid var(--border-primary)',
                    position: 'sticky',
                    top: '0',
                    zIndex: 'var(--z-sticky)',
                    padding: 'var(--space-md) 0'
                },
                '.gaming-header-content': {
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '0 var(--space-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                },
                '.gaming-logo': {
                    fontFamily: 'var(--font-gaming)',
                    fontWeight: '800',
                    fontSize: '1.5rem',
                    background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                },
                '.gaming-grid': {
                    display: 'grid',
                    gap: 'var(--space-lg)',
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '0 var(--space-md)'
                },
                '.gaming-grid-small': {
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))'
                },
                '.gaming-grid-medium': {
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))'
                },
                '.gaming-grid-large': {
                    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))'
                },
                '.gaming-search': {
                    position: 'relative',
                    maxWidth: '500px',
                    margin: '0 auto'
                },
                '.gaming-search-input': {
                    width: '100%',
                    padding: 'var(--space-md) var(--space-lg)',
                    paddingLeft: '3rem',
                    background: 'var(--bg-card)',
                    border: '2px solid var(--border-primary)',
                    borderRadius: 'var(--radius-xl)',
                    fontSize: '1rem',
                    color: 'var(--text-primary)',
                    transition: 'all var(--transition-normal)'
                },
                '.gaming-search-icon': {
                    position: 'absolute',
                    left: 'var(--space-md)',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                    fontSize: '1.125rem'
                },
                '.gaming-loading': {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 'var(--space-2xl)'
                },
                '.gaming-spinner': {
                    width: '40px',
                    height: '40px',
                    border: '3px solid var(--border-primary)',
                    borderTop: '3px solid var(--primary)',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginBottom: 'var(--space-md)'
                },
                '.gaming-loading-text': {
                    color: 'var(--text-secondary)',
                    fontFamily: 'var(--font-gaming)',
                    fontSize: '0.875rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em'
                },
                '.gaming-scrollbar': {
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'var(--border-secondary) transparent'
                },
                '.gaming-scrollbar::-webkit-scrollbar': {
                    width: '6px'
                },
                '.gaming-scrollbar::-webkit-scrollbar-track': {
                    background: 'transparent'
                },
                '.gaming-scrollbar::-webkit-scrollbar-thumb': {
                    background: 'var(--border-secondary)',
                    borderRadius: 'var(--radius-sm)'
                },
                '.gaming-scrollbar::-webkit-scrollbar-thumb:hover': {
                    background: 'var(--border-accent)'
                }
            }
            
            addUtilities(gamingUtilities)
        }
    ]
} 