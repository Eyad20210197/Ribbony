'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApi } from '@/lib/api';
import { useAppStore } from '@/store/useAppStore';
import { authClient } from '@/services/authClient';

type Product = {
  id: string;
  name: string;
  price: number;
  description?: string;
  images?: string[];
};

type OrderItem = {
  productId: string;
  product?: Product;
  priceAtTime: number;
  quantity: number;
};

type Order = {
  id: string;
  customerId: string;
  customerName?: string;
  status: 'PENDING' | 'WORK_IN_PROGRESS' | 'SHIPPED';
  total: number;
  createdAt: string;
  items: OrderItem[];
};

function AdminHeader() {
  // read user and logout from store (non-destructive)
  const user = useAppStore((s) => s.user);
  const logout = useAppStore((s) => s.logout);
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST', credentials: 'include' });
    } catch (err) {
      // ignore
    }
    try { authClient.clearToken(); } catch {}
    try { logout(); } catch {}
    router.push('/');
  };

  return (
    <div className="header-frame mb-6 flex items-center justify-between">
      <div>
        <div className="site-title">Ribbony — Admin</div>
        <div className="site-sub">Management Console</div>
      </div>
      <div className="flex items-center gap-3">
        <button className="hamburger" aria-label="Toggle admin menu">≡</button>
        <div className="product-card" role="status">
          {user?.firstName ? (
            <>
              Signed in as <strong>{user.firstName}</strong>
              <button className="sticker-btn ml-3" onClick={handleSignOut} style={{ marginLeft: 12 }}>Sign out</button>
            </>
          ) : (
            <>Not signed in</>
          )}
        </div>
      </div>
    </div>
  );
}

function Sidebar({ section, setSection }: { section: string; setSection: React.Dispatch<React.SetStateAction<'overview'|'products'|'orders'>> }) {
  return (
    <aside className="w-64 mr-6">
      <div className="product-card mb-4">
        <div className="font-bold mb-2">Navigation</div>
        <nav className="flex flex-col gap-2">
          <button onClick={() => setSection('overview')} className={`text-left p-2 rounded ${section==='overview'? 'bg-gray-100': ''}`}>Overview</button>
          <button onClick={() => setSection('products')} className={`text-left p-2 rounded ${section==='products'? 'bg-gray-100': ''}`}>Products</button>
          <button onClick={() => setSection('orders')} className={`text-left p-2 rounded ${section==='orders'? 'bg-gray-100': ''}`}>Orders</button>
        </nav>
      </div>

      <div className="product-card">
        <div className="font-bold mb-2">Quick Actions</div>
        <button id="create-product" className="btn-add w-full">Create product</button>
      </div>
    </aside>
  );
}

export default function AdminDashboardPage() {
  const api = useApi();
  const setLoading = useAppStore((s) => s.setLoading);

  // auth-related store reads
  const user = useAppStore((s) => s.user);
  const isAdminFn = useAppStore((s) => (typeof s.isAdmin === 'function' ? s.isAdmin : undefined));
  const logout = useAppStore((s) => s.logout);

  const router = useRouter();

  const [section, setSection] = useState<'overview' | 'products' | 'orders'>('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showNewProduct, setShowNewProduct] = useState(false);

  // helper to determine admin role (fallback to inspecting user.role)
  const isAdmin = (() => {
    try {
      if (typeof isAdminFn === 'function') return isAdminFn();
      if (!user) return false;
      const r = (user as any).role ?? '';
      return !!(r && (r === 'ADMIN' || r === 'Admin' || r === 'admin'));
    } catch {
      return false;
    }
  })();

  // Redirect non-admins / unauthenticated visitors to login
  useEffect(() => {
    // If user explicitly null => not signed in => redirect
    if (user === null) {
      router.replace('/login');
      return;
    }

    // If user exists but not admin => redirect
    if (user && !isAdmin) {
      router.replace('/login');
      return;
    }

    // else allow admin to stay
  }, [user, isAdmin, router]);

  // fetch products (admin)
  async function loadProducts() {
    try {
      const data = await api('/products', { method: 'GET' });
      setProducts(data || []);
    } catch (err) {
      console.error('Failed to load products', err);
    }
  }

  async function loadOrders() {
    try {
      const data = await api('/orders', { method: 'GET' });
      setOrders(data || []);
    } catch (err) {
      console.error('Failed to load orders', err);
    }
  }

  useEffect(() => {
    // only fetch when user is admin
    if (!user || !isAdmin) return;
    loadProducts();
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isAdmin]);

  // While redirecting or not authorized — avoid flicker by rendering nothing
  if (!user || !isAdmin) return null;

  return (
    <div>
      <AdminHeader />

      <div className="flex">
        <Sidebar section={section} setSection={setSection} />

        <main className="flex-1">
          {section === 'overview' && (
            <div>
              <h2 className="hero-title">Overview</h2>
              <div className="grid grid-cols-3 gap-6 mt-4">
                <div className="product-card p-4">Products<br/><div className="text-2xl font-bold">{products.length}</div></div>
                <div className="product-card p-4">Orders<br/><div className="text-2xl font-bold">{orders.length}</div></div>
                <div className="product-card p-4">Pending<br/><div className="text-2xl font-bold">{orders.filter(o=>o.status==='PENDING').length}</div></div>
              </div>

              <div className="product-stage mt-8 checker-hero p-6">
                <h3 className="hero-title">Recent Orders</h3>
                <div className="mt-4 space-y-4">
                  {orders.slice(0,5).map(o=> (
                    <div key={o.id} className="pr-row product-card p-3 flex items-center justify-between">
                      <div>
                        <div className="pr-title">Order #{o.id}</div>
                        <div className="text-sm">{o.customerName ?? o.customerId} • {new Date(o.createdAt).toLocaleString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="pr-price">{o.total} EGP</div>
                        <div className="mt-2"><button className="pc-cta" onClick={()=> setSelectedOrder(o)}>View</button></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {section === 'products' && (
            <div>
              <div className="flex items-center justify-between">
                <h2 className="hero-title">Products</h2>
                <div>
                  <button onClick={()=> setShowNewProduct(true)} className="btn-add">New Product</button>
                  <button onClick={loadProducts} className="ml-2 sticker-btn">Refresh</button>
                </div>
              </div>

              <div className="pg-grid mt-6">
                {products.map(p => (
                  <div className="pg-cell" key={p.id}>
                    <div className="pc-card">
                      <div className="pc-image-wrap">
                        {p.images && p.images[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.images[0]} alt={p.name} className="pc-image" />
                        ) : (
                          <div className="pc-image-fallback" />
                        )}
                      </div>
                      <div className="pc-meta">
                        <h3 className="pc-title">{p.name}</h3>
                        <div className="pc-price">{p.price} EGP</div>
                        <div className="pr-cta-row mt-3">
                          <button className="pc-cta" onClick={() => alert('Edit not implemented in single-file demo')}>Edit</button>
                          <button className="sticker-btn" onClick={async ()=>{
                            if(!confirm('Delete this product?')) return;
                            setLoading(true);
                            try{
                              await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api'}/products/${p.id}`, { method: 'DELETE', credentials: 'include' });
                              await loadProducts();
                            }catch(e){ console.error(e); alert('Failed to delete'); }
                            setLoading(false);
                          }}>Delete</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {section === 'orders' && (
            <div>
              <div className="flex items-center justify-between">
                <h2 className="hero-title">Orders</h2>
                <div>
                  <button onClick={loadOrders} className="sticker-btn">Refresh</button>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {orders.map(o => (
                  <div key={o.id} className="product-card p-4 flex items-center justify-between">
                    <div>
                      <div className="pr-title">#{o.id} — {o.customerName ?? o.customerId}</div>
                      <div className="text-sm">{new Date(o.createdAt).toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="pr-price">{o.total} EGP</div>
                      <div className="mt-2 flex gap-2 justify-end">
                        <select defaultValue={o.status} onChange={async (e)=>{
                          const newStatus = e.target.value as Order['status'];
                          try{
                            await api(`/orders/${o.id}/status`, { method: 'PUT', body: JSON.stringify({ status: newStatus }), headers: { 'Content-Type': 'application/json' } });
                            await loadOrders();
                          }catch(err){ console.error(err); alert('Failed to update'); }
                        }} className="sticker-btn">
                          <option value="PENDING">PENDING</option>
                          <option value="WORK_IN_PROGRESS">WORK_IN_PROGRESS</option>
                          <option value="SHIPPED">SHIPPED</option>
                        </select>
                        <button className="pc-cta" onClick={()=> setSelectedOrder(o)}>View</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {selectedOrder && (
                <div className="game-modal-backdrop mt-6">
                  <div className="game-modal">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="pr-title">Order #{selectedOrder.id}</h3>
                        <div className="text-sm">{selectedOrder.customerName ?? selectedOrder.customerId} • {new Date(selectedOrder.createdAt).toLocaleString()}</div>
                      </div>
                      <button className="modal-close" onClick={()=> setSelectedOrder(null)}>✕</button>
                    </div>

                    <div className="mt-4">
                      <h4 className="font-bold">Items</h4>
                      <div className="mt-2 space-y-2">
                        {selectedOrder.items.map((it, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 border rounded">
                            <div>
                              <div className="font-semibold">{it.product?.name ?? it.productId}</div>
                              <div className="text-sm">Qty: {it.quantity} • Price: {it.priceAtTime} EGP</div>
                            </div>
                            <div className="font-bold">{(it.quantity * it.priceAtTime).toFixed(2)} EGP</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 text-right">
                      <strong>Total: {selectedOrder.total} EGP</strong>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}
        </main>
      </div>
    </div>
  );
}
