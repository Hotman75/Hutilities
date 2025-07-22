# 🛠️ Digital Useful Toolbox

A curated collection of free, practical digital tools I use daily — and think you should too.

---

## 📚 Table of Contents

- [🔧 Recommended Browser Setup](#-recommended-browser-setup)
- [🪟 Windows 11 Enhancements](#-windows-11-enhancements)
- [↔️ DNS Recommendations](#️-dns-recommendations)
- [🎬 Home Cinema Setup](#-home-cinema-setup)
- [☁️ Personal Cloud Server (Oracle Cloud)](#️-personal-cloud-server-oracle-cloud)
  - [📦 Install Tampermonkey Script](#-install-tampermonkey-script)
  - [🧭 Guide to Get an Always Free Server](#-guide-to-get-an-always-free-server)
    - [📝 Prerequisites](#-prerequisites)
    - [🌐 Configure the Virtual Cloud Network (VCN)](#-configure-the-virtual-cloud-network-vcn)
    - [⚙️ Create the Instance](#️-create-the-instance)
    - [🖱️ Launch the Auto-Click Script](#-launch-the-auto-click-script)
    - [⏱️ In a Hurry?](#️-in-a-hurry)

---

## 🔧 Recommended Browser Setup

I strongly recommend using **Firefox**, along with these extensions:

| Extension | Description |
|----------|-------------|
| [uBlock Origin](https://addons.mozilla.org/firefox/addon/ublock-origin/) | Blocks ads and trackers |
| [Tampermonkey](https://addons.mozilla.org/firefox/addon/tampermonkey/) | Userscript manager |
| [I Still Don't Care About Cookies](https://addons.mozilla.org/firefox/addon/istilldontcareaboutcookies/) | Automatically rejects cookie banners |
| [FastForward](https://addons.mozilla.org/firefox/addon/fastforwardteam/) | Bypasses URL shorteners |
| [Bypass Paywalls Clean](https://gitflic.ru/project/magnolia1234/bypass-paywalls-firefox-clean) | Bypasses paywalls on many news websites |
| [Firefox Multi-Account Containers](https://addons.mozilla.org/firefox/addon/multi-account-containers/) | Isolate tabs between work/personal accounts |
| [SponsorBlock](https://addons.mozilla.org/firefox/addon/sponsorblock/) | Skips sponsor segments on YouTube |
| [Alternate Player for Twitch.tv](https://addons.mozilla.org/firefox/addon/twitch_5/) | Skips Twitch ads |
| [BetterTTV](https://addons.mozilla.org/firefox/addon/betterttv/) | Enhances Twitch and YouTube with chat emotes and features |
| [Dark Reader](https://addons.mozilla.org/firefox/addon/darkreader/) | Enables dark mode on all websites |

---

## 🪟 Windows 11 Enhancements

- **PowerToys**  
  A set of utilities to improve productivity and system management.  
  👉 [Install PowerToys](https://learn.microsoft.com/en-us/windows/powertoys/install)

---

## ↔️ DNS Recommendations

To improve speed and privacy, change your DNS provider directly from your router or system settings:

- [**Quad9 (9.9.9.9)**](https://quad9.net/service/service-addresses-and-features/) — Privacy-focused and secure  
- [**Cloudflare (1.1.1.1)**](https://developers.cloudflare.com/1.1.1.1/ip-addresses/) — Fast and privacy-first

---

## 🎬 Home Cinema Setup

For streaming movies/TV shows, I recommend:

- **Stremio** + **Torrentio**  
- Combine them with a premium **debrid service** (>30€/year) for safety and quality

📖 Full setup guide: [https://guides.viren070.me/stremio](https://guides.viren070.me/stremio)

---

## ☁️ Personal Cloud Server (Oracle Cloud)

Looking for a free cloud server? Oracle Cloud offers Always Free virtual machines. Below is a setup guide and an automation script to help you secure an instance.

---

### 📦 Install Tampermonkey Script

To install the automation script:

1. Open your **Tampermonkey Dashboard**
2. Go to the **Utilities** tab
3. Paste this URL in **"Import from URL"**:  
   [https://raw.githubusercontent.com/Hotman75/Tampermonkey/main/Oracle%20Cloud/create-instance.js](https://raw.githubusercontent.com/Hotman75/Tampermonkey/main/Oracle%20Cloud/create-instance.js)
4. Click **Install**

---

### 🧭 Guide to Get an Always Free Server

#### 📝 Prerequisites

- Create a free account at [https://cloud.oracle.com/](https://cloud.oracle.com/)
- A credit card is required (but won’t be charged if you stay within free tier limits)

---

#### 🌐 Configure the Virtual Cloud Network (VCN)

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

#### ⚙️ Create the Instance

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

#### 🖱️ Launch the Auto-Click Script

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

#### ⏱️ In a Hurry?

Need a server immediately? You can upgrade your account to **Pay As You Go**.

- Requires a ~$100 pre-auth charge (refunded shortly)
- Lets you **instantly create an instance**
- But: stay within **Always Free limits** (4 OCPU, 24 GB RAM, 2 public IPs)

📉 Set billing alerts to avoid unexpected charges.

---

🎉 **That's it!** You're now equipped to get a free cloud server automatically with a few simple steps.
