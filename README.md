# 🛠️ Tampermonkey Scripts Collection

This repository contains various Tampermonkey utility scripts, developed and tested primarily with **Firefox**, they may not work in **Chrome**.  
These scripts help automate and enhance your experience on specific web platforms.

---

## 📚 Table of Contents

- [🔧 Recommended Browser Setup](#-recommended-browser-setup)
- [📦 How to Install a Script](#-how-to-install-a-script)
- [🖱️ Oracle Cloud Create Instance Auto-Click](#%EF%B8%8F-oracle-cloud-create-instance-auto-click)

---

## 🔧 Recommended Browser Setup

- **Firefox**  
  - Tampermonkey: [Install on Firefox](https://addons.mozilla.org/fr/firefox/addon/tampermonkey/)  
  - uBlock Origin (recommended for ad/tracker blocking): [Install on Firefox](https://addons.mozilla.org/fr/firefox/addon/ublock-origin/)

- **Google Chrome / Chromium-based browsers**  
  - Tampermonkey: [Install on Chrome](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)

---

## 📦 How to Install a Script

1. Open your Tampermonkey Dashboard.  
2. Go to the **"Utilities"** tab.  
3. Paste the script URL in the **"Import from URL"** field.  
4. Click **"Install"**.

---

## 🖱️ Oracle Cloud Create Instance Auto-Click

Automatically clicks the **“Create”** button on the Oracle Cloud instance creation page every 30 seconds.  
Useful for reserving a Free Tier server when resources are limited or contention is high.

### 🔗 Script URL

> Paste this in Tampermonkey’s *“Import from URL”* field:  
> [https://raw.githubusercontent.com/Hotman75/Tampermonkey/main/Oracle%20Cloud/create-instance.js](https://raw.githubusercontent.com/Hotman75/Tampermonkey/main/Oracle%20Cloud/create-instance.js)

### 📄 Description

This script:

- Displays a status bar with Start/Stop buttons to activate/deactivate the automation.
- Once started, clicks the **"Create"** button every **30 seconds**.
- Prevents disconnect by clicking **"Continue working"** when displayed.
- Stops once the instance is created.

### 🖥️ Requirements

- Navigate to:  
  `https://cloud.oracle.com/compute/instances/create?...`
- Complete all required parameters until the **"Create"** button is visible (last step).
- Oracle forces a regular reconnection, so it's impossible to automate the click for longer than the authorized session time.

### 🧭 Guide to Get an Always Free Server

#### 1. 📝 Prerequisites

- Create an Oracle Cloud account: [https://cloud.oracle.com/](https://cloud.oracle.com/)
- Provide a credit card (you won’t be charged as long as you stay within the Always Free quotas).

---

#### 2. 🌐 Configure a Virtual Cloud Network (VCN)

1. Go to **"Virtual Cloud Networks"** under the **"Networking"** tab.  
   
  ![Screenshot](https://github.com/user-attachments/assets/057fbd90-b3e0-41b3-a05f-a5e89cf7729b)

2. **Create a VCN**  
   - Name it as you like  
   - Set **IPv4 CIDR Block** to: `10.0.0.0/16`

3. Once created, go to the **"Subnets"** tab and click **"Create Subnet"**:  
   - Set a custom name  
   - Set **IPv4 CIDR Block** to: `10.0.0.0/24`  
   - Select the **"Default Security List for [VCN name]"**  
   - Leave other options as default

4. In the **"Gateways"** tab:  
   - Create an **Internet Gateway**

5. In the **"Routing"** tab:  
   - Select **"Default Route Table for [VCN]"**  
   - Go to the **"Route Rules"** tab → **Add Route Rule**:  
     - **Target Type**: Internet Gateway  
     - **Destination CIDR Block**: `0.0.0.0/0`  
     - **Target**: Select the Internet Gateway created earlier

6. In the **"Security"** tab:  
   - Select **"Default Security List for [VCN]"**  
   - Go to **"Security Rules"** → **Add Ingress Rules**:  
     - **Source CIDR**: `0.0.0.0/0`  
     - **Source Port Range**: All  
     - **Destination Port Range**: Add needed rules, such as (one rule per port):  
       - TCP 22 → SSH  
       - TCP 80 → HTTP  
       - TCP 443 → HTTPS  
       - TCP 25565 → Minecraft (optional)
       - (any other port needed)

> ℹ️ For any unspecified options, you can safely leave the default values.

---

#### 3. ⚙️ Configure the Instance

1. Go to the **"Instances"** menu in the **"Compute"** tab.  
   
  ![Screenshot](https://github.com/user-attachments/assets/6a131817-7bfb-4d7d-8ed8-b3748cf339d4)

2. Click **"Create Instance"**:
   - Choose a custom name
   - Select an OS Image: latest **Oracle Linux** or **Canonical Ubuntu**

3. **Change the Shape**:
   - Choose **Ampere → VM.Standard.A1.Flex**  
   - Adjust CPU and RAM (e.g., 1 OCPU, 6 GB RAM for Always Free)  
   ![Screenshot](https://github.com/user-attachments/assets/72af5ff1-ae85-46aa-821f-39a6a7abc141)

4. In the **Network** section:
   - Select the **VCN** and **Subnet** created earlier
   - Ensure **"Automatically assign public IPv4 address"** is **checked**
   - Generate SSH keys (if needed):
     >⚠️ Download Private and Public Keys

5. You can leave the **Boot volume** (Storage) as default, or define a custom size (up to 200Go for the Free Plan).

---

#### 4. 🖱️ Launching the Auto-Click Script

- After completing the configuration, you should see the **“Create”** button at the bottom of the page.
- The **Tampermonkey Auto-Click script** will display a status bar in the top-left corner.
- Click the **"Start"** button in the status bar — it will:
  - Click the **"Create"** button every 30 seconds
  - Prevent session timeouts by clicking **“Continue working”** when prompted
  - Stop automatically once the instance is created

> ⏳ Note: It can take hours — even days — to successfully create an Always Free instance, depending on availability. Be patient.

💡 **Oracle may disconnect you** after a long active session. Be sure to check in regularly and restart the creation process if needed.

---

#### 5. ⏱️ Don't want to wait ?

If the need is urgent or the wait too long, you can upgrade your Always Free account to a Pay As You Go account.
You'll be charged ~$100 (refunded immediately), but you'll be able to create an instance almost instantly.
If you choose this solution, be careful not to exceed the Always Free ceiling (4 OCPU, 24 Gb RAM, 2 Public IPs, ...).
You can set up invoice alerts to ensure you never exceed quotas.

🎉 Good luck! With this setup and script, you're ready to grab your Always Free server automatically.
