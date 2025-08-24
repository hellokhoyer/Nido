import { listings } from "@/api/data/listings";
import ListingList from "@/components/ListingList";

const HomePage = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <ListingList listings={listings} />
    </div>
  );
};

export default HomePage;
