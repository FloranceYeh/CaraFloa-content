export interface HomeSection {
  id: string;
  title: string;
  summary: string;
}

export const homeSections: HomeSection[] = [
  { id: "open-source", title: "开源速递", summary: "优质开源项目、架构解析、GitHub 趋势" },
  { id: "unpublished-1", title: "未发布", summary: "未发布内容" },
  { id: "deep-dive", title: "深度议题", summary: "技术演进探讨、开源协议、行业生态" },
  { id: "challenge", title: "极客挑战", summary: "CTF 隐写、算法趣题、逆向解析" },
  { id: "tech-news", title: "科技前沿", summary: "硬核科技动向、AI 架构突破、芯片与系统" },
  { id: "unpublished-2", title: "未发布", summary: "未发布内容" },
  { id: "special", title: "本周特辑", summary: "一周精华回顾、CaraFloa 精选合集" },
];
