import { memo } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Plus, CheckSquare } from 'lucide-react';
import { useThemeStore, useModalStore } from '@/stores';
import { Button } from '@/components/ui';
import type { Task } from '@/types';

interface HeaderProps {
  tasks?: Task[];
}

export const Header = memo(function Header({ tasks }: HeaderProps) {
  const { isDark, toggleTheme } = useThemeStore();
  const { openModal } = useModalStore();

  const totalTasks = tasks?.length ?? 0;
  const completedTasks = tasks?.filter((t) => t.status === 'completed').length ?? 0;

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Stats */}
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ rotate: -10 }}
              animate={{ rotate: 0 }}
              className="flex items-center gap-2"
            >
              <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                <CheckSquare className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Dashboard de Tarefas
              </h1>
            </motion.div>

            {/* Stats badge */}
            {totalTasks > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="hidden sm:flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm"
              >
                <span className="text-gray-600 dark:text-gray-400">
                  {completedTasks}/{totalTasks} concluídas
                </span>
                <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(completedTasks / totalTasks) * 100}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="h-full bg-green-500 rounded-full"
                  />
                </div>
              </motion.div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
            >
              <motion.div
                initial={false}
                animate={{ rotate: isDark ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </motion.div>
            </motion.button>

            {/* New task button */}
            <Button
              onClick={() => openModal()}
              leftIcon={<Plus size={18} />}
            >
              Nova Tarefa
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
});
