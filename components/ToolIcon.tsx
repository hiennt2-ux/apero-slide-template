// Logo công cụ: nếu có file trong /public/icons thì hiện logo thật,
// không thì hiện badge chữ cái đầu (cho công cụ chưa có logo).
// Giá trị trong map là ĐUÔI FILE (mặc định đa số là svg).
const ICON_FILES: Record<string, string> = {
  anthropic: "svg",
  antigravity: "png",
  claude: "svg",
  discord: "svg",
  git: "svg",
  github: "svg",
  gnubash: "svg",
  googlechrome: "svg",
  googledocs: "svg",
  googledrive: "svg",
  googlegemini: "svg",
  googlesheets: "svg",
  knowledge: "svg",
  linkedin: "svg",
  lovable: "svg",
  modelcontextprotocol: "svg",
  plan: "svg",
  nextdotjs: "svg",
  nodedotjs: "svg",
  npm: "svg",
  openai: "svg",
  python: "svg",
  supabase: "svg",
  vercel: "svg",
  // Logo công cụ do thám thị trường (slide 20) — favicon tải về, đuôi png.
  sensortower: "png",
  appmagic: "png",
  metaads: "png",
  tiktok: "png",
  googleads: "png",
  bigspy: "png",
  similarweb: "png",
  semrush: "png",
};

export default function ToolIcon({
  icon,
  name,
  className = "",
}: {
  icon?: string;
  name: string;
  className?: string;
}) {
  if (icon && ICON_FILES[icon]) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        className={`tool-logo ${className}`}
        src={`/icons/${icon}.${ICON_FILES[icon]}`}
        alt={name}
      />
    );
  }
  const initial = (name.trim()[0] ?? "?").toUpperCase();
  return (
    <span className={`tool-letter ${className}`} aria-label={name}>
      {initial}
    </span>
  );
}
