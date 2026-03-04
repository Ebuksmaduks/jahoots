import logoImg from "@/assets/logo-bg.png";

export default function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "h-10",
    md: "h-16",
    lg: "h-24",
  };

  return (
    <div className="flex items-center gap-3">
      <img src={logoImg} alt="9jahoot" className={`${sizes[size]} w-auto object-contain`} />
    </div>
  );
}
