// Code icon "</>" used by the generated favicon and Apple touch icon.
// Colors are the hex values of the site tokens --accent (oklch(0.56 0.18 42))
// and --paper (oklch(0.975 0.004 70)), since ImageResponse does not support OKLCH.
const ACCENT = "#c64200";
const PAPER = "#f8f6f4";

export default function BrandMark({ size, radius }: { size: number; radius: number }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: ACCENT,
        borderRadius: radius,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <path
          d="M11 10 L5 16 L11 22 M21 10 L27 16 L21 22 M18.5 7.5 L13.5 24.5"
          stroke={PAPER}
          strokeWidth={3.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
