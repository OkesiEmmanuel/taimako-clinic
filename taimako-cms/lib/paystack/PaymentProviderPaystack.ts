
import fetch from 'node-fetch'

export class PaymentProviderPaystack {
  secretKey: string
  constructor(secretKey: string) {
    this.secretKey = secretKey
  }

  async initializeTransaction({ amount, email, reference }) {
    const url = 'https://api.paystack.co/transaction/initialize'
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ amount, email, reference })
    })
    return res.json()
  }

  async verifyTransaction(reference: string) {
    const url = `https://api.paystack.co/transaction/verify/${reference}`
    const res = await fetch(url, {
      method: 'GET',
      headers: { Authorization: `Bearer ${this.secretKey}` }
    })
    return res.json()
  }
}
