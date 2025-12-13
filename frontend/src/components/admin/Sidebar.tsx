'use client';

export default function Sidebar({
  section,
  setSection,
  onCreate,
}: {
  section: 'overview'|'products'|'orders'|'users';
  setSection: (s:'overview'|'products'|'orders'|'users') => void;
  onCreate?: ()=>void;
}) {
  const navButton = (label:string, key:'overview'|'products'|'orders'|'users') => (
    <button
      onClick={() => setSection(key)}
      className={`text-left w-full px-3 py-2 rounded-md ${section === key ? 'bg-slate-100 font-medium' : 'hover:bg-slate-50'}`}
    >
      {label}
    </button>
  );

  return (
    <aside className="w-64 mr-6 hidden md:block">
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="font-semibold mb-3">Navigation</div>
        <nav className="flex flex-col gap-2">
          {navButton('Overview','overview')}
          {navButton('Products','products')}
          {navButton('Orders','orders')}
          {navButton('Users','users')}
        </nav>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="font-semibold mb-3">Quick Actions</div>
        <div className="flex flex-col gap-2">
          <button onClick={onCreate} className="w-full px-3 py-2 rounded bg-emerald-50 border border-emerald-100">Create product</button>
          <button className="w-full px-3 py-2 rounded bg-slate-50">Create user</button>
        </div>
      </div>
    </aside>
  );
}
