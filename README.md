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

### 🧭 Guide to get a Always Free Server

#### 1. 📝 Prerequisites
- Create an Oracle Cloud account : https://cloud.oracle.com/
- Enter a credit card (no direct debit if you stay within Always Free quotas).

  #### 2. 🌐 Configure a Virtual Cloud Network
- Go to the **"Virtual clourd networks"** Menu, available in the **"Networking"** tab
<img width="1106" height="681" alt="image" src="https://github.com/user-attachments/assets/057fbd90-b3e0-41b3-a05f-a5e89cf7729b" />
- Create a VCN :
> Set a custom name
> IPv4 CIDR Blocks : 10.0.0.0/16
- Once created, in your VCN page, go to the **"Subnets"** tab and Create a Subnet :
> Set a custom name
> IPv4 CIDR Block : 10.0.0.0/24
> Select the **"Default Security List for VCN"**
> Let the default other options
