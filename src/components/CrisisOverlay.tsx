import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, HeartHandshake, ShieldAlert, X, Eye, Wind } from 'lucide-react';
interface CrisisOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToBreathing: () => void;
}
export function CrisisOverlay({
  isOpen,
  onClose,
  onNavigateToBreathing
}: CrisisOverlayProps) {
  return (
    <AnimatePresence>
      {isOpen &&
      <motion.div
        initial={{
          opacity: 0
        }}
        animate={{
          opacity: 1
        }}
        exit={{
          opacity: 0
        }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
        
          {/* Gentle red-to-pink background overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-rose-100/95 to-pink-50/95 dark:from-rose-950/95 dark:to-pink-900/95 backdrop-blur-md" />

          <motion.div
          initial={{
            scale: 0.95,
            y: 20
          }}
          animate={{
            scale: 1,
            y: 0
          }}
          exit={{
            scale: 0.95,
            y: 20
          }}
          className="relative w-full max-w-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-rose-200 dark:border-rose-800 p-8 sm:p-12 overflow-y-auto max-h-[90vh]">
          
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <HeartHandshake className="w-8 h-8 text-rose-600 dark:text-rose-400" />
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-slate-900 dark:text-white mb-4">
                You are not alone.
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Support is available right now. We're here to help you through
                this moment.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              <button className="flex items-center gap-4 p-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white transition-colors group">
                <div className="p-2 bg-white/20 rounded-xl group-hover:scale-110 transition-transform">
                  <Phone className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">Emergency Helpline</div>
                  <div className="text-rose-100 text-sm">Call 988 (US)</div>
                </div>
              </button>

              <button className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800 hover:bg-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 text-white transition-colors group">
                <div className="p-2 bg-white/10 rounded-xl group-hover:scale-110 transition-transform">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">Crisis Text Line</div>
                  <div className="text-slate-300 text-sm">
                    Text HOME to 741741
                  </div>
                </div>
              </button>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-6 sm:p-8 mb-8 border border-slate-100 dark:border-slate-700">
              <h3 className="font-heading font-medium text-lg text-slate-900 dark:text-white mb-6 text-center">
                Grounding Techniques
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white dark:bg-slate-800 shadow-sm">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400 mt-1">
                    <Eye className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white mb-1">
                      5-4-3-2-1 Method
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Look around and name 5 things you can see, 4 you can
                      touch, 3 you can hear, 2 you can smell, and 1 you can
                      taste.
                    </p>
                  </div>
                </div>

                <button
                onClick={() => {
                  onClose();
                  onNavigateToBreathing();
                }}
                className="w-full flex items-start gap-4 p-4 rounded-2xl bg-white dark:bg-slate-800 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-colors text-left">
                
                  <div className="p-2 bg-teal-50 dark:bg-teal-900/30 rounded-xl text-teal-600 dark:text-teal-400 mt-1">
                    <Wind className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white mb-1">
                      Guided Breathing
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Take slow, deep breaths with me. Click here to start a
                      calming breathing exercise.
                    </p>
                  </div>
                </button>
              </div>
            </div>

            <div className="text-center">
              <button
              onClick={onClose}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              
                <X className="w-4 h-4" />
                <span>I'm feeling safer now, return to app</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      }
    </AnimatePresence>);

}