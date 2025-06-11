export interface UserInfo {
  computerName: string;
  ipAddress: string;
  country: string;
  status: string;
  lastActiveTime: string;
  additionalSystemDetails: string;
}

export interface TransferModalProps {
  isOpen: boolean;
  user: UserInfo;
  onClose: () => void;
  commandOptions: string[];
}

export interface Task {
  id: string;
  name: string;
  command: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  stdout?: string;
  stderr?: string;
  exitCode?: number | null;
  createdAt: string;
  startedAt?: string | null;
  completedAt?: string | null;
}

export interface ClientInfo {
  id: string;
  ipAddress: string;
  operatingSystem: string;
  region: string;
  isAdmin: boolean;
  status: string;
}
