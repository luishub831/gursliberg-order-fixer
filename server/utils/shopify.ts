export async function getShopifyOrderByNumber(orderNumber: string) {
  const config = useRuntimeConfig()
  const encodedNumber = encodeURIComponent(orderNumber.startsWith('#') ? orderNumber : `#${orderNumber}`)

  const url = `https://${config.shopifyDomain}/admin/api/${config.shopifyApiVersion}/orders.json?name=${encodedNumber}`

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'X-Shopify-Access-Token': config.shopifyAdminToken,
      'Content-Type': 'application/json'
    }
  })

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(`[Shopify API Error ${res.status}]: ${errorText}`)
  }

  const data = await res.json()
  if (data.orders.length === 0) throw new Error(`No order found with number: ${orderNumber}`)

  return data.orders[0] // Return the first match
}
