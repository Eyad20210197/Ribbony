# Naming Conventions

## Java
- Packages: all lower-case `com.ribbony.<module>`
- Classes: PascalCase `OrderService`
- Interfaces: PascalCase `OrderRepository`
- Methods/fields: camelCase `calculateDeposit()`, `totalAmount`
- Constants: UPPER_SNAKE `DEFAULT_DEPOSIT_PERCENT`

## Database
- Tables: snake_case plural `orders`, `products`
- Columns: snake_case `created_at`, `payload_jsonb`
- Primary keys: `id` (UUID)

## Frontend (React/Next)
- Files/components: PascalCase `ProductCard.jsx`
- Hooks: `useCart()`, `useOrder()`
- CSS classes (Tailwind): not enforced; prefer utility-first + named components.

## JSON keys
- camelCase for JSON payloads in API (consistent with JS): `pageCount`, `coverPhotoUrl`
