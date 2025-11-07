"use server";

import { post } from "@/app/common/util/fetch";

interface StripeSession {
  id: string;
}

export default async function checkout(productId: number) {
  return post<StripeSession>("checkout/session", { productId });
}
