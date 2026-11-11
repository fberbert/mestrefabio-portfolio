import { ImageResponse } from "next/og";
import BrandMark from "@/components/brand-mark";

export const runtime = "edge";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

// iOS applies its own rounded mask, so the square stays unrounded here.
export default function AppleIcon() {
  return new ImageResponse(<BrandMark size={150} radius={0} />, { ...size });
}
