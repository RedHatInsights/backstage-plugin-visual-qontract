export type Change = {
  commit: string;
  merged_at: string;
  change_types: string[];
  error: boolean;
  apps: string[];
};

export type ChangeTableProps = {
  changes: Change[];
};
