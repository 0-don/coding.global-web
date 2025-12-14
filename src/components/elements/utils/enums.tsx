import { Badge, badgeVariants } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { type VariantProps } from "class-variance-authority";
import { useTranslations } from "next-intl";
import { IconType } from "react-icons";
import { FaBug, FaCode, FaCrown } from "react-icons/fa";
import { HiMiniSparkles } from "react-icons/hi2";
import { MdHelpCenter, MdSupportAgent } from "react-icons/md";
import { TbCodeDots } from "react-icons/tb";

export enum StaffRole {
  OWNER = "Owner",
  MODERATOR = "Moderator",
  ADMIN = "Admin",
  HELPER = "Helper",
  TECHLEAD = "Techlead",
  BOOSTER = "Booster",
}

export enum MemberStatus {
  ONLINE = "online",
  IDLE = "idle",
  DND = "dnd",
  OFFLINE = "offline",
}

export type MemberRole = {
  role: StaffRole;
  color: string;
  Icon: IconType;
};

export const STAFF_ROLES: MemberRole[] = [
  {
    role: StaffRole.OWNER,
    color: "text-red-500",
    Icon: FaCrown,
  },
  {
    role: StaffRole.MODERATOR,
    color: "text-green-500",
    Icon: FaBug,
  },
  {
    role: StaffRole.ADMIN,
    color: "text-yellow-500",
    Icon: FaCode,
  },
  {
    role: StaffRole.HELPER,
    color: "text-blue-500",
    Icon: MdHelpCenter,
  },
  {
    role: StaffRole.TECHLEAD,
    color: "text-orange-500",
    Icon: MdSupportAgent,
  },
  {
    role: StaffRole.BOOSTER,
    color: "text-pink-600",
    Icon: HiMiniSparkles,
  },
];

export const RoleIcon = (props: {
  role: StaffRole;
  className?: string;
  showText?: boolean;
  textClassName?: string;
}) => {
  const roleData = STAFF_ROLES.find((r) => r.role === props.role);
  const IconComponent = roleData?.Icon || TbCodeDots;

  return (
    <>
      <IconComponent className={cn(roleData?.color, props.className)} />
      {props.showText && (
        <p className={cn(props.textClassName)}>{props.role}</p>
      )}
    </>
  );
};

export const RoleBadgeIcon = (props: {
  role: StaffRole;
  className?: string;
  iconOnly?: boolean;
}) => {
  const variant: VariantProps<typeof badgeVariants>["variant"] = props.role
    ? "outline"
    : "destructive";

  return (
    <Badge
      variant={variant}
      title={props.role}
      className={cn(
        props.className,
        "flex items-center justify-center gap-1 truncate",
      )}
    >
      <RoleIcon role={props.role} />
      {!props.iconOnly && props.role}
    </Badge>
  );
};

export const StatusIndicator = (props: {
  status: MemberStatus;
  className?: string;
}) => {
  const t = useTranslations("DISCORD_WIDGET");

  const STATUS_COLORS: Record<MemberStatus, string> = {
    [MemberStatus.ONLINE]: "bg-green-500",
    [MemberStatus.IDLE]: "bg-yellow-500",
    [MemberStatus.DND]: "bg-red-500",
    [MemberStatus.OFFLINE]: "bg-muted-foreground",
  };

  return (
    <span
      className={cn(
        "border-card absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2",
        STATUS_COLORS[props.status] || STATUS_COLORS[MemberStatus.OFFLINE],
        props.className,
      )}
      aria-label={t(
        `STATUS.${props.status.toUpperCase() as Uppercase<MemberStatus>}`,
      )}
    />
  );
};
