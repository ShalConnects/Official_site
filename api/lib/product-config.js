/**
 * Single source: Paddle product/price ID → slug + download file env key.
 * Add new products here and set env (e.g. NOTIPRESS_PLUGIN_FILE_URL) in Vercel.
 */
const PRODUCT_MAP = {
  'pro_01kafwx8k4bw47cfh5w95smm7m': { slug: 'variation-images-pro', fileEnvKey: 'PLUGIN_FILE_URL' },
  'pri_01kafx042cwqdh525d9ts9fj6v': { slug: 'variation-images-pro', fileEnvKey: 'PLUGIN_FILE_URL' },
  'pro_01khd9txcvgf70fhqwr1tsq3h5': { slug: 'notipress', fileEnvKey: 'NOTIPRESS_PLUGIN_FILE_URL' },
  'pri_01khd9vscmynzpd3655cd1trrx': { slug: 'notipress', fileEnvKey: 'NOTIPRESS_PLUGIN_FILE_URL' },
};

function getProductByPaddleId(id) {
  return id ? PRODUCT_MAP[id] || null : null;
}

function getProductFromTransaction(transactionData) {
  const item = transactionData?.items?.[0];
  const productId = item?.product_id ?? item?.price?.product_id;
  const priceId = item?.price_id ?? item?.price?.id;
  return getProductByPaddleId(productId) || getProductByPaddleId(priceId);
}

function getDownloadUrl(transactionData, req) {
  const product = getProductFromTransaction(transactionData);
  const url = product && process.env[product.fileEnvKey] ? process.env[product.fileEnvKey] : null;
  if (url) return url;
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host || process.env.VERCEL_URL || 'localhost:5173';
  const slug = product?.slug || 'variation-images-pro';
  return `${protocol}://${host}/downloads/${slug}.zip`;
}

export { getProductByPaddleId, getProductFromTransaction, getDownloadUrl };
