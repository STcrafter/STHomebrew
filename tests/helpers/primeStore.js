export async function primeStore(server, overrides = {}) {
  const { primeCategory } = await server.ssrLoadModule('/src/data/store.js');
  const { data } = await server.ssrLoadModule('/src/data/index.js');
  for (const [category, items] of Object.entries(data)) {
    primeCategory(category, overrides[category] ?? items);
  }
}
