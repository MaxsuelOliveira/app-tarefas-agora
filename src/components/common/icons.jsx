import Svg, { Circle, Line, Path, Polyline, Rect } from "react-native-svg";

function IconBase({
  children,
  color = "currentColor",
  size = 24,
  strokeWidth = 2,
  ...props
}) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </Svg>
  );
}

export function AlertTriangle(props) {
  return (
    <IconBase {...props}>
      <Path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
      <Line x1="12" y1="9" x2="12" y2="13" />
      <Line x1="12" y1="17" x2="12.01" y2="17" />
    </IconBase>
  );
}

export function Bell(props) {
  return (
    <IconBase {...props}>
      <Path d="M10.27 21a2 2 0 0 0 3.46 0" />
      <Path d="M3.26 15a1 1 0 0 0 .76 1.63h15.96a1 1 0 0 0 .76-1.63C19.38 13.5 18 11.28 18 8a6 6 0 1 0-12 0c0 3.28-1.38 5.5-2.74 7Z" />
    </IconBase>
  );
}

export function BellRing(props) {
  return (
    <IconBase {...props}>
      <Path d="M10.27 21a2 2 0 0 0 3.46 0" />
      <Path d="M3.26 15a1 1 0 0 0 .76 1.63h15.96a1 1 0 0 0 .76-1.63C19.38 13.5 18 11.28 18 8a6 6 0 1 0-12 0c0 3.28-1.38 5.5-2.74 7Z" />
      <Path d="M4 2C2.8 3.7 2 5.7 2 8" />
      <Path d="M20 8c0-2.3-.8-4.3-2-6" />
    </IconBase>
  );
}

export function CalendarDays(props) {
  return (
    <IconBase {...props}>
      <Rect x="3" y="4" width="18" height="18" rx="2" />
      <Line x1="16" y1="2" x2="16" y2="6" />
      <Line x1="8" y1="2" x2="8" y2="6" />
      <Line x1="3" y1="10" x2="21" y2="10" />
      <Line x1="8" y1="14" x2="8" y2="14" />
      <Line x1="12" y1="14" x2="12" y2="14" />
      <Line x1="16" y1="14" x2="16" y2="14" />
      <Line x1="8" y1="18" x2="8" y2="18" />
      <Line x1="12" y1="18" x2="12" y2="18" />
      <Line x1="16" y1="18" x2="16" y2="18" />
    </IconBase>
  );
}

export function ClipboardList(props) {
  return (
    <IconBase {...props}>
      <Rect x="6" y="4" width="12" height="16" rx="2" />
      <Path d="M9 4.5h6" />
      <Path d="M9 9h6" />
      <Path d="M9 13h6" />
      <Path d="M9 17h4" />
      <Path d="M9 2h6v3H9z" />
    </IconBase>
  );
}

export function CheckCheck(props) {
  return (
    <IconBase {...props}>
      <Polyline points="18 6 7 17 2 12" />
      <Polyline points="22 10 13.5 18.5 11 16" />
    </IconBase>
  );
}

export function ChevronRight(props) {
  return (
    <IconBase {...props}>
      <Polyline points="9 18 15 12 9 6" />
    </IconBase>
  );
}

export function Clock3(props) {
  return (
    <IconBase {...props}>
      <Circle cx="12" cy="12" r="9" />
      <Polyline points="12 7 12 12 16 12" />
    </IconBase>
  );
}

export function House(props) {
  return (
    <IconBase {...props}>
      <Path d="M3 10.5 12 3l9 7.5" />
      <Path d="M5 9.5V20h14V9.5" />
      <Path d="M10 20v-5h4v5" />
    </IconBase>
  );
}

export function Pencil(props) {
  return (
    <IconBase {...props}>
      <Path d="M12 20h9" />
      <Path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4Z" />
    </IconBase>
  );
}

export function Plus(props) {
  return (
    <IconBase {...props}>
      <Line x1="12" y1="5" x2="12" y2="19" />
      <Line x1="5" y1="12" x2="19" y2="12" />
    </IconBase>
  );
}

export function Save(props) {
  return (
    <IconBase {...props}>
      <Path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
      <Path d="M17 21v-8H7v8" />
      <Path d="M7 3v5h8" />
    </IconBase>
  );
}

export function ShieldAlert(props) {
  return (
    <IconBase {...props}>
      <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <Line x1="12" y1="8" x2="12" y2="12" />
      <Line x1="12" y1="16" x2="12.01" y2="16" />
    </IconBase>
  );
}

export function Sparkles(props) {
  return (
    <IconBase {...props}>
      <Path d="m12 3 1.9 3.9L18 9l-4.1 2.1L12 15l-1.9-3.9L6 9l4.1-2.1Z" />
      <Path d="M5 3v4" />
      <Path d="M3 5h4" />
      <Path d="M19 16v5" />
      <Path d="M16.5 18.5h5" />
    </IconBase>
  );
}

export function Tag(props) {
  return (
    <IconBase {...props}>
      <Path d="M20.59 13.41 11 3.83A2 2 0 0 0 9.59 3H4a1 1 0 0 0-1 1v5.59A2 2 0 0 0 3.59 11l9.58 9.59a2 2 0 0 0 2.83 0l4.59-4.59a2 2 0 0 0 0-2.83Z" />
      <Circle
        cx="7.5"
        cy="7.5"
        r=".5"
        fill={props.color || "currentColor"}
        stroke="none"
      />
    </IconBase>
  );
}

export function Trash2(props) {
  return (
    <IconBase {...props}>
      <Path d="M3 6h18" />
      <Path d="M8 6V4h8v2" />
      <Path d="M19 6l-1 14H6L5 6" />
      <Line x1="10" y1="11" x2="10" y2="17" />
      <Line x1="14" y1="11" x2="14" y2="17" />
    </IconBase>
  );
}

export function Type(props) {
  return (
    <IconBase {...props}>
      <Path d="M4 7V4h16v3" />
      <Path d="M9 20h6" />
      <Path d="M12 4v16" />
    </IconBase>
  );
}

export function UserRound(props) {
  return (
    <IconBase {...props}>
      <Circle cx="12" cy="8" r="4" />
      <Path d="M4 20a8 8 0 0 1 16 0" />
    </IconBase>
  );
}

export function UserRoundPlus(props) {
  return (
    <IconBase {...props}>
      <Circle cx="10" cy="8" r="4" />
      <Path d="M2 20a8 8 0 0 1 12.2-6.9" />
      <Line x1="19" y1="8" x2="19" y2="14" />
      <Line x1="16" y1="11" x2="22" y2="11" />
    </IconBase>
  );
}
