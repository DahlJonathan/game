// Function to generate a unique ID
export function generateUniqueId() {
    const id = 'xxxx-xxxx-xxxx-xxxx'.replace(/x/g, () => Math.floor(Math.random() * 16).toString(16));
    console.log(`IdGenerator -  Generated unique ID: ${id}`); // Debug: ID generation
    return id;
}