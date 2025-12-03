// Import Lucide icons
import {
  Shield,
  Menu,
  Home,
  User,
  Briefcase,
  Mail,
  MapPin,
  Star,
  ChevronLeft,
  ChevronRight,
  Smartphone,
  Wifi,
  Zap,
  Camera,
  Lock,
  Globe,
  Server,
  Sun,
  Battery,
  Settings,
  Monitor,
  Lightbulb,
  Thermometer,
  Phone,
  CheckCircle,
  ArrowRight,
  Filter,
  Search,
  Clock,
  Users,
  Target,
  Award,
  TrendingUp,
  Calendar,
  MessageSquare,
  FileText,
  Download,
  Eye,
  Heart,
  Building
} from 'lucide';

// Icon mapping for easy access
export const icons = {
  shield: Shield,
  menu: Menu,
  home: Home,
  user: User,
  briefcase: Briefcase,
  mail: Mail,
  mapPin: MapPin,
  star: Star,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  smartphone: Smartphone,
  wifi: Wifi,
  zap: Zap,
  camera: Camera,
  lock: Lock,
  globe: Globe,
  server: Server,
  sun: Sun,
  battery: Battery,
  settings: Settings,
  monitor: Monitor,
  lightbulb: Lightbulb,
  thermometer: Thermometer,
  phone: Phone,
  checkCircle: CheckCircle,
  arrowRight: ArrowRight,
  filter: Filter,
  search: Search,
  clock: Clock,
  users: Users,
  target: Target,
  award: Award,
  trendingUp: TrendingUp,
  calendar: Calendar,
  messageSquare: MessageSquare,
  fileText: FileText,
  download: Download,
  eye: Eye,
  heart: Heart,
  building: Building
};

// Function to create and insert icon
export function createIcon(iconName, className = '', size = 24) {
  const IconComponent = icons[iconName];
  if (!IconComponent) {
    console.warn(`Icon "${iconName}" not found`);
    return null;
  }

  const iconElement = IconComponent.cloneNode ? IconComponent : new IconComponent();
  const svg = iconElement instanceof SVGElement ? iconElement : iconElement.render();

  // Set attributes
  svg.setAttribute('width', size);
  svg.setAttribute('height', size);
  if (className) {
    svg.setAttribute('class', className);
  }

  return svg;
}

// Function to replace SVG with icon by selector
export function replaceIcon(selector, iconName, className = '', size = 24) {
  const elements = document.querySelectorAll(selector);
  elements.forEach(element => {
    const icon = createIcon(iconName, className, size);
    if (icon) {
      element.replaceWith(icon);
    }
  });
}

// Initialize icons when DOM is loaded
export function initIcons() {
  // Replace common icons across all pages
  replaceIcon('.logo svg', 'shield', 'w-8 h-8 text-white');
  replaceIcon('.mobile-menu-button svg', 'menu', 'w-6 h-6');

  // Page-specific icon replacements will be handled in individual page scripts
}