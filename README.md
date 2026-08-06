# Order Management — Food Delivery App

A full-stack Order Management feature: browse a menu, build a cart, check out,
and track an order's status live as it moves through the kitchen.

## Stack

- **Frontend:** React + Vite, Tailwind CSS v4
- **Backend:** Node.js + Express, in-memory data store
- **Validation:** Zod (server-side schema validation on every write)
- **Real-time:** Server-Sent Events (SSE), with a simulated kitchen/delivery
  progression running server-side
- **Testing:** Vitest + Supertest (API), Vitest + React Testing Library (UI)

## Project structure

    order-management/
    ├── server/               # Express API
    │   ├── src/
    │   │   ├── routes/       # menu, orders, SSE stream
    │   │   ├── models/       # in-memory stores
    │   │   ├── validation/   # zod schemas
    │   │   └── simulation/   # background status progression
    │   └── tests/
    └── client/                # React + Vite
        └── src/
            ├── api/           # fetch wrapper + SSE subscription
            ├── components/
            └── tests/

## Running locally

    npm install          # from the root — installs concurrently
    cd server && npm install
    cd ../client && npm install
    cd ..
    npm run dev           # starts API on :4000 and client on :5173

## Running tests

    npm test               # runs both server and client test suites

## API endpoints

| Method | Endpoint                     | Description                          |
|--------|-------------------------------|---------------------------------------|
| GET    | `/api/menu`                   | List all menu items                   |
| POST   | `/api/orders`                 | Place an order (cart + delivery info) |
| GET    | `/api/orders`                 | List all orders                       |
| GET    | `/api/orders/:id`              | Get a single order                    |
| PATCH  | `/api/orders/:id/status`       | Update an order's status              |
| GET    | `/api/orders/:id/events`       | SSE stream of live status updates     |

## Design notes

- **Prices are resolved server-side** from the menu store on order creation,
  never trusted from the client cart payload.
- **Status can only move forward** (`Order Received → Preparing → Out for
  Delivery → Delivered`) — the API rejects backward transitions.
- **Cart state uses functional `setState` updates** to stay correct under
  rapid clicks / React's update batching, rather than debouncing (which
  would silently drop clicks).
- Real-time status is pushed via **SSE**, with a server-side timer
  simulating the kitchen/driver advancing the order automatically.