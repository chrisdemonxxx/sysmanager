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
