import { $fetch } from 'ofetch';

async function fetchProduct() {
  const result = await $fetch('http://localhost:3000/api/woocommerce/products?slug=jbl-partybox-stage-320'); // Replace with correct base URL if needed, or we can use the backend URL
  console.log(JSON.stringify(result, null, 2));
}

fetchProduct();
