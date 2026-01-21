import { Header } from '@/components/layout';
import { TaskList, TaskFilters, TaskModal } from '@/components/tasks';
import { useTasks } from '@/hooks';

function App() {
  const { data: tasks, isLoading, isError } = useTasks();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header tasks={tasks} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isError && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
            Erro ao carregar tasks. Tente novamente mais tarde.
          </div>
        )}

        <div className="mb-6">
          <TaskFilters />
        </div>

        <TaskList tasks={tasks} isLoading={isLoading} />
      </main>

      <TaskModal />
    </div>
  );
}

export default App;
