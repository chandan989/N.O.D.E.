/**
 * 🎬 WalletConnect Demo Automation Script
 * 
 * This script demonstrates the wallet connection flow programmatically.
 * Run this in the browser console after opening the N.O.D.E. app.
 */

// Demo steps with delays
const demo = {
  async step1_Introduction() {
    console.log("%c🎯 DEMO STEP 1: Introduction", "color: #00ff00; font-size: 16px; font-weight: bold");
    console.log("N.O.D.E. Protocol WalletConnect Integration Demo");
    console.log("This demo will walk you through connecting a Hedera wallet via WalletConnect");
    await this.delay(2000);
  },

  async step2_CheckConnection() {
    console.log("%c📋 DEMO STEP 2: Check Connection Status", "color: #00ff00; font-size: 16px; font-weight: bold");
    
    // Access wallet store (if available in window)
    if (window.__WALLET_STORE__) {
      const state = window.__WALLET_STORE__.getState();
      if (state.isConnected) {
        console.log(`✅ Already connected to: ${state.accountId}`);
        console.log(`💰 Balance: ${state.balance} HBAR`);
        return true;
      }
    }
    
    console.log("ℹ️  Not connected. Ready to connect...");
    await this.delay(1500);
    return false;
  },

  async step3_InitiateConnection() {
    console.log("%c🔗 DEMO STEP 3: Initiate Wallet Connection", "color: #00ff00; font-size: 16px; font-weight: bold");
    console.log("1. Click the 'JOIN_NETWORK' button in the header");
    console.log("2. WalletConnect modal will open with QR code");
    console.log("3. On your mobile HashPack wallet:");
    console.log("   - Open HashPack app");
    console.log("   - Go to Settings → WalletConnect");
    console.log("   - Scan the QR code displayed in the modal");
    console.log("   - Approve the connection when prompted");
    await this.delay(3000);
  },

  async step4_WaitForConnection() {
    console.log("%c⏳ DEMO STEP 4: Waiting for Connection", "color: #00ff00; font-size: 16px; font-weight: bold");
    console.log("Waiting for wallet approval... (check browser console for connection logs)");
    
    // Monitor for connection (polling)
    let attempts = 0;
    const maxAttempts = 60; // 60 seconds
    
    const checkInterval = setInterval(() => {
      attempts++;
      
      if (window.__WALLET_STORE__) {
        const state = window.__WALLET_STORE__.getState();
        if (state.isConnected) {
          clearInterval(checkInterval);
          console.log(`✅ Connection successful!`);
          console.log(`📱 Account: ${state.accountId}`);
          console.log(`💰 Balance: ${state.balance} HBAR`);
          return;
        }
      }
      
      if (attempts >= maxAttempts) {
        clearInterval(checkInterval);
        console.log("⏰ Connection timeout. Please try again.");
      } else {
        process.stdout.write(".");
      }
    }, 1000);
  },

  async step5_ShowConnectedState() {
    console.log("%c✅ DEMO STEP 5: Connected State", "color: #00ff00; font-size: 16px; font-weight: bold");
    
    if (window.__WALLET_STORE__) {
      const state = window.__WALLET_STORE__.getState();
      if (state.isConnected) {
        console.log("📊 Connection Details:");
        console.log(`   Account ID: ${state.accountId}`);
        console.log(`   Balance: ${state.balance} HBAR`);
        console.log(`   Wallet Type: ${state.walletType || 'walletconnect'}`);
        console.log(`   Connection Status: ${state.isConnected ? 'Connected' : 'Disconnected'}`);
      } else {
        console.log("⚠️  Not connected. Please complete Step 3 first.");
      }
    }
    
    await this.delay(2000);
  },

  async step6_TestSessionPersistence() {
    console.log("%c🔄 DEMO STEP 6: Test Session Persistence", "color: #00ff00; font-size: 16px; font-weight: bold");
    console.log("The WalletConnect session persists across page refreshes.");
    console.log("Try refreshing the page - the wallet should remain connected.");
    console.log("This is because we check for existing sessions before creating new pairings.");
    await this.delay(2000);
  },

  async step7_ShowBalanceAPI() {
    console.log("%c🌐 DEMO STEP 7: Balance Fetching", "color: #00ff00; font-size: 16px; font-weight: bold");
    console.log("Balance is fetched from Hedera Mirror Node API:");
    console.log("- API: https://testnet.mirrornode.hedera.com/api/v1/accounts/{accountId}");
    console.log("- Returns balance in tinybars");
    console.log("- Converted to HBAR (1 HBAR = 100,000,000 tinybars)");
    console.log("- Updates in real-time");
    await this.delay(2000);
  },

  async step8_Disconnect() {
    console.log("%c🔌 DEMO STEP 8: Disconnect", "color: #00ff00; font-size: 16px; font-weight: bold");
    console.log("To disconnect:");
    console.log("1. Click on your account in the header");
    console.log("2. Click 'DISCONNECT' button");
    console.log("3. WalletConnect session will be closed");
    console.log("4. Application returns to initial state");
    await this.delay(2000);
  },

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  async runFullDemo() {
    console.clear();
    console.log("%c╔════════════════════════════════════════╗", "color: #00ff00; font-size: 14px");
    console.log("%c║  N.O.D.E. WALLET CONNECT DEMO SCRIPT  ║", "color: #00ff00; font-size: 14px");
    console.log("%c╚════════════════════════════════════════╝", "color: #00ff00; font-size: 14px");
    console.log("");

    await this.step1_Introduction();
    console.log("");
    
    const isConnected = await this.step2_CheckConnection();
    console.log("");
    
    if (!isConnected) {
      await this.step3_InitiateConnection();
      console.log("");
      await this.step4_WaitForConnection();
      console.log("");
    }
    
    await this.step5_ShowConnectedState();
    console.log("");
    await this.step6_TestSessionPersistence();
    console.log("");
    await this.step7_ShowBalanceAPI();
    console.log("");
    await this.step8_Disconnect();
    console.log("");

    console.log("%c🎉 Demo Complete!", "color: #00ff00; font-size: 16px; font-weight: bold");
    console.log("%cFor more details, see WALLET_DEMO.md", "color: #888; font-size: 12px");
  }
};

// Make demo accessible globally
window.walletDemo = demo;

// Auto-run if requested
console.log("%c📝 Wallet Demo Script Loaded!", "color: #00ff00; font-size: 14px; font-weight: bold");
console.log("To run the demo, type: walletDemo.runFullDemo()");
console.log("Or run individual steps:");
console.log("  - walletDemo.step1_Introduction()");
console.log("  - walletDemo.step2_CheckConnection()");
console.log("  - walletDemo.step3_InitiateConnection()");
console.log("  - etc.");

// Export for Node.js environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = demo;
}

