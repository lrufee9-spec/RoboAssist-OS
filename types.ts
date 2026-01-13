
export enum ModuleType {
  HOME = 'HOME',
  PROFILE = 'PROFILE',
  AI_CHAT = 'AI_CHAT',
  CHAT = 'CHAT',
  CONTENT = 'CONTENT',
  INBOX = 'INBOX',
  VIDEO = 'VIDEO',
  BOOKS = 'BOOKS',
  FILES = 'FILES',
  CONTROLLER = 'CONTROLLER',
  GPS = 'GPS',
  CAMERA = 'CAMERA',
  TERMINAL = 'TERMINAL',
  STORAGE = 'STORAGE',
  EXTENSIONS = 'EXTENSIONS',
  BATTERY = 'BATTERY'
}

export interface User {
  id: string;
  name: string;
  robotName: string;
  balance: number;
  avatar: string;
  fingerprintId?: string;
  robotFriends: RobotFriend[];
}

export interface RobotFriend {
  id: string;
  name: string;
  ownerName: string;
  lastSeen: Date;
  location: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'robot';
  text: string;
  timestamp: Date;
  isVoice?: boolean;
}

export interface FileItem {
  id: string;
  name: string;
  type: 'pdf' | 'jpg' | 'mp4' | 'doc';
  url: string;
}

export interface SecurityAlert {
  id: string;
  type: 'VIOLENCE' | 'AUDIO' | 'THREAT' | 'EMERGENCY' | 'BATTERY';
  severity: 'low' | 'med' | 'high';
  message: string;
  timestamp: Date;
}
