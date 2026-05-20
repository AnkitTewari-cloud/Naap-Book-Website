export type GalleryTab = "shop" | "customer";

export interface GalleryItem {
  id: string;
  title: string;
  garmentTag: string;
  clientLabel: string;
  dateLabel: string;
  imageUrl: string;
  tab: GalleryTab;
}

export const DEMO_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "g-1",
    title: "Navy Two-Piece Suit",
    garmentTag: "SUIT",
    clientLabel: "Client: Marcus J.",
    dateLabel: "Oct 12, 2023",
    imageUrl:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80",
    tab: "shop",
  },
  {
    id: "g-2",
    title: "Maroon Blouse",
    garmentTag: "BLOUSE",
    clientLabel: "Client: Asha Devi",
    dateLabel: "Jan 8, 2026",
    imageUrl:
      "https://images.unsplash.com/photo-1583292652881-96605a5ec2dc?w=600&q=80",
    tab: "shop",
  },
  {
    id: "g-3",
    title: "Royal Blue Kurta",
    garmentTag: "KURTA",
    clientLabel: "Client: Ravi Patil",
    dateLabel: "Feb 2, 2026",
    imageUrl:
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6e633?w=600&q=80",
    tab: "shop",
  },
  {
    id: "g-4",
    title: "Wedding Lehenga",
    garmentTag: "LEHENGA",
    clientLabel: "Client: Priya Nair",
    dateLabel: "Mar 15, 2026",
    imageUrl:
      "https://images.unsplash.com/photo-1595777457583-95b1d949d8b0?w=600&q=80",
    tab: "customer",
  },
  {
    id: "g-5",
    title: "Formal Shirt",
    garmentTag: "SHIRT",
    clientLabel: "Client: Rajesh Kumar",
    dateLabel: "Apr 1, 2026",
    imageUrl:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80",
    tab: "customer",
  },
  {
    id: "g-6",
    title: "Sherwani Finish",
    garmentTag: "SHERWANI",
    clientLabel: "Shop showcase",
    dateLabel: "May 10, 2026",
    imageUrl:
      "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&q=80",
    tab: "shop",
  },
  {
    id: "g-7",
    title: "Bridal Blouse Work",
    garmentTag: "BLOUSE",
    clientLabel: "Client: Kavita Reddy",
    dateLabel: "Feb 14, 2026",
    imageUrl:
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80",
    tab: "customer",
  },
  {
    id: "g-8",
    title: "Indigo Kurta Set",
    garmentTag: "KURTA",
    clientLabel: "Client: Divya Nambiar",
    dateLabel: "Mar 3, 2026",
    imageUrl:
      "https://images.unsplash.com/photo-1610030469983-98e550fe9b2e?w=600&q=80",
    tab: "shop",
  },
  {
    id: "g-9",
    title: "Salwar Dupatta",
    garmentTag: "SALWAR",
    clientLabel: "Client: Nandini Rao",
    dateLabel: "Apr 18, 2026",
    imageUrl:
      "https://images.unsplash.com/photo-1583391733981-9b17e7d9d9e4?w=600&q=80",
    tab: "customer",
  },
  {
    id: "g-10",
    title: "Corporate Shirt Stack",
    garmentTag: "SHIRT",
    clientLabel: "Client: Arjun Menon",
    dateLabel: "Jan 22, 2026",
    imageUrl:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80",
    tab: "shop",
  },
  {
    id: "g-11",
    title: "Velvet Sherwani",
    garmentTag: "SHERWANI",
    clientLabel: "Client: Omkar Deshpande",
    dateLabel: "May 2, 2026",
    imageUrl:
      "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&q=80",
    tab: "customer",
  },
  {
    id: "g-12",
    title: "Festive Lehenga",
    garmentTag: "LEHENGA",
    clientLabel: "Shop showcase",
    dateLabel: "Dec 8, 2025",
    imageUrl:
      "https://images.unsplash.com/photo-1595777457583-95b1d949d8b0?w=600&q=80",
    tab: "shop",
  },
];

const STORAGE_KEY = "naapbook_gallery_uploads_v1";

export function loadGalleryUploads(): GalleryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as GalleryItem[];
  } catch {
    return [];
  }
}

export function saveGalleryUploads(items: GalleryItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* ignore */
  }
}
