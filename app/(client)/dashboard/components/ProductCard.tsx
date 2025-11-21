export default function ProductCard({ item }: any) {
  return (
    <div className="rounded-lg overflow-hidden shadow-sm text-white frosted-glass bg-[rgba(255,255,255,0.1)]">
        <img
        src={item.image}
        alt={item.name}
        className="w-full h-32 object-cover mb-4 rounded aspect-square"
      />
      <div className="p-4">
      <h3 className="font-semibold text-lg">{item.name}</h3>
      <p>{item.description}</p>
      <p className="mt-2 font-bold">${item.price.toFixed(2)}</p>
      </div>
    </div>
  );
}
