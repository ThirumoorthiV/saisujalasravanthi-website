// Content published by Trust staff in the CMS (/login/).
//
// scripts/fetch-content.mjs downloads it from Firestore into cms.generated.json
// before every `npm run dev` / `npm run build`. A collection is only present once
// staff have imported it into the CMS (Dashboard); until then the site uses the
// SEED_* lists in this folder.
import type { Centre, GalleryItem, Leader, Partner, Programme, SocialLink, Story, TrustEvent } from "@/types";
import raw from "./cms.generated.json";

export interface CmsContent {
  stories: Story[];
  events: TrustEvent[];
  gallery: GalleryItem[];
  leadership: Leader[];
  centres: Centre[];
  programmes: Programme[];
  social: SocialLink[];
  partners: Partner[];
}

export const CMS = raw as unknown as Partial<CmsContent>;
