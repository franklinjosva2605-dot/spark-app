export const MOCK_USERS = [
  { id: 1, name: "Aria Chen", age: 26, location: "New York", bio: "Photographer & coffee addict ☕ | NYC sunsets hit different", avatar: "https://i.pravatar.cc/300?img=47", coverColor: "#ff6b6b", posts: 12, followers: 843, following: 201 },
  { id: 2, name: "Marco Reyes", age: 29, location: "Miami", bio: "Surfer 🏄 | Food explorer | Living for golden hour", avatar: "https://i.pravatar.cc/300?img=68", coverColor: "#4ecdc4", posts: 34, followers: 1200, following: 430 },
  { id: 3, name: "Zara Okafor", age: 24, location: "London", bio: "Artist & dreamer 🎨 | Creating worlds one canvas at a time", avatar: "https://i.pravatar.cc/300?img=45", coverColor: "#a29bfe", posts: 7, followers: 512, following: 178 },
  { id: 4, name: "Kai Nakamura", age: 31, location: "Tokyo", bio: "Chef 🍜 | Music lover | Hiking on weekends", avatar: "https://i.pravatar.cc/300?img=60", coverColor: "#fd79a8", posts: 21, followers: 990, following: 300 },
  { id: 5, name: "Luna Torres", age: 27, location: "Barcelona", bio: "Travel blogger ✈️ | 40 countries & counting", avatar: "https://i.pravatar.cc/300?img=44", coverColor: "#fdcb6e", posts: 56, followers: 2400, following: 800 },
];

export const INITIAL_POSTS = [
  { id: 1, userId: 1, user: "Aria Chen", avatar: "https://i.pravatar.cc/60?img=47", caption: "Golden hour in Central Park never gets old 🌅", likes: 312, comments: 28, time: "2h", thumbnail: "https://picsum.photos/seed/park/400/500", liked: false },
  { id: 2, userId: 2, user: "Marco Reyes", avatar: "https://i.pravatar.cc/60?img=68", caption: "Weekend vibes only 🌊 The ocean always calls", likes: 891, comments: 64, time: "4h", thumbnail: "https://picsum.photos/seed/ocean/400/500", liked: false },
  { id: 3, userId: 3, user: "Zara Okafor", avatar: "https://i.pravatar.cc/60?img=45", caption: "New piece finally finished ✨ What do you think?", likes: 445, comments: 43, time: "6h", thumbnail: "https://picsum.photos/seed/art/400/500", liked: false },
  { id: 4, userId: 4, user: "Kai Nakamura", avatar: "https://i.pravatar.cc/60?img=60", caption: "Homemade ramen from scratch 🍜 Worth every hour", likes: 677, comments: 89, time: "8h", thumbnail: "https://picsum.photos/seed/food/400/500", liked: false },
  { id: 5, userId: 5, user: "Luna Torres", avatar: "https://i.pravatar.cc/60?img=44", caption: "Sunrise over Sagrada Família ✈️ Never gets old", likes: 1023, comments: 112, time: "10h", thumbnail: "https://picsum.photos/seed/barcelona/400/500", liked: false },
];

export const INITIAL_COMMENTS = {
  1: [{ user: "Marco Reyes", text: "Stunning shot! 😍", avatar: "https://i.pravatar.cc/40?img=68" }, { user: "Zara Okafor", text: "The colors are perfect 🎨", avatar: "https://i.pravatar.cc/40?img=45" }],
  2: [{ user: "Aria Chen", text: "This is my dream! 🌊", avatar: "https://i.pravatar.cc/40?img=47" }],
  3: [{ user: "Kai Nakamura", text: "Love the texture!", avatar: "https://i.pravatar.cc/40?img=60" }, { user: "Marco Reyes", text: "So talented 🔥", avatar: "https://i.pravatar.cc/40?img=68" }],
  4: [{ user: "Aria Chen", text: "I need this in my life rn 😩", avatar: "https://i.pravatar.cc/40?img=47" }, { user: "Zara Okafor", text: "Recipe please!!", avatar: "https://i.pravatar.cc/40?img=45" }],
  5: [{ user: "Marco Reyes", text: "Spain is magical 🇪🇸", avatar: "https://i.pravatar.cc/40?img=68" }],
};

export const MY_PROFILE = {
  name: "You",
  avatar: "https://i.pravatar.cc/60?img=12",
  bio: "Just joined Spark ✨",
};
