import React from 'react';
import {
  Files,
  Scissors,
  Minimize2,
  FileText,
  Image,
  FileImage,
  RotateCw,
  Stamp,
  Hash,
  Lock,
  PenTool,
  Layers,
  Sheet,
  Presentation,
  ScanText,
  Unlock,
  Wrench,
  LucideProps,
} from 'lucide-react';

interface ToolIconProps extends LucideProps {
  name: string;
}

export const ToolIcon: React.FC<ToolIconProps> = ({ name, ...props }) => {
  switch (name) {
    case 'Files':
      return <Files {...props} />;
    case 'Scissors':
      return <Scissors {...props} />;
    case 'Minimize2':
      return <Minimize2 {...props} />;
    case 'FileText':
      return <FileText {...props} />;
    case 'Image':
      return <Image {...props} />;
    case 'FileImage':
      return <FileImage {...props} />;
    case 'RotateCw':
      return <RotateCw {...props} />;
    case 'Stamp':
      return <Stamp {...props} />;
    case 'Hash':
      return <Hash {...props} />;
    case 'Lock':
      return <Lock {...props} />;
    case 'PenTool':
      return <PenTool {...props} />;
    case 'Layers':
      return <Layers {...props} />;
    case 'Sheet':
      return <Sheet {...props} />;
    case 'Presentation':
      return <Presentation {...props} />;
    case 'ScanText':
      return <ScanText {...props} />;
    case 'Unlock':
      return <Unlock {...props} />;
    case 'Wrench':
      return <Wrench {...props} />;
    default:
      return <FileText {...props} />;
  }
};
