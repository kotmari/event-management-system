import {
  Cpu,
  Palette,
  Briefcase,
  Music,
  Heart,
  Coffee,
  Hash,
  LayoutGrid,
} from "lucide-react";

export const TAG_CONFIG: Record<
  string,
  { bg: string; text: string; border: string; icon: any }
> = {
  All: { bg: "#76767d", text: "#111827", border: "#3b3b3f", icon: LayoutGrid },
  Technology: { bg: "#EBF8FF", text: "#2B6CB0", border: "#4299E1", icon: Cpu },
  Art: { bg: "#FFF5F7", text: "#9B2C2C", border: "#F687B3", icon: Palette },
  Business: {
    bg: "#FFFFF0",
    text: "#744210",
    border: "#ECC94B",
    icon: Briefcase,
  },
  Music: { bg: "#FAF5FF", text: "#553C9A", border: "#9F7AEA", icon: Music },
  Health: { bg: "#F0FFF4", text: "#22543D", border: "#48BB78", icon: Heart },
  Leisure: { bg: "#F7FAFC", text: "#2D3748", border: "#E2E8F0", icon: Coffee },
  Default: { bg: "#d6dbda", text: "#4B5563", border: "#CBD5E0", icon: Hash },
};
