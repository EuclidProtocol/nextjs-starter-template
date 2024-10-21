import TokenSelectorModal from "@/src/modals/token-selector";
import Swap from "@/src/swap";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl font-bold">Euclid Nextjs Starter</h1>
      <Swap />
      <TokenSelectorModal />
    </div>
  );
}
