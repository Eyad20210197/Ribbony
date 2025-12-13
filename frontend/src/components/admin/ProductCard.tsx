import React from 'react';

export default function ProductCard({ p, onEdit, onDelete }: {
  p: { id: string, name: string, price: number, images?: string[] },
  onEdit?: (id:string)=>void,
  onDelete?: (id:string)=>void
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="h-40 bg-slate-100 flex items-center justify-center">
        {p.images?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.images[0]} alt={p.name} className="object-contain h-full w-full" />
        ) : (
          <div className="text-slate-400">No image</div>
        )}
      </div>

      <div className="p-3">
        <h3 className="font-medium">{p.name}</h3>
        <div className="text-sm text-slate-500">{p.price} EGP</div>

        <div className="mt-3 flex gap-2">
          <button onClick={()=>onEdit?.(p.id)} className="px-3 py-1 rounded bg-sky-50 border">Edit</button>
          <button onClick={()=>onDelete?.(p.id)} className="px-3 py-1 rounded bg-rose-50 border">Delete</button>
        </div>
      </div>
    </div>
  );
}
