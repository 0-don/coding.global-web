import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { IconType } from "react-icons";
import {
  FaBriefcase,
  FaBug,
  FaChartLine,
  FaCode,
  FaCrown,
  FaGraduationCap,
  FaLock,
  FaMicrophone,
  FaRocket,
  FaUserCheck,
  FaUsers,
  FaUserTie,
} from "react-icons/fa";
import { GiMusicalNotes } from "react-icons/gi";
import { HiMiniSparkles } from "react-icons/hi2";
import { MdHelpCenter, MdSupportAgent } from "react-icons/md";
import { RiScissorsCutFill } from "react-icons/ri";
import { TbCodeDots, TbCopy } from "react-icons/tb";

export enum StaffRole {
  OWNER = "Owner",
  MODERATOR = "Moderator",
  ADMIN = "Admin",
  HELPER = "Helper",
  TECHLEAD = "Techlead",
  BOOSTER = "Booster",
}

export enum StatusRole {
  MEMBER = "Member",
  VERIFIED = "Verified",
  VOICEONLY = "VoiceOnly",
  JAIL = "Jail",
}

export enum LevelRole {
  COPY_PASTER = "Copy Paster!",
  SCRIPT_KIDDIE = "Script Kiddie!",
  VIBE_CODER = "Vibe Coder!",
  INTERN = "Intern!",
  JUNIOR_DEV = "Junior Dev!",
  MID_DEV = "Mid Dev!",
  SENIOR_DEV = "Senior Dev!",
  LEAD_DEV = "Lead Dev!",
  TECH_LEAD = "Tech Lead!",
}

export enum MemberStatus {
  ONLINE = "online",
  IDLE = "idle",
  DND = "dnd",
  OFFLINE = "offline",
}

export type StaffRoleData = {
  role: StaffRole;
  color: string;
  Icon: IconType;
};

export type StatusRoleData = {
  role: StatusRole;
  color: string;
  Icon: IconType;
};

export type LevelRoleData = {
  role: LevelRole;
  color: string;
  Icon: IconType;
  level: number;
};

export const STAFF_ROLES: StaffRoleData[] = [
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

export const STATUS_ROLES: StatusRoleData[] = [
  {
    role: StatusRole.MEMBER,
    color: "text-blue-500",
    Icon: FaUsers,
  },
  {
    role: StatusRole.VERIFIED,
    color: "text-green-500",
    Icon: FaUserCheck,
  },
  {
    role: StatusRole.VOICEONLY,
    color: "text-purple-500",
    Icon: FaMicrophone,
  },
  {
    role: StatusRole.JAIL,
    color: "text-red-500",
    Icon: FaLock,
  },
];

export const LEVEL_ROLES: LevelRoleData[] = [
  {
    role: LevelRole.COPY_PASTER,
    color: "text-gray-400",
    Icon: TbCopy,
    level: 1,
  },
  {
    role: LevelRole.SCRIPT_KIDDIE,
    color: "text-slate-400",
    Icon: RiScissorsCutFill,
    level: 2,
  },
  {
    role: LevelRole.VIBE_CODER,
    color: "text-purple-400",
    Icon: GiMusicalNotes,
    level: 3,
  },
  {
    role: LevelRole.INTERN,
    color: "text-blue-400",
    Icon: FaGraduationCap,
    level: 4,
  },
  {
    role: LevelRole.JUNIOR_DEV,
    color: "text-cyan-400",
    Icon: FaCode,
    level: 5,
  },
  {
    role: LevelRole.MID_DEV,
    color: "text-green-400",
    Icon: FaBriefcase,
    level: 6,
  },
  {
    role: LevelRole.SENIOR_DEV,
    color: "text-yellow-400",
    Icon: FaUserTie,
    level: 7,
  },
  {
    role: LevelRole.LEAD_DEV,
    color: "text-orange-400",
    Icon: FaChartLine,
    level: 8,
  },
  {
    role: LevelRole.TECH_LEAD,
    color: "text-red-400",
    Icon: FaRocket,
    level: 9,
  },
];

export const StaffRoleIcon = (props: {
  role: StaffRole;
  className?: string;
  showText?: boolean;
  textClassName?: string;
}) => {
  const roleData = STAFF_ROLES.find(
    (r) => r.role.toLowerCase() === props.role.toLowerCase(),
  );
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

export const StaffRoleBadgeIcon = (props: {
  role: StaffRole;
  className?: string;
  iconOnly?: boolean;
}) => {
  return (
    <Badge
      variant="outline"
      title={props.role}
      className={cn(
        props.className,
        "flex items-center justify-center gap-1 truncate",
      )}
    >
      <StaffRoleIcon role={props.role} />
      {!props.iconOnly && props.role}
    </Badge>
  );
};

export const StatusRoleIcon = (props: {
  role: StatusRole;
  className?: string;
  showText?: boolean;
  textClassName?: string;
}) => {
  const roleData = STATUS_ROLES.find(
    (r) => r.role.toLowerCase() === props.role.toLowerCase(),
  );
  const IconComponent = roleData?.Icon || FaUserCheck;

  return (
    <>
      <IconComponent className={cn(roleData?.color, props.className)} />
      {props.showText && (
        <p className={cn(props.textClassName)}>{props.role}</p>
      )}
    </>
  );
};

export const StatusRoleBadgeIcon = (props: {
  role: StatusRole;
  className?: string;
  iconOnly?: boolean;
}) => {
  return (
    <Badge
      variant="outline"
      title={props.role}
      className={cn(
        props.className,
        "flex items-center justify-center gap-1 truncate",
      )}
    >
      <StatusRoleIcon role={props.role} />
      {!props.iconOnly && props.role}
    </Badge>
  );
};

export const LevelRoleIcon = (props: {
  role: LevelRole;
  className?: string;
  showText?: boolean;
  textClassName?: string;
}) => {
  const roleData = LEVEL_ROLES.find(
    (r) => r.role.toLowerCase() === props.role.toLowerCase(),
  );
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

export const LevelRoleBadgeIcon = (props: {
  role: LevelRole;
  className?: string;
  iconOnly?: boolean;
}) => {
  const roleData = LEVEL_ROLES.find(
    (r) => r.role.toLowerCase() === props.role.toLowerCase(),
  );

  return (
    <Badge
      variant="outline"
      title={`${props.role} (Level ${roleData?.level})`}
      className={cn(
        props.className,
        "flex items-center justify-center gap-1 truncate",
      )}
    >
      <LevelRoleIcon role={props.role} />
      {!props.iconOnly && props.role}
    </Badge>
  );
};

// Overlapping RoleIcon component that handles any role type
export const RoleIcon = (props: {
  role: StaffRole | StatusRole | LevelRole;
  className?: string;
  showText?: boolean;
  textClassName?: string;
}) => {
  // Check if it's a StaffRole
  const staffRoleData = STAFF_ROLES.find(
    (r) => r.role.toLowerCase() === props.role.toLowerCase(),
  );
  if (staffRoleData) {
    return (
      <StaffRoleIcon
        role={props.role as StaffRole}
        className={props.className}
        showText={props.showText}
        textClassName={props.textClassName}
      />
    );
  }

  // Check if it's a StatusRole
  const statusRoleData = STATUS_ROLES.find(
    (r) => r.role.toLowerCase() === props.role.toLowerCase(),
  );
  if (statusRoleData) {
    return (
      <StatusRoleIcon
        role={props.role as StatusRole}
        className={props.className}
        showText={props.showText}
        textClassName={props.textClassName}
      />
    );
  }

  // Check if it's a LevelRole
  const levelRoleData = LEVEL_ROLES.find(
    (r) => r.role.toLowerCase() === props.role.toLowerCase(),
  );
  if (levelRoleData) {
    return (
      <LevelRoleIcon
        role={props.role as LevelRole}
        className={props.className}
        showText={props.showText}
        textClassName={props.textClassName}
      />
    );
  }

  // Default fallback
  return (
    <>
      <TbCodeDots className={cn("text-gray-500", props.className)} />
      {props.showText && (
        <p className={cn(props.textClassName)}>{props.role}</p>
      )}
    </>
  );
};

// Overlapping RoleBadgeIcon component that handles any role type
export const RoleBadgeIcon = (props: {
  role: StaffRole | StatusRole | LevelRole;
  className?: string;
  iconOnly?: boolean;
}) => {
  // Check if it's a StaffRole
  const staffRoleData = STAFF_ROLES.find(
    (r) => r.role.toLowerCase() === props.role.toLowerCase(),
  );
  if (staffRoleData) {
    return (
      <StaffRoleBadgeIcon
        role={props.role as StaffRole}
        className={props.className}
        iconOnly={props.iconOnly}
      />
    );
  }

  // Check if it's a StatusRole
  const statusRoleData = STATUS_ROLES.find(
    (r) => r.role.toLowerCase() === props.role.toLowerCase(),
  );
  if (statusRoleData) {
    return (
      <StatusRoleBadgeIcon
        role={props.role as StatusRole}
        className={props.className}
        iconOnly={props.iconOnly}
      />
    );
  }

  // Check if it's a LevelRole
  const levelRoleData = LEVEL_ROLES.find(
    (r) => r.role.toLowerCase() === props.role.toLowerCase(),
  );
  if (levelRoleData) {
    return (
      <LevelRoleBadgeIcon
        role={props.role as LevelRole}
        className={props.className}
        iconOnly={props.iconOnly}
      />
    );
  }

  // Default fallback
  return (
    <Badge
      variant="outline"
      title={props.role}
      className={cn(
        props.className,
        "flex items-center justify-center gap-1 truncate",
      )}
    >
      <TbCodeDots className="text-gray-500" />
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
