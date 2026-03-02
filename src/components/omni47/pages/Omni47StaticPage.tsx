import Omni47Button from "../shared/Omni47Button";
import type { Omni47StaticPageProps } from "../types";

const Omni47StaticPage = ({
  heroImage,
  title,
  content,
  sidebar,
}: Omni47StaticPageProps) => (
  <div className="min-h-screen bg-omni47-cream pt-16 lg:pt-20">
    {/* Hero */}
    <div className="relative h-[40vh] lg:h-[50vh] overflow-hidden">
      <img src={heroImage} alt="" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-omni47-navy/50" />
      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className="font-cormorant text-[36px] lg:text-[56px] font-extralight text-white text-center">
          {title}
        </h1>
      </div>
    </div>

    {/* Content */}
    <div className="max-w-7xl mx-auto px-5 lg:px-8 py-14 lg:py-20">
      <div className={`grid grid-cols-1 ${sidebar ? "lg:grid-cols-12 gap-12" : ""}`}>
        <div className={sidebar ? "lg:col-span-8" : "max-w-3xl mx-auto"}>
          <div className="space-y-6">
            {content.map((block, i) => {
              switch (block.type) {
                case "heading":
                  const Tag = `h${block.level || 2}` as keyof JSX.IntrinsicElements;
                  return (
                    <Tag
                      key={i}
                      className={`font-cormorant font-light text-omni47-navy ${
                        block.level === 1
                          ? "text-[32px]"
                          : block.level === 3
                          ? "text-[20px]"
                          : "text-[26px]"
                      }`}
                    >
                      {block.content}
                    </Tag>
                  );
                case "paragraph":
                  return (
                    <p key={i} className="text-[14px] font-light leading-[1.9] text-omni47-text-muted">
                      {block.content}
                    </p>
                  );
                case "image":
                  return (
                    <img
                      key={i}
                      src={block.src}
                      alt={block.alt || ""}
                      className="w-full aspect-[16/9] object-cover"
                    />
                  );
                case "cta":
                  return block.button ? (
                    <div key={i} className="py-4">
                      <Omni47Button {...block.button} variant={block.button.variant || "outline"} showArrow />
                    </div>
                  ) : null;
                default:
                  return null;
              }
            })}
          </div>
        </div>

        {/* Sidebar */}
        {sidebar && (
          <aside className="lg:col-span-4 space-y-8">
            {sidebar.map((s, i) => (
              <div key={i} className="bg-white p-6">
                <h3 className="font-cormorant text-[18px] font-light text-omni47-navy mb-3">{s.title}</h3>
                <p className="text-[13px] font-light text-omni47-text-muted leading-relaxed">{s.content}</p>
              </div>
            ))}
          </aside>
        )}
      </div>
    </div>
  </div>
);

export default Omni47StaticPage;
