export type ContextMenuItem = {
  id: string;
  label: string;
  onSelect?: () => void;
  tone?: 'primary' | 'default';
  disabled?: boolean;
  disabledReason?: string;
};

export type ContextMenuState =
  | {
      x: number;
      y: number;
      items: ContextMenuItem[];
      label: string;
    }
  | null;
