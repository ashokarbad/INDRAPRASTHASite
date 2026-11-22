/* ==========================================================
   MENU — edit dishes and prices here.
   DRAFT: dishes and prices are placeholders. Replace them with
   the restaurant's real menu before publishing.
   Fields: name, desc, price (number, ₹), sig (true = Signature)
   ========================================================== */
window.MENU_DATA = [
  {
    id: "nashta",
    title: "Subah ka Nashta",
    subtitle: "Breakfast · served from 9 AM",
    items: [
      { name: "Chole Bhature", desc: "Puffed bhature with slow-cooked Pindi chole, pickled onion and green chilli", price: 220, sig: true },
      { name: "Amritsari Kulcha", desc: "Tandoor-baked stuffed kulcha, white butter, chole and tangy chutney", price: 240 },
      { name: "Bedmi Poori Aloo", desc: "Old Delhi's morning favourite — spiced urad dal poori with tangy aloo sabzi", price: 170 },
      { name: "Aloo Paratha", desc: "Tawa-crisp paratha with white butter, fresh curd and achaar", price: 160 },
      { name: "Poori Sabzi", desc: "Golden pooris with homestyle aloo tamatar sabzi", price: 150 },
      { name: "Kulhad Masala Chai", desc: "Strong, gingery chai served the Delhi way", price: 50 }
    ]
  },
  {
    id: "chaat",
    title: "Chandni Chowk Chaat",
    subtitle: "Street favourites & starters",
    items: [
      { name: "Raj Kachori", desc: "A crisp, generous kachori filled with sprouts, dahi, chutneys and sev", price: 180, sig: true },
      { name: "Aloo Tikki Chaat", desc: "Ghee-crisped tikki, chole, sweet curd, saunth and mint chutney", price: 160 },
      { name: "Dahi Bhalla", desc: "Soft lentil dumplings in chilled whisked curd with roasted jeera", price: 150 },
      { name: "Papdi Chaat", desc: "Crunchy papdi, potato, chickpeas, curd and tangy chutneys", price: 140 },
      { name: "Gol Gappe", desc: "Six pani puri with spiced and meetha pani", price: 110 },
      { name: "Hariyali Paneer Tikka", desc: "Paneer marinated in mint, coriander and hung curd, charred in the tandoor", price: 290, sig: true }
    ]
  },
  {
    id: "handi",
    title: "Delhi ki Handi",
    subtitle: "Mains, slow-cooked",
    items: [
      { name: "Veg Thali", desc: "Laccha paratha, rice, dal makhani, soya masala and mix veg — the full home meal", price: 349, sig: true },
      { name: "Dal Makhani", desc: "Black lentils simmered overnight, finished with butter and cream", price: 280, sig: true },
      { name: "Paneer Butter Masala", desc: "Soft paneer in a velvety tomato-cashew makhani gravy", price: 320 },
      { name: "Kadhai Paneer", desc: "Paneer tossed with capsicum, onion and fresh-ground kadhai masala", price: 320 },
      { name: "Shahi Malai Kofta", desc: "Paneer-potato koftas in a rich, mildly sweet cream gravy", price: 330 },
      { name: "Rajma Masala", desc: "Comforting red kidney beans the way every Delhi home makes them", price: 240 }
    ]
  },
  {
    id: "tandoor",
    title: "Tandoor & Chawal",
    subtitle: "Breads & rice",
    items: [
      { name: "Butter Naan", desc: "Soft tandoori naan brushed with butter", price: 70 },
      { name: "Garlic Naan", desc: "Naan topped with garlic and coriander", price: 90 },
      { name: "Lachha Paratha", desc: "Flaky, layered whole-wheat paratha", price: 70 },
      { name: "Tandoori Roti", desc: "Whole-wheat roti from the clay oven", price: 40 },
      { name: "Jeera Rice", desc: "Basmati tempered with cumin and ghee", price: 160 },
      { name: "Veg Dum Biryani", desc: "Fragrant basmati and vegetables, sealed and slow-cooked", price: 280 }
    ]
  },
  {
    id: "meetha",
    title: "Meetha & Sharbat",
    subtitle: "Desserts & drinks",
    items: [
      { name: "Rabri Jalebi", desc: "Hot, crisp jalebis with chilled, thickened rabri", price: 160, sig: true },
      { name: "Kesar Lassi", desc: "Thick saffron lassi in an earthen kulhad", price: 120, sig: true },
      { name: "Gulab Jamun", desc: "Two warm khoya dumplings in rose-cardamom syrup", price: 90 },
      { name: "Kesar Phirni", desc: "Ground-rice pudding set in a clay bowl", price: 120 },
      { name: "Shikanji", desc: "Old Delhi spiced lemonade, masala-kissed", price: 80 },
      { name: "Thandai", desc: "Chilled milk with almonds, fennel and rose", price: 130 }
    ]
  }
];
