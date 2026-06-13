import ListingGrid from "./components/ListingGrid";

export type Listing = {
  id: string;
  title: string;
  crop: string;
  price: number;
  total_slots: number;
  available_slots: number;
  image_url: string | null;
  harvest_date: string | null;
  producers: { name: string; location: string } | null;
};

export const revalidate = 0;

export default async function Home() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/listings/`, {
    cache: "no-store",
  });
  const listings: Listing[] = res.ok ? await res.json() : [];

  return (
    <main className="w-full px-12 py-8">
      <ListingGrid listings={(listings as Listing[]) ?? []} />
    </main>
  );
}
