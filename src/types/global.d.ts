declare module 'clsx' {
  export default function clsx(...args: any[]): string;
}

declare module 'lucide-react' {
  import { ComponentType } from 'react';

  interface IconProps {
    color?: string;
    size?: string | number;
    className?: string;
    [key: string]: any;
  }

  export const Home: ComponentType<IconProps>;
  export const Users: ComponentType<IconProps>;
  export const Clock: ComponentType<IconProps>;
  export const Wrench: ComponentType<IconProps>;
  export const Briefcase: ComponentType<IconProps>;
  export const Car: ComponentType<IconProps>;
  export const Calendar: ComponentType<IconProps>;
  export const Coffee: ComponentType<IconProps>;
  export const Hotel: ComponentType<IconProps>;
  export const Navigation: ComponentType<IconProps>;
  export const UserCheck: ComponentType<IconProps>;
  export const FileText: ComponentType<IconProps>;
  export const DollarSign: ComponentType<IconProps>;
  export const ShoppingCart: ComponentType<IconProps>;
  export const Newspaper: ComponentType<IconProps>;
  export const Scale: ComponentType<IconProps>;
  export const Contact: ComponentType<IconProps>;
  export const Settings: ComponentType<IconProps>;
  export const Menu: ComponentType<IconProps>;
  export const X: ComponentType<IconProps>;
  export const Moon: ComponentType<IconProps>;
  export const Sun: ComponentType<IconProps>;
  export const ChevronDown: ComponentType<IconProps>;
  export const ChevronRight: ComponentType<IconProps>;
  export const LayoutGrid: ComponentType<IconProps>;
  export const Timer: ComponentType<IconProps>;
  export const Building: ComponentType<IconProps>;
  export const PartyPopper: ComponentType<IconProps>;
  export const Search: ComponentType<IconProps>;
  export const Info: ComponentType<IconProps>;
}

// Déclaration JSX
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

// Ajout de React-JSX
declare namespace React {
  interface JSX {
    IntrinsicElements: {
      [elemName: string]: any;
    };
  }
}

// Déclarer les modules Radix UI
declare module '@radix-ui/react-accordion' {
  export const Root: React.FC<{
    type: 'single' | 'multiple';
    defaultValue?: string;
    collapsible?: boolean;
    className?: string;
    children: React.ReactNode;
  }>;
  export const Item: React.FC<{
    value: string;
    className?: string;
    children: React.ReactNode;
  }>;
  export const Header: React.FC<{
    className?: string;
    children: React.ReactNode;
  }>;
  export const Trigger: React.FC<{
    className?: string;
    children: React.ReactNode;
  }>;
  export const Content: React.FC<{
    className?: string;
    children: React.ReactNode;
  }>;
}

declare module '@radix-ui/react-popover' {
  export const Root: React.FC<{
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children: React.ReactNode;
  }>;
  export const Trigger: React.FC<{
    asChild?: boolean;
    children: React.ReactNode;
  }>;
  export const Portal: React.FC<{
    children: React.ReactNode;
  }>;
  export const Content: React.FC<{
    className?: string;
    align?: 'start' | 'center' | 'end';
    sideOffset?: number;
    onInteractOutside?: (e: any) => void;
    children: React.ReactNode;
  }>;
}

declare module 'cmdk' {
  export const Command: React.FC<{
    className?: string;
    children: React.ReactNode;
  }> & {
    List: React.FC<{
      className?: string;
      children: React.ReactNode;
    }>;
    Item: React.FC<{
      key?: string | number;
      value?: string;
      onSelect?: (value: string) => void;
      className?: string;
      children: React.ReactNode;
    }>;
    Empty: React.FC<{
      className?: string;
      children: React.ReactNode;
    }>;
  };
} 