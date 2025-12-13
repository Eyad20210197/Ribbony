"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApi } from "@/lib/api";
import { useAppStore } from "@/store/useAppStore";
import Link from "next/link";
import toast from "react-hot-toast";

// Visual Components
import VintageSquares from "@/components/VintageSquares";
import Noise from "@/components/Noise";

/* --- Types --- */
type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  productImage: string;
};

type Order = {
  id: number;
  status: string;
  totalAmount: number;
  userId: number;
  customerName?: string;
  createdAt: string;
  orderItems: any[];
};

type User = {
  id: number;
  firstName: string;
  lastName: string;
  role: string;
  email?: string; // Optional because backend UserResponse doesn't always include it
  address?: string; // Optional
};

export default function AdminDashboard() {
  const api = useApi();
  const router = useRouter();
  const user = useAppStore((s) => s.user);
  const isAdmin = useAppStore((s) => s.isAdmin());
  
  // --- State ---
  const [activeTab, setActiveTab] = useState<"products" | "orders" | "users">("products");
  
  // Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]); // "Found" users list
  
  // Product Form State
  const [isProdEditing, setIsProdEditing] = useState(false);
  const [prodForm, setProdForm] = useState<Partial<Product>>({});

  // User Form State
  const [isUserEditing, setIsUserEditing] = useState(false);
  const [userForm, setUserForm] = useState<Partial<User> & { password?: string }>({});
  const [userSearchId, setUserSearchId] = useState("");

  // --- Auth Check ---
  useEffect(() => {
    if (user && !isAdmin) router.replace("/");
  }, [user, isAdmin, router]);

  // --- Data Loaders ---
  const loadProducts = useCallback(async () => {
    try {
      const data = await api.get("/products/list");
      setProducts(data || []);
    } catch (e) { console.error(e); }
  }, [api]);

  const loadOrders = useCallback(async () => {
    try {
      const data = await api.get("/orders/getAllOrders");
      setOrders(data || []);
    } catch (e) { console.error(e); }
  }, [api]);

  useEffect(() => {
    if (activeTab === "products") loadProducts();
    if (activeTab === "orders") loadOrders();
  }, [activeTab, loadProducts, loadOrders]);

  // --- Product Handlers ---
  const handleDeleteProduct = async (id: number) => {
    if(!confirm("Delete this product?")) return;
    await api.delete(`/products/delete/${id}`);
    loadProducts();
  };

  const handleSaveProduct = async () => {
    try {
      if (prodForm.id) {
        await api.put(`/products/update/${prodForm.id}`, prodForm);
      } else {
        await api.post("/products/save", prodForm);
      }
      setIsProdEditing(false);
      setProdForm({});
      loadProducts();
      toast.success("Product saved");
    } catch (e) { toast.error("Error saving product"); }
  };

  // --- Order Handlers ---
  const handleStatusUpdate = async (id: number, status: string) => {
    await api.put(`/orders/updateStatus/${id}`, { status });
    loadOrders();
    toast.success("Order status updated");
  };

  // --- User Handlers ---
  const handleSearchUser = async () => {
    if(!userSearchId) return;
    try {
      // Endpoint: GET /user/getUser/{id}
      const u = await api.get(`/user/getUser/${userSearchId}`);
      if(u) {
        // Add to our local list if not already there
        setUsers(prev => {
            if(prev.find(existing => existing.id === u.id)) return prev;
            return [...prev, u];
        });
        toast.success("User found");
      }
    } catch (e) { toast.error("User not found"); }
  };

  const handleDeleteUser = async (id: number) => {
    if(!confirm("Delete this user account? This cannot be undone.")) return;
    try {
        await api.delete(`/user/deleteAccount/${id}`);
        setUsers(prev => prev.filter(u => u.id !== id));
        toast.success("User deleted");
    } catch(e) { toast.error("Failed to delete user"); }
  };

  const handleSaveUser = async () => {
    try {
        if (userForm.id) {
            // Update Existing: PUT /user/updateUser
            // DTO: id, firstName, lastName, address, role
            await api.put("/user/updateUser", {
                id: userForm.id,
                firstName: userForm.firstName,
                lastName: userForm.lastName,
                address: userForm.address,
                role: userForm.role
            });
            toast.success("User updated");
        } else {
            // Create New: POST /user/addNewUser
            // DTO: firstName, lastName, email, password, address, role
            await api.post("/user/addNewUser", {
                firstName: userForm.firstName,
                lastName: userForm.lastName,
                email: userForm.email,
                password: userForm.password,
                address: userForm.address,
                role: userForm.role || "CUSTOMER"
            });
            toast.success("User created");
        }
        setIsUserEditing(false);
        setUserForm({});
        // If we created a user, we can't easily fetch them without an ID, 
        // but if we updated, we can refresh the list item locally or re-fetch if we had a "List" endpoint.
        // For now, we just close the modal.
    } catch (e: any) {
        toast.error(e.message || "Error saving user");
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f5c3da]">
      <VintageSquares count={30} density={0.5} />
      <Noise patternAlpha={15} />

      {/* Sidebar */}
      <aside className="w-64 bg-white/80 backdrop-blur-md border-r border-black/5 p-6 flex flex-col gap-6 z-10 sticky top-0 h-screen">
        <div>
          <h1 className="site-title text-2xl">Ribbony</h1>
          <p className="site-sub">Admin Console</p>
        </div>
        
        <nav className="flex flex-col gap-2">
          {['products', 'orders', 'users'].map((tab) => (
             <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)} 
                className={`nav-link text-left px-4 py-3 rounded-lg transition-colors capitalize ${activeTab === tab ? 'bg-white shadow-sm font-bold text-[#e3166d]' : 'hover:bg-white/50'}`}
             >
                {tab}
             </button>
          ))}
        </nav>

        <div className="mt-auto">
          <Link href="/" className="sticker-btn text-xs w-full text-center block">Back to Site</Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto z-10 h-screen relative">
        
        {/* ================= PRODUCTS TAB ================= */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white/60 p-4 rounded-xl backdrop-blur-sm">
              <h2 className="text-2xl font-bold font-serif text-[#2b2220]">Product Catalog</h2>
              <button onClick={() => { setProdForm({}); setIsProdEditing(true); }} className="btn-add shadow-lg">+ Add Product</button>
            </div>

            {/* Product Modal */}
            {isProdEditing && (
               <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                 <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsProdEditing(false)} />
                 <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl relative z-[10000] overflow-hidden flex flex-col" style={{ backgroundColor: 'white' }}>
                    <div className="bg-gray-50 border-b border-gray-100 p-6 flex justify-between items-center">
                        <h3 className="font-serif font-bold text-xl text-[#2b2220]">{prodForm.id ? "Edit Product" : "New Product"}</h3>
                        <button onClick={() => setIsProdEditing(false)} className="text-gray-400 hover:text-red-500 text-3xl leading-none">&times;</button>
                    </div>
                    <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto bg-white">
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Product Name</label>
                            <input className="admin-input" placeholder="e.g. Vintage Sticker Pack" value={prodForm.name || ""} onChange={e=>setProdForm({...prodForm, name: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Price (EGP)</label>
                                <input className="admin-input" type="number" placeholder="0.00" value={prodForm.price || ""} onChange={e=>setProdForm({...prodForm, price: parseFloat(e.target.value)})} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Category</label>
                                <input className="admin-input" placeholder="e.g. Stationery" value={prodForm.category || ""} onChange={e=>setProdForm({...prodForm, category: e.target.value})} />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Image URL</label>
                            <input className="admin-input" placeholder="https://..." value={prodForm.productImage || ""} onChange={e=>setProdForm({...prodForm, productImage: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Description</label>
                            <textarea className="admin-input h-32 resize-none" placeholder="Product details..." value={prodForm.description || ""} onChange={e=>setProdForm({...prodForm, description: e.target.value})} />
                        </div>
                    </div>
                    <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3 justify-end">
                        <button onClick={()=>setIsProdEditing(false)} className="px-6 py-2 rounded-lg font-bold text-gray-500 hover:bg-gray-200 transition-colors">Cancel</button>
                        <button onClick={handleSaveProduct} className="pc-cta px-8 py-2 shadow-lg">Save Product</button>
                    </div>
                 </div>
               </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(p => (
                <div key={p.id} className="bg-white p-4 rounded-xl shadow-sm border border-black/5 hover:shadow-md transition-shadow group relative z-0">
                  <div className="w-full h-48 bg-gray-50 rounded-lg mb-4 overflow-hidden flex items-center justify-center relative">
                     {p.productImage ? (
                        <img src={p.productImage} alt={p.name} className="h-full w-full object-contain p-4 group-hover:scale-105 transition-transform duration-300" />
                     ) : (
                        <div className="text-gray-300 font-bold text-xs uppercase tracking-widest">No Image</div>
                     )}
                  </div>
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-serif font-bold text-lg text-[#2b2220] leading-tight">{p.name}</div>
                    <div className="text-[#e3166d] font-bold bg-pink-50 px-2 py-1 rounded text-sm">{p.price}</div>
                  </div>
                  <div className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-4">{p.category}</div>
                  <div className="flex gap-2 border-t border-gray-100 pt-4">
                    <button onClick={() => { setProdForm(p); setIsProdEditing(true); }} className="flex-1 py-2 rounded-lg bg-gray-100 text-gray-600 text-xs font-bold hover:bg-gray-200 transition-colors">Edit</button>
                    <button onClick={() => handleDeleteProduct(p.id)} className="flex-1 py-2 rounded-lg border border-red-100 text-red-500 text-xs font-bold hover:bg-red-50 transition-colors">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= ORDERS TAB ================= */}
        {activeTab === "orders" && (
          <div className="space-y-6">
             <div className="bg-white/60 p-4 rounded-xl backdrop-blur-sm">
                <h2 className="text-2xl font-bold font-serif text-[#2b2220]">Orders Management</h2>
             </div>
             
             <div className="bg-white rounded-xl shadow-sm border border-black/5 overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase text-xs font-bold tracking-wider">
                    <tr>
                      <th className="p-4">ID</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Total</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.map(order => (
                      <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4 font-mono text-gray-400">#{order.id}</td>
                        <td className="p-4 font-medium text-[#2b2220]">{order.customerName || `User ${order.userId}`}</td>
                        <td className="p-4 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="p-4 font-bold text-[#2b2220]">{order.totalAmount} EGP</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-[10px] font-extrabold uppercase tracking-wide border 
                            ${order.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' : 
                              order.status === 'SHIPPED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                              order.status === 'CANCELED' || order.status === 'CANCELLED' ? 'bg-red-50 text-red-700 border-red-100' : 
                              'bg-blue-50 text-blue-700 border-blue-100'}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-4">
                           <div className="flex gap-1">
                               <button onClick={() => handleStatusUpdate(order.id, "WORK_IN_PROGRESS")} className="p-1.5 rounded hover:bg-blue-50 text-blue-600" title="Mark In Progress">⚙️</button>
                               <button onClick={() => handleStatusUpdate(order.id, "SHIPPED")} className="p-1.5 rounded hover:bg-emerald-50 text-emerald-600" title="Mark Shipped">🚚</button>
                               <button onClick={() => handleStatusUpdate(order.id, "CANCELED")} className="p-1.5 rounded hover:bg-red-50 text-red-600" title="Cancel Order">✕</button>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>
        )}
        
        {/* ================= USERS TAB ================= */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="bg-white/60 p-4 rounded-xl backdrop-blur-sm flex justify-between items-center">
                <h2 className="text-2xl font-bold font-serif text-[#2b2220]">Users</h2>
                <button onClick={() => { setUserForm({}); setIsUserEditing(true); }} className="btn-add shadow-lg">+ Add User</button>
            </div>
            
            {/* User Search Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-black/5 flex gap-4 items-center">
                <input 
                    className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                    placeholder="Search User by ID..."
                    value={userSearchId}
                    onChange={(e) => setUserSearchId(e.target.value)}
                />
                <button onClick={handleSearchUser} className="pc-cta px-6 py-3">Search</button>
            </div>

            {/* Found Users Table */}
            {users.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-black/5 overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase text-xs font-bold tracking-wider">
                            <tr>
                                <th className="p-4">ID</th>
                                <th className="p-4">First Name</th>
                                <th className="p-4">Last Name</th>
                                <th className="p-4">Role</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {users.map(u => (
                                <tr key={u.id} className="hover:bg-gray-50/50">
                                    <td className="p-4 font-mono text-gray-400">#{u.id}</td>
                                    <td className="p-4 font-bold text-[#2b2220]">{u.firstName}</td>
                                    <td className="p-4">{u.lastName}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border 
                                            ${u.role === 'ADMIN' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right flex justify-end gap-2">
                                        <button onClick={() => { setUserForm(u); setIsUserEditing(true); }} className="p-2 rounded bg-gray-100 hover:bg-gray-200 text-xs font-bold">Edit</button>
                                        <button onClick={() => handleDeleteUser(u.id)} className="p-2 rounded bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* User Edit/Create Modal */}
            {isUserEditing && (
               <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                 <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsUserEditing(false)} />
                 <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl relative z-[10000] overflow-hidden flex flex-col" style={{ backgroundColor: 'white' }}>
                    <div className="bg-gray-50 border-b border-gray-100 p-6 flex justify-between items-center">
                        <h3 className="font-serif font-bold text-xl text-[#2b2220]">{userForm.id ? "Edit User" : "Create User"}</h3>
                        <button onClick={() => setIsUserEditing(false)} className="text-gray-400 hover:text-red-500 text-3xl leading-none">&times;</button>
                    </div>
                    <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto bg-white">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">First Name</label>
                                <input className="admin-input" value={userForm.firstName || ""} onChange={e=>setUserForm({...userForm, firstName: e.target.value})} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Last Name</label>
                                <input className="admin-input" value={userForm.lastName || ""} onChange={e=>setUserForm({...userForm, lastName: e.target.value})} />
                            </div>
                        </div>

                        {/* Only show Email/Password for NEW users because backend doesn't support easy update of these via generic update endpoint (has separate endpoints) */}
                        {!userForm.id && (
                            <>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Email</label>
                                    <input className="admin-input" value={userForm.email || ""} onChange={e=>setUserForm({...userForm, email: e.target.value})} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Password</label>
                                    <input className="admin-input" type="password" value={userForm.password || ""} onChange={e=>setUserForm({...userForm, password: e.target.value})} />
                                </div>
                            </>
                        )}

                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Role</label>
                            <select className="admin-input" value={userForm.role || "CUSTOMER"} onChange={e=>setUserForm({...userForm, role: e.target.value})}>
                                <option value="CUSTOMER">CUSTOMER</option>
                                <option value="ADMIN">ADMIN</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">Address (Optional)</label>
                            <input className="admin-input" value={userForm.address || ""} onChange={e=>setUserForm({...userForm, address: e.target.value})} />
                        </div>
                    </div>
                    <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3 justify-end">
                        <button onClick={()=>setIsUserEditing(false)} className="px-6 py-2 rounded-lg font-bold text-gray-500 hover:bg-gray-200 transition-colors">Cancel</button>
                        <button onClick={handleSaveUser} className="pc-cta px-8 py-2 shadow-lg">{userForm.id ? "Update" : "Create"}</button>
                    </div>
                 </div>
               </div>
            )}
          </div>
        )}

      </main>
      
      {/* Helper CSS class for inputs (inlined for this file to keep it clean) */}
      <style jsx global>{`
        .admin-input {
            width: 100%;
            padding: 0.75rem;
            background-color: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 0.5rem;
            color: black;
            outline: none;
            transition: all 0.2s;
        }
        .admin-input:focus {
            border-color: #e3166d;
            box-shadow: 0 0 0 1px #e3166d;
        }
      `}</style>
    </div>
  );
}