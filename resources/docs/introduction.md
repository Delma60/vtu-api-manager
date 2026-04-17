# Welcome to the VTU API Manager 👋

Welcome to the official developer documentation for the **VTU API Manager**. Our RESTful API empowers developers and businesses to seamlessly integrate digital utility payments directly into their applications. 

Whether you are building a fintech app, a corporate reward system, or a digital wallet, our unified API provides a single, reliable gateway to multiple service providers.

---

## 🚀 What Can You Build?

With a single integration, you gain access to a suite of digital services across multiple networks and providers:

* **📱 Airtime Top-up:** Instant recharge for MTN, Airtel, Glo, and 9mobile.
* **📶 Data Bundles:** SME, Corporate Gifting (CG), and Direct Data bundles.
* **📺 Cable TV:** Subscription renewals for DSTV, GOTV, and Startimes.
* **💡 Utility Bills:** Electricity token generation across major national DisCos.

---

## 🌍 Environments & Base URLs

We provide two distinct environments to ensure you can build and test safely without touching real money.

| Environment | Base URL | Description |
| :--- | :--- | :--- |
| **Sandbox (Test)** | `https://sandbox.your-domain.com/api/v1` | Use this for development. Transactions are simulated and no real money is deducted. |
| **Production (Live)** | `https://your-domain.com/api/v1` | Use this for live customer traffic. Real money is used. |

> **Note:** Sandbox and Production environments use entirely different sets of API Keys. Make sure you are using the correct keys for your target environment.

---

## 🔐 Authentication

Security is our top priority. All API requests are authenticated using **Bearer Tokens**. You can retrieve your Secret Key and Public Key from the **Developer Settings** section of your dashboard.

Include your API key in the `Authorization` header of all requests.

```http
Authorization: Bearer YOUR_SECRET_API_KEY
Accept: application/json
Content-Type: application/json