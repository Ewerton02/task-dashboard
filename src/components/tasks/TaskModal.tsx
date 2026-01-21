import { memo, useCallback } from 'react';
import { useModalStore } from '@/stores';
import { Modal } from '@/components/ui';
import { TaskForm } from './TaskForm';

export const TaskModal = memo(function TaskModal() {
  const { isOpen, editingTask, closeModal } = useModalStore();

  const handleSuccess = useCallback(() => {
    closeModal();
  }, [closeModal]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      title={editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}
    >
      <TaskForm task={editingTask} onSuccess={handleSuccess} />
    </Modal>
  );
});
