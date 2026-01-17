
let users = [];

export const seedDB = async () => {
  users = [
    { id: 1, name: "Alice", email: "alice@example.com" },
    { id: 2, name: "Bob", email: "bob@example.com" },
  ];
};

export const clearDB = async () => {
  users = [];
};

export const getUserById = (id) => users.find((u) => u.id === Number(id));
