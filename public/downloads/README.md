# Plugin download files

Place purchased plugin ZIP files here so customers can download after payment:

- **notipress.zip** – Notipress plugin (copy from your build or `wp-content/plugins/notipress.zip`)
- **variation-images-pro.zip** – Variation Images Pro (for fallback when `PLUGIN_FILE_URL` is not set)

After a successful Paddle purchase, the app redirects to `/downloads/<slug>.zip` (e.g. `/downloads/notipress.zip`). For production you can instead set `NOTIPRESS_PLUGIN_FILE_URL` (and `PLUGIN_FILE_URL`) in your host environment to a CDN or storage URL.
