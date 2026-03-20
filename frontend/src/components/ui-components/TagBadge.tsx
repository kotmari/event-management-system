import { TAG_CONFIG } from "../../constants/tags";
interface TagProps {
  name: string;
  isSelected?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  variant?: "default" | "compact";
}

export const TagBadge = ({
  name,
  isSelected,
  onClick,
  variant = "default",
}: TagProps) => {
  const config = TAG_CONFIG[name] || TAG_CONFIG.Default;
  const Icon = config.icon;
  const isCompact = variant === "compact";

  return (
    <span
      onClick={onClick}
      title={isCompact ? name : undefined}
      style={{
        backgroundColor: isSelected ? config.border : config.bg,
        color: isSelected ? "white" : config.text,
        border: `1px solid ${config.border}`,
        borderRadius: "12px",
        padding: "4px 8px",
        fontSize: "11px",
        fontWeight: "600",
        cursor: onClick ? "pointer" : "default",
        transition: "0.2s all",
        marginRight: "5px",
        display: "inline-flex",
        gap: "3px",
      }}
      className={`
        inline-flex items-center justify-center border transition-all duration-200
        hover:scale-105 active:scale-95
        ${onClick ? "cursor-pointer" : "cursor-default"}
        ${
          isCompact
            ? "size-8 rounded-full shadow-sm"
            : "px-2 py-1 rounded-lg text-[11px] font-bold gap-1"
        }
      `}
    >
      {Icon && (
        <Icon
          size={isCompact ? 16 : 14}
          strokeWidth={2.5}
          className={isSelected ? "text-white" : ""}
        />
      )}

      {!isCompact && <span>{name}</span>}
    </span>
  );
};
