export default async function ProductPage({ params }: { params: any }) {
  // unwrap params promise (works whether params is a plain object or a Promise)
  const resolvedParams = await params;
  const id = resolvedParams.id as string;

  // fetch product server-side (replace with your api)
  const product = await fetch(`http://localhost:4000/api/products/${id}`)
    .then((r) => (r.ok ? r.json() : null))
    .catch(() => null);

  if (!product) {
    return (
      <main className="container">
        <h1>Product not found</h1>
      </main>
    );
  }

  return (
    <main className="container">
      <h1>{product.title}</h1>
      <img src={product.image} alt={product.title} />
      <p>{product.description}</p>
    </main>
  );
}
