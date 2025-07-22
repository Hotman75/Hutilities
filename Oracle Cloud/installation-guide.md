# 🧭 Guide to Get an Always Free Server

## 📝 Prerequisites

- Create a free account at [https://cloud.oracle.com/](https://cloud.oracle.com/)
- A credit card is required (but won’t be charged if you stay within free tier limits)
  
### 📦 Install Tampermonkey Script

To install the automation script:

1. Open your **Tampermonkey Dashboard**
2. Go to the **Utilities** tab
3. Paste this URL in **"Import from URL"**:  
   [https://raw.githubusercontent.com/Hotman75/Tampermonkey/main/Oracle%20Cloud/create-instance.js](https://raw.githubusercontent.com/Hotman75/Tampermonkey/main/Oracle%20Cloud/create-instance.js)
4. Click **Install**

---

## 🌐 Configure the Virtual Cloud Network (VCN)

1. Go to **Networking → Virtual Cloud Networks**
2. **Create VCN**  
   - Set a name  
   - Use `10.0.0.0/16` as IPv4 CIDR Block

3. **Subnets** → Create a new one  
   - Use `10.0.0.0/24` as CIDR  
   - Assign the default security list

4. **Gateways** → Create an **Internet Gateway**

5. **Routing**  
   - Edit route table  
   - Add rule:  
     - Destination: `0.0.0.0/0`  
     - Target: Internet Gateway

6. **Security List** → Add Ingress Rules:
   - Source: `0.0.0.0/0`
   - Open ports as needed (one rule per port):  
     - TCP 22 (SSH)  
     - TCP 80 (HTTP)  
     - TCP 443 (HTTPS)  
     - TCP 25565 (Minecraft)  
     - …others as needed

> ℹ️ You can safely leave other settings as default.

---

## ⚙️ Create the Instance

1. Go to **Compute → Instances**  
2. Click **Create Instance**
   - Name it
   - OS Image: Ubuntu

3. **Change Shape**  
   - Choose **Ampere → VM.Standard.A1.Flex**
   - Select **OCPU / RAM** (maximum **4 OCPU / 24 GB RAM**)

4. **Networking**  
   - Use the VCN/subnet created earlier  
   - Enable public IPv4 address  
   - Generate and download SSH keys

5. **Storage**  
   - Default is fine, or set custom volume (up to 200 GB free)

---

## 🖱️ Launch the Auto-Click Script

After completing the instance config:

- Scroll to the bottom and ensure the **"Create"** button is visible
- The script will show a floating **Start** button
- Click **Start** — it will:
  - Click “Create” every 30s
  - Prevent disconnects
  - Stop once successful

> ⏳ **It may take hours or days** to get a free instance due to capacity limits.

💡 Oracle might disconnect you — check in regularly to restart if needed.

---

## ⏱️ In a Hurry?

Need a server immediately? You can upgrade your account to **Pay As You Go**.

- Requires a ~$100 pre-auth charge (refunded shortly)
- Lets you **instantly create an instance**
- But: stay within **Always Free limits** (4 OCPU, 24 GB RAM, 2 public IPs)

📉 Set billing alerts to avoid unexpected charges.

---

🎉 **That's it!** You're now equipped to get a free cloud server automatically with a few simple steps.
