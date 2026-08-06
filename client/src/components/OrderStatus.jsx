// import { useEffect, useState } from 'react';
// import { subscribeToOrderEvents } from '../api/client';

// const STATUS_STEPS = ['Order Received', 'Preparing', 'Out for Delivery', 'Delivered'];

// export default function OrderStatus({ order: initialOrder, onNewOrder }) {
//   const [order, setOrder] = useState(initialOrder);

//   useEffect(() => {
//     const unsubscribe = subscribeToOrderEvents(initialOrder.id, (updated) => {
//       setOrder(updated);
//     });
//     return unsubscribe;
//   }, [initialOrder.id]);

//   const currentIndex = STATUS_STEPS.indexOf(order.status);

//   return (
//     <div className="max-w-md mx-auto p-6">
//       <p className="text-center text-sm text-ink/50 mb-6">
//         Order placed — here's it moving through the kitchen
//       </p>

//       <div className="relative bg-white border border-line rounded-xl shadow-sm">
//         <div className="flex justify-between px-4 -mt-2">
//           {Array.from({ length: 14 }).map((_, i) => (
//             <span key={i} className="w-2 h-2 rounded-full bg-paper border border-line" />
//           ))}
//         </div>

//         <div className="p-6">
//           <div className="flex justify-between items-start mb-1">
//             <h2 className="font-display text-xl">Order Ticket</h2>
//             <span className="font-mono text-xs text-ink/50">
//               #{order.id.slice(0, 8)}
//             </span>
//           </div>
//           <p className="text-xs text-ink/40 font-mono mb-6">
//             {new Date(order.createdAt).toLocaleString()}
//           </p>

//           <div className="space-y-0 mb-6">
//             {STATUS_STEPS.map((step, i) => {
//               const done = i < currentIndex;
//               const active = i === currentIndex;
//               return (
//                 <div key={step} className="flex items-start gap-3">
//                   <div className="flex flex-col items-center">
//                     <span
//                       className={`w-3 h-3 rounded-full shrink-0 ${
//                         done || active ? 'bg-basil' : 'bg-line'
//                       } ${active ? 'ring-4 ring-basil/20' : ''}`}
//                     />
//                     {i < STATUS_STEPS.length - 1 && (
//                       <span
//                         className={`w-px flex-1 min-h-[28px] ${
//                           done ? 'bg-basil' : 'bg-line'
//                         }`}
//                       />
//                     )}
//                   </div>
//                   <div className="pb-7 -mt-0.5">
//                     <p
//                       className={`text-sm font-medium ${
//                         active ? 'text-ink' : done ? 'text-ink/70' : 'text-ink/35'
//                       }`}
//                     >
//                       {step}
//                     </p>
//                     {active && (
//                       <p className="text-xs text-basil mt-0.5">In progress…</p>
//                     )}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           <div className="border-t border-dashed border-line pt-4 space-y-1.5">
//             {order.items.map((item) => (
//               <div key={item.menuItemId} className="flex justify-between text-sm">
//                 <span className="text-ink/70">
//                   {item.quantity}× {item.name}
//                 </span>
//                 <span className="font-mono text-ink/70">
//                   ₹{item.subtotal.toFixed(2)}
//                 </span>
//               </div>
//             ))}
//             <div className="flex justify-between font-semibold pt-2 mt-2 border-t border-line">
//               <span>Total</span>
//               <span className="font-mono">₹{order.total.toFixed(2)}</span>
//             </div>
//           </div>

//           <div className="border-t border-dashed border-line mt-4 pt-4 text-sm text-ink/60">
//             <p>{order.deliveryDetails.name}</p>
//             <p>{order.deliveryDetails.address}</p>
//           </div>
//         </div>

//         <div className="flex justify-between px-4 -mb-2">
//           {Array.from({ length: 14 }).map((_, i) => (
//             <span key={i} className="w-2 h-2 rounded-full bg-paper border border-line" />
//           ))}
//         </div>
//       </div>

//       <button
//         onClick={onNewOrder}
//         className="mt-8 w-full bg-ink text-paper rounded-full py-3 text-sm font-medium hover:bg-ink/90 transition"
//       >
//         Start a new order
//       </button>
//     </div>
//   );
// }
import { useEffect, useState } from 'react';
import { subscribeToOrderEvents } from '../api/client';

const STATUS_STEPS = ['Order Received', 'Preparing', 'Out for Delivery', 'Delivered'];

export default function OrderStatus({ order: initialOrder, onNewOrder }) {
  const [order, setOrder] = useState(initialOrder);
  const [justUpdated, setJustUpdated] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToOrderEvents(initialOrder.id, (updated) => {
      setOrder(updated);
      setJustUpdated(true);
      setTimeout(() => setJustUpdated(false), 700);
    });
    return unsubscribe;
  }, [initialOrder.id]);

  const currentIndex = STATUS_STEPS.indexOf(order.status);
  const isDelivered = order.status === 'Delivered';

  return (
    <div className="max-w-md mx-auto p-6">
      <p className="text-center text-sm text-ink/50 mb-6">
        Order placed — here's it moving through the kitchen
      </p>

      <div
        className={`relative bg-white rounded-2xl transition-shadow duration-500 ${
          justUpdated ? 'shadow-xl' : 'card-elevate'
        }`}
      >
        <div className="flex justify-between px-4 -mt-2">
          {Array.from({ length: 14 }).map((_, i) => (
            <span key={i} className="w-2 h-2 rounded-full bg-paper border border-line" />
          ))}
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-1">
            <h2 className="font-display text-xl">Order Ticket</h2>
            <span
              className={`text-xs font-mono px-2 py-1 rounded-full ${
                isDelivered
                  ? 'bg-basil/10 text-basil'
                  : 'bg-saffron/10 text-saffron-dark'
              }`}
            >
              #{order.id.slice(0, 8)}
            </span>
          </div>
          <p className="text-xs text-ink/40 font-mono mb-6">
            {new Date(order.createdAt).toLocaleString()}
          </p>

          <div className="space-y-0 mb-6">
            {STATUS_STEPS.map((step, i) => {
              const done = i < currentIndex;
              const active = i === currentIndex;
              return (
                <div key={step} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <span
                      className={`w-3 h-3 rounded-full shrink-0 transition-all duration-500 ${
                        done || active ? 'bg-basil' : 'bg-line'
                      } ${active ? 'ring-4 ring-basil/20 scale-110' : ''}`}
                    />
                    {i < STATUS_STEPS.length - 1 && (
                      <span
                        className={`w-px flex-1 min-h-[28px] transition-colors duration-500 ${
                          done ? 'bg-basil' : 'bg-line'
                        }`}
                      />
                    )}
                  </div>
                  <div className="pb-7 -mt-0.5">
                    <p
                      className={`text-sm font-medium transition-colors duration-500 ${
                        active ? 'text-ink' : done ? 'text-ink/70' : 'text-ink/35'
                      }`}
                    >
                      {step}
                    </p>
                    {active && !isDelivered && (
                      <p className="text-xs text-basil mt-0.5 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-basil animate-pulse" />
                        In progress…
                      </p>
                    )}
                    {step === 'Delivered' && isDelivered && (
                      <p className="text-xs text-basil mt-0.5">Enjoy your meal 🎉</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-dashed border-line pt-4 space-y-1.5">
            {order.items.map((item) => (
              <div key={item.menuItemId} className="flex justify-between text-sm">
                <span className="text-ink/70">
                  {item.quantity}× {item.name}
                </span>
                <span className="font-mono text-ink/70">₹{item.subtotal.toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between font-semibold pt-2 mt-2 border-t border-line">
              <span>Total</span>
              <span className="font-mono">₹{order.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="border-t border-dashed border-line mt-4 pt-4 text-sm text-ink/60">
            <p>{order.deliveryDetails.name}</p>
            <p>{order.deliveryDetails.address}</p>
          </div>
        </div>

        <div className="flex justify-between px-4 -mb-2">
          {Array.from({ length: 14 }).map((_, i) => (
            <span key={i} className="w-2 h-2 rounded-full bg-paper border border-line" />
          ))}
        </div>
      </div>

      <button
        onClick={onNewOrder}
        className="mt-8 w-full bg-ink text-paper rounded-full py-3 text-sm font-medium hover:bg-saffron hover:text-ink transition-colors duration-200"
      >
        Start a new order
      </button>
    </div>
  );
}