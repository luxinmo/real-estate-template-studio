import { ArrowLeft, Share2, Facebook, Twitter, Linkedin } from "lucide-react";
import type { Omni47BlogPostPageProps } from "../types";

const Omni47BlogPostPage = ({
  heroImage,
  title,
  author,
  date,
  category,
  readTime,
  content,
  relatedPosts,
  shareUrl,
}: Omni47BlogPostPageProps) => (
  <div className="min-h-screen bg-omni47-cream pt-16 lg:pt-20">
    {/* Hero */}
    <div className="relative h-[50vh] lg:h-[60vh] overflow-hidden">
      <img src={heroImage} alt="" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-omni47-navy/80 via-omni47-navy/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-16">
        <div className="max-w-3xl mx-auto">
          <span className="text-[11px] tracking-[0.2em] uppercase text-omni47-gold font-light">
            {category}
          </span>
          <h1 className="font-cormorant text-[32px] lg:text-[48px] font-extralight text-white mt-3 leading-[1.1]">
            {title}
          </h1>
        </div>
      </div>
    </div>

    {/* Meta */}
    <div className="max-w-3xl mx-auto px-5 lg:px-8 py-8 flex flex-wrap items-center gap-4 text-[12px] text-omni47-text-muted border-b border-omni47-cream-dark">
      <span>{author}</span>
      <span className="text-omni47-cream-dark">·</span>
      <span>{date}</span>
      <span className="text-omni47-cream-dark">·</span>
      <span>{readTime}</span>
      <span className="text-omni47-cream-dark">·</span>
      <span className="text-omni47-gold">{category}</span>
    </div>

    {/* Content */}
    <article className="max-w-3xl mx-auto px-5 lg:px-8 py-10 lg:py-14">
      <div
        className="prose prose-lg max-w-none text-[14px] font-light leading-[1.9] text-omni47-text-muted
          [&_h2]:font-cormorant [&_h2]:text-[26px] [&_h2]:font-light [&_h2]:text-omni47-navy [&_h2]:mt-10 [&_h2]:mb-4
          [&_h3]:font-cormorant [&_h3]:text-[20px] [&_h3]:font-light [&_h3]:text-omni47-navy
          [&_img]:w-full [&_img]:my-8
          [&_a]:text-omni47-gold [&_a]:no-underline hover:[&_a]:underline
          [&_blockquote]:border-l-2 [&_blockquote]:border-omni47-gold [&_blockquote]:pl-6 [&_blockquote]:italic [&_blockquote]:text-omni47-navy"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </article>

    {/* Share */}
    <div className="max-w-3xl mx-auto px-5 lg:px-8 pb-10 flex items-center gap-4">
      <span className="text-[11px] tracking-[0.15em] uppercase text-omni47-text-muted font-light">Share:</span>
      {[
        { icon: Facebook, url: `https://facebook.com/sharer/sharer.php?u=${shareUrl}` },
        { icon: Twitter, url: `https://twitter.com/intent/tweet?url=${shareUrl}` },
        { icon: Linkedin, url: `https://linkedin.com/sharing/share-offsite/?url=${shareUrl}` },
      ].map(({ icon: Icon, url }) => (
        <a
          key={url}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-9 h-9 flex items-center justify-center border border-omni47-cream-dark text-omni47-text-muted hover:border-omni47-gold hover:text-omni47-gold transition-colors"
        >
          <Icon className="w-4 h-4" />
        </a>
      ))}
    </div>

    {/* Related posts */}
    {relatedPosts.length > 0 && (
      <div className="bg-white py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <h2 className="font-cormorant text-[28px] font-light text-omni47-navy mb-10 text-center">
            Related Articles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedPosts.slice(0, 3).map((post) => (
              <a key={post.slug} href={post.href} className="group bg-omni47-cream overflow-hidden">
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-omni47-gold font-light">
                    {post.category}
                  </span>
                  <h3 className="font-cormorant text-[18px] font-light text-omni47-navy mt-2 group-hover:text-omni47-gold transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-[12px] text-omni47-text-muted/60 mt-2">{post.date}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    )}
  </div>
);

export default Omni47BlogPostPage;
