import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-white">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-ink-200 border-t-gold-500" />
        <p className="font-serif text-sm tracking-wider text-ink-500">AMKAS INTERNATIONAL</p>
      </motion.div>
    </div>
  );
}
