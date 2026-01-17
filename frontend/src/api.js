export const getTodos = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/todos`);
    if (!res.ok) throw new Error("Network response was not ok");
    return res.json();
  } catch (error) {
    console.error("Failed to fetch todos:", error);
    return [];
  }
};
