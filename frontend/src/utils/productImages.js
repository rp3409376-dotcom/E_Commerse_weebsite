const productImages = {
  phone:
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900&q=80",
  mobile:
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900&q=80",
  iphone:
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900&q=80",
  iphon:
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900&q=80",
  samsung:
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900&q=80",
  laptop:
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=900&q=80",
  macbook:
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=900&q=80",
  mackbook:
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=900&q=80",
  notebook:
    "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=900&q=80",
  watch:
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&q=80",
  clock:
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&q=80",
  table:
    "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=900&q=80",
  chair:
    "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=900&q=80",
  cloth:
    "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=900&q=80",
  clothes:
    "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=900&q=80",
};

export function getProductImage(title = "product", category = "") {
  const normalizedTitle = title.trim().toLowerCase();
  const matchedKeyword = Object.keys(productImages).find((keyword) =>
    normalizedTitle.includes(keyword),
  );

  if (matchedKeyword) {
    return productImages[matchedKeyword];
  }

  const normalizedCategory = category.trim().toLowerCase();
  const categoryKeyword = Object.keys(productImages).find(
    (keyword) => normalizedCategory === keyword,
  );

  return (
    productImages[categoryKeyword] ||
    `https://loremflickr.com/900/600/${encodeURIComponent(normalizedTitle || "product")}`
  );
}

export function isProductImage(image) {
  return image && Object.values(productImages).includes(image);
}
