// ------------------------------------------------------------------
// MOCK de Mercado Pago — NO usar credenciales reales acá.
//
// Estructura preparada para reemplazar por la integración real:
//  - Access Token de Mercado Pago (server-side, nunca en el cliente)
//  - Creación de una "preference" con el monto de la seña
//  - Redirección a Checkout Pro (o Checkout Bricks embebido)
//  - Webhook que recibe la notificación de pago y actualiza el turno
//  - payment_id / estado real devuelto por Mercado Pago
//
// Por ahora, processMockPayment() simula la latencia y la respuesta
// de la pasarela para poder construir y probar todo el flujo.
// ------------------------------------------------------------------

export type MockPaymentResult = {
  approved: boolean
  paymentId: string
}

export async function processMockPayment(amount: number): Promise<MockPaymentResult> {
  await new Promise((resolve) => setTimeout(resolve, 1600))

  // Demo: ~85% de aprobación simulada.
  const approved = Math.random() > 0.15

  return {
    approved,
    paymentId: approved ? `MOCK-${Date.now()}` : '',
  }
}
