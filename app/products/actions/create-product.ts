"use server";

import { revalidateTag } from "next/cache";
import { getHeaders, post } from "../../common/util/fetch";
import { API_URL } from "@/app/common/constants/api";
import { Product } from "../interfaces/product.interface";

export default async function createProduct(formData: FormData) {
  const response = await post<Product>("products", formData);
  const productImage = formData.get("image");
  if (productImage instanceof File && !response.error && response.data) {
    await uploadProductImage(response.data.id, productImage);
  }
  revalidateTag("products");
  return response;
}

async function uploadProductImage(productId: number, file: File) {
  const formData = new FormData();
  formData.append("image", file);
  await fetch(`${API_URL}/products/${productId}/image`, {
    body: formData,
    method: "POST",
    headers: getHeaders(),
  });
}
