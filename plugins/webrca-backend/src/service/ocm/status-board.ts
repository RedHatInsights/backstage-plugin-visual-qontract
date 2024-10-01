interface product {
  id: string;
  kind: string;
  href: string;
  name: string;
  fullname: string;
}

interface productList {
  items: product[];
}

export async function lookupProduct(
  url: string,
  access_token: string,
  product_name: string,
): Promise<productList> {
  return (await fetch(
    `${url}/api/proxy/status-board/products?search=fullname+ilike+'${product_name}'`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    },
  )
  .catch(error => error)
  .then(resp => resp.json())) as productList;
}
