export interface Task {
  id: string;
  name: string;
  assignedTo: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export type TaskDraft = Pick<Task, 'name' | 'assignedTo' | 'description'>;

export interface TaskTamerFile {
  version: string;
  createdAt: string;
  tasks: Task[];
}
