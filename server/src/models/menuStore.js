const menuItems = [
  {
    id: 'itm-001',
    name: 'Margherita Pizza',
    description: 'Classic tomato, mozzarella, and fresh basil on a thin crust.',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002',
    category: 'Pizza',
  },
  {
    id: 'itm-002',
    name: 'Pepperoni Pizza',
    description: 'Loaded with pepperoni and a blend of mozzarella cheeses.',
    price: 11.49,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e',
    category: 'Pizza',
  },
  {
    id: 'itm-003',
    name: 'Classic Cheeseburger',
    description: 'Beef patty, cheddar, lettuce, tomato, and house sauce.',
    price: 8.49,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd',
    category: 'Burgers',
  },
  {
    id: 'itm-004',
    name: 'Bacon Burger',
    description: 'Double smoked bacon, cheddar, and caramelized onions.',
    price: 10.29,
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b',
    category: 'Burgers',
  },
  {
    id: 'itm-005',
    name: 'Caesar Salad',
    description: 'Romaine, parmesan, croutons, and creamy Caesar dressing.',
    price: 7.99,
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9',
    category: 'Salads',
  },
  {
    id: 'itm-006',
    name: 'Chocolate Milkshake',
    description: 'Thick and creamy, topped with whipped cream.',
    price: 4.99,
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699',
    category: 'Drinks',
  },
];

export function getMenu() {
  return menuItems;
}

export function getMenuItemById(id) {
  return menuItems.find((item) => item.id === id);
}