import * as Icons from 'lucide-react';
import { LucideProps } from 'lucide-react';

interface AmenityIconProps extends LucideProps {
  name: string;
}

export default function AmenityIcon({ name, ...props }: AmenityIconProps) {
  const Icon = (Icons as any)[name];
  
  if (!Icon) {
    return <Icons.HelpCircle {...props} />;
  }

  return <Icon {...props} />;
}
