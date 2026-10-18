export interface LinkItem {
  url: string;
  ava: string;
  name: string;
  des: string;
}

export type LinkGroups = Record<string, Record<string, LinkItem>>;

export const links: LinkGroups = {
  "People": {
    "Florance": {
      url: "https://florance.top/",
      ava: "/images/links/florance.png",
      name: "Florance's Blog",
      des: "It's Florance.",
    },
  },
};
