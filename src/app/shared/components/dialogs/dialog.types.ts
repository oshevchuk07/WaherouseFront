export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export interface PromptDialogData {
  title: string;
  message?: string;
  label: string;
  placeholder?: string;
  initialValue?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  validators?: PromptValidator[];
}

export interface PromptValidator {
  validate: (value: string) => boolean;
  message: string;
}
