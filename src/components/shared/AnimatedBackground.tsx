import { motion } from 'framer-motion'

export function AnimatedBackground({ subtle = false }: { subtle?: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="gradient-mesh absolute inset-0 opacity-80" />
      <motion.div
        className={`absolute -left-1/4 top-0 rounded-full bg-primary/20 blur-3xl ${subtle ? 'h-[300px] w-[300px]' : 'h-[500px] w-[500px]'}`}
        animate={{ x: [0, 80, 0], y: [0, 40, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className={`absolute -right-1/4 top-1/3 rounded-full bg-cyan-500/15 blur-3xl ${subtle ? 'h-[250px] w-[250px]' : 'h-[400px] w-[400px]'}`}
        animate={{ x: [0, -60, 0], y: [0, 60, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-0 left-1/3 h-[300px] w-[400px] rounded-full bg-purple-500/10 blur-3xl"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}
